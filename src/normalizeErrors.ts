// tslint:disable-next-line:no-any
const normalizeErrors = (errors: any[]) => {
	return errors.reduce((acc, val) => {
		if (val.path in acc) {
			acc[val.path].push([val.message]);
		} else {
			acc[val.path] = [val.message];
		}
		return acc;
		// tslint:disable-next-line:align
	}, {});
};

export default normalizeErrors;
