import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import "semantic-ui-css/semantic.css";

import registerServiceWorker from "./registerServiceWorker";
import Routes from "./routes/index";
import client from "./apollo";

const App = (
	<ApolloProvider client={client}>
		<Routes />
	</ApolloProvider>
);

ReactDOM.render(App, document.getElementById("root") as HTMLElement);
registerServiceWorker();
