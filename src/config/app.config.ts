import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export class AppConfig {
	public readonly NODE_ENV = process.env.NODE_ENV || '';
	public readonly PORT = parseInt(process.env.PORT || '');
	public readonly BASE_URL = process.env.BASE_URL || '';
}
