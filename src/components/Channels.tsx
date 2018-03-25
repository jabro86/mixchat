import * as React from "react";
import styled from "styled-components";

const ChannelWrapper = styled.div`
	grid-column: 2;
	grid-row: 1/4;
	background-color: #4e3a4c;
	color: #958993;
`;

export interface IdAndName {
	id: number;
	name: string;
}
export interface ChannelsProps {
	teamName: string;
	username: string;
	channels: IdAndName[];
	users: IdAndName[];
}

const channel = ({ id, name }: IdAndName) => <li key={`channel-${id}`}># {name}</li>;
const user = ({ id, name }: IdAndName) => <li key={`user-${id}`}>{name}</li>;
export default class Channels extends React.Component<ChannelsProps> {
	render() {
		const { teamName, username, channels, users } = this.props;
		return (
			<ChannelWrapper>
				<div>
					{teamName}
					{username}
				</div>
				<div>
					<ul>
						<li>Channels</li>
						{channels.map(channel)}
					</ul>
				</div>
				<div>
					<ul>
						<li>Direct Messages</li>
						{users.map(user)}
					</ul>
				</div>
			</ChannelWrapper>
		);
	}
}
