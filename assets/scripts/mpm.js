function getNSDF(audioBuffer) {
    var nsdf = [];
    for (var tau = 0; tau < audioBuffer.length; tau ++) {
        var acf = 0.0,
            m = 0.0;
        for (var i = 0; i < audioBuffer.length - tau; i++) {
            acf += audioBuffer[i] * audioBuffer[i + tau];
            m += audioBuffer[i] * audioBuffer[i] +
                audioBuffer[i + tau] * audioBuffer[i + tau];
        }
        nsdf.push(2 * acf / m);
    }
    return nsdf;
}

function getMaxPositions(nsdf) {
    var pos = 0,
        maxPos = 0;

    var maxPositions = [];

    while(pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0.0) {
        pos++;
    }

    while(pos < nsdf.length - 1 && nsdf[pos] <= 0.0) {
        pos++;
    }

    if (pos == 0) {
        pos = 1;
    }

    while(pos < nsdf.length - 1) {
        //ndsf[pos] >= 0.0
        if (nsdf[pos] > nsdf[pos - 1] && nsdf[pos] &&
            nsdf[pos] >= nsdf[pos + 1]) {

            if (maxPos == 0 || nsdf[pos] > nsdf[maxPos]) {
                maxPos = pos;
            }
        }
        pos++;
        if (pos < nsdf.length - 1 && nsdf[pos] <= 0.0) {
            if (maxPos > 0) {
                maxPositions.push(maxPos);
                maxPos = 0;
            }
            while (pos < nsdf.length - 1 && nsdf[pos] <= 0.0) {
                pos++;
            }
        }
    }

    if (maxPos > 0) {
        maxPositions.push(maxPos);
    }

    return maxPositions;
}

function getTurningPoint(nsdf, tau) {
    if (bottom == 0.0) {
        return {
            x: tau,
            y: nsdf[tau],
        }
    }
    var delta = nsdf[tau - 1] - nsdf[tau + 1],
        bottom = 2 * (nsdf[tau + 1] + nsdf[tau - 1] - 2 * nsdf[tau]);
    return {
        x: tau + delta / bottom,
        y: nsdf[tau] - delta * delta / (4 * bottom)
    };
}

module.exports = function(audioBuffer, sampleRate, smallCutoff, cutoff,
    lowerPitchCutoff) {

    var pitch = 0.0;
    var maxPositions = [],
        estimates = [];

    var nsdf = getNSDF(audioBuffer);
    var maxPositions = getMaxPositions(nsdf);

    var highestAmp = Number.MIN_VALUE;

    for (var i = 0; i < maxPositions.length; i++) {
        var tau = maxPositions[i];

        highestAmp = Math.max(highestAmp, nsdf[tau]);

        if (nsdf[tau] > smallCutoff) {
            var turningPoint = getTurningPoint(nsdf, tau);
            estimates.push(turningPoint);
            highestAmp = Math.max(highestAmp, turningPoint.y);
        }
    }

    if (estimates.length == 0) {
        return {
            pitch: 0.0,
            probability: 0.0
        };
    }
    var actualCutoff = cutoff * highestAmp;

    var period = 0;
    for (var i = 0; i < estimates.length; i++) {
        if (estimates[i].y >= actualCutoff) {
            period = estimates[i].x;
            break;
        }
    }

    var pitchEstimate = sampleRate / period;
    if (pitchEstimate > lowerPitchCutoff) {
        pitch = pitchEstimate;
    } else {
        return {
            pitch: 0.0,
            probability: 0.0
        };
    }

    return {
        pitch: pitch,
        probability: highestAmp
    }

}
