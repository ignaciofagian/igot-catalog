import { Result } from '../utils';
import { IStore, Store } from '../store';

type Data = {
	attrIdentity: number;
	abbIdentity: number;
	abbreviatures: any[];
	attributes: any[];
};
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

class AttributeController {
	private store: IStore<Data>;
	private db: Data;

	async initialize() {
		this.store = new Store<Data>('db.json');
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
			(e: any) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase(),
		);
		if (exists) {
			return new Result(400, `La abreviatura ${abbrev.abbreviature} ya existe.`);
		}

		this.db.abbIdentity = this.db.abbIdentity + 1;
		this.db.abbreviatures.push({
			id: this.db.abbIdentity,
			name: abbrev.name,
			abbreviature: abbrev.abbreviature.replace(/\b\w/g, (c) => c.toUpperCase()),
			description: abbrev.description,
		});
		this.updateAttributes();
		await this.store.write(this.db);
		return new Result(200);
	}

	public async editAbbreviature(abbrev: any): Promise<Result> {
		const exists = this.db.abbreviatures.find(
			(e: any) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase() && e.id != abbrev.id,
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
		const attrResult = this.calculate(attr.name);
		if (attrResult.status === 200) {
			this.db.attrIdentity = this.db.attrIdentity + 1;
			this.db.attributes.push({
				id: this.db.attrIdentity,
				name: attr.name,
				attribute: attrResult.attribute,
				description: attr.description,
			});
			await this.store.write(this.db);
			return new Result(200);
		}
		return new Result(400, attrResult.errors.join('\n'));
	}

	public async editAttribute(attr: any): Promise<Result> {
		const currentAttr = this.db.attributes.find((e: any) => e.id == attr.id);
		const attrResult = this.calculate(attr.name);
		if (attrResult.status === 200) {
			if (currentAttr) {
				currentAttr.name = attr.name;
				currentAttr.attribute = attr.attribute;
				currentAttr.description = attr.description;
			}
			await this.store.write(this.db);
			return new Result(200);
		}
		return new Result(400, attrResult.errors.join('\n'));
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
		const [result, words] = this.validateInputWords(raw);
		const parts: AttrParts[] = [];
		let attribute: string = '';
		if (result.status === 200) {
			words.forEach((word: string) => {
				const abb = this.db.abbreviatures.find((e: any) => {
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
					const current = word.substring(0, 3).replace(/\b\w/g, (c) => c.toUpperCase());
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

		return { status: 400, errors: [result?.description ?? ''] };
	}

	private validateInputWords(raw: string): [Result, any?] {
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
}

export default new AttributeController();
