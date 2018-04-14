import * as React from "react";
import { Input } from "semantic-ui-react";
import styled from "styled-components";
import { withFormik } from "formik";

const SendMessageWrapper = styled.div`
	grid-column: 3;
	grid-row: 3;
	margin: 20px;
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
			handleSubmit
		} = this.props;

		return (
			<SendMessageWrapper>
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
					fluid={true}
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
