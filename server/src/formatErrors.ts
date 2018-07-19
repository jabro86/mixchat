import * as _ from "lodash";

export const formatErrors = (e, models) => {
	if (e instanceof models.sequelize.UniqueConstraintError) {
		return [{ path: "name", message: "name must be unique" }];
	}
	if (e instanceof models.sequelize.ValidationError) {
		return e.errors.map(x => _.pick(x, ["path", "message"]));
	}
	return [{ path: "name", message: "something went wrong" }];
};
