var themeHeavymetal;
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
var loadPromise = $.Deferred();
var createPromise = $.Deferred();
var playAudio;
var title;
var sparkles = {
    0: { x: 68, y: 55 },
    1: { x: 144, y: 55 },
    2: { x: 186, y: 55 },
    3: { x: 255, y: 55 },
    4: { x: 285, y: 55 },
    5: { x: 363, y: 55 },
    6: { x: 409, y: 55 },
    7: { x: 468, y: 55 }
};
var lightningBoltInterval = false;
var fireworksInterval = false;

window.PhaserGlobal = {
    hideBanner: true
};

function preload() {
    /* Load assets needed to get the theme up and running */
    themeHeavymetal.stage.backgroundColor = "#fff";
    themeHeavymetal.load.image("background", "assets/images/background.png");
    themeHeavymetal.load.image("title", "assets/images/title.png");
    themeHeavymetal.load.image("knob", "assets/images/knob.png");
    themeHeavymetal.load.image("light", "assets/images/light.png");
    themeHeavymetal.load.image("sparkle", "assets/images/sparkle.png");
    themeHeavymetal.load.image("smoke_puff", "assets/images/smoke_puff.png");
    themeHeavymetal.load.spritesheet("amp_cord", "assets/images/amp_cord.png", 200, 56, 10);
    themeHeavymetal.load.spritesheet("lightning", "assets/images/lightning.png", 260, 300, 9);
    themeHeavymetal.load.spritesheet("pyro_small", "assets/images/pyro_small.png", 59, 59, 12);
    themeHeavymetal.load.spritesheet("pyro_large", "assets/images/pyro_large.png", 124, 258, 16);
    themeHeavymetal.load.audio("pyro_small", ["assets/audio/pyro_small.mp3", "assets/audio/pyro_small.ogg"]);
    themeHeavymetal.load.audio("pyro_large_audio", ["assets/audio/pyro_large.mp3", "assets/audio/pyro_large.ogg"]);
    themeHeavymetal.load.spritesheet("mute_button", "../common/images/mute.png", 35, 34, 3);
    themeHeavymetal.load.audio("intro", ["assets/audio/intro.mp3", "assets/audio/intro.ogg"]);
    themeHeavymetal.load.audio("status_1", ["assets/audio/status_1.mp3", "assets/audio/status_1.ogg"]);
    preloadPromise.resolve();
}

function loadRemainingAssets() {
    /* Load everything else */
    themeHeavymetal.load.audio("status_2", ["assets/audio/status_2.mp3", "assets/audio/status_2.ogg"]);
    themeHeavymetal.load.audio("status_3", ["assets/audio/status_3.mp3", "assets/audio/status_3.ogg"]);
    themeHeavymetal.load.audio("status_4", ["assets/audio/status_4.mp3", "assets/audio/status_4.ogg"]);
    themeHeavymetal.load.audio("status_5", ["assets/audio/status_5.mp3", "assets/audio/status_5.ogg"]);
    themeHeavymetal.load.audio("status_6", ["assets/audio/status_6.mp3", "assets/audio/status_6.ogg"]);

    themeHeavymetal.load.start();

    themeHeavymetal.load.onLoadComplete.add(function () {
        status2Audio = themeHeavymetal.add.audio("status_2");
        status3Audio = themeHeavymetal.add.audio("status_3");
        status4Audio = themeHeavymetal.add.audio("status_4");
        status5Audio = themeHeavymetal.add.audio("status_5");
        status6Audio = themeHeavymetal.add.audio("status_6");
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
        if (themeHeavymetal.sound.mute) {
            muteButton.frame = 0;
            themeHeavymetal.sound.mute = false;
        } else {
            muteButton.frame = 2;
            themeHeavymetal.sound.mute = true;
        }
    }, this);
}

/* function for having sprites enter the stage from a certain direction */
function tweenIn(options) {
    var def = $.Deferred();
    var thisInstance = options.instance;
    var thisX = options.x || thisInstance.x;
    var thisY = options.y || thisInstance.y;
    var thisDuration = options.duration;
    var thisDirection = options && options.direction || "up";
    var tween;

    if (thisDirection === "left") {
        thisY += 30;
        thisX -= 120;
    } else if (thisDirection === "right") {
        thisY += 30;
        thisX += 120;
    }
    tween = themeHeavymetal.add.tween(thisInstance).to({ x: thisX, y: thisY }, thisDuration, Phaser.Easing.Linear.In, true);
    tween.onComplete.add(function () {
        def.resolve();
    }, this);
    return def.promise();
}

/* function used to have sprites fade in */
function alphaIn(options) {
    var thisInstance = options.instance;
    var thisInterval = options.interval;
    var interval = setInterval(function () {
        thisInstance.alpha += 0.01;
        if (thisInstance.alpha >= 1) {
            clearInterval(interval);
        }
    }, thisInterval);
}

/* function used to have sprites fade out */
function alphaOut(options) {
    var thisInstance = options.instance;
    var thisInterval = options.interval;
    var interval = setInterval(function () {
        thisInstance.alpha -= 0.03;
        if (thisInstance.alpha <= 0) {
            clearInterval(interval);
            thisInstance.destroy();
        }
    }, thisInterval);
}

/*
    Amp knobs are rotated using the follwing two functions
    rotateKnob gets the interval running that will rotate the knob and kill it when it gets to 11.
    rotateKnobs just helps orchastrates the knobs and the accompaning audio
*/
function rotateKnob(knob) {
    var interval = setInterval(function () {
        knob.angle += 1;
        if (knob.angle >= -36 && knob.angle <= -34) {
            clearInterval(interval);
        }
    }, 4);
}

function rotateKnobs(knob1, knob2, knob3) {
    var def = $.Deferred();
    var introAudio = themeHeavymetal.add.audio("intro");
    introAudio.play();
    rotateKnob(knob1);
    setTimeout(function () {
        rotateKnob(knob2);
        def.resolve();
        setTimeout(function () {
            rotateKnob(knob3);
        }, 600);
    }, 600);
    return def.promise();
}

function sparkle(x, y) {
    var thisSparkle = themeHeavymetal.add.sprite(x, y, "sparkle");
    var rotateInterval = setInterval(function () {
        thisSparkle.angle += 0.5;
        if (thisSparkle.angle < 40) {
            thisSparkle.alpha += 0.01;
        } else {
            thisSparkle.alpha -= 0.01;
        }
        if (thisSparkle.angle > 90) {
            clearInterval(rotateInterval);
            thisSparkle.destroy();
        }
    }, 8);

    thisSparkle.anchor.setTo(0.5, 0.5);
    thisSparkle.angle = -25;
    thisSparkle.alpha = 0;
}

function startSparkle(x, y) {
    sparkle(x, y);
    setInterval(function () {
        sparkle(x, y);
    }, 10000);
}

/*
    smokePuff takes an instance of the smoke_puff image and adds it to the stage
    the sprite is then stretched and has its alpha channel decreased to make it more whispy looking
    to get rid of the smokes hard leading edge its angle is randomized
    Then a secondary level of smoke is then added
    the direction and type is then looked at, pyro smoke shoots out to the sides more and smoke screen floats straight up
*/
function smokePuff(x, y, direction, type) {
    var thisSmokePuff = themeHeavymetal.add.sprite(x, y, "smoke_puff");
    var tweenY = 10;
    var duration = 2800;
    var interval = 100;
    var thisSmokePuff2;

    thisSmokePuff.alpha = 0.5;

    if (type === "pyro") {
        thisSmokePuff.alpha = 0.4;
        tweenY = 100;
        duration = 1500;
        interval = 80;
    }

    thisSmokePuff.scale.x = 3;
    thisSmokePuff.scale.y = 2;
    thisSmokePuff.angle = Math.random() * 90;
    tweenIn({ instance: thisSmokePuff, y: tweenY, duration: duration, direction: direction });
    alphaOut({ instance: thisSmokePuff, interval: interval });
    if (type !== "pyro") {
        setTimeout(function () {
            thisSmokePuff2 = themeHeavymetal.add.sprite(x, y, "smoke_puff");
            thisSmokePuff2.scale.x = 3;
            thisSmokePuff2.scale.y = 3;
            thisSmokePuff2.alpha = 0.7;
            thisSmokePuff2.angle = Math.random() * 20;
            tweenIn({ instance: thisSmokePuff2, y: tweenY + 10, duration: duration - 400, direction: direction });
            alphaOut({ instance: thisSmokePuff2, interval: interval });
        }, 400);
    }
}

function smokeScreen() {
    var def = $.Deferred();
    setTimeout(function () {
        smokePuff(100, 230, "left", "screen");
        smokePuff(160, 230, "left", "screen");
        smokePuff(124, 230, "left", "screen");
        smokePuff(216, 230, "up", "screen");
        smokePuff(288, 230, "up", "screen");
        smokePuff(340, 230, "up", "screen");
        smokePuff(442, 230, "up", "screen");
        smokePuff(510, 230, "up", "screen");
        smokePuff(546, 230, "right", "screen");
        smokePuff(588, 230, "right", "screen");
        smokePuff(600, 230, "right", "screen");
        def.resolve();
    }, 20);
    return def.promise();
}

function pyroSmoke() {
    var def = $.Deferred();
    setTimeout(function () {
        smokePuff(100, 160, "left", "pyro");
        smokePuff(160, 160, "left", "pyro");
        smokePuff(124, 160, "left", "pyro");
        smokePuff(216, 180, "up", "pyro");
        smokePuff(288, 180, "up", "pyro");
        smokePuff(340, 180, "up", "pyro");
        smokePuff(442, 180, "up", "pyro");
        smokePuff(510, 180, "up", "pyro");
        smokePuff(546, 160, "right", "pyro");
        smokePuff(588, 160, "right", "pyro");
        smokePuff(600, 160, "right", "pyro");
        def.resolve();
    }, 20);
    return def.promise();
}

function smallFireworks(x, y, num) {
    var index = 0;
    var def = $.Deferred();
    var pyroAudio = themeHeavymetal.add.audio("pyro_small");
    var firework;
    var fireworkAnimation;
    var fireworkInterval = setInterval(function () {
        if (index < num) {
            firework = themeHeavymetal.add.sprite(index * 44 + x, y, "pyro_small");
            fireworkAnimation = firework.animations.add("blast");
            firework.animations.play("blast", 32, false);
            fireworkAnimation.onComplete.add(function (thisFirework) {
                thisFirework.destroy();
            }, this);
            index++;
        } else {
            clearInterval(fireworkInterval);
            setTimeout(function () {
                def.resolve();
            }, 10);
        }
    }, 20);
    pyroAudio.play();
    return def.promise();
}

function largeFireworks(num) {
    var index = 0;
    var def = $.Deferred();
    var pyroAudio = themeHeavymetal.add.audio("pyro_large_audio");
    var firework;
    var fireworkAnimation;
    var fireworkInterval = setInterval(function () {
        if (index < num) {
            firework = themeHeavymetal.add.sprite(index * 100 + 114, 0, "pyro_large");
            fireworkAnimation = firework.animations.add("blast", [0, 1, 2, 3, 4, 5, 6], 16, false);
            firework.animations.play("blast");
            fireworkAnimation.onComplete.add(function (thisFirework) {
                thisFirework.destroy();
            }, this);
            index++;
        } else {
            clearInterval(fireworkInterval);
            setTimeout(function () {
                def.resolve();
                smokeScreen();
            }, 10);
        }
    }, 40);
    pyroAudio.play();
    return def.promise();
}

function startFireworks(x, y, num) {
    if (!fireworksInterval) {
        setInterval(function () {
            startFireworks(x, y, num);
        }, 20000);
    }
    smallFireworks(x, y, num).then(function () {
        return pyroSmoke();
    }).then(function () {
        setTimeout(function () {
            return largeFireworks(6);
        }, 10000);
    });
    fireworksInterval = true;
}

function titleIntro() {
    var def = $.Deferred();
    var index = 0;
    var sparkleInterval;
    title = themeHeavymetal.add.sprite(40, 85, "title");
    title.alpha = 0;
    alphaIn({ instance: title, interval: 20 });
    tweenIn({ instance: title, y: 35, duration: 1400 }).then(function () {
        def.resolve();
        sparkleInterval = setInterval(function () {
            startSparkle(sparkles[index].x, sparkles[index].y);
            index++;
            if (index >= 8) {
                clearInterval(sparkleInterval);
            }
        }, 300);
    });
    return def.promise();
}

function plugInAmp() {
    var def = $.Deferred();
    var ampCord = themeHeavymetal.add.sprite(454, 221, "amp_cord");
    var ampCordAnimation = ampCord.animations.add("plugin");
    var light = themeHeavymetal.add.sprite(666, 222, "light");
    ampCord.animations.play("plugin", 12, false);
    light.alpha = 0;
    ampCordAnimation.onComplete.add(function () {
        alphaIn({ instance: light, interval: 6 });
        def.resolve();
    }, this);
    return def.promise();
}

function mainBolt(main) {
    var def = $.Deferred();
    var x = main ? 380 : 200;
    var lightning = themeHeavymetal.add.sprite(x, 65, "lightning");
    var lightningAnimation = lightning.animations.add("flash");
    if (main) {
        lightning.scale.x = 0.4;
        lightning.scale.y = 0.6;
    } else {
        lightning.scale.x = 0.3;
        lightning.scale.y = 0.5;
    }
    lightning.alpha = 0.75;
    lightning.animations.play("flash", 20, false);
    lightningAnimation.onComplete.add(function () {
        lightning.destroy();
        def.resolve();
    }, this);
    return def.promise();
}

function secondaryBolt(x) {
    var def = $.Deferred();
    var lightning = themeHeavymetal.add.sprite(x, 20, "lightning");
    var lightningAnimation = lightning.animations.add("flash");
    lightning.scale.x = 0.3;
    lightning.scale.y = 0.3;
    lightning.alpha = 0.25;
    lightning.animations.play("flash", 12, false);
    lightningAnimation.onComplete.add(function () {
        lightning.destroy();
        def.resolve();
    }, this);
    return def.promise();
}

function startLightningBolts() {
    if (!lightningBoltInterval) {
        setInterval(function () {
            startLightningBolts();
            lightningBoltInterval = true;
        }, 10000);
    }
    mainBolt(true).then(function () {
        setTimeout(function () {
            mainBolt(false);
        }, 4000);
    }).then(function () {
        setTimeout(function () {
            secondaryBolt(60);
            secondaryBolt(420);
        }, 2000);
    });
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
    var knob1;
    var knob2;
    var knob3;

    $.when(preloadPromise).then(function () {
        themeHeavymetal.stage.disableVisibilityChange = true;
        themeHeavymetal.add.sprite(0, 0, "background");
        knob1 = themeHeavymetal.add.sprite(530, 55, "knob");
        knob2 = themeHeavymetal.add.sprite(580, 55, "knob");
        knob3 = themeHeavymetal.add.sprite(630, 55, "knob");
        knob1.anchor.setTo(0.5, 0.5);
        knob2.anchor.setTo(0.5, 0.5);
        knob3.anchor.setTo(0.5, 0.5);
        smallFireworks(66, 20, 8).then(function () {
            return titleIntro();
        }).then(function () {
            return rotateKnobs(knob1, knob2, knob3);
        }).then(function () {
            return plugInAmp();
        }).then(function () {
            startLightningBolts();
        }).then(function () {
            return startFireworks(220, 188, 8);
        });

        muteButton = themeHeavymetal.add.sprite(750, 88, "mute_button");
        muteButton.inputEnabled = true;
        addMuteButtonEvents();
        status1Audio = themeHeavymetal.add.audio("status_1");
        loadRemainingAssets();
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
themeHeavymetal = new Phaser.Game(862, 280, Phaser.CANVAS, "theme__canvas", { preload: preload, create: create }, true);
//# sourceMappingURL=heavymetal.js.map
