window.AudioContext = window.AudioContext ||
					  window.webkitAudioContext ||
					  window.mozAudioContext ||
					  window.oAudioContext ||
					  window.msAudioContext;

navigator.getUserMedia = navigator.getUserMedia ||
					  	 navigator.webkitGetUserMedia ||
					     navigator.mozGetUserMedia ||
					     navigator.msGetUserMedia;

function chainConnect() {
	for(var i = 0; i < arguments.length - 1; i++) {
		arguments[i].connect(arguments[i+1]);
	}
}

module.exports = function(stream) {
	var context = new AudioContext();
	var mic = context.createMediaStreamSource(stream);
	var script = context.createScriptProcessor(1024, 1, 1);
	var gain = context.createGain();
	gain.gain.value = 0;
	chainConnect(mic, script, gain, context.destination);
	return {
		context: context,
		script: script
	};
};
