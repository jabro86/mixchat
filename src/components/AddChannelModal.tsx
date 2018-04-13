import * as React from "react";
import { Modal, Input, Button, Form } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { graphql, compose, MutateProps } from "react-apollo";
import * as _ from "lodash";

import { meQuery } from "../graphql/team";
interface AddChannelModalProps {
	teamId: string;
	open: boolean;
	onClose(event?: React.SyntheticEvent<{}>): void;
}

// tslint:disable-next-line:no-any
const AddChannelModal = (props: any) => {
	const {
		open,
		onClose,
		values,
		handleChange,
		handleBlur,
		isSubmitting,
		handleSubmit
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
			<Modal.Header>Add Channel</Modal.Header>
			<Modal.Content>
				<Form>
					<Form.Field>
						<Input
							value={values.name}
							onChange={handleChange}
							onBlur={handleBlur}
							name="name"
							fluid={true}
							placeholder="Channel name"
						/>
					</Form.Field>
					<Form.Group>
						<Button disabled={isSubmitting} fluid={true} onClick={onClose}>
							Cancel
						</Button>
						<Button disabled={isSubmitting} fluid={true} onClick={handleSubmit}>
							Create Channel
						</Button>
					</Form.Group>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

const createChannelMutation = gql`
	mutation($teamId: Int!, $name: String!) {
		createChannel(teamId: $teamId, name: $name) {
			ok
			channel {
				id
				name
			}
		}
	}
`;

export default compose(
	graphql(createChannelMutation),
	withFormik({
		mapPropsToValues: (props: AddChannelModalProps & MutateProps) => ({
			name: ""
		}),
		handleSubmit: async (
			values,
			{ props: { teamId, mutate, onClose }, setSubmitting, setErrors }
		) => {
			await mutate({
				variables: { teamId, name: values.name },
				optimisticResponse: {
					createChannel: {
						__typename: "Mutation",
						ok: true,
						channel: {
							__typename: "Channel",
							id: -1,
							name: values.name
						}
					}
				},
				update: (store, context) => {
					if (context.data) {
						const { createChannel: { ok, channel } } = context.data;
						if (!ok) {
							return;
						}
						// tslint:disable-next-line:no-any
						const data: any = store.readQuery({ query: meQuery });
						const teamIdx = _.findIndex(data.me.teams, ["id", teamId]);
						data.me.teams[teamIdx].channels.push(channel);
						store.writeQuery({ query: meQuery, data });
					}
				}
			});
			onClose();
			setSubmitting(false);
		}
	})
)(AddChannelModal);
