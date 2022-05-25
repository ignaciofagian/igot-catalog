import * as express from "express";
import * as http from "http";
import * as cors from "cors";
import { json } from "body-parser";
import router from "./routes";
import ctrlAttribute from "./controllers/attribute";
import { loadFromExcel } from "./utils";

export class App {
  private appServer: any;

  async initialize() {
    await ctrlAttribute.initialize();
    // await loadFromExcel("./../data.xlsx");
  }

  async runServer() {
    // initialize ctrls
    await this.initialize();

    const port = process.env.PORT || 4000;
    const basePath = process.env.BASE_HREF || "";

    this.appServer = express();
    this.appServer.use(
      cors({
        origin: (_, callback) => callback(null, true),
        credentials: true,
        exposedHeaders: ["Content-Disposition"],
      })
    );
		this.appServer.use((req, res, next) => {
			console.log(`Request ${req.url}`);
			next();
		});
    this.appServer.use(json({ limit: "50mb" }));
    this.appServer.use(basePath + "/api", router);

    // start http server
    this.appServer.listen(port, () => {
      console.info(`************ Server listening on ${port} ************`);
    });
  }
}

const app = new App();
app.runServer();
