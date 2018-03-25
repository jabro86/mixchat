import * as React from "react";
import styled from "styled-components";

const TeamWrapper = styled.div`
	grid-column: 1;
	grid-row: 1/4;
	background-color: #362234;
	color: #958993;
`;

export interface IdAndLetter {
	id: number;
	letter: string;
}

export interface TeamsProps {
	teams: IdAndLetter[];
}

const team = ({ id, letter }: IdAndLetter) => <li key={`team-${id}`}>{letter}</li>;

export default class Teams extends React.Component<TeamsProps> {
	render() {
		const { teams } = this.props;
		return (
			<TeamWrapper>
				<ul>{teams.map(team)}</ul>
			</TeamWrapper>
		);
	}
}
