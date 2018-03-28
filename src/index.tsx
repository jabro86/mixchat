import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import registerServiceWorker from "./registerServiceWorker";
import Routes from "./routes/index";
import "semantic-ui-css/semantic.min.css";

// tslint:disable-next-line:no-any
const httpLink: any = createHttpLink({ uri: "http://localhost:8080/graphql" });

const authLink = setContext(() => ({
	headers: {
		"x-token": localStorage.getItem("token"),
		"x-refresh-token": localStorage.getItem("refreshToken")
	}
}));

const afterwareLink = new ApolloLink((operation, forward) => {
	const { headers } = operation.getContext();
	if (headers) {
		const token = headers.get("x-token");
		const refreshToken = headers.get("x-refresh-token");
		if (token) {
			localStorage.setItem("token", token);
		}
		if (refreshToken) {
			localStorage.setItem("refreshToken", refreshToken);
		}
	}
	if (forward) {
		return forward(operation);
	} else {
		return null;
	}
});

const middleware = afterwareLink.concat(authLink.concat(httpLink));

const client = new ApolloClient({
	link: middleware,
	cache: new InMemoryCache()
});

const App = (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
