import * as React from "react";
import { Header } from "semantic-ui-react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
	grid-column: 3;
	grid-row: 1;
`;

export interface StyledHeaderProps {
	channelName: string;
}

export default class StyledHeader extends React.Component<StyledHeaderProps> {
	render() {
		return (
			<HeaderWrapper>
				<Header textAlign="center">#{this.props.channelName}</Header>
			</HeaderWrapper>
		);
	}
}
