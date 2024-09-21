import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import { Config } from '@/config';
import { Mongo } from '@/shared/utils';
import { Routers } from '@/transport/routers';

class Main {
	private app: Express;

	constructor() {
		this.app = express();

		this.init();
		this.middlewares();
		this.routes();
		this.listenServer();
		this.background();
	}

	/**
	 * App Init
	 */
	private init(): void {
		Mongo.connect(Config.db.MAIN_DB_DSN, Config.db.MAIN_DB_NAME);
	}

	/**
	 * App Middlewares
	 */
	private middlewares(): void {
		this.app.enable('trust proxy');
		this.app.use(helmet({ crossOriginEmbedderPolicy: false }));
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(express.static(path.join(process.cwd(), './public')));
	}

	/**
	 * App Routes
	 */
	private routes(): void {
		const routers = new Routers().router;
		this.app.use('/', routers);
	}

	/**
	 * App Listen Server
	 */
	private listenServer(): void {
		const port = Config.app.PORT;

		this.app.listen(port, () => {
			console.log('App is running');
			console.log('Port:', port);
			console.log(`Environment: ${Config.app.NODE_ENV}`);
		});
	}

	/**
	 * App Background
	 */
	private background(): void {}
}

new Main();
