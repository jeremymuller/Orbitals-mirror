//
// script.js
// by Jeremy Muller
// This is used to control the performer's clock
//

var startButton, text, wrapper;

// var clock;
var start = false;
var mm_offset = 0;
var noSleep = new NoSleep();
var metIndex = 0; // I have to use this because transport time isn't always accurate enough
var clickOn = false;
// var pubnub2;

var impulse = new Tone.NoiseSynth({
    "noise": {
        "type": "white"
    },
    "envelope": {
        "attack": 0.005,
        "decay": 0.1,
        "sustain": 0,
        "release": 0.1
    }
});

var filter = new Tone.Filter({
    "type": "bandpass",
    "frequency": 1000,
    "Q": 100,
    "gain": 0
}).toMaster();

var boost = new Tone.Multiply(10);
impulse.chain(filter, boost, Tone.Master);

var metronome = new Tone.Loop(function (time) {
    if (clickOn) {
        if (metIndex == 0) filter.frequency.value = 3000;
        else filter.frequency.value = 2000;
        impulse.triggerAttackRelease(0.1, time, 0.9);
    }
    metIndex = (metIndex + 1) % 4;
}, "4n");

function draw() {
    if (start) requestAnimationFrame(draw);

    // document.getElementsByTagName("p")[0].innerHTML = "audio context: " + Tone.now().toFixed(3);
    // document.querySelector('p').textContent = Tone.now().toFixed(3);


    // document.querySelector('span').textContent = "bars: " + Tone.Time(transport).toBarsBeatsSixteenths();

    var transport = Tone.Transport.seconds.toFixed(3);
    var time = Tone.Time(transport).toBarsBeatsSixteenths();
    var index1 = time.indexOf(':');
    var index2 = time.indexOf(':', index1 + 1);
    var bars = time.slice(0, index1);
    var beat = time.slice(index1 + 1, index2);

    var b = parseInt(bars);
    // document.getElementById("timer").innerHTML = ++b;
    document.getElementById("timer").innerHTML = b;
    // if (b < 100) {
    //     if (b < 10) {
    //         document.getElementById("timer").innerHTML = "00" + bars + beat;
    //     } else {
    //         document.getElementById("timer").innerHTML = "0" + bars + beat;
    //     }
    // } else {
    //     document.getElementById("timer").innerHTML = "" + bars + beat;
    // }

    var beats = document.getElementsByClassName("beat");
    for (var i = 0; i < beats.length; i++) {
        beats[i].style.opacity = 0;
    }
    // for (var b in beats) {
    //     // b.style.opacity = 0;
    //     // console.log("b: " + b);
    // }
    document.getElementById(beat).style.opacity = 1;
}

function buttonAction() {
    // wrapper.remove();
    wrapper.style.display = "none";
    document.getElementById("timer").style.display = "inline";
    document.getElementById("resetButton").style.display = "inline";

    noSleep.enable();

    // Tone.Transport.start(Tone.now(), mm_offset);
    start = true;
    publishIt(0+mm_offset);
    draw();
    conductor();
    metronome.start();
}

function init() {
    // create button
    startButton = document.createElement("button");
    startButton.onclick = buttonAction;
    text = document.createTextNode("Start");
    startButton.appendChild(text);
    startButton.className = "splash";
    startButton.id = "startButton";
    wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    // wrapper.id = "container";
    wrapper.appendChild(startButton);
    document.body.appendChild(wrapper);

    StartAudioContext(Tone.context);
    Tone.Transport.bpm.value = 140;

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
        withPresence: false
    });
}

function reset() {
    start = false;
    publishIt(0);
    metronome.stop();
    metIndex = 0;
    Tone.Transport.stop();
    Tone.Transport.bpm.value = 140;
    document.getElementById("resetButton").style.display = "none";
    wrapper.style.display = "inline";
    setTimeout(function () {
        document.getElementById("timer").innerHTML = "0";
        var beats = document.getElementsByClassName("beat");
        for (var i = 0; i < beats.length; i++) {
            beats[i].style.opacity = 0;
        }
    }, 100);
}

function conductor() {
    // Tone.Transport.scheduleOnce(function (time) {
    //     // publishIt(Tone.TransportTime().toBarsBeatsSixteenths());
    //     var transport = Tone.Transport.seconds;
    //     var mm = Tone.Time(transport).toBarsBeatsSixteenths();
    //     console.log("measure 1: " + mm);
    //     console.log("measure 1 seconds: " + Tone.Transport.seconds);
    //     // publishIt(mm);
    //     // publishIt(mm);
    //     publishIt(Tone.Transport.seconds);
    // }, "0m");
    // Tone.Transport.schedule(function (time) {
    //     // publishIt(Tone.TransportTime().toBarsBeatsSixteenths());
    //     var transport = Tone.Transport.seconds;
    //     var mm = Tone.Time(transport).toBarsBeatsSixteenths();
    //     console.log("measure 2: " + mm);
    //     publishIt(mm);
    // }, "2m");
    Tone.Transport.schedule(function (time) {
        publishIt(Tone.Transport.seconds);
        // publishIt(Tone.TransportTime().toBarsBeatsSixteenths());
    }, "13:3:2"); // measure 13, 4th beat, 8th note

    // TODO!!!!
    Tone.Transport.schedule(function (time) {
        console.log("used to be AJAX");
        console.log("now pubnub");
        publishIt(Tone.Transport.seconds);
    }, "200m"); // 200m
    Tone.Transport.scheduleOnce(function (time) {
        console.log("STOP!!");
        Tone.Transport.stop();
        start = false;
        publishIt(0);
    }, "313m");
}

function inputChanged() {
    var v = document.getElementsByName("mm_num")[0].value;
    if (v == "") v = '0';
    mm_offset = Tone.Time(v+"m").toSeconds();
    console.log("seconds: " + mm_offset);
    document.getElementById("timer").innerHTML = v;
}

function toggleClick() {
    clickOn = document.getElementById("beatClick").checked;
}

function publishIt(time) {

    // time test
    pubnub.time(function (status, response) {
        if (status.error) {
            // handle error if something went wrong based on the status object
        } else {
            console.log(response.timetoken);
        }
    });

    pubnub.publish({
        message: {
            // "number" : Math.floor(Math.random() * 360)
            "start": start,
            "time": time
        },
        channel: 'JeremyMuller_Orbitals',
        storeInHistory: false
        },
        function (status, response) {
            if (status.error) {
                // handle error
                console.log(status)
            } else {
                // console.log("message published w/ server response: ", response);
                // console.log("message Published w/ timetoken", response.timetoken);
                console.log(response.timetoken);
            }
    });

    // pubnub.hereNow({
    //     channels: ['JeremyMuller_Orbitals'],
    //     includeUUIDs: true
    // },
    // function(status, response) {
    //     console.log(response);
    // });
}

function handleMessage(m) {
    // TODO
    console.log("time: " + m.message['time']);
    var mm = m.message['time'];
    // Tone.Transport.start(Tone.now(), mm);

    if (Tone.Transport.state == "stopped") {
        Tone.Transport.start(Tone.now(), mm);
    } else {
        Tone.Transport.pause();
        Tone.Transport.start("+0.1", mm + 0.1);
        console.log("transport was paused and restarted");
    }
}

window.addEventListener("load", init);
