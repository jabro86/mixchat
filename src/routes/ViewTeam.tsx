import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Header from "../components/Header";
import Messages from "../components/Messages";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";

interface ViewTeamProps {
	teamId: string;
	channelId: string;
}

const ViewTeam = ({ match: { params } }: RouteComponentProps<ViewTeamProps>) => (
	<AppLayout>
		<Header channelName="general" />
		<Sidebar currentTeamId={params.teamId} />
		<Messages>
			<ul className="message-list">
				<li />
				<li />
			</ul>
		</Messages>
		<SendMessage channelName="general" />
	</AppLayout>
);

export default ViewTeam;
