import { Router } from 'express';

import { BaseRouter } from '@/shared/libs';
import { UserRouter } from '@/transport/routers/user.router';

export class Routers extends BaseRouter {
	public readonly appRouter: Router;

	constructor() {
		super();

		this.appRouter = Router();
		this.appRoutes(this.appRouter);
		this.index(this.appRouter);
	}

	/**
	 * App Route lists
	 *
	 * @param router
	 */
	private appRoutes(router: Router): void {
		new UserRouter(router);
	}
}
