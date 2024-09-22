import { BaseMiddleware } from '@/transport/middlewares/base.middleware';
import { Helper } from '@/shared/helpers';
import { Next, Req, Res } from '@/shared/types/express';
import { S_User } from '@/app/models';
import { UserService } from '@/app/services';

export class Middleware extends BaseMiddleware {
	private userSvc: UserService;

	constructor() {
		super();

		this.userSvc = new UserService();
	}

	/**
	 * Auth Middleware
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async auth(req: Req, res: Res, next: Next): Promise<void> {
		try {
			if (!req.headers.authorization)
				this.errorHandler(
					this.STATUS_CODE.UNAUTHORIZED,
					'Unauthorized',
				);

			const splitToken = (req.headers.authorization as string).split(' ');
			if (splitToken.length !== 2 || splitToken[0] !== 'Bearer')
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Wrong authorization format',
				);

			const { error, decoded } = Helper.verifyJWT<S_User>(splitToken[1]);
			if (error)
				this.errorHandler(
					this.STATUS_CODE.UNAUTHORIZED,
					error.message,
					error,
				);

			const user = await this.userSvc.me(
				(decoded as S_User)._id as string,
			);

			res.locals.user = user as S_User;
			next();
		} catch (error) {
			await this.catchErrorHandler(res, error, this.auth.name);
		}
	}

	public async isAdmin(_req: Req, res: Res, next: Next): Promise<void> {
		try {
			const user = res.locals.user;
			if (!user)
				this.errorHandler(
					this.STATUS_CODE.FORBIDDEN,
					'Forbidden: Admin only',
				);

			if (!user.roles?.includes('admin'))
				this.errorHandler(
					this.STATUS_CODE.FORBIDDEN,
					'Forbidden: Admin only',
				);

			next();
		} catch (error) {
			await this.catchErrorHandler(res, error, this.isAdmin.name);
		}
	}
}
