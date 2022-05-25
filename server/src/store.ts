import { writeFile, readFile } from "fs";
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
    return new Promise((res, rej) => {
      readFile(this.filename, { encoding: "utf-8" }, (err, data?: string) => {
        if (err) {
          throw err;
        }
        if (data === null) {
          return res(null);
        } else {
          return res(JSON.parse(data));
        }
      });
    });
  }

  async write(obj: T): Promise<void> {
    writeFile(this.filename, JSON.stringify(obj, null, 2), (err) => {
      if (err) {
        throw err;
      }
    });
  }
}
