import client from '.';

/** Abbreviature */
export interface Abbreviature {
	id: number;
	name: string;
  abbreviature: string;
	description: string;
}

export function getAbbreviatureList(): Promise<Abbreviature[]> {
	return client.get(`/abbreviature/list`).then((res) => res.data);
}

/** Attribute */
export interface Attribute {
	id: number;
	name: string;
  attribute: string;
	description: string;
}

export function getAttributeList(): Promise<Attribute[]> {
	return client.get(`/attribute/list`).then((res) => res.data);
}