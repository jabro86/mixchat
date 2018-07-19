import * as React from "react";
import {
	Form,
	Container,
	Header,
	Input,
	Button,
	Message
} from "semantic-ui-react";
import { graphql, ChildProps } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";

interface RegisterState {
	[key: string]: string;
}

interface RegisterProps extends RouteComponentProps<{}> {}

export interface Error {
	path: string;
	message: string;
}

export interface RegisterResponse {
	ok: boolean;
	errors: Error[];
}

export interface RegisterMutation {
	register: RegisterResponse;
}

class Register extends React.Component<
	ChildProps<RegisterProps, RegisterMutation>,
	RegisterState
> {
	state = {
		username: "",
		usernameError: "",
		email: "",
		emailError: "",
		password: "",
		passwordError: ""
	};

	onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		if (name === "username" || name === "email" || name === "password") {
			this.setState({ [name]: value });
		}
	};

	onSubmit = async () => {
		this.setState({
			usernameError: "",
			emailError: "",
			passwordError: ""
		});

		if (this.props.mutate) {
			const { username, email, password } = this.state;
			const response = await this.props.mutate({
				variables: { username, email, password }
			});

			const { ok, errors } = response.data.register;
			if (ok) {
				this.props.history.push("/login");
			} else {
				const err = {};
				errors.forEach(({ path, message }) => {
					err[`${path}Error`] = message;
				});
				this.setState({ ...err });
			}
		}
	};

	render() {
		const {
			username,
			usernameError,
			email,
			emailError,
			password,
			passwordError
		} = this.state;

		const errorList = [];
		if (usernameError) {
			errorList.push(usernameError);
		}
		if (emailError) {
			errorList.push(emailError);
		}
		if (passwordError) {
			errorList.push(passwordError);
		}

		return (
			<Container>
				<Header as="h2">Register</Header>
				<Form>
					<Form.Field error={!!usernameError}>
						<Input
							name="username"
							onChange={this.onChange}
							value={username}
							placeholder="Username"
							fluid={true}
						/>
					</Form.Field>
					<Form.Field error={!!emailError}>
						<Input
							name="email"
							onChange={this.onChange}
							value={email}
							placeholder="Email"
							fluid={true}
						/>
					</Form.Field>
					<Form.Field error={!!passwordError}>
						<Input
							name="password"
							onChange={this.onChange}
							value={password}
							type="password"
							placeholder="Password"
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

const registerMutation = gql`
	mutation($username: String!, $email: String!, $password: String!) {
		register(username: $username, email: $email, password: $password) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default graphql(registerMutation)(Register);
