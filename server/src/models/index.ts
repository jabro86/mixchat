import * as Sequelize from "sequelize";

/* tslint:disable no-any*/

const sequelize = new Sequelize("slack", "postgres", "supersecret", {
	dialect: "postgres",
	operatorsAliases: Sequelize.Op as any,
	define: {
		underscored: true
	}
});

const models = {
	User: sequelize.import("./user"),
	Channel: sequelize.import("./channel"),
	Message: sequelize.import("./message"),
	DirectMessage: sequelize.import("./directMessage"),
	Team: sequelize.import("./team"),
	Member: sequelize.import("./member"),
	PCMember: sequelize.import("./pcmember"),
	sequelize: sequelize,
	Sequelize: Sequelize,
	op: Sequelize.Op
};

Object.keys(models).forEach(modelName => {
	if ("associate" in models[modelName]) {
		models[modelName].associate(models);
	}
});

export default models;
