import dayjs from 'dayjs';
import mongoose, { Schema, Model as MongoModel, Document } from 'mongoose';

import { Model } from '@/shared/libs/model.lib';

export interface S_Subscription extends S_SubscriptionBase, Document {}

export interface S_SubscriptionBase {
	type?: string;
	status?: string;
	start_date?: Date | null;
	end_date?: Date | null;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}

class SubscriptionSchema {
	public static getSchema() {
		return new Schema<S_SubscriptionBase>({
			type: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				required: true,
			},
			start_date: {
				type: String,
				required: false,
			},
			end_date: {
				type: String,
				required: false,
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

export class Subscription extends Model<S_Subscription> {
	public payload: S_SubscriptionBase = {} as S_SubscriptionBase;

	constructor() {
		super(
			mongoose.models.subscription ||
				(mongoose.model<S_Subscription>(
					'subscription',
					SubscriptionSchema.getSchema(),
				) as MongoModel<S_Subscription>),
		);
	}

	public async save(): Promise<S_Subscription> {
		return await this.saveInstance(this.payload);
	}
}
