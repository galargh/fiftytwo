/** @jsx React.DOM */
var React = require('react'),
    createClass = require('create-react-class');

module.exports = createClass({
    render: function() {
        var difference = this.props.difference.toFixed(3);
        if (difference > 0) {
            difference = '+' + difference;
        }
        return (
            <h2 className="topRight absolute withMargin">
                {difference} cent
            </h2>
        );
    }
});
