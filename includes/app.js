//
// app.js
// by Jeremy Muller
// To be used in my piece "Orbitals" for clarinet and web audio
//

/************* variables *************/
var startButton, text, wrapper;

var play = false;

// HSL's for hydrogen atom:
// 0, 100, 50
// 184, 100, 50
// 249, 100, 50
// 275, 100, 43

// var colors = ["red", "sky", "blue", "purple"];
var colors = { "red": 0, "sky": 184, "blue": 249, "purple": 275 };
// var hues = [0, 184, 249, 275];
var hue;
var colorIndex = 0;
var backgroundSat = 100;
var backgroundLight = 50;
var light = 50;
var incr = 0.2;

var ajaxCall = null;
var ajaxInterval = 60000;
var globalClock = 0;
var blackWhite = true;
var animate = false;

var noSleep = new NoSleep();
var pubnub;

// ["Eb5", "F5", "Db5", "Gb5", "F5", "Eb5", "C5", "Ab5", "Db5", "Gb5", "Eb5", "F5", "Gb5", "Db5", "Bb4", "Bb5", "Eb5"]

var motiveA = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, ["Eb5", "Gb5"], "up");
motiveA.interval = "16n";

var motiveB = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        var k = random(keys);
        if ((motiveB.index % 3) == 0) setColor(k);
    }, time);
    colorIndex++;
    colorIndex %= 4;

}, ["F5", "Bb5", "Ab5"], "up");
motiveB.interval = "16n";

var motiveC = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        var k = random(keys);
        if ((motiveC.index % 5) == 0) setColor(k);
    }, time);
}, ["F5", "Db6", "Bb5", "Ab5", "Gb5"], "up");
motiveC.interval = "16n";

var motiveD = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        keys.push("grey");
        var k = random(keys);
        setColor(k);
    }, time);
}, ["Eb4", "F4", "Gb4", "Ab4", "Bb4", "C5", "Db5", "Eb5", "F5", "Gb5", "Ab5", "Bb5", "C6", "Db6",
        "Eb6", "F6", "Gb6", "Ab6", "Bb6", "C7", "Db7", "Eb7", "F7", "Gb7"], "randomOnce");
// ["Eb3", "F3", "Gb3", "Ab3", "Bb3", "C4", "Db4", "Eb4", "F4", "Gb4", "Ab4", "Bb4", "C5", "Db5", "Eb5", "F5", "Gb5", "Ab5", "Bb5",
//     "C6", "Db6", "Eb6", "F6", "Gb6", "Ab6", "Bb6", "C7", "Db7", "Eb7", "F7", "Gb7"]
motiveD.interval = "16n";

var fivePattern = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        setColor(keys[fivePattern.index % 4]);
        // var k = random(keys);
        // setColor(k);
    }, time);
}, ["Eb5", "Gb5", "F5", "Ab5"], "up");
fivePattern.interval = "4n/5";

var sixPattern = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        var k = random(keys);
        if ((sixPattern.index % 2) == 0) setColor(k);
    }, time);
}, ["Eb5", "Gb5", "F5", "Ab5"], "up");
sixPattern.interval = "16t";

var bigPattern = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        var k = random(keys);
        if ((bigPattern.index % 2) == 0) setColor(k);
    }, time);
}, ["Eb5", "Gb5", "F5", "Bb5", "Db5", "Gb5", "Eb5", "Bb5", "F5", "Gb5", "Db5", "Bb5"], "up");

// probably gonna remove this
var pattern = new Tone.Pattern(function (time, note) {
    // Tone.Draw.schedule(function(time) {
    //     document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, " + light + "%)";
    // }, time);
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, ["Eb5", "Gb5"], "up");
pattern.interval = "16n";

var descending32 = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, ["C6", "Bb5", "Ab5", "Gb5", "F5", "Eb5", "Db5", "C5"], "up");
descending32.interval = "32n";

var descending6 = new Tone.Pattern(function (time, note) {
    console.log("note: " + note);
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, ["Ab5", "Gb5", "F5", "Eb5", "Db5", "C5"], "up");
descending6.interval = "16t";

var descending5 = new Tone.Pattern(function (time, note) {
    console.log("note: " + note);
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, ["Ab5", "Gb5", "F5", "Eb5", "Db5"], "up");
descending5.interval = "4n/5";

var patternWalk = new Tone.Pattern(function (time, note) {
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
    console.log("current index: " + patternWalk.index + ", note: " + note);
    Tone.Draw.schedule(function (time) {
        var keys = Object.keys(colors);
        keys.push("grey");
        var k = random(keys);
        setColor(k);
    }, time);
    // ["Bb4", "C5", "D5", "Eb5", "F5", "Gb5", "Ab5"]
    // ["Bb4", "Bb4", "Bb4", "Bb4", "Bb4", "Bb4", "Bb4"]
    // ["F4", "Gb4", "Ab4", "Bb4", "C5", "D5", "Eb5"]
}, ["Ab4", "Bb4", "C5"], "up");
patternWalk.interval = "16n";
patternWalk.probability = 0.25;

// var patternWalk = new Tone.Loop(function(time) {
//     var note = random(["F4", "Gb4", "Ab4", "Bb4", "C5", "D5", "Eb5"]);
//     console.log("note: " + note);
//     squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
// }, "16n");

// probably get rid of this later
var metronome = new Tone.Loop(function (time) {
    console.log("WTF?!?!");
    var note = "C6";
    if (random([0, 1])) note = "Bb5";
    squareSynth.triggerAttackRelease(note, 0.1, time, 0.9);
}, "16n");

/************** synths **************/

var squareSynth = new Tone.Synth({
    "oscillator": {
        "type": "square", // maybe use pulse? "width" : 0.5,
        "volume": 3
    },
    "envelope": {
        "attack": 0.05, // 0.05
        "decay": 0.1,
        "sustain": 1,
        "release": 0.1
    }
}).toMaster();

var squareWithLFO = new Tone.Synth({
    "oscillator": {
        "type": "square",
        "volume": 3
    },
    "envelope": {
        "attack": 0.05, // 0.05
        "decay": 0.1,
        "sustain": 0.9,
        "release": 0.1
    }
}).toMaster();

var lfo = new Tone.LFO({
    "frequency": "16n",
    "type": "square",
    "min": -100,
    "max": 3
}).sync().start();
lfo.connect(squareWithLFO.oscillator.volume);

/*****************************/
/********* functions *********/
/*****************************/

function draw() {
    // TODO
    if (animate) requestAnimationFrame(draw);
    document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, " + light + "%)";
    light += incr;
    if (light > 50 || light < 0) incr *= -1;
}

/**********************************/
function startDraw() {
    animate = true;
    draw();
}

function stopDraw() {
    animate = false;
    light = backgroundLight;
}


function buttonAction() {
    // everything that needs to happen when you press start
    console.log("STARTED");
    wrapper.remove();
    play = true;

    noSleep.enable();

    // Subscribe
    pubnub.addListener({
        message: function (m) {
            handleMessage(m);
        },
        presence: function (p) {
            console.log("occupancy: " + p.occupancy);
        }
    });
    pubnub.subscribe({
        channels: ['JeremyMuller_Orbitals'],
        withPresence: true
    });

    // if (random([0, 1])) {
    //     pattern.values = ["Eb4", "Db5", "F5", "Gb5"];
    // }

    // if (random([0, 1])) {
    //     pattern.values = ["Bb4", "Bb5"];
    //     pattern.pattern = "up";
    // }

    draw();
}

/************** helpers **************/

// function draw() {
// 	// this slowly animates background hue
// 	requestAnimationFrame(draw);
// 	document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 50%)";
// 	if (play) backgroundHue += 0.1; backgroundHue % 360;
//
// 	// document.getElementsByTagName("p")[0].innerHTML = "audio context: " + Tone.now().toFixed(3);
//     // document.querySelector('p').textContent = Tone.now().toFixed(3);
//     var transport = Tone.Transport.seconds.toFixed(3);
//
//     // document.querySelector('span').textContent = "bars: " + Tone.Time(transport).toBarsBeatsSixteenths();
// }

// TODO: for mm rehearsing!!
function handleAJAXResponse(xhttp) {
    if (parseFloat(xhttp) == 0) {
        console.log("ajax call");
    } else {
        clearInterval(ajaxCall);
        console.log("response: " + xhttp);
        // var diff = Math.ceil(xhttp) - xhttp;
        // var delay = parseFloat(diff.toFixed(2));
        // console.log("response type: " + (typeof delay));
        // console.log("processed: " + delay);

        // response: 1.99,0m
        // array t: 1.99,0m
        // array[0]: 1.99
        // array[1]: 0m

        var t = xhttp.split(',');
        console.log("array t: " + t);
        console.log("array[0]: " + t[0]);
        console.log("array[1]: " + t[1]);

        // Tone.Transport.start(Tone.now(), parseFloat(xhttp));
        Tone.Transport.start(Tone.now(), parseFloat(t[0]) + Tone.Time(t[1]).toSeconds());
        // Tone.Transport.start("+0.1", "143m");

        setTimeout(function () {
            console.log("transport time: " + Tone.Transport.seconds.toFixed(3));
            // score();
            // squareSynth.oscillator.width.linearRampToValue(0.1, 5, "@1m");
        }, 100);

        // document.getElementById("result").innerHTML += "ajax response: " + xhttp + "</br>";
    }
}

function init() {
    StartAudioContext(Tone.context);
    // Tone.Master.volume.value = -500;
    Tone.Transport.bpm.value = 140;
    // Tone.Transport.start("+0.1");

    setColor("init");
    // backgroundHue = random(hues);
    // if (backgroundHue == 275) {
    //     backgroundLight = 43;
    //     light = 43;
    // }
    // document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 0%)";
    // document.body.style.backgroundColor = "hsl(" + backgroundHue + ", 100%, 100%)";
    // document.body.style.backgroundColor = "rgb(255, 0, 0)";

    // create button
    startButton = document.createElement("button");
    startButton.onclick = buttonAction;
    text = document.createTextNode("Tap to connect");
    startButton.appendChild(text);
    startButton.className = "splash";
    wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.id = "container";
    wrapper.appendChild(startButton);
    document.body.appendChild(wrapper);

    var s = 3.45;
    console.log("" + s + " seconds to notation: " + Tone.Time(s).toNotation());
    console.log("" + s + " seconds to Bars:Beats:Sixteenths: " + Tone.Time(s).toBarsBeatsSixteenths());
    console.log("random: " + random([0, 1, 2, 3], 10));
    console.log("shuffle: " + shuffle([1, 2, 3, 4]));

    Tone.Transport.on('start', score);
}

function cleanUp() {
    pubnub.unsubscribe({
        channels: ['JeremyMuller_Orbitals']
    });
}

function handleMessage(m) {
    console.log("start: " + m.message['start']);
    console.log("time: " + m.message['time']);

    if (m.message['start'] == false) Tone.Transport.stop();
    else {
        var mm = m.message['time'];
        console.log("mm type: " + (typeof mm));
        if (Tone.Transport.state == "stopped") {
            Tone.Transport.start(Tone.now(), mm);
        } else {
            Tone.Transport.pause();
            Tone.Transport.start("+0.1", mm + 0.1);
            console.log("transport was paused and restarted");
        }
    }
}

function playbackRate(rate) {
    bigPattern.playbackRate = rate;
    fivePattern.playbackRate = rate;
    sixPattern.playbackRate = rate;
}

function setColor(c) {
    if (c === "init") {
        var keys = Object.keys(colors);
        hue = random(keys);
        if (hue === "purple") light = 43;
        backgroundLight = light;
        document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 0%)";
    } else if (c === "grey" || c === "gray") {
        document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 10%)";
    } else if (c === "black") {
        document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 0%)";
    } else if (c == null) {
        document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, " + light + "%)";
    } else {
        document.body.style.backgroundColor = "hsl(" + colors[c] + ", 100%, " + light + "%)";
    }
}

function stopPatterns() {
    pattern.stop();
    descending32.stop();
    descending6.stop();
    descending5.stop();
    motiveA.stop();
    motiveB.stop();
    motiveC.stop();
    motiveD.stop();
    fivePattern.stop();
    sixPattern.stop();
    bigPattern.stop();
    patternWalk.stop();

    // TODO: reset patterns to index 0?
}

function score() {

    Tone.Transport.schedule(function (time) {
        Tone.Draw.schedule(function (time) {
            setColor();
        }, "@1m");
        motiveA.start("@1m");
    }, "1m");
    Tone.Transport.schedule(function (time) {
        motiveA.stop();
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
        var note;
        random([0, 1]) ? note = "Eb5" : note = "Db5";
        squareWithLFO.triggerAttack(note, time, 0.9);
        squareWithLFO.triggerRelease("@15m");
    }, "14m");
    Tone.Transport.schedule(function (time) {
        setTimeout(function () {
            squareWithLFO.triggerRelease();
        }, 150);
        motiveA.stop();
        motiveA.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "15m");
    Tone.Transport.schedule(function (time) {
        motiveA.stop();
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
        var note;
        random([0, 1]) ? note = "C5" : note = "Bb4";
        squareWithLFO.triggerAttack(note, time, 0.9);
        squareWithLFO.triggerRelease("@25m");
    }, "23m");
    Tone.Transport.schedule(function (time) {
        setTimeout(function () {
            squareWithLFO.triggerRelease();
        }, 150);
        motiveA.stop();
        motiveA.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "25m");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "Bb4";
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
    }, "30m");

    if (random([0, 1])) {
        Tone.Transport.schedule(function (time) {
            motiveA.values[0] = "C5";
            Tone.Draw.schedule(function (time) {
                document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 25%)";
            }, time);
        }, "31m + 2n + 4n");
    } else {
        Tone.Transport.schedule(function (time) {
            motiveA.values[0] = "C5";
            Tone.Draw.schedule(function (time) {
                document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 25%)";
            }, time);
        }, "31m");
        Tone.Transport.schedule(function (time) {
            motiveA.values[0] = "Db5";
            Tone.Draw.schedule(function (time) {
                document.body.style.backgroundColor = "hsl(" + colors[hue] + ", 100%, 40%)";
            }, time);
        }, "31m + 2n + 4n");
    }
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "Eb5";
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "33m");

    if (random([0, 1])) {
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["F5", "Gb5"];
            motiveA.values[0] = "F5";
        }, "35m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Eb5", "Gb5"];
            motiveA.values[0] = "Eb5";
        }, "37m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["F5", "Gb5"];
            motiveA.values[0] = "F5";
        }, "37m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            motiveA.stop();
            squareWithLFO.triggerAttack("Gb5", time, 0.9);
            squareWithLFO.triggerRelease("@40m");
        }, "38m + 4n");
    } else {
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Db5", "Gb5"];
            motiveA.values[0] = "Db5";
        }, "35m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Eb5", "Gb5"];
            motiveA.values[0] = "Eb5";
        }, "35m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Db5", "Gb5"];
            motiveA.values[0] = "Db5";
        }, "37m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Eb5", "Gb5"];
            motiveA.values[0] = "Eb5";
        }, "37m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            motiveA.stop();
            squareWithLFO.triggerAttack("F5", time, 0.9);
            squareWithLFO.triggerRelease("@40m");
        }, "38m + 4n");
    }
    Tone.Transport.schedule(function (time) {
        setTimeout(function () {
            squareWithLFO.triggerRelease();
        }, 150);
        motiveA.stop();
        motiveA.values[0] = "Eb5";
        motiveA.start("@4n");
    }, "40m");

    if (random([0, 1])) {
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Bb4", "Gb5"];
            motiveA.values[0] = "Bb4";
        }, "41m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["C5", "Gb5"];
            motiveA.values[0] = "C5";
        }, "43m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Db5", "Gb5"];
            motiveA.values[0] = "Db5";
        }, "43m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Eb5", "Gb5"];
            motiveA.values[0] = "Eb5";
        }, "45m");
        Tone.Transport.schedule(function (time) {
            motiveA.stop();
            squareWithLFO.triggerAttack("F5", time, 0.9);
            squareWithLFO.triggerRelease("@49m");
            Tone.Draw.schedule(function (time) {
                setColor("grey");
            }, time);
        }, "46m");
    } else {
        Tone.Transport.schedule(function (time) {
            motiveA.stop();
            motiveA.values[0] = "Bb4";
            motiveA.start("@1m");
        }, "41m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["C5", "Gb5"];
            motiveA.values[0] = "C5";
        }, "41m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Db5", "Gb5"];
            motiveA.values[0] = "Db5";
        }, "43m");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["Eb5", "Gb5"];
            motiveA.values[0] = "Eb5";
        }, "43m + 2n + 4n");
        Tone.Transport.schedule(function (time) {
            // pattern.values = ["F5", "Gb5"];
            motiveA.values[0] = "F5";
        }, "45m");
        Tone.Transport.schedule(function (time) {
            motiveA.stop();
            squareWithLFO.triggerAttack("Gb5", time, 0.9);
            squareWithLFO.triggerRelease("@49m");
            Tone.Draw.schedule(function (time) {
                setColor("grey");
            }, time);
        }, "46m");
    }

    Tone.Transport.schedule(function (time) {
        setTimeout(function () {
            squareWithLFO.triggerRelease();
        }, 150);
        motiveA.stop();
        motiveA.values[0] = "Eb5";
        // random([0,1]) ? pattern.values = ["F5", "Bb5", "Ab5"] : pattern.values = ["Eb5", "Gb5"];
        // pattern.start("@1m");
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "49m");

    Tone.Transport.schedule(function (time) {
        // pattern.stop();
        // pattern.values = ["Eb5", "Gb5", "F5", "Ab5"];
        stopPatterns();

        // 50% pick rhythm
        random([0, 1]) ? fivePattern.start("@1m") : sixPattern.start("@1m");
        // pattern.start("@1m");
    }, "62m");

    Tone.Transport.schedule(function (time) {
        stopPatterns();
        sixPattern.values = ["Gb5", "Bb5", "Ab5", "C6"];
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "63m");

    Tone.Transport.schedule(function (time) {
        stopPatterns();
        switch (random([0, 1, 2])) {
            case 0:
                bigPattern.interval = "16t";
                break;
            case 1:
                bigPattern.interval = "4n/5";
                break;
            case 2:
                bigPattern.interval = "32n";
                break;
        }
        bigPattern.start("@1m");
    }, "71m");

    Tone.Transport.schedule(function (time) {
        // pattern.stop();
        // pattern.interval = "16n";
        // random([0,1]) ? pattern.values = ["F5", "Bb5", "Ab5"] : pattern.values = ["Eb5", "Gb5"];
        // pattern.start("@1m");
        stopPatterns();
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "73m");


    if (random([0, 1])) {
        Tone.Transport.schedule(function (time) {
            stopPatterns();
            squareWithLFO.triggerAttack("Gb5", time, 0.9);
            squareWithLFO.triggerRelease("@81m");
            Tone.Draw.schedule(function (time) {
                setColor("grey");
            }, time);
        }, "78m");
    } else {
        Tone.Transport.schedule(function (time) {
            // pattern.stop();
            // pattern.interval = "32n";
            // pattern.values = ["Eb5", "Gb5", "F5", "Bb5", "Db5", "Gb5", "Eb5", "Bb5", "F5", "Gb5", "Db5", "Bb5"];
            // pattern.start("@1m");
            stopPatterns();
            bigPattern.interval = "32n";
            bigPattern.start("@1m");
        }, "78m");
    }

    Tone.Transport.schedule(function (time) {
        setTimeout(function () {
            squareWithLFO.triggerRelease();
        }, 150);
        // pattern.stop();
        // pattern.interval = "16n";
        // random([0,1]) ? pattern.values = ["F5", "Bb5", "Ab5"] : pattern.values = ["Eb5", "Gb5"];
        // pattern.start("@1m");
        stopPatterns();
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "81m");

    // randomly pick 1 of 3 choices
    switch (random([0, 1, 2])) {
        case 0:
            console.log("case 0");
            Tone.Transport.schedule(function (time) {
                // pattern.stop();
                // pattern.interval = "16t";
                // pattern.values = ["Gb5", "Bb5", "Ab5", "C6"];
                // pattern.start("@1m");
                stopPatterns();
                sixPattern.start("@1m");
            }, "84m");
            break;
        case 1:
            console.log("case 1");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                Tone.Draw.schedule(function (time) {
                    setColor("grey");
                }, time);
                squareWithLFO.triggerAttack("Db5", time, 0.9);
                squareWithLFO.triggerRelease("@89m");
                squareWithLFO.setNote("Bb4", "+2n + 4n");
                squareWithLFO.setNote("C5", "+1m + 2n");
                squareWithLFO.setNote("Db5", "+2m + 4n");
                squareWithLFO.setNote("Bb4", "+2m + 2n + 4n");
                squareWithLFO.setNote("C5", "+3m + 2n");
                squareWithLFO.setNote("Db5", "+4m + 4n");
            }, "84m");
            break;
        case 2:
            console.log("case 2");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                Tone.Draw.schedule(function (time) {
                    setColor("grey");
                }, time);
                squareWithLFO.triggerAttack("Db5", time, 0.9);
                squareWithLFO.triggerRelease("@89m");
                squareWithLFO.setNote("Eb5", "+4n");
                squareWithLFO.setNote("Bb4", "+2n + 4n");
                squareWithLFO.setNote("C5", "+1m");
                squareWithLFO.setNote("Db5", "+1m + 2n");
                squareWithLFO.setNote("Eb5", "+2m + 4n");
                squareWithLFO.setNote("Bb4", "+2m + 2n + 4n");
                squareWithLFO.setNote("C5", "+3m");
                squareWithLFO.setNote("Db5", "+3m + 2n");
                squareWithLFO.setNote("Eb5", "+4m + 4n");
            }, "84m");
            break;
    }

    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        // pattern.stop();
        // pattern.interval = "16n";
        // random([0,1]) ? pattern.values = ["F5", "Bb5", "Ab5"] : pattern.values = ["Eb5", "Gb5"];
        // pattern.start("@1m");
        stopPatterns();
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "89m");

    Tone.Transport.schedule(function (time) {
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
        if (random([0, 1])) {
            stopPatterns();
            squareWithLFO.triggerAttack("Bb5", time, 0.9);
            squareWithLFO.triggerRelease("@95m");
            squareWithLFO.setNote("C6", "+2m");
            squareWithLFO.setNote("Db6", "+3m + 4n");
        } else {
            stopPatterns();
            squareWithLFO.triggerAttack("Bb5", time, 0.9);
            squareWithLFO.triggerRelease("@95m");
            squareWithLFO.setNote("C6", "+2m");
        }
    }, "91m");

    Tone.Transport.schedule(function (time) {
        switch (random([0, 1, 2])) {
            case 0:
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("@99m");
                squareWithLFO.setNote("C6", "+2m");
                squareWithLFO.setNote("Db6", "+3m + 4n");
                break;
            case 1:
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("@99m");
                squareWithLFO.setNote("C6", "+2m");
                break;
            case 2:
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("@99m");
                squareWithLFO.setNote("Ab5", "+3m + 4n");
                break;
        }
    }, "95m");

    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        // pattern.stop();
        // random([0,1]) ? pattern.values = ["F5", "Bb5", "Ab5"] : pattern.values = ["Eb5", "Gb5"];
        // pattern.start("@1m");
        stopPatterns();
        random([0, 1]) ? motiveA.start("@1m") : motiveB.start("@1m");
        Tone.Draw.schedule(function (time) {
            setColor();
        }, time);
    }, "99m");

    Tone.Transport.schedule(function (time) {
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
        if (random([0, 1])) {
            stopPatterns();
            squareWithLFO.triggerAttack("Bb5", time, 0.9);
            squareWithLFO.triggerRelease("@104m");
            squareWithLFO.setNote("C6", "+2m");
            squareWithLFO.setNote("Db6", "+3m + 4n");
        } else {
            stopPatterns();
            squareWithLFO.triggerAttack("Bb5", time, 0.9);
            squareWithLFO.triggerRelease("@104m");
            squareWithLFO.setNote("C6", "+2m");
        }
    }, "100m");

    switch (random([0, 1, 2])) {
        case 0:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("(@106m) + 2n");
                squareWithLFO.setNote("C6", "+1m + 4n");
                squareWithLFO.setNote("Db6", "+2m");
            }, "104m");
            Tone.Transport.schedule(function (time) {
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("(@109m) + 2n");
                squareWithLFO.setNote("C6", "+1m + 4n");
                squareWithLFO.setNote("Db6", "+2m");
            }, "107m");
            break;
        case 1:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("(@106m) + 2n");
                squareWithLFO.setNote("C6", "+1m + 4n");
            }, "104m");
            Tone.Transport.schedule(function (time) {
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("@109m");
                squareWithLFO.setNote("C6", "+1m + 4n");
                fivePattern.values = ["C6", "Db6", "Bb5", "Eb6"]; // preparing for next section
            }, "107m");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                fivePattern.start("@1m");
                // pattern.stop();
                // pattern.interval = "4n/5";
                // pattern.values = ["C6", "Db6", "Bb5", "Eb6"];
                // pattern.start("@1m");
            }, "109m");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                descending5.start("@4n");
            }, "110m + 2n + 4n");
            break;
        case 2:
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                // pattern.stop();
                // pattern.interval = "16t";
                // pattern.values = ["Gb5", "Bb5", "Ab5", "C6"];
                // pattern.start("@1m");
                stopPatterns();
                sixPattern.start("@1m");
            }, "104m");
            Tone.Transport.schedule(function (time) {
                // it can't set the array fast enough
                // so the first 2 indices are placeholders
                // pattern.values = ["C4", "C4", "Ab5", "Gb5", "F5", "Eb5", "Db5", "C5"];
                stopPatterns();
                descending6.start("@4n");
            }, "110m + 2n + 4n");
            break;
    }

    // this is a prep schedule
    Tone.Transport.schedule(function (time) {
        motiveB.values = ["C6", "E6", "D6", "Bb5", "E6", "D6"];
    }, "111m");

    switch (random([0, 1, 2])) {
        case 0:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("(@122m) + 2n + 4n");
                squareWithLFO.setNote("C6", "+2n + 4n");
                stopPatterns();
            }, "111m");
            Tone.Transport.schedule(function (time) {
                descending32.start("@4n");
            }, "122m + 2n + 4n");
            break;
        case 1:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("@112m");
                squareWithLFO.setNote("C6", "+2n + 4n");
                fivePattern.values = ["C6", "Db6", "Bb5", "Eb6", "C6", "Db6", "Bb5", "Eb6"]; // preparing
            }, "111m");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                fivePattern.start("@1m");
            }, "112m");
            Tone.Transport.schedule(function (time) {
                fivePattern.values[1] = "D6";
                fivePattern.values[5] = "D6";
                fivePattern.values[7] = "F6";
            }, "116m");
            Tone.Transport.schedule(function (time) {
                // ["C6", "D6", "Bb5", "Eb6", "C6", "D6", "Bb5", "F6"]
                fivePattern.values.splice(7);
                // ["C6", "D6", "Bb5", "Eb6", "C6", "D6", "Bb5"]
            }, "118m");
            Tone.Transport.schedule(function (time) {
                fivePattern.values.splice(6);
                // ["C6", "D6", "Bb5", "Eb6", "C6", "D6"]
                fivePattern.values.splice(2);
                // ["C6", "D6", "Eb6", "C6", "D6"]
            }, "118m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                fivePattern.values.splice(2);
                // ["C6", "D6", "C6", "D6"]
            }, "119m + 4n"); // do I want it on beat 2 or 3?
            Tone.Transport.schedule(function (time) {
                fivePattern.stop();
                descending5.values = ["C6", "Bb5", "Ab5", "Gb5", "F5", "Eb5", "Db5", "C5", "Bb4", "Ab5"]; // preparing
                lfo.frequency.value = "4n/5";
                squareWithLFO.triggerAttack("C6", time, 0.9);
                squareWithLFO.triggerRelease("(@122m) + 2n");
            }, "119m + 2n + 4n");
            Tone.Transport.scheduleOnce(function (time) {
                lfo.unsync();
                lfo.frequency.value = "16n";
                lfo.phase = 0;
                lfo.sync();
            }, "120m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                fivePattern.values = ["C6", "D6", "Bb5", "E6", "C6", "D6", "Bb5", "Gb6"]; // preparing
                descending5.start("@4n");
            }, "122m + 2n");
            break;
        case 2:
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                sixPattern.values = ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "C6"];
                stopPatterns();
                sixPattern.start("@1m");
                // pattern.interval = "16t";
                // pattern.values = ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "C6"];
                // pattern.start("@1m");
            }, "111m");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                sixPattern.values[7] = "D6";
            }, "116m");
            Tone.Transport.schedule(function (time) {
                // ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "D6"]
                sixPattern.values.splice(7);
                // ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5"]
            }, "118m");
            Tone.Transport.schedule(function (time) {
                sixPattern.values = ["Bb5", "Ab5", "C6", "Bb5", "Ab5"]; // this is the only thing that works
            }, "118m + 2n");
            Tone.Transport.schedule(function (time) {
                sixPattern.values.splice(2);
                // ["Bb5", "Ab5", "Bb5", "Ab5"]
            }, "119m");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                sixPattern.values = ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "D6"]; // preparing
                descending6.values = ["C6", "Bb5", "Ab5", "Gb5", "F5", "Eb5"];
                lfo.frequency.value = "16t";
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                squareWithLFO.triggerRelease("(@122m) + 4n");
            }, "120m");
            Tone.Transport.scheduleOnce(function (time) {
                lfo.unsync();
                lfo.frequency.value = "16n";
                lfo.phase = 0;
                lfo.sync();
            }, "121m + 4n");
            Tone.Transport.schedule(function (time) {
                descending6.start("@4n");
            }, "122m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                descending6.stop();
            }, "123m");
            break;
    }

    // this is a prep schedule
    Tone.Transport.scheduleOnce(function (time) {
        fivePattern.values = ["C6", "D6", "Bb5", "E6", "C6", "D6", "Bb5", "Gb6"];
        sixPattern.values = ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "D6"];
    }, "122m + 2n + 4n");

    switch (random([0, 1, 2])) {
        case 0:
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                motiveB.start("@1m");
            }, "123m");
            Tone.Transport.schedule(function (time) {
                motiveB.values = ["C6", "D6", "Bb5", "D6"];
            }, "126m + 2n");
            Tone.Transport.schedule(function (time) {
                motiveB.values.splice(2);
                // ["C6", "D6", "D6"]
            }, "127m + 4n");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                descending32.values = ["C6", "Bb5", "Ab5", "Gb5", "E5", "D5", "C5", "Bb4"]; // preparing
                squareWithLFO.triggerAttack("C6", time, 0.9);
                squareWithLFO.triggerRelease("(@129m) + 2n + 4n");
            }, "127m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                descending32.start("@4n");
            }, "129m + 2n + 4n");
            break;
        case 1:
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                fivePattern.start("@1m");
            }, "123m");
            Tone.Transport.schedule(function (time) {
                // ["C6", "D6", "Bb5", "E6", "C6", "D6", "Bb5", "Gb6"]
                fivePattern.values.splice(-1);
                // ["C6", "D6", "Bb5", "E6", "C6", "D6", "Bb5"]
            }, "125m");
            Tone.Transport.schedule(function (time) {
                fivePattern.values = ["C6", "D6", "E6", "C6", "D6"];
            }, "125m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                fivePattern.values = ["C6", "D6"];
            }, "126m + 2n");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                descending5.values = ["C6", "Bb5", "Ab5", "Gb5", "E5", "D5", "C5", "Bb4", "Ab5", "Gb5"]; // preparing
                squareWithLFO.triggerAttack("C6", time, 0.9);
                squareWithLFO.triggerRelease("(@129) + 2n");
            }, "126m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                descending5.start("@4n");
            }, "129m + 2n");
            break;
        case 2:
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                stopPatterns();
                sixPattern.start("@1m");
            }, "123m");
            Tone.Transport.schedule(function (time) {
                // ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5", "D6"]
                sixPattern.values.splice(-1);
                // ["Gb5", "Bb5", "Ab5", "C6", "Gb5", "Bb5", "Ab5"]
            }, "125m");
            Tone.Transport.schedule(function (time) {
                sixPattern.values = ["Bb5", "Ab5", "C6", "Bb5", "Ab5"];
            }, "125m + 2n"); // 124m + 2n
            Tone.Transport.schedule(function (time) {
                sixPattern.values = ["Bb5", "C6"];
            }, "126m");
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                descending6.values = ["C6", "Bb5", "Ab5", "Gb5", "E5", "D5"];
                squareWithLFO.triggerAttack("C6", time, 0.9);
                squareWithLFO.triggerRelease("(@129m) + 4n");
            }, "127m");
            Tone.Transport.schedule(function (time) {
                setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
                descending6.start("@4n");
            }, "129m + 2n + 4n");
            Tone.Transport.schedule(function (time) {
                // stopPatterns();
            }, "130m");
            break;
    }

    Tone.Transport.scheduleOnce(function (time) {
        // preparing
        bigPattern.interval = "32n";
        bigPattern.values = ["Bb5", "D6", "C6", "F6", "Ab5", "D6", "Bb5", "F6", "C6", "D6", "Ab5", "F6"];
        fivePattern.values = ["Eb6", "F6", "D6", "Gb6", "Eb6", "F6", "D6", "Ab6"];
        sixPattern.values = ["Ab5", "Bb5", "C6", "D6", "Eb6"];
    }, "128m");

    switch (random([0, 1, 2])) {
        case 0:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                bigPattern.start("@4n");
            }, "130m");
            break;
        case 1:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                fivePattern.start("@4n");
            }, "130m");
            break;
        case 2:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                sixPattern.start("@4n");
            }, "130m");
            break;
    }

    // slow down playback rate
    Tone.Transport.schedule(function (time) {
        console.log("ritardando");
        // Tone.Transport.bpm.linearRampToValue(50, "4m");
        playbackRate(122 / 140.0);
    }, "133m");
    Tone.Transport.schedule(function (time) {
        playbackRate(104 / 140.0);
    }, "134m");
    Tone.Transport.schedule(function (time) {
        playbackRate(86 / 140.0);
    }, "135m");
    Tone.Transport.schedule(function (time) {
        playbackRate(68 / 140.0);
    }, "136m");
    Tone.Transport.scheduleOnce(function (time) {
        playbackRate(50 / 140.0);
    }, "137m");

    Tone.Transport.scheduleOnce(function (time) {
        console.log("probabilities!!");
        bigPattern.probability = 0.75;
        fivePattern.probability = 0.75;
        sixPattern.probability = 0.75;
    }, "139m");
    Tone.Transport.scheduleOnce(function (time) {
        console.log("probabilities!!");
        bigPattern.probability = 0.5;
        fivePattern.probability = 0.5;
        sixPattern.probability = 0.5;
    }, "141m");
    Tone.Transport.scheduleOnce(function (time) {
        console.log("probabilities!!");
        bigPattern.probability = 0.25;
        fivePattern.probability = 0.25;
        sixPattern.probability = 0.25;
        // preparing
        lfo.type = "sine";
        lfo.unsync();
        lfo.frequency.value = "4n";
        lfo.phase = 0;
        lfo.sync();
    }, "143m");
    Tone.Transport.scheduleOnce(function (time) {
        console.log("measure 144");
        stopPatterns();
        Tone.Draw.schedule(function (time) {
            setColor("grey");
        }, time);
        playbackRate(1);

        bigPattern.probability = 1;
        fivePattern.probability = 1;
        sixPattern.probability = 1;
    }, "145m");

    /*************************************************************************************************************************/
    // middle section, yay!!!
    /*************************************************************************************************************************/
    if (random(100) < 25) { // 25% random(100) < 25
        Tone.Transport.schedule(function (time) {
            stopPatterns();
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("@183m");
            Tone.Draw.schedule(function (time) {
                startDraw();
            }, time);
        }, "145m");
        // what is the purpose of this line?
        // I think this is in case phones got hung up on some previous code changing the note
        Tone.Transport.scheduleOnce(function (time) {
            squareWithLFO.setNote("D6", time);
        }, "147m");
    } else {
        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Eb3", time, 0.9);
            squareSynth.triggerRelease("@151m");
            Tone.Draw.schedule(function (time) {
                startDraw();
            }, time);
        }, "148m + 4n");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("F3", time);
            }, "149m");
        }

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Bb3", time, 0.9);
            squareSynth.triggerRelease("@157m");
        }, "152m");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("C4", time);
            }, "152m + 2n");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Ab3", time);
            }, "155m + 4n");
        }

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Eb3", time, 0.9);
            squareSynth.triggerRelease("@164m");
        }, "158m + 2n");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Bb3", time);
            }, "160m + 2n");
        } else {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("F3", time);
            }, "159m");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("C4", time);
            }, "162m");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Bb3", time);
            }, "163m + 2n");
        }

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("D4", time, 0.9);
            squareSynth.triggerRelease("@168m");
        }, "165m");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Eb4", time);
            }, "165m + 2n");
        }

        Tone.Transport.schedule(function (time) {
            squareSynth.setNote("C4", time);
        }, "167m");

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Eb3", time, 0.9);
            squareSynth.triggerRelease("@170m");
        }, "168m + 4n");
        Tone.Transport.schedule(function (time) {
            squareSynth.setNote("D4", time);
        }, "169m");
        if (random(100) < 50) squareSynth.setNote("Eb4", "169m + 4n");

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("D4", time, 0.9);
            squareSynth.triggerRelease("@171m + 2n + 4n");
        }, "170m + 2n");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("C4", time);
            }, "170m + 2n + 4n");
        }

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Bb3", time, 0.9);
            squareSynth.triggerRelease("@177m");
        }, "173m");

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Bb3", time, 0.9);
            squareSynth.triggerRelease("@183m");
        }, "177m");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("F3", time);
            }, "180m + 2n");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("D4", time);
            }, "182m");
        } else {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Eb3", time);
            }, "177m + 2n");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("D4", time);
            }, "179m");
        }
    }

    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "183m");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "183m + 2n");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "184m");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "184m + 2n");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "185m");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "185m + 2n");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "186m");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "186m + 2n");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "187m");
    }
    if (random(100) < 50) {
        Tone.Transport.schedule(function (time) {
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("+2n");
        }, "187m + 2n");
    }

    if (random(100) < 25) { // 25%
        Tone.Transport.schedule(function (time) {
            stopPatterns();
            squareWithLFO.triggerAttack("D6", time, 0.3);
            squareWithLFO.triggerRelease("@199m + 2n + 4n");
        }, "188m");
    } else {
        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Bb3", time, 0.9);
            squareSynth.triggerRelease("@192m");
        }, "189m");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("F4", time);
            }, "190m + 8n");
        } else {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("D4", time);
            }, "189m + 4n + 8n");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Ab3", time);
            }, "191m");
        }
        // switch (random([0, 1, 2])) {
        //     case 0:
        //         Tone.Transport.schedule(function (time) {
        //             squareSynth.setNote("F4", time);
        //         }, "190m + 8n");
        //         break;
        //     case 1:
        //         Tone.Transport.schedule(function (time) {
        //             squareSynth.setNote("D4", time);
        //         }, "189m + 4n + 8n");
        //         Tone.Transport.schedule(function (time) {
        //             squareSynth.setNote("Ab3", time);
        //         }, "191m");
        //         break;
        //     case 2:
        //         Tone.Transport.schedule(function (time) {
        //             squareSynth.setNote("C4", time);
        //         }, "189m + 2n + 4n");
        //         Tone.Transport.schedule(function (time) {
        //             squareSynth.setNote("F3", time);
        //         }, "191m + 2n");
        //         break;
        // }

        Tone.Transport.schedule(function (time) {
            squareSynth.triggerAttack("Bb3", time, 0.9);
            squareSynth.triggerRelease("@200m + 2n + 4n");
        }, "193m");
        if (random(100) < 50) {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("F4", time);
            }, "195m");
        } else {
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("D4", time);
            }, "193m + 2n");
            Tone.Transport.schedule(function (time) {
                squareSynth.setNote("Ab3", time);
            }, "196m");
        }
    }

    Tone.Transport.schedule(function (time) {

        console.log("measure 201");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        stopPatterns();
        Tone.Draw.schedule(function (time) {
            stopDraw();
        }, time);
        // playbackRate(68/140.0);
        playbackRate(1);
        squareSynth.triggerAttackRelease("Bb3", "8n", time, 0.9);
        patternWalk.probability = 0.75;
        patternWalk.playbackRate = 68 / 140.0;
        patternWalk.start("+4n");
        // bigPattern.start("+4n");
        // fivePattern.start("+4n");
        // sixPattern.start("+4n");

    }, "201m"); // 146m

    Tone.Transport.schedule(function (time) {
        // Tone.Transport.bpm.setValueAtTime(86, time);
        console.log("measure 214");
        stopPatterns();
        squareSynth.triggerAttackRelease("C4", "8n", time, 0.9);
        // ["E4", "Gb4", "Ab4", "Bb4", "C5", "D5", "E5"]
        // TODO:
        // patternWalk.values = ["C5", "D5", "E5", "Gb5", "Ab5"];
        patternWalk.values = ["C5", "E5", "D5", "Ab5", "Gb5"];
        // patternWalk.probability = 0.5;
        patternWalk.playbackRate = 86 / 140.0;

        // patternWalk.values = ["C5", "C5", "C5", "C5", "C5", "C5", "C5"];
        // ["E4", "Gb4", "Ab4", "Bb4", "C5", "D5", "E5"]
        // patternWalk.values[0] = "E4";
        // patternWalk.values[6] = "E5";
        patternWalk.start("+4n");
    }, "214m"); // 159m

    Tone.Transport.schedule(function (time) {
        // Tone.Transport.bpm.setValueAtTime(104, time);
        console.log("measure 222");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        stopPatterns();
        squareSynth.triggerAttackRelease("D4", "8n", time, 0.9);
        // patternWalk.values = ["D5", "Eb5", "F5", "Gb5", "Ab5", "Bb5", "C6"];
        patternWalk.values = ["C6", "Bb5", "Ab5", "Gb5", "F5", "Eb5", "D5"];
        // patternWalk.probability = 0.75;
        patternWalk.playbackRate = 104 / 140.0;

        patternWalk.start("+4n");
    }, "222m"); // 167m
    Tone.Transport.schedule(function (time) {
        console.log("measure 227");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        stopPatterns();
        squareSynth.triggerAttackRelease("Eb4", "8n", time, 0.9);
        // patternWalk.values = ["Eb5", "F5", "Bb5", "C6", "Db6", "Eb6"];
        patternWalk.values = ["Eb6", "Db6", "C6", "Bb5", "F5", "Eb5"];
        patternWalk.probability = 0.9;
        patternWalk.playbackRate = 122 / 140.0;

        patternWalk.start("+4n");

        // preparing for next section
        motiveB.values = ["Eb6", "Db6", "C6", "Bb5", "F5", "Eb5"];
        fivePattern.values = ["C6", "Db6", "Bb5", "Eb6"];
        sixPattern.values = ["F5", "Bb5", "Ab5", "Db6", "C6"];
    }, "227m"); // 172m
    Tone.Transport.schedule(function (time) {
        console.log("measure 230");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        patternWalk.stop();

        switch (random([0, 1, 2])) {
            case 0:
                motiveB.start("@4n");
                break;
            case 1:
                fivePattern.start("@4n");
                break;
            case 2:
                sixPattern.start("@4n");
                break;
        }
    }, "230m"); // 175m
    Tone.Transport.schedule(function (time) {
        console.log("measure 233");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        stopPatterns();
        // preparing
        motiveA.values = ["Bb4", "Gb5"];
        motiveB.values = ["F5", "Bb5", "Ab5"];
    }, "233m");
    Tone.Transport.scheduleOnce(function (time) {
        // preparing
        lfo.type = "square";
        lfo.unsync();
        lfo.frequency.value = "16n";
        lfo.phase = 0;
        lfo.sync();
        switch (random([0, 1, 2])) {
            case 0:
                motiveA.start("@4n");
                break;
            case 1:
                motiveB.start("@4n");
                break;
            case 2:
                motiveC.start("@4n");
                break;
        }
    }, "235m");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "C5";
    }, "235m + 2n");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "Bb4";
    }, "236m");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "C5";
    }, "236m + 2n");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "Db5";
    }, "236m + 2n + 4n");
    Tone.Transport.schedule(function (time) {
        motiveA.values[0] = "Eb5";
    }, "237m + 4n");

    switch (random([0, 1, 2])) {
        case 0:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Gb5", time, 0.9);
                squareWithLFO.triggerRelease("@244m + 8n");
                // preparing
                motiveB.values = ["Eb6", "Db6", "C6", "Bb5", "F5", "Eb5"];
            }, "239m");
            Tone.Transport.schedule(function (time) {
                motiveB.start("@4n");
            }, "244m + 8n");
            break;
        case 1:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("F5", time, 0.9);
                squareWithLFO.triggerRelease("@249m");
                // preparing
                fivePattern.values = ["C6", "Ab5", "Bb5", "Gb5"];
                motiveB.values = ["Eb6", "Db6", "C6", "Bb5", "F5", "Eb5"];
            }, "239m");
            Tone.Transport.schedule(function (time) {
                fivePattern.start("@4n");
            }, "249m");
            break;
        case 2:
            Tone.Transport.schedule(function (time) {
                stopPatterns();
                squareWithLFO.triggerAttack("Ab5", time, 0.9);
                squareWithLFO.triggerRelease("@241");
                // preparing
                motiveC.values = ["Db6", "Bb5", "Ab5", "Gb5", "F5"];
                motiveB.values = ["Eb6", "Db6", "C6", "Bb5", "F5", "Eb5"];
            }, "239m");
            Tone.Transport.schedule(function (time) {
                motiveC.start("@4n");
            }, "241m");
            break;
    }

    // everyone in unison (well hopefully but probably won't happen)
    Tone.Transport.schedule(function (time) {
        console.log("UNISON!!");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        fivePattern.stop();
        motiveC.stop();
        // preparing
        motiveC.values = ["Bb5", "Ab5", "F5", "Eb5", "C5", "Bb4"];
        motiveB.start("@4n");
    }, "252m");
    Tone.Transport.schedule(function (time) {
        console.log("measure 260m");
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        if (random(100) < 50) {
            console.log("split");
            motiveB.stop();
            motiveC.start("@4n");
        }
    }, "261m");
    Tone.Transport.schedule(function (time) {
        if (random(100) < 20) {
            stopPatterns();
            squareWithLFO.triggerAttack("Eb6", time, 0.9);
            squareWithLFO.triggerRelease("@270m");
        }
    }, "264m");
    Tone.Transport.schedule(function (time) {
        if (random(100) < 40) {
            stopPatterns();
            squareWithLFO.triggerAttack("Eb6", time, 0.9);
            squareWithLFO.triggerRelease("@270m");
        }
    }, "265m");
    Tone.Transport.schedule(function (time) {
        if (random(100) < 60) {
            stopPatterns();
            squareWithLFO.triggerAttack("Eb6", time, 0.9);
            squareWithLFO.triggerRelease("@270m");
        }
    }, "266m");
    Tone.Transport.schedule(function (time) {
        if (random(100) < 80) {
            stopPatterns();
            squareWithLFO.triggerAttack("Eb6", time, 0.9);
            squareWithLFO.triggerRelease("@270m");
        }
    }, "267m");
    Tone.Transport.schedule(function (time) {
        stopPatterns();
        squareWithLFO.triggerAttack("Eb6", time, 0.9);
        squareWithLFO.triggerRelease("@270m");

        // preparing
        motiveB.interval = "32n";
        fivePattern.values = ["C6", "Ab5", "Bb5", "Gb5", "Eb6", "Ab5", "Bb5", "Gb5"];
        sixPattern.values = ["F5", "Bb5", "Ab5", "Db6", "C6", "F5", "Bb5", "Ab5", "F6", "C6"];
    }, "268m");
    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);

        switch (random([0, 1, 2])) {
            case 0:
                motiveB.start("@4n");
                break;
            case 1:
                fivePattern.start("@4n");
                break;
            case 2:
                sixPattern.start("@4n");
                break;
        }
    }, "270m");

    Tone.Transport.schedule(function (time) {
        stopPatterns();
        squareWithLFO.triggerAttack("Bb5", time, 0.9);
        squareWithLFO.triggerRelease("@275m");

        // preparing
        motiveB.values = ["Eb4", "Db4", "C4", "Bb3", "F3", "Eb3"];
        fivePattern.values = ["C4", "Ab3", "Bb3", "Gb3", "Eb4", "Ab3", "Bb3", "Gb3"];
        sixPattern.values = ["F3", "Bb3", "Ab3", "Db4", "C4", "F3", "Bb3", "Ab3", "F4", "C4"];
    }, "273m");
    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        switch (random([0, 1, 2])) {
            case 0:
                motiveB.start("@4n");
                break;
            case 1:
                fivePattern.start("@4n");
                break;
            case 2:
                sixPattern.start("@4n");
                break;
        }
    }, "275m");

    Tone.Transport.schedule(function (time) {
        stopPatterns();
        squareWithLFO.triggerAttack("F5", time, 0.9);
        squareWithLFO.triggerRelease("@280m");

        // preparing
        switch (random([0, 1, 2])) {
            case 0:
                motiveD.interval = "32n";
                break;
            case 1:
                motiveD.interval = "4n/5";
                break;
            case 2:
                motiveD.interval = "16t";
                break;
        }
        motiveD.values = ["Eb6", "F6", "Gb6", "Ab6", "Bb6", "C7", "Db7", "Eb7"];
        // ["Eb5", "F5", "Gb5", "Ab5", "Bb5", "C6", "Db6", "Eb6", "F6", "Gb6", "Ab6", "Bb6", "C7", "Db7", "Eb7", "F7", "Gb7"]
    }, "278m");
    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        motiveD.start("@4n");
    }, "280m");

    Tone.Transport.schedule(function (time) {
        stopPatterns();
        var r = random([0, 1, 2]);
        console.log("r is: " + r);
        switch (r) {
            case 0:
                squareWithLFO.triggerAttack("Bb4", time, 0.9);
                squareWithLFO.triggerRelease("@285m");
                squareWithLFO.triggerAttack("Bb4", "@285m+4n", 0.9);
                squareWithLFO.triggerRelease("@285m+2n+8n");
                squareWithLFO.triggerAttack("Bb4", "@286m", 0.9);
                squareWithLFO.triggerRelease("@286m+4n");
                squareWithLFO.triggerAttack("Bb4", "@286m+2n", 0.9);
                squareWithLFO.triggerRelease("@287m");
                break;
            case 1:
                squareWithLFO.triggerAttack("Bb4", time, 0.9);
                squareWithLFO.triggerRelease("@285m");
                squareWithLFO.setNote("C5", "+4n");
                squareWithLFO.triggerAttack("C5", "@285m+4n", 0.9);
                squareWithLFO.triggerRelease("@285m+2n+8n");
                squareWithLFO.triggerAttack("C5", "@286m", 0.9);
                squareWithLFO.triggerRelease("@286m+4n");
                squareWithLFO.triggerAttack("C5", "@286m+2n", 0.9);
                squareWithLFO.triggerRelease("@287m");
                break;
            case 2:
                squareWithLFO.triggerAttack("Bb4", time, 0.9);
                squareWithLFO.triggerRelease("@285m");
                squareWithLFO.setNote("Db5", "+2n");
                squareWithLFO.triggerAttack("Db5", "@285m+4n", 0.9);
                squareWithLFO.triggerRelease("@285m+2n+8n");
                squareWithLFO.triggerAttack("Db5", "@286m", 0.9);
                squareWithLFO.triggerRelease("@286m+4n");
                squareWithLFO.triggerAttack("Db5", "@286m+2n", 0.9);
                squareWithLFO.triggerRelease("@287m");
                break;
        }
    }, "283m");
    Tone.Transport.schedule(function (time) {
        switch (random([0, 1, 2, 3])) {
            case 0:
                squareWithLFO.triggerAttack("Bb4", time, 0.9);
                break;
            case 1:
                squareWithLFO.triggerAttack("F5", time, 0.9);
                break;
            case 2:
                squareWithLFO.triggerAttack("Bb5", time, 0.9);
                break;
            case 3:
                squareWithLFO.triggerAttack("Eb6", time, 0.9);
                break;
        }
        squareWithLFO.triggerRelease("@289m");
    }, "287m + 4n");

    Tone.Transport.schedule(function (time) {
        setTimeout(function () { squareWithLFO.triggerRelease(); }, 150);
        switch (random([0, 1, 2])) {
            case 0:
                motiveB.start("@4n");
                break;
            case 1:
                fivePattern.start("@4n");
                break;
            case 2:
                sixPattern.start("@4n");
                break;
        }
    }, "289m");

    Tone.Transport.scheduleRepeat(function (time) {
        console.log("transpose");
        var arrays = [motiveB.values, fivePattern.values, sixPattern.values];

        for (var i = 0; i < arrays.length; i++) {
            var r = Math.floor(random(arrays[i].length));
            var n = arrays[i][r];
            arrays[i][r] = Tone.Frequency(n).transpose(12);
        }
    }, "2n", "292m");

    Tone.Transport.schedule(function (time) {
        console.log("STOP!!");
        Tone.Draw.schedule(function (time) {
            setColor("black");
        }, time);
        Tone.Transport.stop(time+0.1);
        // Tone.Master.volume.value = -500;
        // Tone.Master.volume.linearRampToValue(-500, "4m");
    }, "313m");
}
