import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TeamWrapper = styled.div`
	grid-column: 1;
	grid-row: 1/4;
	background-color: #362234;
	color: #958993;
`;

const TeamList = styled.ul`
	width: 100%
	padding-left: 0px;
	list-style: none;
`;

const TeamListItem = styled.li`
	height: 50px;
	width: 50px;
	background-color: #676066;
	color: #fff;
	margin: auto;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	border-radius: 11px;
	&:hover {
		border-style: solid;
		border-width: thick;
		border-color: #767676;
	}
`;

export interface TeamIdAndFirstLetter {
	id: number;
	letter: string;
}

export interface TeamsProps {
	teams: TeamIdAndFirstLetter[];
}

const team = ({ id, letter }: TeamIdAndFirstLetter) => (
	<Link to={`/view-team/${id}`} key={`team-${id}`}>
		<TeamListItem>{letter}</TeamListItem>
	</Link>
);

export default class Teams extends React.Component<TeamsProps> {
	render() {
		const { teams } = this.props;
		return (
			<TeamWrapper>
				<TeamList>{teams.map(team)}</TeamList>
			</TeamWrapper>
		);
	}
}
