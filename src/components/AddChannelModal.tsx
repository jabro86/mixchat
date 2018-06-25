import * as React from "react";
import { Modal, Form, Input, Button, Checkbox } from "semantic-ui-react";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { graphql, compose, MutateProps } from "react-apollo";
import * as _ from "lodash";

import { meQuery } from "../graphql/team";
import MultiSelectUsers from "./MultiSelectUsers";

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
		handleSubmit,
		resetForm,
		setFieldValue,
		teamId
	} = props;
	return (
		<Modal
			open={open}
			onClose={e => {
				resetForm();
				onClose(e);
			}}
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
					<Form.Field>
						<Checkbox
							toggle={true}
							label="Private"
							checked={!values.public}
							onChange={(e, { checked }) => setFieldValue("public", !checked)}
						/>
					</Form.Field>
					{values.public ? null : (
						<Form.Field>
							<MultiSelectUsers
								value={values.members}
								placeholder="Select member to invite"
								teamId={teamId}
								// tslint:disable-next-line:no-any
								handleChange={(e: any, { value }: any) =>
									setFieldValue("members", value)
								}
							/>
						</Form.Field>
					)}
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
							Create Channel
						</Button>
					</Form.Group>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

const createChannelMutation = gql`
	mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
		createChannel(
			teamId: $teamId
			name: $name
			public: $public
			members: $members
		) {
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
			name: "",
			public: true,
			members: []
		}),
		handleSubmit: async (
			values,
			{ props: { teamId, mutate, onClose }, setSubmitting, setErrors }
		) => {
			await mutate({
				variables: {
					teamId,
					name: values.name,
					public: values.public,
					members: values.members
				},
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
						const {
							createChannel: { ok, channel }
						} = context.data;
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
