import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import registerServiceWorker from "./registerServiceWorker";
import Routes from "./routes/index";
import "semantic-ui-css/semantic.min.css";

const client = new ApolloClient({
	link: new HttpLink({ uri: "http://localhost:8080/graphql" }),
	cache: new InMemoryCache()
});

const App = (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
