import dayjs from 'dayjs';
import mongoose, { Document, Model as MongoModel, Schema } from 'mongoose';

import { Model } from '@/shared/libs';

export interface S_SystemLog extends S_SystemLogBase, Document {}

export interface S_SystemLogBase {
	class_name?: string;
	function_name?: string;
	slug?: string | null;
	status?: 'success' | 'failed';
	data?: Object | unknown;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}

class SystemLogSchema {
	public static getSchema() {
		return new Schema<S_SystemLogBase>({
			class_name: {
				type: String,
				required: true,
			},
			function_name: {
				type: String,
				required: true,
			},
			slug: {
				type: String,
				default: null,
			},
			status: {
				type: String,
				required: true,
			},
			data: {
				type: Object,
				required: true,
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

export class SystemLog extends Model<S_SystemLog> {
	public payload: S_SystemLogBase = {} as S_SystemLogBase;

	constructor() {
		super(
			mongoose.models.system_log ||
				(mongoose.model<S_SystemLog>(
					'system_log',
					SystemLogSchema.getSchema(),
				) as MongoModel<S_SystemLog>),
		);
	}

	public async save(): Promise<S_SystemLog> {
		return await this.saveInstance(this.payload);
	}
}
