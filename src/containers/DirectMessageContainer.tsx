import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";

// tslint:disable:no-any

class DirectMessageContainer extends React.Component<any> {
	unsubscribe: Function;

	// subscribe = (channelId: number) => {
	// 	return this.props.data.subscribeToMore({
	// 		document: newChannelMessageSubscription,
	// 		variables: {
	// 			channelId
	// 		},
	// 		updateQuery: (prev: any, { subscriptionData }: any) => {
	// 			if (!subscriptionData) {
	// 				return prev;
	// 			}
	// 			return {
	// 				...prev,
	// 				messages: [...prev.messages, subscriptionData.data.newChannelMessage]
	// 			};
	// 		}
	// 	});
	// };
	// componentDidMount() {
	// 	this.unsubscribe = this.subscribe(this.props.channelId);
	// }

	// componentWillReceiveProps({ channelId }: any) {
	// 	if (this.props.channelId !== channelId) {
	// 		if (this.unsubscribe) {
	// 			this.unsubscribe();
	// 		}
	// 		this.unsubscribe = this.subscribe(channelId);
	// 	}
	// }

	// componentWillUnmount() {
	// 	if (this.unsubscribe) {
	// 		this.unsubscribe();
	// 	}
	// }

	render() {
		const {
			data: { loading, directMessages }
		} = this.props;
		return loading ? null : (
			<Messages>
				<Comment.Group>
					{directMessages.map((m: any) => (
						<Comment key={`${m.id}-direct-message`}>
							<Comment.Content>
								<Comment.Author as="a">{m.sender.username}</Comment.Author>
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
	}
}

const directMessagesQuery = gql`
	query($teamId: Int!, $otherUserId: Int!) {
		directMessages(teamId: $teamId, otherUserId: $otherUserId) {
			id
			text
			sender {
				username
			}
			created_at
		}
	}
`;

// tslint:disable-next-line:no-any
export default graphql<any>(directMessagesQuery, {
	options: (props: any) => {
		return {
			variables: { teamId: props.teamId, otherUserId: props.userId },
			fetchPolicy: "network-only"
		};
	}
})(DirectMessageContainer);
