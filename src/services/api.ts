import client, { Result } from '.';

/** Abbreviature */
export interface Abbreviature {
	id: number;
	abbreviature: string;
	description: string;
}

export function getAbbreviatureList(): Promise<Abbreviature[]> {
	return client.get(`/abbreviature/list`).then((res) => res.data);
}

export function postAddAbbreviature(abbreviature: Abbreviature): Promise<Result> {
	return client
		.post(`/abbreviature/add`, {
			abbreviature,
		})
		.then((res) => res.data);
}

export function postEditAbbreviature(abbreviature: Abbreviature): Promise<Result> {
	return client
		.post(`/abbreviature/edit`, 
			abbreviature,
		)
		.then((res) => res.data);
}

export function postDeleteAbbreviature(id: number): Promise<Result> {
	return client
		.post(`/abbreviature/delete`, {
			id,
		})
		.then((res) => res.data);
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

export function postAddAttribute(attribute: Attribute): Promise<Result> {
	return client
		.post(`/attribute/add`, {
			attribute,
		})
		.then((res) => res.data);
}

export function postEditAttribute(attribute: Attribute): Promise<Result> {
	return client
		.post(`/attribute/edit`, {
			attribute,
		})
		.then((res) => res.data);
}

export function postDeleteAttribute(id: number): Promise<Result> {
	return client
		.post(`/attribute/delete`, {
			id,
		})
		.then((res) => res.data);
}
