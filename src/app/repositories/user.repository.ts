import {
	PipelineStage,
	ProjectionType,
	QueryOptions,
	RootQuerySelector,
} from 'mongoose';
import { ObjectId } from 'bson';

import { Repository } from '@/shared/libs/repository.lib';
import { S_User, User } from '@/app/models';
import { Helper } from '@/shared/helpers';
import { I_Pagination, I_UserListQueryPayload } from '@/shared/interfaces';

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

	/**
	 * Get User List Pagination
	 *
	 * @param payload
	 * @returns
	 */
	public async getList(payload: I_UserListQueryPayload): Promise<{
		users: S_User[];
		pagination: I_Pagination | null;
	}> {
		const user = new User();
		try {
			const match: RootQuerySelector<S_User> = payload.search.key
				? {
						[payload.search.key]: {
							$in: payload.search.value as string[],
						},
						is_deleted: null,
					}
				: payload.search.value.length > 0
					? {
							$or: [
								{ _id: payload.search.value },
								{
									username: {
										$regex: new RegExp(
											payload.search.value as string,
											'i',
										),
									},
								},
								{
									email: {
										$regex: new RegExp(
											payload.search.value as string,
											'i',
										),
									},
								},
								{ wallet_address: payload.search.value },
							],
							is_deleted: null,
						}
					: {};

			const pipeline: PipelineStage[] = [
				{ $match: match },
				{ $sort: { [payload.sort_by]: payload.sort } },
				{ $skip: (payload.page - 1) * payload.per_page },
				{ $limit: payload.per_page },
				{ $project: { password: 0, __v: 0 } },
			];

			const count = await user.countDocuments(match);
			const users = await user.getRaw(pipeline);

			return {
				users,
				pagination: Helper.generatePagination(
					payload.page,
					payload.per_page,
					count,
				),
			};
		} catch (error) {
			await this.catchErrorHandler(error, this.getList.name);
		}
		return { users: [], pagination: null };
	}
}
