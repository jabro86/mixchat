import * as React from "react";

import Channels from "../components/Channels";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Teams from "../components/Teams";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";

export default () => (
	<AppLayout>
		<Teams teams={[{ id: 1, letter: "T" }, { id: 2, letter: "B" }]} />
		<Channels
			teamName="Team name"
			username="Username"
			channels={[{ id: 1, name: "general" }, { id: 2, name: "random" }]}
			users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user1" }]}
		>
			Channels
		</Channels>
		<Header channelName="general" />
		<Messages>
			<ul className="message-list">
				<li />
				<li />
			</ul>
		</Messages>
		<SendMessage channelName="general" />
	</AppLayout>
);
