import * as React from "react";
import Dropzone from "react-dropzone";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

const FileUpload = ({
	children,
	disableClick = false,
	channelId,
	mutate
}: // tslint:disable-next-line:no-any
any) => (
	<Dropzone
		className="ignore"
		onDrop={async ([file]) => {
			console.log("file", file);
			const response = await mutate({
				variables: {
					channelId,
					file
				}
			});
			console.log("response", response);
		}}
		disableClick={disableClick}
	>
		{children}
	</Dropzone>
);

const createFileMessageMutation = gql`
	mutation($channelId: Int!, $file: Upload) {
		createMessage(channelId: $channelId, file: $file)
	}
`;

// tslint:disable-next-line:no-any
export default graphql<any>(createFileMessageMutation)(FileUpload);
