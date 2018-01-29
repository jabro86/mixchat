import * as React from "react";
import { Container, Header, Input, Button } from "semantic-ui-react";
import { graphql, ChildProps } from "react-apollo";
import gql from "graphql-tag";

interface RegisterState {
	[key: string]: string;
}

class Register extends React.Component<ChildProps<{}, {}>, RegisterState> {

	state = {
		username: "",
		email: "",
		password: ""
	};

	onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		if (name === "username" || name === "email" || name === "password") {
			this.setState({ [name]: value });
		}
	}

	onSubmit = async () => {
		if (this.props.mutate) {
			const response = await this.props.mutate({
				variables: this.state
			});
			console.log(response); // tslint:disable-line
		}
	}

	render() {

		const { username, email, password } = this.state;

		return (
			<Container>
				<Header as="h2">Register</Header>
				<Input
					name="username"
					onChange={this.onChange}
					value={username}
					placeholder="Username"
					fluid={true}
				/>
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

const registerMutation = gql`
	mutation ($username: String!, $email: String!, $password: String!) {
		register(username: $username, email: $email, password: $password)
  	}
`;

export default graphql(registerMutation)(Register);