import { ObjectId } from 'bson';

import { Helper } from '@/shared/helpers';
import { Service } from '@/shared/libs/service.lib';
import {
	UserLoginRequestBody,
	UserRegisterRequestBody,
	UserUpdateRequestBody,
} from '@/transport/requests/user.request';
import { UserRepository } from '@/app/repositories';
import { S_User } from '@/app/models';

export class UserService extends Service {
	private userRepo: UserRepository;
	constructor() {
		super();

		this.userRepo = new UserRepository();
	}

	/**
	 * User Register Service
	 *
	 * @param reqBody
	 * @returns
	 */
	public async register(
		reqBody: UserRegisterRequestBody,
	): Promise<S_User | null> {
		try {
			const payload = {
				email: reqBody.email.toLowerCase(),
				password: Helper.hash(reqBody.password),
			};

			const user = await this.userRepo.findOne(
				{
					email: payload.email,
				},
				{ email: 1 },
			);
			if (user)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Email already exist',
				);

			return await this.userRepo.create(
				reqBody.email.toLowerCase(),
				Helper.hash(reqBody.password),
			);
		} catch (error) {
			await this.catchErrorHandler(error, this.register.name);
		}
		return null;
	}

	/**
	 * User Login Service
	 *
	 * @param reqBody
	 * @returns
	 */
	public async login(reqBody: UserLoginRequestBody) {
		try {
			const payload = {
				email: reqBody.email.toLowerCase(),
				password: Helper.hash(reqBody.password),
			};

			const user = await this.userRepo.findOne(
				{
					email: payload.email,
					password: payload.password,
				},
				{ email: 1, is_verified: 1 },
			);

			if (!user)
				this.errorHandler(
					this.STATUS_CODE.NOT_FOUND,
					'Wrong email or password',
				);
			if (user && !user.is_verified)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Unverified user',
				);

			const token = Helper.generateJWT(user?.toObject(), '7d');

			return { user, token };
		} catch (error) {
			await this.catchErrorHandler(error, this.login.name);
		}
		return null;
	}

	/**
	 * User Me Service
	 *
	 * @param id
	 * @returns
	 */
	public async me(id: string): Promise<S_User | null> {
		try {
			const user = await this.userRepo.findById(new ObjectId(id), {
				password: 0,
				__v: 0,
			});

			if (!user)
				this.errorHandler(this.STATUS_CODE.NOT_FOUND, 'User not found');

			return user;
		} catch (error) {
			await this.catchErrorHandler(error, this.me.name);
		}
		return null;
	}

	/**
	 * User Update Service
	 *
	 * @param reqBody
	 * @param id
	 * @returns
	 */
	public async update(
		reqBody: UserUpdateRequestBody,
		id: string,
	): Promise<S_User | null> {
		try {
			const payload = {
				username: reqBody.username,
				email: reqBody.email.toLowerCase(),
				wallet_address: reqBody.wallet_address,
			};

			const user = await this.userRepo.findOne({
				email: { $ne: payload.email },
			});
			if (user)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Email already exist',
				);

			const updateUser = await this.userRepo.findByIdAndUpdate(
				new ObjectId(id),
				payload,
			);
			if (!updateUser)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Udpate user failed',
				);

			return updateUser;
		} catch (error) {
			await this.catchErrorHandler(error, this.update.name);
		}
		return null;
	}
}
