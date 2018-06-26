import * as React from "react";
import { Modal, Button, Form } from "semantic-ui-react";
import { graphql, compose, MutateProps } from "react-apollo";
import { withRouter } from "react-router-dom";
import { withFormik } from "formik";
import gql from "graphql-tag";

import MultiSelectUsers from "./MultiSelectUsers";
// import { getTeamMembersQuery } from "../graphql/team";

export interface User {
	id: number;
	username: string;
	email: string;
	teams: object[];
}

interface DirectMessageModalProps {
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
			<Modal.Header>Direct Message To</Modal.Header>
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
		getOrCreateChannel(teamId: $teamId, members: $members)
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
			{ props: { teamId, mutate, onClose }, setSubmitting, setErrors }
		) => {
			await mutate({ variables: { members, teamId } });
			onClose();
			setSubmitting(false);
		}
	})
)(DirectMessageModal);
