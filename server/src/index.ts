import * as express from "express";
import * as bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import * as path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import * as cors from "cors";
import { verify } from "jsonwebtoken";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
// import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { apolloUploadExpress } from "apollo-upload-server";
import * as DataLoader from "dataloader";

import models from "./models";
import { refreshTokens } from "./auth";
import { channelBatcher } from "./batchFunctions";

const SECRET = "afdaslk34knmlkanmfdllq3e";
const SECRET2 = "sajdoje2iöowjdöowqj3safksf";

const typeDefs = mergeTypes(
	fileLoader(path.join(__dirname, "./schema"), { extensions: [".ts"] })
);
const resolvers = mergeResolvers(
	fileLoader(path.join(__dirname, "./resolvers"), { extensions: [".ts"] })
);

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

const app = express();

app.use(cors("*"));

const addUser = async (req, res, next) => {
	const token = req.headers["x-token"];
	if (token) {
		try {
			const { user } = verify(token, SECRET) as any;
			req.user = user;
		} catch (err) {
			const refreshToken = req.headers["x-refresh-token"];
			const newTokens = await refreshTokens(
				token,
				refreshToken,
				models,
				SECRET,
				SECRET2
			);
			if (newTokens.token && newTokens.refreshToken) {
				res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
				res.set("x-token", newTokens.token);
				res.set("x-refresh-token", newTokens.refreshToken);
			}
			req.user = newTokens.user;
		}
	}
	next();
};
app.use(addUser);

const graphqlEndpoint = "/graphql";
app.use(
	graphqlEndpoint,
	bodyParser.json(),
	apolloUploadExpress(),
	graphqlExpress((req: any) => ({
		schema,
		context: {
			models,
			user: req.user,
			SECRET,
			SECRET2,
			channelLoader: new DataLoader(ids =>
				channelBatcher(ids, models, req.user)
			)
		}
	}))
);

app.use(
	"/graphiql",
	graphiqlExpress({
		endpointURL: graphqlEndpoint,
		subscriptionsEndpoint: "ws://localhost/subscriptions"
	})
);

app.use("/uploads", express.static("uploads"));

const server = createServer(app);

models.sequelize.sync({ force: false }).then(() => {
	server.listen(8080, () => {
		// tslint:disable-next-line:no-unused-expression
		new SubscriptionServer(
			{
				execute,
				subscribe,
				schema,
				onConnect: async ({ token, refreshToken }, webSocket) => {
					if (token && refreshToken) {
						let user = null;
						try {
							const { user: userFromToken } = verify(token, SECRET) as any;
							return { models, user: userFromToken };
						} catch (err) {
							const newTokens = await refreshTokens(
								token,
								refreshToken,
								models,
								SECRET,
								SECRET2
							);
							return { models, user: newTokens.user };
						}
					}
					return { models };
				}
			},
			{
				server,
				path: "/subscriptions"
			}
		);
	});
});
