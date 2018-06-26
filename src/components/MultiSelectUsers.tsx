import * as React from "react";
import { Dropdown } from "semantic-ui-react";
import { graphql } from "react-apollo";

import { getTeamMembersQuery } from "../graphql/team";
// tslint:disable:no-any
const MultiSelectUsers = ({
	data: { loading, getTeamMembers },
	value,
	handleChange,
	placeholder,
	currentUserId
}: any) => {
	return loading ? null : (
		<Dropdown
			value={value}
			onChange={handleChange}
			placeholder={placeholder}
			fluid={true}
			multiple={true}
			search={true}
			selection={true}
			options={getTeamMembers
				.filter((tm: any) => tm.id !== currentUserId)
				.map((tm: any) => ({
					key: tm.id,
					value: tm.id,
					text: tm.username
				}))}
		/>
	);
};

export default graphql<any>(getTeamMembersQuery, {
	options: ({ teamId }) => ({ variables: { teamId } })
})(MultiSelectUsers);
