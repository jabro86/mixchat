import * as React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Comment, Button } from "semantic-ui-react";

import FileUpload from "../components/FileUpload";
import RenderText from "../components/RenderText";
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
			filetype
			url
		}
	}
`;

const Message = ({ message: { url, text, filetype } }: any) => {
	if (url) {
		if (filetype.startsWith("image/")) {
			return <img src={url} alt="" />;
		} else if (filetype === "text/plain") {
			return <RenderText url={url} />;
		} else if (filetype.startsWith("audio/")) {
			return (
				<div>
					<audio controls={true}>
						<source src={url} type={filetype} />
					</audio>
				</div>
			);
		} else if (filetype.startsWith("video/")) {
			return (
				<div>
					<video width="320" height="240" controls={true}>
						<source src={url} type={filetype} />
						Your browser does not support the video tag.
					</video>
				</div>
			);
		}
	}
	return <Comment.Text>{text}</Comment.Text>;
};

interface MessageContainerState {
	hasMoreItems: boolean;
}

class MessageContainer extends React.Component<any, MessageContainerState> {
	unsubscribe: Function;

	state = {
		hasMoreItems: true
	};

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
						messages: [newChannelMessage, ...previousMessages]
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
			<FileUpload
				style={{
					gridColumn: 3,
					gridRow: 2,
					paddingLeft: "20px",
					paddingRight: "20px",
					display: "flex",
					flexDirection: "column-reverse",
					overflowY: "auto"
				}}
				disableClick={true}
				channelId={channelId}
			>
				<Comment.Group>
					{this.state.hasMoreItems &&
						messages.length >= 20 && (
							<Button
								onClick={() => {
									this.props.data.fetchMore({
										variables: {
											channelId,
											cursor: messages[messages.length - 1].created_at
										},
										updateQuery: (
											previousResult: any,
											{ fetchMoreResult }: any
										) => {
											if (!fetchMoreResult) {
												return previousResult;
											}

											if (fetchMoreResult.messages.length < 20) {
												this.setState({ hasMoreItems: false });
											}
											return {
												...previousResult,
												messages: [
													...previousResult.messages,
													...fetchMoreResult.messages
												]
											};
										}
									});
								}}
							>
								Load More
							</Button>
						)}
					{[...messages].reverse().map((m: any) => (
						<Comment key={`${m.id}-message`}>
							<Comment.Content>
								<Comment.Author as="a">{m.user.username}</Comment.Author>
								<Comment.Metadata>
									<div>{m.created_at}</div>
								</Comment.Metadata>
								<Message message={m} />
								<Comment.Actions>
									<Comment.Action>Reply</Comment.Action>
								</Comment.Actions>
							</Comment.Content>
						</Comment>
					))}
				</Comment.Group>
			</FileUpload>
		);
	}
}

const messagesQuery = gql`
	query($cursor: String, $channelId: Int!) {
		messages(cursor: $cursor, channelId: $channelId) {
			id
			text
			user {
				username
			}
			created_at
			url
			filetype
		}
	}
`;

// tslint:disable-next-line:no-any
export default graphql<any>(messagesQuery, {
	options: (props: any) => {
		return {
			variables: { channelId: props.channelId, offset: 0 },
			fetchPolicy: "network-only"
		};
	}
})(MessageContainer);
