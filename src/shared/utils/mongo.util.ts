import mongoose from 'mongoose';

import { Console } from '@/shared/utils/console.util';

export class Mongo {
    /**
     * MongoDB Connect
     * 
     * @param dbDsn 
     * @param dbName 
     */
	public static connect(dbDsn: string, dbName: string) {
		try {
			mongoose.connect(dbDsn, { dbName });
			Console.log('MongoDB', `Successfully connected to ${dbName}`);
		} catch (error) {
			Console.error('MongoDB', error);
			process.exit(1);
		}
	}
}
