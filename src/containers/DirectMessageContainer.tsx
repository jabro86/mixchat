import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";

// tslint:disable:no-any

const newDirectMessageSubscription = gql`
	subscription($teamId: Int!, $userId: Int!) {
		newDirectMessage(teamId: $teamId, userId: $userId) {
			id
			sender {
				username
			}
			text
			created_at
		}
	}
`;

class DirectMessageContainer extends React.Component<any> {
	unsubscribe: Function;

	subscribe = (teamId: number, userId: number) => {
		return this.props.data.subscribeToMore({
			document: newDirectMessageSubscription,
			variables: {
				teamId,
				userId
			},
			updateQuery: (prev: any, { subscriptionData }: any) => {
				if (!subscriptionData) {
					return prev;
				}
				return {
					...prev,
					directMessages: [
						...prev.directMessages,
						subscriptionData.data.newDirectMessage
					]
				};
			}
		});
	};
	componentDidMount() {
		this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
	}

	componentWillReceiveProps({ teamId, userId }: any) {
		if (this.props.teamId !== teamId || this.props.userId !== userId) {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(teamId, userId);
		}
	}

	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

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
