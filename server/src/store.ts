import { writeFile, readFile } from 'fs/promises';
export interface IStore<T> {
	read(): Promise<T>;
	write(obj: T): Promise<void>;
}

export class Store<T> implements IStore<T> {
	filename: string;

	constructor(filename: string) {
		this.filename = filename;
	}

	async read(): Promise<T | null> {
		let data;

		try {
			data = await readFile(this.filename, 'utf-8');
			if (data === null) {
				return null;
			} else {
				return JSON.parse(data);
			}
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
				return null;
			}
			throw e;
		}
	}

	async write(obj: T): Promise<void> {
		try {
			await writeFile(this.filename, JSON.stringify(obj, null, 2));
		} catch (err) {
			console.log(err);
		}
	}
}
