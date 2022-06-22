const store = {
  abbreviatures: [] as any,
  attributes: [] as any,
};

interface Result {
  status: 200 | 400;
  description?: string;
}

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

export function calculate(raw: string): AttrResult {
  const abbrevsLowerCase = store.abbreviatures.map((e: any) =>
    e.abbreviature.toLocaleLowerCase()
  );
  const [result, words] = validateInputWords(raw);
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
        const abb = store.abbreviatures.find((e: any) => {
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
          current: word.toLocaleLowerCase(),
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

function validateInputWords(raw: string): [Result, any?] {
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

  // count valid words
  const totalWords = words.filter((word: string) => !stopWords.includes(word.toLocaleLowerCase())).length

  if (totalWords > 10) {
    return [
      { status: 400, description: "No se puede ingresar mas de 10 palabras." },
    ];
  }

  return [{ status: 200 }, words];
}

function checkDuplicates(attr?: string) {
  if (!attr) return null;
  debugger;
  const otherAttr = store.attributes.find(
    (e: any) => e.attribute.toUpperCase() == attr.toUpperCase()
  );
  if (otherAttr) {
    return otherAttr;
  }
  return null;
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

export { store, checkDuplicates };
