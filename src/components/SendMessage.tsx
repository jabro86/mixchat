import * as React from "react";
import { Input } from "semantic-ui-react";
import styled from "styled-components";
import { withFormik } from "formik";
import gql from "graphql-tag";
import { compose, graphql, MutateProps } from "react-apollo";

const SendMessageWrapper = styled.div`
	grid-column: 3;
	grid-row: 3;
	margin: 20px;
`;

export interface SendMessageProps {
	channelName: string;
}

interface CreateMessageMutationProps {
	channelId: number;
}

// tslint:disable-next-line:no-any
export class StyledSendMessage extends React.Component<any> {
	render() {
		const {
			channelName,
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
					placeholder={`Message #${channelName}`}
				/>
			</SendMessageWrapper>
		);
	}
}

const createMessageMutation = gql`
	mutation($channelId: Int!, $text: String!) {
		createMessage(channelId: $channelId, text: $text)
	}
`;

export default compose(
	graphql(createMessageMutation),
	withFormik({
		mapPropsToValues: (props: CreateMessageMutationProps & MutateProps) => ({ message: "" }),
		handleSubmit: async (
			values,
			{ props: { channelId, mutate }, setSubmitting, resetForm }
		) => {
			console.log("handleSubmit in SendMessage");
			if (!values.message || !values.message.trim()) {
				setSubmitting(false);
				return;
			}
			const result = await mutate({
				variables: { channelId, text: values.message }
			});
			console.log("result", result);
			resetForm(false);
		}
	})
)(StyledSendMessage);
