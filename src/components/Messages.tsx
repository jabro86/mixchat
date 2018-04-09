import * as React from "react";
import styled from "styled-components";

const MessagesWrapper = styled.div`
	grid-column: 3;
	grid-row: 2;
`;

// tslint:disable-next-line:no-any
export default ({ children }: any) => <MessagesWrapper>{children}</MessagesWrapper>;
