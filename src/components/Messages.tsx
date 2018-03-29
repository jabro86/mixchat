import * as React from "react";
import styled from "styled-components";

const MessagesWrapper = styled.div`
	grid-column: 3;
	grid-row: 2;
`;

export interface MessagesProps {
	channelId: number;
}

export default ({ channelId }: MessagesProps) => <MessagesWrapper />;
