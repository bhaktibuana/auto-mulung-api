import { ProjectionType, QueryOptions, RootQuerySelector } from 'mongoose';
import { ObjectId } from 'bson';

import { Repository } from '@/shared/libs/repository.lib';
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
			await this.catchErrorHandler(error, this.findOne.name);
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
			await this.catchErrorHandler(error, this.create.name);
		}
		return null;
	}

	/**
	 * Find One User by _id
	 *
	 * @param id
	 * @param projection
	 * @returns
	 */
	public async findById(
		id: ObjectId,
		projection?: ProjectionType<S_User>,
	): Promise<S_User | null> {
		const user = new User();
		try {
			return await user.findById(id, projection);
		} catch (error) {
			await this.catchErrorHandler(error, this.findOne.name);
		}
		return null;
	}

	/**
	 * Find One User by _id and Update
	 *
	 * @param id
	 * @param payload
	 * @returns
	 */
	public async findByIdAndUpdate(
		id: ObjectId,
		payload: Partial<S_User>,
	): Promise<S_User | null> {
		const user = new User();
		try {
			return await user.findByIdAndUpdate(id, payload);
		} catch (error) {
			await this.catchErrorHandler(error, this.findByIdAndUpdate.name);
		}
		return null;
	}
}
