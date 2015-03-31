/** @jsx React.DOM */
var React 	   = require('react'),
	Frequency  = require('./frequency.js'),
	Note	   = require('./note.js'),
	Difference = require('./difference.js'),
	Help	   = require('./helpers.js');

var octaveCutoffs = Help.octaveCutoffs,
	noteFrequencies = Help.noteFrequencies,
	notes = Help.notes,
	getBackgroundColor = Help.getBackgroundColor;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			frequency: 0
		};
	},
	componentDidMount: function() {
    	setInterval(this.incrementFrequency, 1000);
    },
    incrementFrequency: function() {
    	this.setState({
    		frequency: this.state.frequency + 1
    	});
    },
    getNote: function() {
    	var multiplier = 1;
    	var octave = 0;
    	while (octave < octaveCutoffs.length && this.state.frequency >= octaveCutoffs[octave]) {
    		octave++;
    		multiplier *= 2;
    	}
    	octave--;
    	multiplier /= 2;
    	var i = 0;
    	while (i < noteFrequencies.length && this.state.frequency > noteFrequencies[i] * multiplier) {
    		i++;
    	}
    	if (i === 0) {
    		return {
    			note: notes[0],
    			octave: octave,
    			difference: this.state.frequency - noteFrequencies[0] * multiplier
    		};
    	} else if(i === noteFrequencies.length) {
    		return {
    		note: notes[notes.length - 1],
    			octave: octave,
    			difference: this.state.frequency - noteFrequencies[noteFrequencies.length - 1] * multiplier
    		};
    	} else {
    		var toLower = this.state.frequency - noteFrequencies[i - 1] * multiplier;
    		var toHigher = this.state.frequency - noteFrequencies[i] * multiplier;
    		if (toLower < -toHigher) {
    			return {
    				note: notes[i - 1],
    				octave: octave,
   					difference: toLower
    			};
    		} else {
    			return {
    				note: notes[i],
    				octave: octave,
    				difference: toHigher
    			};
    		}
    	}
    },
    render: function() {
    	var note = this.getNote();
    	return (
    		<div style={getBackgroundColor(note.difference)} className="full relative">
    			<Frequency frequency={this.state.frequency} />
    			<Difference difference={note.difference} />
    			<Note note={note.note} octave={note.octave} />
    		</div>
    	);
    }
});