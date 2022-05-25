
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
  isAbbreviation: boolean;
}

export interface AttrResult {
  status: 200 | 400;
  attribute?: string;
  errors?: string[];
  messages?: string[];
  parts?: AttrParts[];
}

export function calculate(raw: string): AttrResult {
  const [result, words] = validateInputWords(raw);
  const parts: AttrParts[] = [];
  let attribute: string = "";
  if (result.status === 200) {
    words.forEach((word: string) => {
      const abb = store.abbreviatures.find((e: any) => {
        if (e.name.toUpperCase() === word.toLocaleUpperCase()) {
          return e;
        }
        return false;
      });
      if (abb) {
        attribute += abb.abbreviature;
        parts.push({
          current: abb.abbreviature,
          isAbbreviation: true,
          original: word,
        });
      } else {
        const current = word
          .substring(0, 3)
          .replace(/\b\w/g, (c) => c.toUpperCase());
        attribute += current;
        parts.push({
          current: current,
          isAbbreviation: false,
          original: word,
        });
      }
    });

    return { status: 200, parts, attribute };
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

  if (words.length > 3) {
    return [
      { status: 400, description: "No se puede ingresar mas de 3 palabras." },
    ];
  }

  return [{ status: 200 }, words];
}

function checkDuplicates(attr?: string) {

  if (!attr) return null;
	debugger
  const otherAttr = store.attributes.find(
    (e: any) => e.attribute.toUpperCase() == attr.toUpperCase()
  );
  if (otherAttr) {
    return otherAttr;
  }
  return null;
}

export { store, checkDuplicates };
