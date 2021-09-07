/** @jsx React.DOM */
var React = require('react'),
    createClass = require('create-react-class');

module.exports = createClass({
    render: function() {
        return (
            <h2 className="topLeft absolute withMargin">
                {this.props.frequency} Hz
            </h2>
        );
    }
});
