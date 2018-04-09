import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import Messages from "../components/Messages";

// tslint:disable-next-line:no-any
const MessageContainer = ({ data: { loading, messages } }: any) =>
	loading ? null : <Messages>{JSON.stringify(messages)}</Messages>;

const messagesQuery = gql`
	query($channelId: Int!) {
		messages(channelId: $channelId) {
			id
			text
			user {
				username
			}
			createdAt
		}
	}
`;

// tslint:disable-next-line:no-any
const operationOptions: any = {
	// tslint:disable-next-line:no-any
	variables: (props: any) => ({
		channelId: props.channelId
	})
};

// tslint:disable-next-line:no-any
export default graphql<any>(messagesQuery, operationOptions)(MessageContainer);
