import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

// tslint:disable no-any

const Home = (props: any): JSX.Element => {
	const { data: { allUsers = [] } } = props;
	return (
		<div>
			{allUsers.map((user: any) => (<h1 key={user.id}>{user.email}</h1>))}
		</div>
	);
};

const allUsersQuery = gql`
{
	allUsers {
		id
		email
	}
}
`;

export default graphql(allUsersQuery)(Home);