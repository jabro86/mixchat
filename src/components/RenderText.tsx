import * as React from "react";

// tslint:disable-next-line:no-any
export default class RenderText extends React.Component<{ url: string }> {
	state = {
		text: ""
	};

	componentDidMount() {
		fetch(this.props.url)
			.then(response => {
				return response.text();
			})
			.then(text => {
				this.setState({ text });
			});
	}

	render() {
		const { text } = this.state;
		return (
			<div>
				<div>------</div>
				<p>{text}</p>
				<div>------</div>
			</div>
		);
	}
}
