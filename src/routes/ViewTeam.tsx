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
			data: { loading, allTeams },
			match: { params: { teamId, channelId } }
		} = this.props;
		if (loading || allTeams === undefined) {
			return null;
		}

		if (!allTeams.length) {
			return <Redirect to="/create-team" />;
		}

		let teamIdInteger = parseInt(teamId, 10);
		const teamIdx = teamIdInteger ? _.findIndex(allTeams, ["id", teamIdInteger]) : 0;
		const team = allTeams[teamIdx];

		let channelIdInteger = parseInt(channelId, 10);
		const channelIdx = channelIdInteger
			? _.findIndex(team.channels, ["id", channelIdInteger])
			: 0;
		const channel = team.channels[channelIdx];

		return (
			<AppLayout>
				{channel && <Header channelName={channel.name} />}
				<Sidebar
					teams={allTeams.map(t => ({
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
