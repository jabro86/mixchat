import * as React from "react";
import { Input } from "semantic-ui-react";
import styled from "styled-components";

const SendMessageWrapper = styled.div`
	grid-column: 3;
	grid-row: 3;
	margin: 20px;
`;

export interface SendMessageProps {
	channelName: string;
}

export default class StyledSendMessage extends React.Component<SendMessageProps> {
	render() {
		return (
			<SendMessageWrapper>
				<Input fluid={true} placeholder={`Message #${this.props.channelName}`} />
			</SendMessageWrapper>
		);
	}
}
