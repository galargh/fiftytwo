window.AudioContext = window.AudioContext ||
					  window.webkitAudioContext ||
					  window.mozAudioContext ||
					  window.oAudioContext ||
					  window.msAudioContext;

navigator.getUserMedia = navigator.getUserMedia ||
					  	 navigator.webkitGetUserMedia ||
					     navigator.mozGetUserMedia ||
					     navigator.msGetUserMedia;

function getAnalyser(context) {
	var analyser = context.createAnalyser();
	try {
		analyser.fftSize = 32768;
	} catch(error) {
		analyser.fftSize = 2048;
	}
	analyser.smoothingTimeConstant = 0.8;
	return analyser;
}

function getGain(context) {
	var gain = context.createGain();
	gain.gain.value = 1.5;
	return gain;
}

function getPass(context, type, frequency) {
	var pass = context.createBiquadFilter();
	pass.Q.value = 0;
	pass.frequency.value = frequency;
	pass.type = type;
	return pass;
}

function getLowPass(context) {
	return getPass(context, "lowpass", 4200);
}

function getHighPass(context) {
	return getPass(context, "highpass", 30);
}

function chainConnect() {
	for(var i = 0; i < arguments.length - 1; i++) {
		arguments[i].connect(arguments[i+1]);
	}
}

module.exports = function(stream) {
	var context = new AudioContext();
	var mic = context.createMediaStreamSource(stream);
	var script = context.createScriptProcessor(1024, 1, 1);
	var analyser = context.createAnalyser();
	chainConnect(mic, script, analyser);
	return {
		context: context,
		script: script
	};
}
