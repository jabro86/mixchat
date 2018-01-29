import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";

export default () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true} component={Home} />
				<Route path="/register" exact={true} component={Register} />
			</Switch>
		</BrowserRouter>
	);
};
