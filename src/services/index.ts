import axios from 'axios';
import config from '../config';

export const API_ROOT_URL = config.get('API_URL');

const client = axios.create({
	baseURL: API_ROOT_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Set the AUTH token for any request
client.interceptors.request.use((settings: any) => {
	const loggedData = localStorage.getItem('twitter_profile');
	if (loggedData) {
		settings.headers['user-id'] = JSON.parse(loggedData).id;
	}
	return settings;
});

export interface Result {
	code: any;
	description: string;
}

export default client;
