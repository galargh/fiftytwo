/** @jsx React.DOM */
var React = require('react'),
    createClass = require('create-react-class');

module.exports = createClass({
    render: function() {
        var notesList = this.props.notes.map((note, i) =>
            <li className={
                    "horizontalItem clickableItem" +
                        ((i == this.props.transposition) ? " clickedItem" : "")
                }
                key={note}
                onClick={() => this.props.transpose(i)}>

                {note}
            </li>
        )
        return (
            <h2 className="bottom absolute withMargin">
                <ul className="horizontalList">{notesList}</ul>
            </h2>
        );
    }
});
