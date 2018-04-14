import * as React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import * as decode from "jwt-decode";

import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import CreateTeam from "./CreateTeam";
import ViewTeam from "./ViewTeam";
import DirectMessages from "./DirectMessages";

const isAuthenticated = () => {
	const token = localStorage.getItem("token");
	const refreshToken = localStorage.getItem("refreshToken");
	if (token == null || refreshToken == null) {
		return false;
	}
	try {
		decode(token);
		decode(refreshToken);
	} catch (err) {
		return false;
	}
	return true;
};

// tslint:disable-next-line:no-any
const PrivateRoute = ({ component: Component, ...rest }: any) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: "/login"
					}}
				/>
			)
		}
	/>
);

export default () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true} component={Home} />
				<Route path="/register" exact={true} component={Register} />
				<Route path="/login" exact={true} component={Login} />
				<PrivateRoute
					path="/view-team/user/:teamId/:userId"
					exact={true}
					component={DirectMessages}
				/>
				<PrivateRoute
					path="/view-team/:teamId?/:channelId?"
					exact={true}
					component={ViewTeam}
				/>
				<PrivateRoute path="/create-team" exact={true} component={CreateTeam} />
				<PrivateRoute
					path="/view-team/:teamId?/:channelId?"
					exact={true}
					component={ViewTeam}
				/>
			</Switch>
		</BrowserRouter>
	);
};
