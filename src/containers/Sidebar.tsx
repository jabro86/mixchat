import * as React from "react";
import * as decode from "jwt-decode";

import Channels from "../components/Channels";
import Teams, { TeamIdAndFirstLetter } from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import { Team } from "../routes/ViewTeam";

export interface SidebarProps {
	teams: TeamIdAndFirstLetter[];
	team: Team;
}

export interface SidebarState {
	openAddChannelModal: boolean;
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
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
		const { team, teams } = this.props;

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
			<Teams key="team-sidebar" teams={teams} />,
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

export default Sidebar;
