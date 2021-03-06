import * as React from "react";
import * as _ from "lodash";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { compose, graphql, ChildProps } from "react-apollo";
import gql from "graphql-tag";

import { meQuery } from "../graphql/team";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import MessageContainer from "../containers/MessageContainer";
import { User } from "../components/DirectMessageModal";

export interface Channel {
	id: number;
	name: string;
	public: boolean;
	dm: boolean;
}

export interface Team {
	id: number;
	owner: number;
	name: string;
	admin: boolean;
	directMessageMembers: User[];
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

interface ViewTeamProps {
	teamId: string;
	channelId: string;
}

class ViewTeam extends React.Component<
	ChildProps<RouteComponentProps<ViewTeamProps>, AllTeamsQueryResult>
> {
	render() {
		if (this.props.data === undefined) {
			return null;
		}
		const {
			mutate,
			data: { loading, me },
			match: {
				params: { teamId, channelId }
			}
		} = this.props;

		if (loading || me === undefined || mutate === undefined) {
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

		const channelIdInteger = parseInt(channelId, 10);
		const channelIdx = channelIdInteger
			? _.findIndex(team.channels, ["id", channelIdInteger])
			: 0;
		const channel =
			channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

		return (
			<AppLayout>
				{channel && <Header channelName={channel.name} />}
				<Sidebar
					teams={teams.map(t => ({
						id: t.id,
						letter: t.name.charAt(0).toUpperCase()
					}))}
					team={team}
					username={me.username}
					currentUserId={me.id}
				/>
				{channel && <MessageContainer channelId={channel.id} />}
				{channel && (
					<SendMessage
						placeholder={channel.name}
						// tslint:disable-next-line:no-any
						onSubmit={async (text: any) => {
							await mutate({ variables: { text, channelId: channel.id } });
						}}
						channelId={channel.id}
					/>
				)}
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
	graphql<RouteComponentProps<ViewTeamProps>>(meQuery, {
		options: { fetchPolicy: "network-only" }
	}),
	graphql(createMessageMutation)
)(ViewTeam);
