# fiftytwo[52]

Fiftytwo is a tuner using WebAudio API for audio manipulation and ReactJS for
the view. It implements Philip McLeod's MPM algorithm for pitch
detection. It is being used and tested mainly with guitar and ukulele.

### 52
The tuner was named after
['the world's loneliest whale'](http://en.wikipedia.org/wiki/52-hertz_whale)
which calls at a very unusual frequency of 52Hz.

### MPM
Special thanks to Philip McLeod for
[a smarter way to detect pitch](http://miracle.otago.ac.nz/tartini/papers/A_Smarter_Way_to_Find_Pitch.pdf).

### TODO
* use FFT to speed up the pitch detection
* tune config(cutoffs etc.) for more acurate results
* allow in-browser config manipulation
* add info box for denied microphone access
