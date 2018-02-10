var themeBaseball;
var muteButton;
var status1Audio;
var status2Audio;
var status3Audio;
var status4Audio;
var status5Audio;
var status6Audio;
var animationQueue = [];
var animationPlaying = false;
var serviceMethod;
var preloadPromise = $.Deferred();
var createPromise = $.Deferred();
var loadPromise = $.Deferred();
var playAudio;
var ball;
var ballPaths = {
    0: {
        x: [843, 619, 408, 445],
        y: [0, 76, 48, 0],
        angle: [0, -320, 170]
    },
    1: {
        x: [843, 696, 724],
        y: [192, 236, 273],
        angle: [0, -90]
    },
    2: {
        x: [0, 102],
        y: [143, 273],
        angle: [-90]
    }
};
var ballPathIndex = 0;
var ballRollInterval;

window.PhaserGlobal = {
    hideBanner: true
};

function preload() {
    /* Load assets needed to get the theme up and running */
    themeBaseball.stage.backgroundColor = "#fff";
    themeBaseball.load.image("background", "assets/images/background.jpg");
    themeBaseball.load.spritesheet("title", "assets/images/title.png", 491, 106, 12);
    themeBaseball.load.spritesheet("bat", "assets/images/bat.png", 745, 70, 5);
    themeBaseball.load.spritesheet("ball", "assets/images/baseball.png", 43, 43, 9);
    themeBaseball.load.spritesheet("mute_button", "../common/images/mute.png", 35, 34, 3);
    themeBaseball.load.audio("status_1", ["assets/audio/status_1.mp3", "assets/audio/status_1.ogg"]);
    preloadPromise.resolve();
}

function loadRemainingAssets() {
    /* Load everything else */
    themeBaseball.load.audio("status_2", ["assets/audio/status_2.mp3", "assets/audio/status_2.ogg"]);
    themeBaseball.load.audio("status_3", ["assets/audio/status_3.mp3", "assets/audio/status_3.ogg"]);
    themeBaseball.load.audio("status_4", ["assets/audio/status_4.mp3", "assets/audio/status_4.ogg"]);
    themeBaseball.load.audio("status_5", ["assets/audio/status_5.mp3", "assets/audio/status_5.ogg"]);
    themeBaseball.load.audio("status_6", ["assets/audio/status_6.mp3", "assets/audio/status_6.ogg"]);

    themeBaseball.load.start();

    themeBaseball.load.onLoadComplete.add(function () {
        status2Audio = themeBaseball.add.audio("status_2");
        status3Audio = themeBaseball.add.audio("status_3");
        status4Audio = themeBaseball.add.audio("status_4");
        status5Audio = themeBaseball.add.audio("status_5");
        status6Audio = themeBaseball.add.audio("status_6");
        loadPromise.resolve();
    });
}

function checkQueue() {
    function stage2() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (playAudio) {
                status2Audio.play();
                status2Audio.onStop.add(soundPromise.resolve, this);
            } else {
                soundPromise.resolve();
            }
        }).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage3() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (playAudio) {
                status3Audio.play();
                status3Audio.onStop.add(soundPromise.resolve, this);
            } else {
                soundPromise.resolve();
            }
        }).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage4() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (playAudio) {
                status4Audio.play();
                status4Audio.onStop.add(soundPromise.resolve, this);
            } else {
                soundPromise.resolve();
            }
        }).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage5() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (playAudio) {
                status5Audio.play();
                status5Audio.onStop.add(soundPromise.resolve, this);
            } else {
                soundPromise.resolve();
            }
        }).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage6() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (playAudio) {
                status6Audio.play();
                status6Audio.onStop.add(soundPromise.resolve, this);
            } else {
                soundPromise.resolve();
            }
        }).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    /* Just make sure everything is done then start doing stuff */
    $.when(preloadPromise, createPromise, loadPromise).then(function () {
        if (animationQueue.length >= 1 && !animationPlaying) {
            switch (animationQueue[0]) {
                case "2_pending":
                    stage2();
                    break;
                case "3_pending":
                    stage3();
                    break;
                case "4_pending":
                    stage4();
                    break;
                case "5_pending":
                    stage5();
                    break;
                case "5_complete":
                    if (serviceMethod === "DELIVERY") {
                        stage5();
                    } else {
                        stage6();
                    }
                    break;
                default:
                    animationQueue.shift();
                    checkQueue();
            }
        }
    });
}

function addMuteButtonEvents() {
    muteButton.input.useHandCursor = true;
    muteButton.events.onInputUp.add(function () {
        if (themeBaseball.sound.mute) {
            muteButton.frame = 0;
            themeBaseball.sound.mute = false;
        } else {
            muteButton.frame = 2;
            themeBaseball.sound.mute = true;
        }
    }, this);
}

function ballRoll(path, index) {
    /*
        So the x and y coordinates for each point in the path are used to create a right triangle using the Pythagorean theorem.
        xDist + yDist = duration
        duration then has some maths done to it to look at what leg of the animation it is and slows it down a bit after each bounce.
        The angle is then updated after each bounce to give it a realistic rolling effect
        ball.animations starts the animation loop of the rotating ball
        the tween then sends the rotaating ball along its path
        BOOM balls are rolling around.
        To quote Finn the Human, "ALGEBRAIC!"
    */
    var i = index || 0;
    var xDist = Math.pow(Math.abs(ballPaths[path].x[i] - ballPaths[path].x[i + 1]), 2);
    var yDist = Math.pow(Math.abs(ballPaths[path].y[i] - ballPaths[path].y[i + 1]), 2);
    var duration = Math.sqrt(xDist + yDist) * (6 + i * 3);
    var angle = ballPaths[path].angle[i];
    var tween;

    if (ball) {
        ball.destroy();
    }

    ball = themeBaseball.add.sprite(ballPaths[path].x[i], ballPaths[path].y[i], "ball");
    ball.animations.add("rotate");
    ball.anchor.setTo(0.5, 0.5);
    ball.angle = angle;
    ball.animations.play("rotate", 12, true);

    tween = themeBaseball.add.tween(ball).to({ x: ballPaths[path].x[i + 1], y: ballPaths[path].y[i + 1] }, duration, Phaser.Easing.Linear.In, true);
    tween.onComplete.add(function () {
        if (i + 1 < ballPaths[path].angle.length) {
            ballRoll(path, i + 1);
        } else {
            ball.destroy();
        }
    }, this);
}

function stage1() {
    animationPlaying = true;
    $.Deferred(function (soundPromise) {
        if (playAudio) {
            status1Audio.play();
            status1Audio.onStop.add(soundPromise.resolve, this);
        } else {
            soundPromise.resolve();
        }
    }).then(function () {
        animationPlaying = false;
        checkQueue();
    });
}

function create() {
    var title;
    var titleAnimation;
    $.when(preloadPromise).then(function () {
        themeBaseball.stage.disableVisibilityChange = true;
        themeBaseball.add.sprite(0, 0, "background");
        title = themeBaseball.add.sprite(-40, -10, "title");
        titleAnimation = title.animations.add("in");
        title.animations.play("in", 12, false);
        titleAnimation.onComplete.add(function () {
            var bat = themeBaseball.add.sprite(97, 200, "bat");
            bat.animations.add("enter");
            bat.animations.play("enter", 12);
        }, this);

        muteButton = themeBaseball.add.sprite(750, 88, "mute_button");
        muteButton.inputEnabled = true;
        addMuteButtonEvents();

        status1Audio = themeBaseball.add.audio("status_1");

        loadRemainingAssets();
        ballRoll(0);

        setInterval(function () {
            clearInterval(ballRollInterval);
            ball.destroy();
            if (ballPathIndex >= 2) {
                ballPathIndex = 0;
            } else {
                ballPathIndex++;
            }
            ballRoll(ballPathIndex);
        }, 10000);
        stage1();
        createPromise.resolve();
    });
}

function enableAudioUpdates(enableSpeech) {
    playAudio = enableSpeech;
}

function setServiceMethod(method) {
    serviceMethod = method;
}

function getTrackerStage(stage, status) {
    var thisStage = stage + "_" + status;
    if ($.inArray(thisStage, animationQueue) === -1) {
        animationQueue.push(thisStage);
    }
    checkQueue();
}

/* This is looking at the events that are getting sent in via NOLO, Native Code, etc... */
window.addEventListener("message", function (event) {
    var data = {};
    if (typeof event.data === "string") try {
        data = JSON.parse(event.data);
    } catch (exception) {}
    if (event.origin === window.location.origin && data.type) {
        switch (data.type) {
            case "setFlavorText":
                {
                    if (data.major) document.getElementById("leftStatus").innerText = data.major;
                    document.getElementById("rightStatus").innerText = data.minor ? "- " + data.minor : "";
                    break;
                }
            case "setNonStatusText":
                {
                    if (data.patentText) document.getElementById("patentText").innerText = data.patentText;
                    if (data.num1) document.getElementById("stageLabel1").setAttribute("data-stagenumber-text", data.num1);
                    if (data.num1) document.getElementById("stageLabel2").setAttribute("data-stagenumber-text", data.num2);
                    if (data.num1) document.getElementById("stageLabel3").setAttribute("data-stagenumber-text", data.num3);
                    if (data.num1) document.getElementById("stageLabel4").setAttribute("data-stagenumber-text", data.num4);
                    if (data.num1) document.getElementById("stageLabel5").setAttribute("data-stagenumber-text", data.num5);
                    if (data.direction) document.getElementsByTagName("html")[0].setAttribute("dir", data.direction);
                    break;
                }
            case "setOrderDetails":
                {
                    setServiceMethod(data.serviceMethod);
                    break;
                }
            case "setLabels":
                {
                    if (data.stage1) document.querySelector("#stageLabel1 .labelText").innerText = data.stage1;
                    if (data.stage2) document.querySelector("#stageLabel2 .labelText").innerText = data.stage2;
                    if (data.stage3) document.querySelector("#stageLabel3 .labelText").innerText = data.stage3;
                    if (data.stage4) document.querySelector("#stageLabel4 .labelText").innerText = data.stage4;
                    if (data.stage5) document.querySelector("#stageLabel5 .labelText").innerText = data.stage5;
                    break;
                }
            case "statusChange":
                {
                    if (data.status) document.getElementById("intl-tracker").setAttribute("data-stagestatus", data.status);
                    if (data.stage) document.getElementById("intl-tracker").setAttribute("data-currentstage", data.stage);
                    getTrackerStage(data.stage, data.status);
                    break;
                }
            default:
                getTrackerStage(data.stage, data.status);
        }
    }
}, false);

enableAudioUpdates(!!location.search.match("enableSpeech"));
themeBaseball = new Phaser.Game(843, 273, Phaser.CANVAS, "theme__canvas", { preload: preload, create: create });
//# sourceMappingURL=baseball.js.map
