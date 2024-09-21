import { Router } from 'express';

import { BaseRouter } from '@/shared/libs';

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
	private appRoutes(router: Router): void {}
}
