import { Helper } from '@/shared/helpers';
import { Service } from '@/shared/libs';
import { UserRegisterRequestBody } from '@/transport/requests/user.request';
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
			if (user) this.errorHandler(400, 'Email already exist');

			return await this.userRepo.create(
				reqBody.email.toLowerCase(),
				Helper.hash(reqBody.password),
			);
		} catch (error) {
			await this.catchErrorHandler(error, this.register.name);
		}
		return null;
	}
}
