import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";

export default () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true} component={Home} />
				<Route path="/register" exact={true} component={Register} />
				<Route path="/login" exact={true} component={Login} />
			</Switch>
		</BrowserRouter>
	);
};
