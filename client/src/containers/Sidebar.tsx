import * as React from "react";

import Channels from "../components/Channels";
import Teams, { TeamIdAndFirstLetter } from "../components/Teams";
import DirectMessageModal from "../components/DirectMessageModal";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import { Team, Channel } from "../routes/ViewTeam";

export interface SidebarProps {
	teams: TeamIdAndFirstLetter[];
	team: Team;
	username: string;
	currentUserId: number;
}

export interface SidebarState {
	openAddChannelModal: boolean;
	openInvitePeopleModal: boolean;
	openDirectMessageModal: boolean;
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
	state = {
		openAddChannelModal: false,
		openInvitePeopleModal: false,
		openDirectMessageModal: false
	};

	toggleAddChannelModal = (event?: React.SyntheticEvent<{}>) => {
		if (event) {
			event.preventDefault();
		}
		this.setState(state => ({
			openAddChannelModal: !state.openAddChannelModal
		}));
	};

	toggleDirectMessageModal = (event?: React.SyntheticEvent<{}>) => {
		if (event) {
			event.preventDefault();
		}
		this.setState(state => ({
			openDirectMessageModal: !state.openDirectMessageModal
		}));
	};

	toggleInvitePeopleModal = (event?: React.SyntheticEvent<{}>) => {
		if (event) {
			event.preventDefault();
		}
		this.setState(state => ({
			openInvitePeopleModal: !state.openInvitePeopleModal
		}));
	};

	render() {
		const { team, teams, username, currentUserId } = this.props;

		const regularChannels: Channel[] = [];
		const dmChannels: Channel[] = [];

		team.channels.forEach(c => {
			if (c.dm) {
				dmChannels.push(c);
			} else {
				regularChannels.push(c);
			}
		});

		return [
			<Teams key="team-sidebar" teams={teams} />,
			<Channels
				key="channels-sidebar"
				teamName={team.name}
				username={username}
				teamId={team.id}
				isOwner={team.admin}
				channels={regularChannels}
				dmChannels={dmChannels}
				onAddChannelClick={this.toggleAddChannelModal}
				onInvitePeopleClick={this.toggleInvitePeopleModal}
				onDirectMessageClick={this.toggleDirectMessageModal}
			/>,
			<DirectMessageModal
				teamId={team.id}
				key="sidebar-direct-message-modal"
				open={this.state.openDirectMessageModal}
				onClose={this.toggleDirectMessageModal}
				currentUserId={currentUserId}
			/>,
			<AddChannelModal
				teamId={team.id}
				key="sidebar-add-channel-modal"
				open={this.state.openAddChannelModal}
				onClose={this.toggleAddChannelModal}
				currentUserId={currentUserId}
			/>,
			<InvitePeopleModal
				teamId={team.id}
				key="sidebar-invite-people-modal"
				open={this.state.openInvitePeopleModal}
				onClose={this.toggleInvitePeopleModal}
			/>
		];
	}
}

export default Sidebar;
