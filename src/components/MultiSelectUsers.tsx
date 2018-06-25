import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import { graphql } from "react-apollo";

import { getTeamMembersQuery } from "../graphql/team";

const MultiSelectUsers = ({
	data: { loading, getTeamMembers },
	value,
	handleChange,
	placeholder
}: // tslint:disable-next-line:no-any
any) => {
	return loading ? null : (
		<Dropdown
			value={value}
			onChange={handleChange}
			placeholder={placeholder}
			fluid={true}
			multiple={true}
			search={true}
			selection={true}
			// tslint:disable-next-line:no-any
			options={getTeamMembers.map((tm: any) => ({
				key: tm.id,
				value: tm.id,
				text: tm.username
			}))}
		/>
	);
};

// tslint:disable-next-line:no-any
export default graphql<any>(getTeamMembersQuery, {
	options: ({ teamId }) => ({ variables: { teamId } })
})(MultiSelectUsers);
