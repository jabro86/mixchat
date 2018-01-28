import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";

export default () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true} component={Home} />
			</Switch>
		</BrowserRouter>
	);
};
