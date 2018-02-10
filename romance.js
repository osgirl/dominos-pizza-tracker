var themeRomance;
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
var roundedRectangle;
var people;
var petalsDropping = false;

window.PhaserGlobal = {
    hideBanner: true
};

function preload() {
    /* Load assets needed to get the theme up and running */
    themeRomance.stage.backgroundColor = "#fff";
    themeRomance.load.image("background", "assets/images/background.jpg");
    themeRomance.load.image("book_edge", "assets/images/book_edge.png");
    themeRomance.load.image("flowers", "assets/images/flowers.png");
    themeRomance.load.image("people", "assets/images/people.png");
    themeRomance.load.spritesheet("petal", "assets/images/petal.png", 40, 377, 31);
    themeRomance.load.spritesheet("title_1", "assets/images/title_1.png", 414, 55, 13);
    themeRomance.load.spritesheet("title_2", "assets/images/title_2.png", 414, 55, 13);
    themeRomance.load.spritesheet("title_3", "assets/images/title_3.png", 414, 55, 13);
    themeRomance.load.spritesheet("sparkle", "assets/images/sparkle.png", 89, 194, 11);
    // Filters used for the blurring effect
    themeRomance.load.script("filterX", "../common/lib/filters/BlurX.js");
    themeRomance.load.script("filterY", "../common/lib/filters/BlurY.js");
    themeRomance.load.spritesheet("mute_button", "../common/images/mute.png", 35, 34, 3);
    themeRomance.load.audio("background_sound", ["assets/audio/intro.mp3", "assets/audio/intro.ogg"]);
    themeRomance.load.audio("status_1", ["assets/audio/status_1.mp3", "assets/audio/status_1.ogg"]);
    preloadPromise.resolve();
}

function loadRemainingAssets() {
    /* Load everything else */
    themeRomance.load.audio("status_2", ["assets/audio/status_2.mp3", "assets/audio/status_2.ogg"]);
    themeRomance.load.audio("status_3", ["assets/audio/status_3.mp3", "assets/audio/status_3.ogg"]);
    themeRomance.load.audio("status_4", ["assets/audio/status_4.mp3", "assets/audio/status_4.ogg"]);
    themeRomance.load.audio("status_5", ["assets/audio/status_5.mp3", "assets/audio/status_5.ogg"]);
    themeRomance.load.audio("status_6", ["assets/audio/status_6.mp3", "assets/audio/status_6.ogg"]);

    themeRomance.load.start();

    themeRomance.load.onLoadComplete.add(function () {
        status2Audio = themeRomance.add.audio("status_2");
        status3Audio = themeRomance.add.audio("status_3");
        status4Audio = themeRomance.add.audio("status_4");
        status5Audio = themeRomance.add.audio("status_5");
        status6Audio = themeRomance.add.audio("status_6");
        loadPromise.resolve();
    });
}

function startPetals(options) {
    var thisX = options.x;
    var thisY = options.y;
    var thisAngle = options.angle;
    var petal = themeRomance.add.sprite(thisX, thisY, "petal");

    themeRomance.world.swap(people, petal);
    themeRomance.world.swap(people, roundedRectangle);
    themeRomance.world.swap(muteButton, roundedRectangle);
    petal.angle = thisAngle;
    petal.animations.add("float");
    petal.animations.play("float", 12);
}

function dropPetals() {
    petalsDropping = true;
    startPetals({ x: 800, y: 25, scale: 1.8, angle: 60 });
    setTimeout(function () {
        startPetals({ x: 800, y: 25, scale: 1, angle: 60 });
        setTimeout(function () {
            startPetals({ x: 500, y: 175, scale: 1.8, angle: 60 });
            setTimeout(function () {
                startPetals({ x: 500, y: 175, scale: 1, angle: 60 });
            }, 800);
        }, 800);
    }, 400);

    setTimeout(function () {
        startPetals({ x: 300, y: 15, scale: 2.8, angle: 60 });
        setTimeout(function () {
            startPetals({ x: 300, y: 15, scale: 2, angle: 60 });
        }, 800);
    }, 3000);

    setInterval(function () {
        startPetals({ x: 800, y: 25, scale: 1.8, angle: 60 });
        setTimeout(function () {
            startPetals({ x: 800, y: 25, scale: 1, angle: 60 });
            setTimeout(function () {
                startPetals({ x: 500, y: 175, scale: 1.8, angle: 60 });
                setTimeout(function () {
                    startPetals({ x: 500, y: 175, scale: 1, angle: 60 });
                }, 800);
            }, 800);
        }, 800);

        setTimeout(function () {
            startPetals({ x: 300, y: 15, scale: 2.8, angle: 60 });
            setTimeout(function () {
                startPetals({ x: 300, y: 15, scale: 2, angle: 60 });
            }, 800);
        }, 3000);
    }, 8000);
}

function checkQueue() {
    function stage2() {
        animationPlaying = true;
        $.Deferred(function (soundPromise) {
            if (!petalsDropping) {
                dropPetals();
            }

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
            if (!petalsDropping) {
                dropPetals();
            }

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
            if (!petalsDropping) {
                dropPetals();
            }

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
            if (!petalsDropping) {
                dropPetals();
            }

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
            if (!petalsDropping) {
                dropPetals();
            }

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
        if (themeRomance.sound.mute) {
            muteButton.frame = 0;
            themeRomance.sound.mute = false;
        } else {
            muteButton.frame = 2;
            themeRomance.sound.mute = true;
        }
    }, this);
}

function scriptTitle() {
    var title = themeRomance.add.sprite(25, 18, "title_1");
    var titleAnimation = title.animations.add("script");
    title.animations.play("script", 10);
    titleAnimation.onComplete.add(function () {
        title = themeRomance.add.sprite(25, 18, "title_2");
        titleAnimation = title.animations.add("script");
        title.animations.play("script", 10);
        titleAnimation.onComplete.add(function () {
            title = themeRomance.add.sprite(25, 18, "title_3");
            titleAnimation = title.animations.add("script");
            title.animations.play("script", 10);
        }, this);
    }, this);
}

function drawRectangle() {
    // This draws the transparent gray rectangle behind the tracker bar
    var width = 775;
    var height = 150;

    roundedRectangle = themeRomance.add.graphics(28, 78);
    roundedRectangle.lineStyle(0);
    roundedRectangle.beginFill(0x333333, 0.5);
    roundedRectangle.drawRoundedRect(0, 0, width, height, 10);
}

function sparkles() {
    var thisSparkle = themeRomance.add.sprite(450, 15, "sparkle");
    thisSparkle.animations.add("sparkle");
    thisSparkle.animations.play("sparkle", 12, false);

    setTimeout(function () {
        var thisSparkle2 = themeRomance.add.sprite(660, 25, "sparkle");
        thisSparkle2.animations.add("sparkle");
        thisSparkle2.scale.x = -1;
        thisSparkle2.animations.play("sparkle", 12, false);
    }, 400);
}

/* function for having sprites go from blurred to clear */
function blurIn(options) {
    var blurX = themeRomance.add.filter("BlurX");
    var blurY = themeRomance.add.filter("BlurY");
    var thisInstance = options.instance;
    var thisBlurX = options.blurX;
    var thisBlurY = options.blurY;
    var thisInterval = options.interval;
    var interval = setInterval(function () {
        blurX.blur = thisBlurX;
        blurY.blur = thisBlurY;
        thisInstance.filters = [blurX, blurY];
        thisBlurY -= 0.5;
        thisBlurX -= 0.5;
        if (thisBlurX <= 0 || thisBlurY <= 0) {
            clearInterval(interval);
        }
    }, thisInterval);
}

/* function for having sprites go from cleared to blurred */
function blurOut(options) {
    var blurX = themeRomance.add.filter("BlurX");
    var blurY = themeRomance.add.filter("BlurY");
    var thisInstance = options.instance;
    var thisBlurX = 0;
    var thisBlurY = 0;
    var thisInterval = options.interval;
    var interval = setInterval(function () {
        blurX.blur = thisBlurX;
        blurY.blur = thisBlurY;
        thisInstance.filters = [blurX, blurY];
        thisBlurY += 0.5;
        thisBlurX += 0.5;
        if (thisBlurX >= options.blurX || thisBlurY >= options.blurY) {
            clearInterval(interval);
        }
    }, thisInterval);
}

/* function for having the background scale from big to the stage dimensions */
function scaleIn(options) {
    var thisInstance = options.instance;
    var thisScaleX = options.scaleX;
    var thisScaleY = options.scaleY;
    var thisInterval = options.interval;
    var interval = setInterval(function () {
        thisScaleX -= 0.01;
        thisScaleY -= 0.01;
        thisInstance.scale.setTo(thisScaleX, thisScaleY);
        if (thisScaleX <= 1 || thisScaleY <= 1) {
            clearInterval(interval);
            thisInstance.scale.setTo(1, 1);
        }
    }, thisInterval);
}

/* function for having sprites enter the stage from a certain direction */
function tweenIn(options) {
    var def = $.Deferred();
    var thisInstance = options.instance;
    var thisX = options.x;
    var thisY = options.y;
    var thisDuration = options.duration;
    var tween = themeRomance.add.tween(thisInstance).to({ x: thisX }, thisDuration, Phaser.Easing.Linear.In, true);

    tween.onComplete.add(function () {
        def.resolve();
    }, this);
    if (thisY) {
        themeRomance.add.tween(thisInstance).to({ y: thisY }, thisDuration, Phaser.Easing.Linear.In, true);
    }
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

function stage1() {
    animationPlaying = true;
    $.Deferred(function (soundPromise) {
        if (!petalsDropping) {
            dropPetals();
        }

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
    var background = themeRomance.add.sprite(0, 15, "background");
    var leftFlowers = themeRomance.add.sprite(240, 13, "flowers");
    var backgroundAudio = themeRomance.add.audio("background_sound");

    $.when(preloadPromise).then(function () {
        themeRomance.stage.disableVisibilityChange = true;
        themeRomance.add.sprite(0, 15, "book_edge");
        leftFlowers.scale.x = -1.5;
        leftFlowers.scale.y = 1.5;
        people = themeRomance.add.sprite(240, 0, "people");
        people.alpha = 0;

        blurIn({ instance: background, blurY: 60, blurX: 60, interval: 28 });
        scaleIn({ instance: background, scaleX: 1.33, scaleY: 1.33, interval: 75 });

        tweenIn({ instance: leftFlowers, x: -240, duration: 3000 });
        blurOut({ instance: leftFlowers, blurY: 60, blurX: 60, interval: 30 });

        setTimeout(function () {
            alphaIn({ instance: people, interval: 20 });
            tweenIn({ instance: people, x: 450, duration: 2400 }).then(function () {
                startPetals({ x: 0, y: 25, scale: 1, angle: -45 });
                startPetals({ x: 835, y: 125, scale: 1.2, angle: 60 });
                sparkles();
            });
        }, 600);

        scriptTitle();

        drawRectangle();

        muteButton = themeRomance.add.sprite(750, 96, "mute_button");
        muteButton.inputEnabled = true;
        addMuteButtonEvents();

        status1Audio = themeRomance.add.audio("status_1");
        backgroundAudio.play("", 0.2, 0.5, true, false);

        loadRemainingAssets();
        dropPetals();
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

themeRomance = new Phaser.Game(835, 275, Phaser.CANVAS, "theme__canvas", { preload: preload, create: create });
//# sourceMappingURL=romance.js.map
