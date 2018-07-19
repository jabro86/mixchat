import * as React from "react";
import styled from "styled-components";

const MessagesWrapper = styled.div`
	grid-column: 3;
	grid-row: 2;
	padding-left: 20px;
	padding-right: 20px;
	display: flex;
	flex-direction: column-reverse;
	overflow-y: auto;
`;

// tslint:disable-next-line:no-any
export default ({ children }: any) => (
	<MessagesWrapper>{children}</MessagesWrapper>
);
