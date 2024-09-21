import dayjs from 'dayjs';
import mongoose, { Schema, Model as MongoModel, Document } from 'mongoose';

import { S_SubscriptionBase } from '@/app/models/subscription.model';
import { Model } from '@/shared/libs';

export interface S_User extends S_UserBase, Document {}

export interface S_UserBase {
	username?: string;
	email?: string;
	password?: string;
	wallet_address?: string;
	roles?: string[];
	features?: string[];
	capabilities?: string[];
	subscriptions?: S_SubscriptionBase[];
	is_verified?: boolean;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}

class UserSchema {
	public static getSchema() {
		return new Schema<S_UserBase>({
			username: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			password: {
				type: String,
				required: true,
			},
			wallet_address: {
				type: String,
				default: '',
			},
			roles: {
				type: Array,
				required: true,
			},
			features: {
				type: Array,
				required: true,
			},
			capabilities: {
				type: Array,
				required: true,
			},
			subscriptions: {
				type: Array,
				required: true,
			},
			is_verified: {
				type: Boolean,
				required: true,
				default: false,
			},
			created_at: {
				type: Date,
				required: true,
				default: dayjs().toDate(),
			},
			updated_at: {
				type: Date,
				required: true,
				default: dayjs().toDate(),
			},
			deleted_at: {
				type: Date,
				default: null,
			},
		});
	}
}

export class User extends Model<S_User> {
	public payload: S_UserBase = {} as S_UserBase;

	constructor() {
		super(
			mongoose.models.user ||
				(mongoose.model<S_User>(
					'user',
					UserSchema.getSchema(),
				) as MongoModel<S_User>),
		);
	}

	public async save(): Promise<S_User> {
		return await this.saveInstance(this.payload);
	}
}
