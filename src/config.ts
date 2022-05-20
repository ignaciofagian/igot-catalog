/* eslint-disable */

const CONFIG_VAR = '___APP_CONFIG___';

type Fields = 'API_URL' | 'API_SOCKET_PATH';

function get(key: Fields) {
	if (!(window as any)[CONFIG_VAR]) {
		throw new Error('Missing app configuration file config.json');
	}

	return (window as { [key: string]: any })[CONFIG_VAR][key];
}

export default { get };
