import * as React from "react";
import { Input, Button, Icon } from "semantic-ui-react";
import styled from "styled-components";
import { withFormik } from "formik";
import FileUpload from "./FileUpload";

const SendMessageWrapper = styled.div`
	grid-column: 3;
	margin: 20px;
	display: grid;
	grid-template-columns: 45px auto;
`;

export interface SendMessageProps {
	placeholder: string;
}

// tslint:disable-next-line:no-any
export class StyledSendMessage extends React.Component<any> {
	render() {
		const {
			placeholder,
			values,
			handleChange,
			handleBlur,
			isSubmitting,
			handleSubmit,
			channelId
		} = this.props;

		return (
			<SendMessageWrapper>
				<FileUpload channelId={channelId}>
					<Button icon={true}>
						<Icon name="plus" />
					</Button>
				</FileUpload>
				<Input
					onChange={handleChange}
					// tslint:disable-next-line:no-any
					onKeyDown={(event: any) => {
						//  ENTER_KEY
						if (event.keyCode === 13 && !isSubmitting) {
							handleSubmit(event);
						}
					}}
					onBlur={handleBlur}
					name="message"
					value={values.message}
					placeholder={`Message #${placeholder}`}
				/>
			</SendMessageWrapper>
		);
	}
}

export default withFormik({
	// tslint:disable-next-line:no-any
	mapPropsToValues: (props: any) => ({
		message: ""
	}),
	handleSubmit: async (
		values,
		{ props: { onSubmit }, setSubmitting, resetForm }
	) => {
		if (!values.message || !values.message.trim()) {
			setSubmitting(false);
			return;
		}
		await onSubmit(values.message);
		resetForm(false);
	}
})(StyledSendMessage);
