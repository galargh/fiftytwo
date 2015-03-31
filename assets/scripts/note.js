/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<h1 className="center absolute noMargin">
				<span>{this.props.note}</span>
				<small>{this.props.octave}</small>
	    	</h1>
		);
	}
});