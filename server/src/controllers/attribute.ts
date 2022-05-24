import { IStore, Store } from '../store';

type Data = {
	attrIdentity: number;
	abbIdentity: number;
	abbreviatures: any[];
	attributes: any[];
};

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

	public async addAbbreviature(abbrev: any) {
		this.db.abbIdentity = this.db.abbIdentity + 1;
		this.db.abbreviatures.push({
			id: this.db.abbIdentity,
			name: abbrev.name,
			abbreviature: abbrev.abbreviature,
			description: abbrev.description,
		});
		await this.store.write(this.db);
	}

	public async editAbbreviature(abbrev: any) {
		const currentAbbrev = this.db.abbreviatures.find((e: any) => e.id == abbrev.id);
		if (currentAbbrev) {
			currentAbbrev.name = abbrev.name;
			currentAbbrev.abbreviature = abbrev.abbreviature;
			currentAbbrev.description = abbrev.description;
		}
		await this.store.write(this.db);
	}

	public async deleteAbbreviature(abbrevId: any) {
		this.db.abbreviatures = this.db.abbreviatures.filter((e: any) => e.id != abbrevId);
		await this.store.write(this.db);
	}
}

export default new AttributeController();
