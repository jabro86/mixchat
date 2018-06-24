import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";
import FileUpload from "../components/FileUpload";

// tslint:disable:no-any

const newChannelMessageSubscription = gql`
	subscription($channelId: Int!) {
		newChannelMessage(channelId: $channelId) {
			id
			text
			user {
				username
			}
			created_at
		}
	}
`;

class MessageContainer extends React.Component<any> {
	unsubscribe: Function;

	subscribe = (channelId: number) => {
		return this.props.data.subscribeToMore({
			document: newChannelMessageSubscription,
			variables: {
				channelId
			},
			updateQuery: (prev: any = {}, { subscriptionData }: any) => {
				if (!subscriptionData) {
					return prev;
				}
				const previousMessages = (prev && prev.messages) || [];
				const newChannelMessage =
					subscriptionData &&
					subscriptionData.data &&
					subscriptionData.data.newChannelMessage;
				if (newChannelMessage !== undefined) {
					return {
						...prev,
						messages: [...previousMessages, newChannelMessage]
					};
				}
				return {
					...prev,
					messages: [...previousMessages]
				};
			}
		});
	};
	componentDidMount() {
		this.unsubscribe = this.subscribe(this.props.channelId);
	}

	componentWillReceiveProps({ channelId }: any) {
		if (this.props.channelId !== channelId) {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(channelId);
		}
	}

	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	render() {
		const {
			data: { loading, messages },
			channelId
		} = this.props;
		return loading ? null : (
			<Messages>
				<FileUpload disableClick={true} channelId={channelId}>
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
				</FileUpload>
			</Messages>
		);
	}
}

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
export default graphql<any>(messagesQuery, {
	options: (props: any) => {
		return {
			variables: { channelId: props.channelId },
			fetchPolicy: "network-only"
		};
	}
})(MessageContainer);
