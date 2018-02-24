import * as React from "react";
import { observer } from "mobx-react";
import { extendObservable } from "mobx";
import { Container, Header, Input, Button } from "semantic-ui-react";

interface LoginProps {}

export default observer(
	class Login extends React.Component<LoginProps> {
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

		onSubmit = () => {
			const { email, password } = this;
			console.log(email, password); // tslint:disable-line
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
);
