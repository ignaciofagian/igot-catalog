import { Result } from "../utils";
import { IStore, Store } from "../store";

type Data = {
  attrIdentity: number;
  abbIdentity: number;
  abbreviatures: any[];
  attributes: any[];
};

export interface AttrParts {
  original: string;
  current: string;
  wordType: WordType;
}

export interface AttrResult {
  status: 200 | 400;
  attribute?: string;
  conceptType?: ConceptType;
  errors?: string[];
  messages?: string[];
  parts?: AttrParts[];
}

type WordType = "StopWord" | "Abbreviation" | "Default" | "None";

export type ConceptType =
  | "OneWordEndS"
  | "TwoWordsEndS"
  | "OneOrTwoWords"
  | "ThreeOrMoreWords";

class AttributeController {
  private store: IStore<Data>;
  private db: Data;

  async initialize() {
    this.store = new Store<Data>("db.json");
    this.db = await this.store.read();
  }

  public getAbbreviatureList() {
    return this.db.abbreviatures;
  }

  public getAttributeList() {
    return this.db.attributes;
  }

  public async addAbbreviature(abbrev: any): Promise<Result> {
    // check if already exists
    const exists = this.db.abbreviatures.find(
      (e: any) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase()
    );
    if (exists) {
      return new Result(400, `La abreviatura ${abbrev.abbreviature} ya existe.`);
    }

    this.db.abbIdentity = this.db.abbIdentity + 1;
    this.db.abbreviatures.unshift({
      id: this.db.abbIdentity,
      name: abbrev.name,
      abbreviature: abbrev.abbreviature.replace(/\b\w/g, (c) => c.toUpperCase()),
      description: abbrev.description ?? abbrev.name,
    });
    this.updateAttributes();
    await this.store.write(this.db);
    return new Result(200);
  }

  public async editAbbreviature(abbrev: any): Promise<Result> {
    const exists = this.db.abbreviatures.find(
      (e: any) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase() && e.id != abbrev.id
    );
    if (exists) {
      return new Result(400, `La abreviatura ${abbrev.abbreviature} ya existe.`);
    }
    const currentAbbrev = this.db.abbreviatures.find((e: any) => e.id == abbrev.id);
    if (currentAbbrev) {
      currentAbbrev.name = abbrev.name;
      currentAbbrev.abbreviature = abbrev.abbreviature.replace(/\b\w/g, (c) => c.toUpperCase());
      currentAbbrev.description = abbrev.description;
    }
    this.updateAttributes();
    await this.store.write(this.db);
    return new Result(200);
  }

  public async deleteAbbreviature(abbrevId: any): Promise<Result> {
    this.db.abbreviatures = this.db.abbreviatures.filter((e: any) => e.id != abbrevId);
    this.updateAttributes();
    await this.store.write(this.db);
    return new Result(200);
  }

  public async addAttribute(attr: any): Promise<Result> {
    // validate
    const attrResult = this.calculate(attr.description);
    if (attrResult.status === 200) {
      const exists = this.db.attributes.find(
        (e: any) => e.attribute.toUpperCase() == attrResult.attribute.toUpperCase() && e.id != attr.id
      );
      if (exists) {
        return new Result(400, `El atributo ${attr.attribute} (${exists.name}) ya existe.`);
      }
      this.db.attrIdentity = this.db.attrIdentity + 1;
      this.db.attributes.unshift({
        id: this.db.attrIdentity,
        name: attrResult.parts?.filter((part: AttrParts) => part.wordType != 'StopWord').map((part: AttrParts) => part.original).join(' '),
        attribute: attrResult.attribute,
        description: attr.description,
      });
      await this.store.write(this.db);
      return new Result(200);
    }
    return new Result(400, attrResult.errors.join("\n"));
  }

  public async editAttribute(attr: any): Promise<Result> {
    const currentAttr = this.db.attributes.find((e: any) => e.id == attr.id);
    const attrResult = this.calculate(attr.name);
    if (attrResult.status === 200) {
      if (currentAttr) {
        const exists = this.db.attributes.find(
          (e: any) => e.attribute.toUpperCase() == attrResult.attribute.toUpperCase() && e.id != attr.id
        );
        if (exists) {
          return new Result(400, `El atributo ${attr.attribute} (${exists.name}) ya existe.`);
        }
        currentAttr.name = attrResult.parts?.filter((part: AttrParts) => part.wordType != 'StopWord').map((part: AttrParts) => part.original).join(' ')
        currentAttr.attribute = attr.attribute;
        currentAttr.description = attr.description;
      }
      await this.store.write(this.db);
      return new Result(200);
    }
    return new Result(400, attrResult.errors.join("\n"));
  }

  public async deleteAttribute(attrId: any): Promise<Result> {
    this.db.attributes = this.db.attributes.filter((e: any) => e.id != attrId);
    await this.store.write(this.db);
    return new Result(200);
  }

  private updateAttributes() {
    const attributes = this.db.attributes;
    attributes.forEach((attr: any) => {
      const attrResult = this.calculate(attr.name);
      if (attrResult.status == 200) {
        attr.attribute = attrResult.attribute;
      }
    });
  }

  private calculate(raw: string): AttrResult {
    const abbrevsLowerCase = this.db.abbreviatures.map((e: any) =>
      e.abbreviature.toLocaleLowerCase()
    );
    const [result, words] = this.validateInputWords(raw);
    const parts: AttrParts[] = [];

    if (result.status === 200) {
      let conceptType: ConceptType | null;
  
      // check stop words
      words.forEach((word: string) => {
        // stop word
        if (stopWords.includes(word.toLocaleLowerCase())) {
          parts.push({
            current: "",
            original: word,
            wordType: "StopWord",
          });
        } 
        // abbreviation
        else if (abbrevsLowerCase.includes(word.toLocaleLowerCase())) {
          const abb = this.db.abbreviatures.find((e: any) => {
            if (e.name.toLocaleLowerCase() === word.toLocaleLowerCase()) {
              return e;
            }
            return false;
          });
          if (abb) {
            parts.push({
              current: abb.abbreviature,
              original: word,
              wordType: "Abbreviation",
            });
          } else throw new Error("Cannot find abbrev");
        } 
        // default
        else {
          parts.push({
            current: word,
            original: word,
            wordType: "Default",
          });
        }
      });


      // apply rules
      const defaultWords: AttrParts[] = parts.filter((part: AttrParts) => part.wordType === 'Default')
        
      // Cuando el concepto tiene una palabra y termina en ese, poner las 4 primeras letras de la palabra y agregar ese al final.
      if (defaultWords.length === 1 && defaultWords[0].current[defaultWords[0].current.length - 1] === 's') {
        defaultWords[0].current = defaultWords[0].current.slice(0,4) + 's'
        conceptType = 'OneWordEndS';
      }

      // Cuando el concepto tiene 2 palabras que terminan en ese, poner las 4 primeras letras de la primera palabra, las 4 primeras letras de la segunda y agregar ese al final.
      else if (defaultWords.length === 2 && defaultWords[1].current[defaultWords[1].current.length - 1] === 's') {
        defaultWords[0].current = defaultWords[0].current.slice(0,4);
        defaultWords[1].current = defaultWords[1].current.slice(0,4) + 's'
        conceptType = 'TwoWordsEndS';
      }

      // Cuando el concepto tiene 2 palabras se utiliza el truncamiento con las primeras 4 letras por palabra
      else if (defaultWords.length === 2) {
        defaultWords[0].current = defaultWords[0].current.slice(0,4);
        defaultWords[1].current = defaultWords[1].current.slice(0,4) 
        conceptType = 'OneOrTwoWords';
      }

      // Cuando el concepto tiene 1 palabra se utiliza el truncamiento con las primeras 4 letras por palabra
      else if (defaultWords.length === 1) {
        defaultWords[0].current = defaultWords[0].current.slice(0,4);
        conceptType = 'OneOrTwoWords';
      }

      // Cuando el concepto tiene 3 palabras hasta 10, utilizar el criterio de truncamiento para las fórmulas fijas, esto es, se toma la inicial de cada palabra.
      else {
        defaultWords.forEach((part: AttrParts) => part.current = part.current.slice(0,1));
        conceptType = 'ThreeOrMoreWords';
      }

      // set current to starting in capital letter
      defaultWords.forEach((part: AttrParts) => part.current = part.current.replace(/\b\w/g, (c) => c.toUpperCase()));

      let attribute: string = parts.map((part: AttrParts) => part.current.trim().replace(/\b\w/g, (c) => c.toUpperCase())).join('')

      return { status: 200, parts, attribute, conceptType };
    }

    return { status: 400, errors: [result?.description ?? ""] };
  }

  private validateInputWords(raw: string): [Result, any?] {
    const words = raw
      .split(" ")
      // remove spaces
      .map((e: string) =>
        e
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
      )
      // filter 0 length
      .filter((e: string) => e.length > 0);

    if (words.length > 10) {
      return [{ status: 400, description: "No se puede ingresar mas de 10 palabras." }];
    }

    return [{ status: 200 }, words];
  }
}

const stopWords = [
  "a",
  "aca",
  "ahi",
  "al",
  "algo",
  "algun",
  "alguna",
  "alguno",
  "algunos",
  "alla",
  "alli",
  "ambos",
  "ante",
  "antes",
  "aquel",
  "aquella",
  "aquello",
  "aquellos",
  "aqui",
  "arriba",
  "asi",
  "atras",
  "aun",
  "aunque",
  "bien",
  "cada",
  "casi",
  "como",
  "con",
  "cual",
  "cuales",
  "cualquier",
  "cualquiera",
  "cualquieras",
  "cuan",
  "cuando",
  "cuanto",
  "cuanta",
  "cuantas",
  "de",
  "del",
  "demas",
  "desde",
  "donde",
  "dos",
  "el",
  "el",
  "ella",
  "ello",
  "ellos",
  "ellas",
  "en",
  "eres",
  "esa",
  "ese",
  "eso",
  "esas",
  "esos",
  "esta",
  "estas",
  "etc",
  "ha",
  "hasta",
  "la",
  "lo",
  "los",
  "las",
  "me",
  "mi",
  "mis",
  "mia",
  "mias",
  "mientras",
  "muy",
  "ni",
  "nosotras",
  "nosotros",
  "nuestra",
  "nuestro",
  "nuestras",
  "nuestros",
  "nos",
  "otra",
  "otro",
  "otros",
  "para",
  "pero",
  "pues",
  "que",
  "que",
  "si",
  "si",
  "siempre",
  "siendo",
  "sin",
  "sino",
  "sobre",
  "sr",
  "sra",
  "sres",
  "sta",
  "su",
  "sus",
  "te",
  "tu",
  "tus",
  "un",
  "una",
  "uno",
  "unas",
  "unos",
  "usted",
  "ustedes",
  "vosotras",
  "vosotros",
  "vuestra",
  "vuestro",
  "vuestras",
  "vuestros",
  "y",
  "ya",
];

export default new AttributeController();
