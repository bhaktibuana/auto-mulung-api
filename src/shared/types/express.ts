import { NextFunction, Request, Response } from 'express';

import { S_User } from '@/app/models';

declare namespace e {
	type Next = NextFunction;
	type Req = Request;

	type Res = Response<
		any,
		{
			base_url: string;
			user: S_User;
		}
	>;
}

export = e;
