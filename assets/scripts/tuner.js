/** @jsx React.DOM */
var React         = require('react'),
    Frequency     = require('./frequency.js'),
    Note          = require('./note.js'),
    Difference    = require('./difference.js'),
    Transposition = require('./transposition.js'),
    Help          = require('./helpers.js');

var setUpStream   = require('./webaudio.js'),
    estimatePitch = require('./mpm.js');

var octaveCutoffs = Help.octaveCutoffs,
    noteFrequencies = Help.noteFrequencies,
    notes = Help.notes,
    getBackgroundColor = Help.getBackgroundColor;

var pitches = [];
var script;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            frequency: 0,
            transposition: 0
        };
    },
    componentDidMount: function() {
        var self = this;
        navigator.getUserMedia({audio: true},
            function(stream) {
                var set = setUpStream(stream);
                script = set.script;
                set.script.onaudioprocess = function(audioProcessingEvent) {
                    var audioBuffer = audioProcessingEvent.inputBuffer
                        .getChannelData(0);
                    var pitch = estimatePitch(audioBuffer,
                        set.context.sampleRate, 0.75, 0.97, 80);
                    self.setPitch(pitch.pitch);
                }
            }, function(error) {
                console.log(error);
            }
        );
    },
    setPitch: function(pitch) {
        pitches.push(pitch);
        if (pitches.length == 5) {
            this.setState({
                frequency: pitches.sort()[2]
            });
            pitches = [];
        }
    },
    setTransposition: function(transposition) {
        this.setState({
          transposition: transposition
        });
    },
    getTransposedNote: function(i) {
      return notes[(this.state.transposition + i) % notes.length];
    },
    getNote: function() {
        var multiplier = 1;
        var octave = 0;
        while (octave < octaveCutoffs.length &&
            this.state.frequency >= octaveCutoffs[octave]) {

            octave++;
            multiplier *= 2;
        }
        octave--;
        multiplier /= 2;
        var i = 0;
        while (i < noteFrequencies.length &&
            this.state.frequency > noteFrequencies[i] * multiplier) {

            i++;
        }
        if (i === 0) {
            return {
                note: this.getTransposedNote(0),
                octave: octave,
                difference: this.state.frequency -
                    noteFrequencies[0] * multiplier
            };
        } else if(i === noteFrequencies.length) {
            return {
                note: this.getTransposedNote(notes.length - 1),
                octave: octave,
                difference: this.state.frequency -
                    noteFrequencies[noteFrequencies.length - 1] * multiplier
            };
        } else {
            var toLower = this.state.frequency -
                noteFrequencies[i - 1] * multiplier;
            var toHigher = this.state.frequency -
                noteFrequencies[i] * multiplier;
            if (toLower < -toHigher) {
                return {
                    note: this.getTransposedNote(i - 1),
                    octave: octave,
                    difference: toLower
                };
            } else {
                return {
                    note: this.getTransposedNote(i),
                    octave: octave,
                    difference: toHigher
                };
            }
        }
    },
    render: function() {
        var note = this.getNote();
        return (
            <div style={getBackgroundColor(note.difference)}
                className="full relative">

                <Frequency frequency={this.state.frequency.toFixed(3)} />
                <Difference difference={note.difference} />
                <Note note={note.note} octave={note.octave} />
                <Transposition notes={notes} transposition={this.state.transposition} transpose={this.setTransposition} />
            </div>
        );
    }
});
