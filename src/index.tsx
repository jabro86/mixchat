import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import registerServiceWorker from "./registerServiceWorker";
import Routes from "./routes/index";
import "semantic-ui-css/semantic.min.css";

const httpLink = new HttpLink({ uri: "http://localhost:8080/graphql" });

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	operation.setContext({
		headers: {
			"x-token": localStorage.getItem("token"),
			"x-refresh-token": localStorage.getItem("refreshToken")
		}
	});
	if (forward) {
		return forward(operation);
	} else {
		return null;
	}
});

const logoutLink = onError(operation => {
	console.log("onError", operation);

	// const token = headers.get("x-token");
	// const refreshToken = headers.get("x-refresh-token");
	// if (token) {
	// 	localStorage.setItem("token", token);
	// }
	// if (refreshToken) {
	// 	localStorage.setItem("refreshToken", refreshToken);
	// }

	if (operation.networkError && operation.networkError.name === "401") {
		// logout
	}
});
// tslint:disable-next-line:no-any
const middleware: any = concat(authMiddleware, httpLink);
// tslint:disable-next-line:no-any
const link: any = logoutLink.concat(middleware);
const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache()
});

const App = (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
