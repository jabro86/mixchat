import { withFilter } from "graphql-subscriptions";
import * as mkdirp from "mkdirp";
import * as shortid from "shortid";
import * as fs from "fs";
import { GraphQLUpload } from "apollo-upload-server";

import { requiresAuth, requiresTeamAccess } from "../permissions";
import pubsub from "../pubsub";
import { WSAETOOMANYREFS } from "constants";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

const uploadDir = "./uploads";
mkdirp.sync(uploadDir);

const storeFS = ({ stream, filename }) => {
	const id = shortid.generate();
	const path = `${uploadDir}/${id}-${filename}`;
	// tslint:disable-next-line:no-any
	return new Promise<any>((resolve, reject) =>
		stream
			.on("error", error => {
				if (stream.truncated) {
					// Delete the truncated file
					fs.unlinkSync(path);
				}
				reject(error);
			})
			.pipe(fs.createWriteStream(path))
			.on("error", error => reject(error))
			.on("finish", () => resolve({ id, path }))
	);
};

const processUpload = async upload => {
	const { stream, filename, mimetype, encoding } = await upload;
	const { id, path } = await storeFS({ stream, filename });
	return { id, filename, mimetype, encoding, path };
};

export default {
	Upload: GraphQLUpload,
	Subscription: {
		newChannelMessage: {
			subscribe: requiresTeamAccess.createResolver(
				withFilter(
					() => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
					(payload, args) => payload.channelId === args.channelId
				)
			)
		}
	},
	Message: {
		url: parent => {
			return parent.url
				? `${process.env.SERVER_URL || "http://localhost:8080"}/${parent.url}`
				: parent.url;
		},
		user: ({ user, userId }, args, { models }) => {
			if (user) {
				return user;
			}
			return models.User.findOne({ where: { id: userId } }, { raw: true });
		}
	},
	Query: {
		messages: requiresAuth.createResolver(
			async (parent, { cursor, channelId }, { models, user }) => {
				const channel = await models.Channel.findOne({
					raw: true,
					where: { id: channelId }
				});
				if (!channel.public) {
					const member = await models.PCMember.findOne({
						raw: true,
						where: { channelId, userId: user.id }
					});
					if (!member) {
						throw new Error("Not Authorized");
					}
				}

				const options = {
					order: [["created_at", "DESC"]],
					where: { channelId },
					limit: 20
				};

				if (cursor) {
					// tslint:disable-next-line:no-any
					(options.where as any).created_at = {
						[models.op.lt]: cursor
					};
				}
				return models.Message.findAll(options, { raw: true });
			}
		)
	},
	Mutation: {
		createMessage: requiresAuth.createResolver(
			async (parent, { file, ...args }, { models, user }) => {
				try {
					let messageData = args;
					if (file) {
						const { mimetype, path } = await processUpload(file);
						messageData.filetype = mimetype;
						messageData.url = path;
					}
					const message = await models.Message.create({
						...messageData,
						userId: user.id
					});

					const asyncFunc = async () => {
						const currentUser = await models.User.findOne(
							{ where: { id: user.id } },
							{ raw: true }
						);

						pubsub.publish(NEW_CHANNEL_MESSAGE, {
							channelId: args.channelId,
							newChannelMessage: {
								...message.dataValues,
								user: currentUser.dataValues
							}
						});
					};

					asyncFunc();

					return true;
				} catch (error) {
					return false;
				}
			}
		)
	}
};
