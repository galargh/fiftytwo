/** @jsx React.DOM */
var React = require('react'),
    createClass = require('create-react-class');

module.exports = createClass({
    render: function() {
        return (
            <h1 className="center absolute noMargin">
                <span>{this.props.note}</span>
                <small>{this.props.octave}</small>
            </h1>
        );
    }
});
