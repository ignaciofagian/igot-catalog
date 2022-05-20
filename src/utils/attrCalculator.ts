import { getAbbreviatureList } from '../services/api';

const tempAbbreviatures = [
	{ id: 1, name: 'Fecha', abbreviature: 'Fch', description: 'Fecha' },
	{ id: 2, name: 'Proyecto', abbreviature: 'Proy', description: 'Proyecto' },
	{ id: 3, name: 'Programa', abbreviature: 'Prog', description: 'Programa' },
	{ id: 4, name: 'Año', abbreviature: 'Ano', description: 'Año' },
];

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
	errors?: string[];
	messages?: string[];
	parts?: AttrParts[];
}

export function calculate(raw: string): AttrResult {
	const [result, words] = validateInputWords(raw);
	const parts: AttrParts[] = [];
	if (result.status === 200) {
		words.forEach((word: string) => {
			const abb = tempAbbreviatures.find((e: any) => {
				if (e.name.toUpperCase() === word.toLocaleUpperCase()) {
					return e;
				}
				return false;
			});
			if (abb) {
				parts.push({
					current: abb.abbreviature,
					isAbbreviation: true,
					original: word,
				});
			} else {
				parts.push({
					current: word.substring(0, 3).replace(/\b\w/g, (c) => c.toUpperCase()),
					isAbbreviation: false,
					original: word,
				});
			}
		});

		return { status: 200, parts };
	}

	return { status: 400, errors: [result?.description ?? ''] };
}


function validateInputWords(raw: string): [Result, any?] {
	const words = raw
		.split(' ')
		// remove spaces
		.map((e: string) => e.trim())
		// filter 0 length
		.filter((e: string) => e.length > 0);

	if (words.length > 3) {
		return [{ status: 400, description: 'No se puede ingresar mas de 3 palabras.' }];
	}

	return [{ status: 200 }, words];
}
