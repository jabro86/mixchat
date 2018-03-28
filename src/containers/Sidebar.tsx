import * as React from "react";
import gql from "graphql-tag";
import { graphql, ChildProps } from "react-apollo";
import * as _ from "lodash";
import * as decode from "jwt-decode";

import Channels from "../components/Channels";
import Teams from "../components/Teams";

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

export interface SidebarProps {
	currentTeamId: number;
}

export class Sidebar extends React.Component<ChildProps<SidebarProps, AllTeamsQueryResult>> {
	render() {
		if (this.props.data === undefined) {
			return null;
		}
		const { data: { loading, allTeams }, currentTeamId } = this.props;
		if (loading || allTeams === undefined) {
			return null;
		}

		const teamIdx = _.findIndex(allTeams, ["id", currentTeamId]);
		const team = allTeams[teamIdx];
		let username: string;
		try {
			// tslint:disable-next-line:no-any
			const token: any = localStorage.getItem("token");
			const { user } = decode(token);
			username = user.username;
		} catch (err) {
			username = "";
		}
		return [
			<Teams
				key="team-sidebar"
				teams={allTeams.map(t => ({
					id: t.id,
					letter: t.name.charAt(0).toUpperCase()
				}))}
			/>,
			<Channels
				key="channels-sidebar"
				teamName={team.name}
				username={username}
				channels={team.channels}
				users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user1" }]}
			>
				Channels
			</Channels>
		];
	}
}

const allTeamsQuery = gql`
	{
		allTeams {
			id
			name
			channels {
				id
				name
			}
		}
	}
`;

export default graphql<SidebarProps>(allTeamsQuery)(Sidebar);
