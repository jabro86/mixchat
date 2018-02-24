import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react";
import { extendObservable } from "mobx";
import { Container, Header, Input, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { graphql, ChildProps } from "react-apollo";

export interface Error {
	path: string;
	message: string;
}

export interface LoginResponse {
	ok: boolean;
	token: string;
	refreshToken: string;
	errors: Error[];
}

export interface LoginMutation {
	login: LoginResponse;
}

export interface LoginProps extends RouteComponentProps<{}> {}

class Login extends React.Component<ChildProps<LoginProps, LoginMutation>> {
	private email: string;
	private password: string;

	constructor(props: LoginProps) {
		super(props);

		extendObservable(this, {
			email: "",
			password: ""
		});
	}

	onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget;
		this[name] = value;
	};

	onSubmit = async () => {
		const { email, password } = this;
		if (this.props.mutate) {
			const response = await this.props.mutate({
				variables: { email, password }
			});
			console.log(response);
			const { ok, token, refreshToken } = response.data.login;
			if (ok) {
				localStorage.setItem("token", token);
				localStorage.setItem("refreshToken", refreshToken);
			}
		}
	};

	render() {
		const { email, password } = this;
		return (
			<Container>
				<Header as="h2">Login</Header>
				<Input
					name="email"
					onChange={this.onChange}
					value={email}
					placeholder="Email"
					fluid={true}
				/>
				<Input
					name="password"
					onChange={this.onChange}
					value={password}
					type="password"
					placeholder="Password"
					fluid={true}
				/>
				<Button onClick={this.onSubmit}>Submit</Button>
			</Container>
		);
	}
}

const loginMutation = gql`
	mutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			ok
			token
			refreshToken
			errors {
				path
				message
			}
		}
	}
`;
const LoginWithObserver: any = observer(Login); // tslint:disable-line
export default graphql<LoginMutation>(loginMutation)(LoginWithObserver);
