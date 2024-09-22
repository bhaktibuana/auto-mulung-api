import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { UserController } from '@/app/controllers';

export class UserRouter extends Router<UserController> {
	constructor(router: ExpressRouter) {
		super(router, '/user', new UserController());

		this.post('/register', this.controller.register);
		this.post('/login', this.controller.login);
		this.get('/me', this.controller.me, ['auth']);
		this.put('/update', this.controller.update, ['auth']);
		this.put('/update-password', this.controller.updatePassword, ['auth']);
		this.put('/:id/update-role', this.controller.updateRole, [
			'auth',
			'isAdmin',
		]);
		this.get('/', this.controller.list, ['auth', 'isAdmin']);
	}
}
