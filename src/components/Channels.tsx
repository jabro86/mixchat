import * as React from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { User } from "./DirectMessageModal";

const ChannelWrapper = styled.div`
	grid-column: 2;
	grid-row: 1/4;
	background-color: #4e3a4c;
	color: #958993;
`;

const TeamNameHeader = styled.h1`
	color: #fff;
	font-size: 20px;
`;

const SideBarList = styled.ul`
	width: 100%
	list-style: none;
	padding-left: 0px;
`;

const paddingLeft = "padding-left: 10px";

const SideBarListItem = styled.li`
	${paddingLeft};
	&:hover {
		background: #3e313c;
	}
`;

const SideBarListHeader = styled.li`
	${paddingLeft};
`;

const PushLeft = styled.div`
	${paddingLeft};
`;

const Green = styled.span`
	color: #38978d;
`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : <span>○</span>);

export interface IdAndName {
	id: number;
	name: string;
}
export interface ChannelsProps {
	teamName: string;
	username: string;
	isOwner: boolean;
	teamId: number;
	channels: IdAndName[];
	users: User[];
	onAddChannelClick(event: React.SyntheticEvent<{}>): void;
	onInvitePeopleClick(event: React.SyntheticEvent<{}>): void;
	onDirectMessageClick(event: React.SyntheticEvent<{}>): void;
}

const channel = ({ id, name }: IdAndName, teamId: number) => (
	<Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
		<SideBarListItem># {name}</SideBarListItem>
	</Link>
);
const user = ({ id, username }: User, teamId: number) => (
	<SideBarListItem key={`user-${id}`}>
		<Link to={`/view-team/user/${teamId}/${id}`}>
			<Bubble /> {username}
		</Link>
	</SideBarListItem>
);
export default class Channels extends React.Component<ChannelsProps> {
	render() {
		const {
			teamName,
			username,
			channels,
			users,
			teamId,
			isOwner,
			onAddChannelClick,
			onInvitePeopleClick,
			onDirectMessageClick
		} = this.props;
		return (
			<ChannelWrapper>
				<PushLeft>
					<TeamNameHeader>{teamName}</TeamNameHeader>
					{username}
				</PushLeft>
				<div>
					<SideBarList>
						<SideBarListHeader>
							Channels{" "}
							{isOwner && (
								<Icon name="add circle" onClick={onAddChannelClick} />
							)}
						</SideBarListHeader>
						{channels.map(c => channel(c, teamId))}
					</SideBarList>
				</div>
				<div>
					<SideBarList>
						<SideBarListHeader>
							Direct Messages{" "}
							<Icon name="add circle" onClick={onDirectMessageClick} />
						</SideBarListHeader>
						{users.map(u => user(u, teamId))}
					</SideBarList>
				</div>
				{isOwner && (
					<div>
						<a href="#invite-people" onClick={onInvitePeopleClick}>
							+ Invite People
						</a>
					</div>
				)}
			</ChannelWrapper>
		);
	}
}
