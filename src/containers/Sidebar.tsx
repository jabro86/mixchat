import * as React from "react";
import { graphql, ChildProps } from "react-apollo";
import * as _ from "lodash";
import * as decode from "jwt-decode";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import { allTeamsQuery } from "../graphql/team";
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
	currentTeamId: string;
}

export interface SidebarState {
	openAddChannelModal: boolean;
}

export class Sidebar extends React.Component<
	ChildProps<SidebarProps, AllTeamsQueryResult>,
	SidebarState
> {
	state = {
		openAddChannelModal: false
	};

	handleCloseAddChannelModal = () => {
		this.setState({ openAddChannelModal: false });
	};

	handleAddChannelClick = () => {
		this.setState({ openAddChannelModal: true });
	};

	render() {
		if (this.props.data === undefined) {
			return null;
		}
		const { data: { loading, allTeams }, currentTeamId } = this.props;
		if (loading || allTeams === undefined) {
			return null;
		}

		const teamIdx = currentTeamId
			? _.findIndex(allTeams, ["id", parseInt(currentTeamId, 10)])
			: 0;
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
				teamId={team.id}
				channels={team.channels}
				users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user1" }]}
				onAddChannelClick={this.handleAddChannelClick}
			/>,
			<AddChannelModal
				teamId={team.id}
				key="sidebar-add-channel-modal"
				open={this.state.openAddChannelModal}
				onClose={this.handleCloseAddChannelModal}
			/>
		];
	}
}

export default graphql<SidebarProps>(allTeamsQuery)(Sidebar);
