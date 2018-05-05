import * as React from "react";
import { Modal, Input, Button, Form } from "semantic-ui-react";
import Downshift from "downshift";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

export interface User {
	id: number;
	username: string;
	email: string;
	teams: object[];
}

// tslint:disable-next-line:no-any
const DirectMessageModal = (props: any) => {
	const {
		open,
		onClose,
		teamId,
		data: { loading, getTeamMembers },
		history
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
						{!loading && (
							<Downshift
								onChange={selectedUser => {
									history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
									onClose();
								}}
							>
								{({
									getInputProps,
									getItemProps,
									isOpen,
									inputValue,
									selectedItem,
									highlightedIndex
								}) => (
									<div>
										<Input
											{...getInputProps({ placeholder: "Favorite color" })}
											fluid={true}
										/>
										{isOpen ? (
											<div style={{ border: "1px solid #ccc" }}>
												{getTeamMembers
													.filter(
														(user: User) =>
															!inputValue ||
															user.username
																.toLowerCase()
																.includes(inputValue.toLowerCase())
													)
													.map((item: User, index: number) => (
														<div
															{...getItemProps({ item })}
															key={item.id}
															style={{
																backgroundColor:
																	highlightedIndex === index ? "gray" : "white",
																fontWeight:
																	selectedItem === item ? "bold" : "normal"
															}}
														>
															{item.username}
														</div>
													))}
											</div>
										) : null}
									</div>
								)}
							</Downshift>
						)}
					</Form.Field>
					<Form.Group>
						<Button fluid={true} onClick={onClose}>
							Cancel
						</Button>
					</Form.Group>
				</Form>
			</Modal.Content>
		</Modal>
	);
};

const getTeamMembersQuery = gql`
	query($teamId: Int!) {
		getTeamMembers(teamId: $teamId) {
			id
			username
		}
	}
`;

// tslint:disable-next-line:no-any
const WithRouterAndGraphqlDirectMessageModal: any = withRouter(
	// tslint:disable-next-line:no-any
	graphql<any>(getTeamMembersQuery)(DirectMessageModal)
);

export default WithRouterAndGraphqlDirectMessageModal;
