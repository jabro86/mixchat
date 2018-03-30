import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { graphql, ChildProps } from "react-apollo";
import * as _ from "lodash";

import { allTeamsQuery } from "../graphql/team";
import Header from "../components/Header";
import Messages from "../components/Messages";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
export interface Channel {
	id: number;
	name: string;
}

export interface Team {
	id: number;
	name: string;
	channels: Channel[];
}

export interface AllTeamsQueryResult {
	loading: boolean;
	allTeams: Team[];
	inviteTeams: Team[];
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
			data: { loading, allTeams, inviteTeams },
			match: { params: { teamId, channelId } }
		} = this.props;

		if (loading) {
			return null;
		}

		const teams = [];
		if (allTeams !== undefined) {
			teams.push(...allTeams);
		}
		if (inviteTeams !== undefined) {
			teams.push(...inviteTeams);
		}

		if (!teams.length) {
			return <Redirect to="/create-team" />;
		}

		const teamIdInteger = parseInt(teamId, 10);
		const teamIdx = teamIdInteger ? _.findIndex(teams, ["id", teamIdInteger]) : 0;
		const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

		const channelIdInteger = parseInt(channelId, 10);
		const channelIdx = channelIdInteger
			? _.findIndex(team.channels, ["id", channelIdInteger])
			: 0;
		const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

		return (
			<AppLayout>
				{channel && <Header channelName={channel.name} />}
				<Sidebar
					teams={teams.map(t => ({
						id: t.id,
						letter: t.name.charAt(0).toUpperCase()
					}))}
					team={team}
				/>
				{channel && (
					<Messages channelId={channel.id}>
						<ul className="message-list">
							<li />
							<li />
						</ul>
					</Messages>
				)}
				{channel && <SendMessage channelName={channel.name} />}
			</AppLayout>
		);
	}
}

export default graphql<RouteComponentProps<ViewTeamProps>>(allTeamsQuery)(ViewTeam);
