export class Result {
	status: 200 | 400;
	description?: string;

  constructor(status: 200 | 400, description?: string) {
    this.status = status;
    this.description = description;
  }
}