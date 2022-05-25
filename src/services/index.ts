import axios from 'axios';
import config from '../config';

export const API_ROOT_URL = config.get('API_URL');

const client = axios.create({
	baseURL: API_ROOT_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export interface Result {
	code: any;
	description: string;
}

export default client;
