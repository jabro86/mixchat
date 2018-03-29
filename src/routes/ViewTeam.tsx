import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
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

		const teamIdx = !!teamId ? _.findIndex(allTeams, ["id", parseInt(teamId, 10)]) : 0;
		const team = allTeams[teamIdx];
		const channelIdx = !!channelId
			? _.findIndex(team.channels, ["id", parseInt(channelId, 10)])
			: 0;
		const channel = team.channels[channelIdx];

		return (
			<AppLayout>
				<Header channelName={channel.name} />
				<Sidebar
					teams={allTeams.map(t => ({
						id: t.id,
						letter: t.name.charAt(0).toUpperCase()
					}))}
					team={team}
				/>
				<Messages channelId={channel.id}>
					<ul className="message-list">
						<li />
						<li />
					</ul>
				</Messages>
				<SendMessage channelName={channel.name} />
			</AppLayout>
		);
	}
}

export default graphql<RouteComponentProps<ViewTeamProps>>(allTeamsQuery)(ViewTeam);
