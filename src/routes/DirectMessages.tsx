import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import * as _ from "lodash";
import gql from "graphql-tag";

import { meQuery } from "../graphql/team";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import { Team } from "./ViewTeam";

export interface Channel {
	id: number;
	name: string;
}

export interface MeQuery {
	id: number;
	username: string;
	teams: Team[];
}

export interface AllTeamsQueryResult {
	loading: boolean;
	me: MeQuery;
}

interface DirectMessagesProps {
	teamId: string;
	userId: string;
}

// tslint:disable-next-line:no-any
class DirectMessages extends React.Component<any, AllTeamsQueryResult> {
	render() {
		if (this.props.data === undefined) {
			return null;
		}
		const {
			mutate,
			data: { loading, me, getUser },
			match: {
				params: { teamId, userId }
			}
		} = this.props;

		if (loading || me === undefined) {
			return null;
		}
		const teams = [];
		if (me !== undefined) {
			teams.push(...me.teams);
		}

		if (!teams.length) {
			return <Redirect to="/create-team" />;
		}

		const teamIdInteger = parseInt(teamId, 10);
		const teamIdx = teamIdInteger
			? _.findIndex(teams, ["id", teamIdInteger])
			: 0;
		const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

		return (
			<AppLayout>
				<Header channelName={getUser.username} />
				<Sidebar
					teams={teams.map(t => ({
						id: t.id,
						letter: t.name.charAt(0).toUpperCase()
					}))}
					team={team}
					username={me.username}
				/>
				<DirectMessageContainer teamId={team.id} userId={userId} />
				<SendMessage
					onSubmit={async (text: string) => {
						await mutate!({
							variables: {
								text,
								receiverId: userId,
								teamId: teamId
							},
							optimisticResponse: {
								createDirectMessage: true
							},
							// tslint:disable-next-line:no-any
							update: (store: any) => {
								// tslint:disable-next-line:no-any
								const data: any = store.readQuery({ query: meQuery });
								const teamIdx2 = _.findIndex(data.me.teams, ["id", team.id]);
								const notAlreadyThere = data.me.teams[
									teamIdx2
								].directMessageMembers.every(
									// tslint:disable-next-line:no-any
									(member: any) => member.id !== parseInt(userId, 10)
								);
								if (notAlreadyThere) {
									data.me.teams[teamIdx2].directMessageMembers.push({
										__typename: "User",
										id: userId,
										username: getUser.username
									});
									store.writeQuery({ query: meQuery, data });
								}
							}
						});
					}}
					placeholder={userId}
				/>
			</AppLayout>
		);
	}
}

const createDirectMessageMutation = gql`
	mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
		createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
	}
`;

const directMessageMeQuery = gql`
	query($userId: Int!) {
		getUser(userId: $userId) {
			username
		}
		me {
			id
			username
			teams {
				id
				name
				admin
				directMessageMembers {
					id
					username
				}
				channels {
					id
					name
				}
			}
		}
	}
`;

export default compose(
	graphql<RouteComponentProps<DirectMessagesProps>>(directMessageMeQuery, {
		options: props => ({
			variables: { userId: props.match.params.userId },
			fetchPolicy: "network-only"
		})
	}),
	graphql(createDirectMessageMutation)
)(DirectMessages);
