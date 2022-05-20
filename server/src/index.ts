import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import { json } from 'body-parser';
import router from './routes';

export class App {
	private appServer: any;

	async initialize() {}

	async runServer() {
		this.appServer = express();
		this.appServer.use(
			cors({
				origin: (_, callback) => callback(null, true),
				credentials: true,
				exposedHeaders: ['Content-Disposition'],
			}),
		);
		this.appServer.use(json({ limit: '50mb' }));
		this.appServer.use('/api', router);

		const server = new http.Server(this.appServer);

		// start http server
		server.listen(4000, () => {
			console.info(`************ Server listening on ${4000} ************`);
		});
	}
}

const app = new App();
app.runServer();
