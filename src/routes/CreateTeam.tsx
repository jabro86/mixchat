import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react";
import { extendObservable } from "mobx";
import { Message, Form, Container, Header, Input, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { graphql, ChildProps } from "react-apollo";

export interface Error {
	path: string;
	message: string;
}

export interface CreateTeamResponse {
	ok: boolean;
	errors: Error[];
}

export interface CreateTeamMutation {
	createTeam: CreateTeamResponse;
}

export interface CreateTeamProps extends RouteComponentProps<{}> {}

class CreateTeam extends React.Component<ChildProps<CreateTeamProps, CreateTeamMutation>> {
	private name: string;
	private errors: {
		nameError: string;
	};

	constructor(props: CreateTeamProps) {
		super(props);

		extendObservable(this, {
			name: "",
			errors: {}
		});
	}

	onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;
		this[name] = value;
	};

	onSubmit = async () => {
		const { name } = this;
		if (this.props.mutate) {
			const response = await this.props.mutate({
				variables: { name }
			});
			console.log(response);
			const { ok, errors } = response.data.createTeam;
			if (ok) {
				this.props.history.push("/");
			} else {
				const err = {
					nameError: ""
				};
				errors.forEach(({ path, message }) => {
					err[`${path}Error`] = message;
				});
				this.errors = { ...err };
			}
		}
	};

	render() {
		const { name, errors: { nameError } } = this;
		const errorList = [];

		if (nameError) {
			errorList.push(nameError);
		}

		return (
			<Container>
				<Header as="h2">Create a team</Header>
				<Form>
					<Form.Field error={!!nameError}>
						<Input
							name="name"
							onChange={this.onChange}
							value={name}
							placeholder="Name"
							fluid={true}
						/>
					</Form.Field>
					<Button onClick={this.onSubmit}>Submit</Button>
				</Form>
				{errorList.length ? (
					<Message
						error={true}
						header="There was some errors with your submission"
						list={errorList}
					/>
				) : null}
			</Container>
		);
	}
}

const createTeamMutation = gql`
	mutation($name: String!) {
		createTeam(name: $name) {
			ok
			errors {
				path
				message
			}
		}
	}
`;
const CreateTeamWithObserver: any = observer(CreateTeam); // tslint:disable-line
export default graphql<CreateTeamMutation>(createTeamMutation)(CreateTeamWithObserver);
