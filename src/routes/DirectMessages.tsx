import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { graphql, compose, ChildProps } from "react-apollo";
import * as _ from "lodash";
import gql from "graphql-tag";

import { meQuery } from "../graphql/team";
// import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
// import MessageContainer from "../containers/MessageContainer";
export interface Channel {
	id: number;
	name: string;
}

export interface Team {
	id: number;
	owner: number;
	name: string;
	admin: boolean;
	channels: Channel[];
}

export interface MeQuery {
	id: number;
	username: string;
	teams: Team[];
}

export interface AllTeamsQueryResult {
	loading: boolean;
	me: MeQuery;
}

interface DirectMessagesProps {
	teamId: string;
	userId: string;
}

class DirectMessages extends React.Component<
	ChildProps<RouteComponentProps<DirectMessagesProps>, AllTeamsQueryResult>
> {
	render() {
		if (this.props.data === undefined) {
			return null;
		}
		const {
			data: { loading, me },
			match: { params: { teamId, userId } }
		} = this.props;

		if (loading || me === undefined) {
			return null;
		}
		const teams = [];
		if (me !== undefined) {
			teams.push(...me.teams);
		}

		if (!teams.length) {
			return <Redirect to="/create-team" />;
		}

		const teamIdInteger = parseInt(teamId, 10);
		const teamIdx = teamIdInteger
			? _.findIndex(teams, ["id", teamIdInteger])
			: 0;
		const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

		return (
			<AppLayout>
				{/* <Header channelName={channel.name} /> */}
				<Sidebar
					teams={teams.map(t => ({
						id: t.id,
						letter: t.name.charAt(0).toUpperCase()
					}))}
					team={team}
					username={me.username}
				/>
				{/* <MessageContainer channelId={channel.id} /> */}
				<SendMessage
					onSubmit={() => {
						/* todo*/
					}}
					placeholder={userId}
				/>
			</AppLayout>
		);
	}
}

const createMessageMutation = gql`
	mutation($channelId: Int!, $text: String!) {
		createMessage(channelId: $channelId, text: $text)
	}
`;

export default compose(
	graphql<RouteComponentProps<DirectMessagesProps>>(meQuery, {
		options: { fetchPolicy: "network-only" }
	}),
	graphql(createMessageMutation)
)(DirectMessages);