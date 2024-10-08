import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import {
	UserListRequestQuery,
	UserLoginRequestBody,
	UserRegisterRequestBody,
	UserUpdatePasswordRequestBody,
	UserUpdateRequestBody,
	UserUpdateRolesRequestBody,
	UserUpdateRolesRequestParams,
} from '@/transport/requests/user.request';
import { UserService } from '@/app/services';
import { UserResponse } from '@/transport/responses/user.response';

export class UserController extends Controller {
	private userSvc: UserService;
	private userRes: UserResponse;

	constructor() {
		super();

		this.userSvc = new UserService();
		this.userRes = new UserResponse();
	}

	/**
	 * User Register Controller
	 *
	 * @param req
	 * @param res
	 */
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
				this.userRes.register(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.register.name);
		}
	}

	/**
	 * User Login Controller
	 *
	 * @param req
	 * @param res
	 */
	public async login(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(
				UserLoginRequestBody,
				req,
			);

			const result = await this.userSvc.login(reqBody);

			this.response(
				res,
				'Login success',
				this.STATUS_CODE.OK,
				this.userRes.login(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.login.name);
		}
	}

	/**
	 * User Me Controller
	 *
	 * @param _req
	 * @param res
	 */
	public async me(_req: Request, res: Response): Promise<void> {
		try {
			this.response(
				res,
				'User data',
				this.STATUS_CODE.OK,
				this.getLocals(res).user,
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.me.name);
		}
	}

	/**
	 * User Update controller
	 *
	 * @param req
	 * @param res
	 */
	public async update(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(
				UserUpdateRequestBody,
				req,
			);

			const user = this.getLocals(res).user;
			const result = await this.userSvc.update(
				reqBody,
				user._id as string,
			);

			this.response(
				res,
				'Update user success',
				this.STATUS_CODE.OK,
				this.userRes.update(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.update.name);
		}
	}

	/**
	 * User Update Password controller
	 *
	 * @param req
	 * @param res
	 */
	public async updatePassword(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(
				UserUpdatePasswordRequestBody,
				req,
			);

			const user = this.getLocals(res).user;
			const result = await this.userSvc.updatePassword(reqBody, user);

			this.response(
				res,
				'Update password success',
				this.STATUS_CODE.OK,
				this.userRes.updatePassword(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updatePassword.name);
		}
	}

	/**
	 * User Update Role controller
	 *
	 * @param req
	 * @param res
	 */
	public async updateRole(req: Request, res: Response): Promise<void> {
		try {
			const reqParams = await this.getRequestParams(
				UserUpdateRolesRequestParams,
				req,
			);

			const reqBody = await this.getRequestBody(
				UserUpdateRolesRequestBody,
				req,
			);

			const result = await this.userSvc.updateRole(reqBody, reqParams.id);

			this.response(
				res,
				'Update role success',
				this.STATUS_CODE.OK,
				this.userRes.updateRole(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.updateRole.name);
		}
	}

	/**
	 * User List Controller
	 *
	 * @param req
	 * @param res
	 */
	public async list(req: Request, res: Response): Promise<void> {
		try {
			const reqQuery = await this.getRequestQuery(
				UserListRequestQuery,
				req,
			);

			const { users: results, pagination } =
				await this.userSvc.list(reqQuery);

			this.responsePagination(
				res,
				'User list',
				this.STATUS_CODE.OK,
				this.userRes.list(results),
				pagination,
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.list.name);
		}
	}
}
