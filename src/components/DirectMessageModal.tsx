import * as React from "react";
import { Modal, Button, Form } from "semantic-ui-react";
import { graphql, compose, MutateProps } from "react-apollo";
import { withRouter } from "react-router-dom";
import { withFormik } from "formik";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
import * as _ from "lodash";

import { meQuery } from "../graphql/team";
import MultiSelectUsers from "./MultiSelectUsers";
// import { getTeamMembersQuery } from "../graphql/team";

export interface User {
	id: number;
	username: string;
	email: string;
	teams: object[];
}

interface DirectMessageModalProps extends RouteComponentProps<{}> {
	teamId: string;
	open: boolean;
	onClose(event?: React.SyntheticEvent<{}>): void;
}

// tslint:disable:no-any
const DirectMessageModal = (props: any) => {
	const {
		open,
		onClose,
		values,
		isSubmitting,
		handleSubmit,
		resetForm,
		setFieldValue,
		teamId,
		currentUserId
	} = props;

	return (
		<Modal
			open={open}
			onClose={onClose}
			style={{
				marginTop: "0px !important",
				marginLeft: "auto",
				marginRight: "auto"
			}}
		>
			<Modal.Header>Direct Messaging</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<MultiSelectUsers
							value={values.members}
							placeholder="Select members to invite"
							teamId={teamId}
							// tslint:disable-next-line:no-any
							handleChange={(e: any, { value }: any) =>
								setFieldValue("members", value)
							}
							currentUserId={currentUserId}
						/>
					</Form.Field>
					<Form.Group>
						<Button
							disabled={isSubmitting}
							fluid={true}
							onClick={e => {
								resetForm();
								onClose(e);
							}}
						>
							Cancel
						</Button>
						<Button disabled={isSubmitting} fluid={true} onClick={handleSubmit}>
							Start Messaging
						</Button>
					</Form.Group>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

const getOrCreateChannelMutation = gql`
	mutation($teamId: Int!, $members: [Int!]!) {
		getOrCreateChannel(teamId: $teamId, members: $members) {
			id
			name
		}
	}
`;

export default compose(
	withRouter,
	graphql(getOrCreateChannelMutation),
	withFormik({
		mapPropsToValues: (props: DirectMessageModalProps & MutateProps) => ({
			members: []
		}),
		handleSubmit: async (
			{ members },
			{
				props: { teamId, mutate, onClose, history },
				setSubmitting,
				setErrors,
				resetForm
			}
		) => {
			await mutate({
				variables: { members, teamId },
				update: (store, context) => {
					if (context.data) {
						const {
							getOrCreateChannel: { id, name }
						} = context.data;

						// tslint:disable-next-line:no-any
						const data: any = store.readQuery({ query: meQuery });
						const teamIdx = _.findIndex(data.me.teams, ["id", teamId]);
						const notInChannelList = data.me.teams[teamIdx].channels.every(
							(c: any) => c.id !== id
						);
						if (notInChannelList) {
							data.me.teams[teamIdx].channels.push({
								__typename: "Channel",
								id,
								name,
								dm: true
							});
							store.writeQuery({ query: meQuery, data });
						}
						history.push(`/view-team/${teamId}/${id}`);
					}
				}
			});
			onClose();
			resetForm();
		}
	})
)(DirectMessageModal);
