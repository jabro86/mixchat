import * as React from "react";
import Dropzone from "react-dropzone";

// tslint:disable-next-line:no-any
const FileUpload = ({ children, disableClick = false }: any) => (
	<Dropzone
		className="ignore"
		onDrop={() => console.log("on drop")}
		disableClick={disableClick}
	>
		{children}
	</Dropzone>
);

export default FileUpload;
