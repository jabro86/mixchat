import { sign, decode, verify } from "jsonwebtoken";
import * as _ from "lodash";
import * as bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {
	// {user: {id: 2}}
	const createToken = sign({ user: _.pick(user, ["id", "username"]) }, secret, {
		expiresIn: "1h"
	});

	const createRefreshToken = sign(
		{ user: _.pick(user, "id", "username") },
		secret2,
		{
			expiresIn: "7d"
		}
	);

	return [createToken, createRefreshToken];
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
	const user = await models.User.findOne({ where: { email }, raw: true });
	if (!user) {
		// user with provided email not found
		return {
			ok: false,
			errors: [{ path: "email", message: "Wrong email" }]
		};
	}

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) {
		// bad password
		return {
			ok: false,
			errors: [{ path: "password", message: "Wrong password" }]
		};
	}

	const refreshTokenSecret = user.password + SECRET2;

	const [token, refreshToken] = await createTokens(
		user,
		SECRET,
		refreshTokenSecret
	);

	return { ok: true, token, refreshToken };
};

export const refreshTokens = async (
	token: string,
	refreshToken: string,
	models,
	SECRET: string,
	SECRET2?: string
) => {
	let userId = 0;
	try {
		const {
			user: { id }
		} = decode(refreshToken) as any;
	} catch (err) {
		return {};
	}

	if (!userId) {
		return {};
	}

	const user = await models.User.findOne({ where: { id: userId }, raw: true });

	if (!user) {
		return {};
	}

	const refreshSecret = user.password + SECRET2;

	try {
		verify(refreshToken, refreshSecret);
	} catch (err) {
		return {};
	}

	const [newToken, newRefreshToken] = await createTokens(
		user,
		SECRET,
		refreshSecret
	);

	return {
		token: newToken,
		refreshToken: newRefreshToken,
		user
	};
};
