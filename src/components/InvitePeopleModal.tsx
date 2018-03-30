import * as React from "react";
import { Modal, Input, Button, Form } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { graphql, compose, MutateProps } from "react-apollo";

import normalizeErrors from "../normalizeErrors";

interface InvitePeopleModalProps {
	teamId: string;
	open: boolean;
	onClose(event?: React.SyntheticEvent<{}>): void;
}

// tslint:disable-next-line:no-any
const InvitePeopleModal = (props: any) => {
	const {
		open,
		onClose,
		values,
		handleChange,
		handleBlur,
		isSubmitting,
		handleSubmit,
		touched,
		errors
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
			<Modal.Header>Add People to your Team</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<Input
							value={values.name}
							onChange={handleChange}
							onBlur={handleBlur}
							name="email"
							fluid={true}
							placeholder="User's email"
						/>
					</Form.Field>
					{touched.email && errors.email ? errors.email[0] : null}
					<Form.Group>
						<Button disabled={isSubmitting} fluid={true} onClick={onClose}>
							Cancel
						</Button>
						<Button disabled={isSubmitting} fluid={true} onClick={handleSubmit}>
							Add User
						</Button>
					</Form.Group>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

const addTeamMemberMutation = gql`
	mutation($email: String!, $teamId: Int!) {
		addTeamMember(email: $email, teamId: $teamId) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default compose(
	graphql(addTeamMemberMutation),
	withFormik({
		mapPropsToValues: (props: InvitePeopleModalProps & MutateProps) => ({ email: "" }),
		handleSubmit: async (
			values,
			{ props: { teamId, mutate, onClose }, setSubmitting, setErrors }
		) => {
			// tslint:disable-next-line:no-any
			const response: any = await mutate({
				variables: { teamId, email: values.email }
			});
			const { ok, errors } = response.data.addTeamMember;
			if (ok) {
				onClose();
				setSubmitting(false);
			} else {
				setSubmitting(false);
				setErrors(normalizeErrors(errors));
			}
		}
	})
)(InvitePeopleModal);
