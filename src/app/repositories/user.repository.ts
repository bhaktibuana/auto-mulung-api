import { ProjectionType, QueryOptions, RootQuerySelector } from 'mongoose';

import { Repository } from '@/shared/libs';
import { S_User, User } from '@/app/models';
import { Helper } from '@/shared/helpers';

export class UserRepository extends Repository {
	constructor() {
		super();
	}

	/**
	 * Find One User
	 *
	 * @param query
	 * @param projection
	 * @param options
	 * @returns
	 */
	public async findOne(
		query: RootQuerySelector<S_User>,
		projection?: ProjectionType<S_User>,
		options?: QueryOptions<S_User>,
	): Promise<S_User | null> {
		const user = new User();
		try {
			return await user.findOne(query, projection, options);
		} catch (error) {
			await this.systemLog(this.create.name, error);
			this.errorHandler(500, 'Internal Server Error', error);
		}
		return null;
	}

	/**
	 * Create User
	 *
	 * @param email
	 * @param password
	 * @returns
	 */
	public async create(
		email: string,
		password: string,
	): Promise<S_User | null> {
		const user = new User();
		user.payload = {
			email,
			password,
			username: Helper.generateUsername(),
			wallet_address: '',
			roles: [],
			features: [],
			capabilities: [],
			subscriptions: [],
			is_verified: false,
		};

		try {
			return await user.save();
		} catch (error) {
			await this.systemLog(this.create.name, error);
			this.errorHandler(500, 'Internal Server Error', error);
		}
		return null;
	}
}
