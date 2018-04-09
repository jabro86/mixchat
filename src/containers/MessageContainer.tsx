import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";

// tslint:disable:no-any
const MessageContainer = ({ data: { loading, messages } }: any) =>
	loading ? null : (
		<Messages>
			<Comment.Group>
				{messages.map((m: any) => (
					<Comment key={`${m.id}-message`}>
						<Comment.Content>
							<Comment.Author as="a">{m.user.username}</Comment.Author>
							<Comment.Metadata>
								<div>{m.created_at}</div>
							</Comment.Metadata>
							<Comment.Text>{m.text}</Comment.Text>
							<Comment.Actions>
								<Comment.Action>Reply</Comment.Action>
							</Comment.Actions>
						</Comment.Content>
					</Comment>
				))}
			</Comment.Group>
		</Messages>
	);

const messagesQuery = gql`
	query($channelId: Int!) {
		messages(channelId: $channelId) {
			id
			text
			user {
				username
			}
			created_at
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
