import * as React from "react";

import Header from "../components/Header";
import Messages from "../components/Messages";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";

export default () => (
	<AppLayout>
		<Header channelName="general" />
		<Sidebar currentTeamId={1} />
		<Messages>
			<ul className="message-list">
				<li />
				<li />
			</ul>
		</Messages>
		<SendMessage channelName="general" />
	</AppLayout>
);
