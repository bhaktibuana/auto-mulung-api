import { Request, Response } from 'express';

import { Controller } from '@/shared/libs';
import { UserRegisterRequestBody } from '@/transport/requests/user.request';
import { UserService } from '@/app/services';

export class UserController extends Controller {
	private userSvc: UserService;

	constructor() {
		super();

		this.userSvc = new UserService();
	}

	public async register(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(
				UserRegisterRequestBody,
				req,
			);

			const result = await this.userSvc.register(reqBody);

			this.response(
				res,
				'Register success',
				this.STATUS_CODE.CREATED,
				result,
			);
		} catch (error) {
			await this.systemLog(this.register.name, error);
			this.errorResponse(res, error);
		}
	}
}
