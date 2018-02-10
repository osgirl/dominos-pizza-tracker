var themePete;
var logo;
var logoAudio;
var bowls;
var bowlsAudio;
var pizzaBox;
var pizzaBoxAudio;
var oven;
var ovenglow;
var ovenAudio;
var paddle;
var paddleBackgroundAudio;
var paddleVoiceAudio;
var computer;
var computerAudio;
var computerAudioSecondary;
var muteButton;
var pete;
var blink;
var blinkInterval;
var heatwaveBag;
var pizzaDough;
var pizza;
var lastStageInstance;
var status1Audio;
var status2Audio;
var status3Audio;
var status4Audio;
var status5Audio;
var status6Audio;
var status7Audio;
var animationQueue = [];
var animationPlaying = false;
var previousStage = "1_complete";
var serviceMethod;
var preloadPromise = $.Deferred();
var loadPromise = $.Deferred();
var createPromise = $.Deferred();
var playAudio = false;

window.PhaserGlobal = {
    hideBanner: true
};

function preload() {
    /* Load assets needed to get the theme up and running */
    themePete.stage.backgroundColor = "#eee";
    themePete.load.image("background", "assets/images/background.jpg");
    themePete.load.spritesheet("rollover_logo", "assets/images/rollover_logo.png", 95, 95);
    themePete.load.audio("logo_audio", ["assets/audio/pete_logo_beep.mp3", "assets/audio/pete_logo_beep.ogg"]);
    themePete.load.spritesheet("rollover_bowls", "assets/images/rollover_bowl.png", 73, 111);
    themePete.load.audio("bowls_audio", ["assets/audio/pete_bowls.mp3", "assets/audio/pete_bowls.ogg"]);
    themePete.load.spritesheet("rollover_pizzaBox", "assets/images/rollover_pizza_boxes.png", 87, 87);
    themePete.load.audio("box_audio", ["assets/audio/pete_pizza_boxes.mp3", "assets/audio/pete_pizza_boxes.ogg"]);
    themePete.load.spritesheet("rollover_oven", "assets/images/rollover_oven.png", 372, 87);
    themePete.load.audio("oven_audio", ["assets/audio/pete_oven_ouch.mp3", "assets/audio/pete_oven_ouch.ogg"]);
    themePete.load.spritesheet("rollover_ovenglow", "assets/images/rollover_ovenglow.png", 189, 17);
    themePete.load.spritesheet("rollover_computer", "assets/images/rollover_computer.png", 105, 80);
    themePete.load.audio("terminal_audio", ["assets/audio/pete_terminal.mp3", "assets/audio/pete/pete_terminal.ogg"]);
    themePete.load.audio("terminal_audio_type", ["assets/audio/pete_terminal_type.mp3", "assets/audio/pete_terminal_type.ogg"]);
    themePete.load.spritesheet("rollover_paddle", "assets/images/rollover_peel.png", 63, 204);
    themePete.load.audio("paddle_audio_background", ["assets/audio/pete_paddle_background.mp3", "assets/audio/pete/pete_paddle_background.ogg"]);
    themePete.load.audio("paddle_audio_voice", ["assets/audio/pete_paddle_voice.mp3", "assets/audio/pete_paddle_voice.ogg"]);
    themePete.load.image("pete_idle", "assets/images/pete_idle.png");
    themePete.load.image("blink", "assets/images/blink.png");
    themePete.load.image("heatwave_bag", "assets/images/heatwave_bag.png");
    themePete.load.spritesheet("mute_button", "../common/images/mute.png", 35, 34, 3);
    themePete.load.spritesheet("pete_wave", "assets/images/pete_wave.png", 126, 123, 22);
    themePete.load.spritesheet("pete_type", "assets/images/pete_type.png", 150, 123, 49);
    themePete.load.spritesheet("pete_walk", "assets/images/pete_walk.png", 102, 123, 21);
    themePete.load.audio("status_1", ["assets/audio/status_1.mp3", "assets/audio/status_1.ogg"]);
    preloadPromise.resolve();
}

function loadRemainingAssets() {
    /* Load everything else */
    // Stage 2
    themePete.load.spritesheet("pete_dough_grab", "assets/images/pete_dough_grab.png", 154, 128, 22);
    themePete.load.spritesheet("pete_dough_squish", "assets/images/pete_dough_squish.png", 154, 130, 30);
    themePete.load.spritesheet("pete_dough_stretch", "assets/images/pete_dough_stretch.png", 154, 130, 11);
    themePete.load.spritesheet("pete_sauce", "assets/images/pete_pizza_sauce.png", 154, 123, 39);
    themePete.load.spritesheet("pete_topping", "assets/images/pete_pizza_top.png", 154, 123, 26);
    themePete.load.spritesheet("pizza_toppings", "assets/images/pizza_toppings.png", 37, 46, 41);
    themePete.load.spritesheet("pizza_dough", "assets/images/pizza_dough.png", 82, 29, 24);
    // Stage 3
    themePete.load.spritesheet("pete_talk", "assets/images/pete_talk_stage3.png", 127, 123, 39);
    themePete.load.spritesheet("pete_peel_1", "assets/images/pete_peel_sequence_1.png", 200, 132, 18);
    themePete.load.spritesheet("pete_peel_2", "assets/images/pete_peel_sequence_2.png", 200, 132, 25);
    themePete.load.spritesheet("pete_peel_ouch", "assets/images/pete_peel_ouch.png", 178, 150, 19);
    themePete.load.spritesheet("pete_peel_drop", "assets/images/pete_peel_setdown.png", 210, 140, 20);
    themePete.load.spritesheet("pete_hand_lift", "assets/images/pete_hand_lift.png", 158, 137, 29);
    themePete.load.spritesheet("pete_into_the_oven", "assets/images/pete_into_the_oven.png", 241, 123, 31);
    themePete.load.spritesheet("pete_into_the_oven_2", "assets/images/pete_into_the_oven_2.png", 280, 123, 15);
    themePete.load.spritesheet("pete_into_the_oven_3", "assets/images/pete_into_the_oven_3.png", 280, 123, 15);
    themePete.load.spritesheet("pete_wipe", "assets/images/pete_wipe.png", 131, 123, 35);
    // Stage 4
    themePete.load.spritesheet("pizza", "assets/images/pizza_oven.png", 48, 11, 12);
    themePete.load.spritesheet("pete_get_box", "assets/images/pete_get_box.png", 206, 123, 23);
    themePete.load.spritesheet("pete_get_pizza", "assets/images/pete_get_pizza.png", 231, 123, 18);
    themePete.load.spritesheet("pete_get_pizza2", "assets/images/pete_get_pizza2.png", 231, 123, 18);
    themePete.load.spritesheet("pete_pizza_cut", "assets/images/pete_pizza_cut.png", 146, 123, 39);
    themePete.load.spritesheet("pete_pizza_box", "assets/images/pete_pizza_box.png", 148, 123, 34);
    // Stage 5
    themePete.load.spritesheet("pete_talk_stage_5", "assets/images/pete_talk_stage5.png", 116, 123, 43);
    themePete.load.spritesheet("pete_heatwave", "assets/images/pete_heatwave.png", 241, 123, 20);
    themePete.load.spritesheet("pete_heatwave_2", "assets/images/pete_heatwave_2.png", 241, 123, 20);
    themePete.load.spritesheet("pete_heatwave_pickup", "assets/images/pete_heatwave_pickup.png", 137, 123, 19);
    themePete.load.spritesheet("pete_walk_heatwave", "assets/images/pete_walk_heatwave.png", 105, 132, 13);

    // Status audio files
    themePete.load.audio("status_2", ["assets/audio/status_2.mp3", "assets/audio/status_2.ogg"]);
    themePete.load.audio("status_3", ["assets/audio/status_3.mp3", "assets/audio/status_3.ogg"]);
    themePete.load.audio("status_4", ["assets/audio/status_4.mp3", "assets/audio/status_4.ogg"]);
    themePete.load.audio("status_5", ["assets/audio/status_5.mp3", "assets/audio/status_5.ogg"]);
    themePete.load.audio("status_6", ["assets/audio/status_6.mp3", "assets/audio/status_6.ogg"]);
    themePete.load.audio("status_7", ["assets/audio/status_7.mp3", "assets/audio/status_7.ogg"]);

    themePete.load.start();
    themePete.load.onLoadComplete.add(function () {
        status2Audio = themePete.add.audio("status_2");
        status3Audio = themePete.add.audio("status_3");
        status4Audio = themePete.add.audio("status_4");
        status5Audio = themePete.add.audio("status_5");
        status6Audio = themePete.add.audio("status_6");
        status7Audio = themePete.add.audio("status_7");
        loadPromise.resolve();
    });
}

function addLogoEvents() {
    logo.input.useHandCursor = true;
    logo.events.onInputOver.add(function () {
        logo.animations.play("over", 10, true);
    }, this);
    logo.events.onInputOut.add(function () {
        logo.animations.stop();
        logo.frame = 0;
    }, this);
    logo.events.onInputDown.add(function () {
        var logoAnimation = logo.animations.play("click");
        // Loop the animation 5 times
        logoAnimation.onLoop.add(function () {
            if (logoAnimation.loopCount >= 5) {
                logo.animations.stop();
                addLogoEvents();
            }
        }, this);
        logo.events.destroy();
        logoAudio.play();
    }, this);
}

function addBowlEvents() {
    bowls.input.useHandCursor = true;
    bowls.events.onInputOver.add(function () {
        bowls.animations.play("over", 10, false);
    }, this);
    bowls.events.onInputOut.add(function () {
        bowls.animations.stop();
        bowls.frame = 0;
    }, this);
    bowls.events.onInputDown.add(function () {
        var bowlsAnimation = bowls.animations.play("click");
        bowls.events.destroy();
        bowlsAudio.play();
        bowlsAnimation.onComplete.add(addBowlEvents, this);
    }, this);
}

function addPizzaBoxEvents() {
    pizzaBox.input.useHandCursor = true;
    pizzaBox.events.onInputOver.add(function () {
        pizzaBox.animations.play("over", 10, false);
    }, this);
    pizzaBox.events.onInputOut.add(function () {
        pizzaBox.animations.stop();
        pizzaBox.frame = 0;
    }, this);
    pizzaBox.events.onInputDown.add(function () {
        var pizzaBoxAnimation = pizzaBox.animations.play("click");
        pizzaBox.events.destroy();
        pizzaBoxAudio.play();
        pizzaBoxAnimation.onComplete.add(addPizzaBoxEvents, this);
    }, this);
}

function addOvenEvents() {
    oven.input.useHandCursor = true;
    oven.events.onInputOver.add(function () {
        oven.animations.play("over", 10, false);
    }, this);
    oven.events.onInputOut.add(function () {
        oven.animations.stop();
        oven.frame = 0;
    }, this);
    oven.events.onInputDown.add(function () {
        var ovenAnimation = oven.animations.play("click");
        oven.events.destroy();
        ovenAudio.play();
        ovenAnimation.onComplete.add(addOvenEvents, this);
    }, this);
}

function addComputerEvents() {
    computer.input.useHandCursor = true;
    computer.events.onInputOver.add(function () {
        computer.animations.play("over", 8, false);
    }, this);
    computer.events.onInputOut.add(function () {
        computer.animations.stop();
        computer.frame = 0;
    }, this);
    computer.events.onInputDown.add(function () {
        var computerAnimation = computer.animations.play("click");
        computer.events.destroy();
        if (playAudio) {
            computerAudio.play();
        } else {
            computerAudioSecondary.play();
        }
        computerAnimation.onComplete.add(addComputerEvents, this);
    }, this);
}

function addPaddleEvents() {
    paddle.input.useHandCursor = true;
    paddle.events.onInputOver.add(function () {
        paddle.animations.play("over", 8, true);
    }, this);
    paddle.events.onInputOut.add(function () {
        paddle.animations.stop();
        paddle.frame = 0;
    }, this);
    paddle.events.onInputDown.add(function () {
        var paddleAnimation = paddle.animations.play("click");
        paddle.events.destroy();
        paddleBackgroundAudio.play();
        if (playAudio) {
            paddleVoiceAudio.play();
        }
        paddleAnimation.onComplete.add(addPaddleEvents, this);
    }, this);
}

function addMuteButtonEvents() {
    muteButton.input.useHandCursor = true;

    muteButton.events.onInputUp.add(function () {
        if (themePete.sound.mute) {
            muteButton.frame = 0;
            themePete.sound.mute = false;
        } else {
            muteButton.frame = 2;
            themePete.sound.mute = true;
        }
    }, this);
}

function setRandomGlows() {
    setInterval(function () {
        var item = Math.floor(Math.random() * 6);
        if (!animationPlaying) {
            switch (item) {
                case 0:
                    logo.animations.play("over", 10, false);
                    break;
                case 1:
                    bowls.animations.play("over", 10, false);
                    break;
                case 2:
                    pizzaBox.animations.play("over", 10, false);
                    break;
                case 3:
                    oven.animations.play("over", 10, false);
                    break;
                case 4:
                    computer.animations.play("over", 8, false);
                    break;
                case 5:
                    paddle.animations.play("glow", 10, false);
                    break;
                default:
                    logo.animations.play("over", 10, false);
            }
        }
    }, 10000);
}

function peteWaveAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteWave = themePete.add.sprite(thisX, thisY, "pete_wave");
    var peteWaveAnim = peteWave.animations.add("wave");

    pete.visible = false;
    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteWave.animations.play("wave", 12, false);
    peteWaveAnim.onComplete.add(function () {
        pete.x = peteWave.x;
        pete.y = peteWave.y;
        pete.visible = true;
        def.resolve(peteWave);
    }, this);
    return def.promise();
}

function peteTypeAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var peteType = themePete.add.sprite(thisX, thisY, "pete_type");
    var peteTypeAnim = peteType.animations.add("type");

    peteType.visible = false;

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    themePete.world.swap(peteType, computer);
    if (options && options.animate) {
        setTimeout(function () {
            pete.visible = false;
            peteType.visible = true;
            peteType.animations.play("type", 16, false);
            setTimeout(function () {
                computerAudioSecondary.play();
            }, 1000);
            peteTypeAnim.onComplete.add(function () {
                peteType.destroy();
                pete.visible = true;
                def.resolve(pete);
            }, this);
        }, thisDelay);
    } else {
        pete.visible = false;
        peteType.frame = 7;
        peteType.visible = true;
        def.resolve(peteType);
    }
    return def.promise();
}

function peteMakePizzaAnimationSequence(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteGrab = themePete.add.sprite(thisX, thisY, "pete_dough_grab");
    var peteGrabAnimation = peteGrab.animations.add("grab");
    var peteSquish;
    var peteSquishAnimation;
    var peteStretch;
    var peteStretchAnimation;

    pete.visible = false;

    // Grab the doughball and set it on the table
    peteGrab.animations.play("grab", 12, false);
    peteGrabAnimation.onComplete.add(function () {
        // Squish the doughball down
        peteSquish = themePete.add.sprite(thisX, thisY - 2, "pete_dough_squish");
        peteSquishAnimation = peteSquish.animations.add("squish");

        pizzaDough = themePete.add.sprite(thisX + 28, thisY + 82, "pizza_dough");
        pizzaDough.animations.add("stretch1", [1, 2, 3, 4, 5, 6], 12, false);
        pizzaDough.animations.add("stretch2", [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 12, false);
        peteGrab.destroy();
        peteSquish.play("squish", 12, false);
        peteSquishAnimation.onComplete.add(function () {
            // Stretch the doughball out
            peteStretch = themePete.add.sprite(thisX, thisY, "pete_dough_stretch");
            peteStretchAnimation = peteStretch.animations.add("stretch", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 12, false);
            themePete.world.swap(peteStretch, pizzaDough);
            peteSquish.destroy();
            peteStretch.animations.add("stretchLoop", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 12, false);
            peteStretch.play("stretch");
            pizzaDough.play("stretch1");
            peteStretchAnimation.onComplete.add(function () {
                var stretchLoop = peteStretch.animations.play("stretchLoop");
                pizzaDough.play("stretch2");
                stretchLoop.onComplete.add(function () {
                    def.resolve(peteStretch);
                }, this);
            }, this);
        }, this);
    }, this);
    return def.promise();
}

function peteSauceAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteSauce = themePete.add.sprite(thisX, thisY, "pete_sauce");
    var peteSauceAnim;

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    themePete.world.swap(peteSauce, pizzaDough);
    peteSauce.animations.add("sauceLoop", [36, 35, 34, 33, 34, 35, 36, 37, 36, 35, 34, 33, 34, 35, 36, 37, 36, 35, 34, 33, 32], 14, false);
    peteSauce.animations.add("returnSpoodle", [18, 16, 14, 13, 11, 9, 7, 5, 3, 1, 0], 14, false);
    peteSauceAnim = peteSauce.animations.add("sauce");
    peteSauce.animations.play("sauce", 12, false);
    peteSauceAnim.onComplete.add(function () {
        var sauceLoop = peteSauce.animations.play("sauceLoop");
        sauceLoop.onComplete.add(function () {
            var returnSpoodle = peteSauce.animations.play("returnSpoodle");
            returnSpoodle.onComplete.add(function () {
                def.resolve(peteSauce);
            }, this);
        }, this);
    });
    return def.promise();
}

function peteToppingAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var peteTopping = themePete.add.sprite(thisX, thisY, "pete_topping");
    var pizzaToppings = themePete.add.sprite(thisX + 50, thisY + 72, "pizza_toppings");
    var peteToppingAnim = peteTopping.animations.add("top");
    var toppingLoopAnimation;

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    setTimeout(function () {
        themePete.world.swap(peteTopping, pizzaDough);
        themePete.world.swap(pizzaToppings, pizzaDough);
        peteTopping.animations.add("toppingLoop", [7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 12, false);
        peteTopping.animations.play("top", 12, false);
        pizzaToppings.animations.add("pizzaTop", [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0, 0, 0, 0, 0, 0, 0, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 0, 0, 0, 0, 0, 0, 0, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 0], 12, false);
        pizzaToppings.animations.play("pizzaTop");
        peteToppingAnim.onComplete.add(function () {
            toppingLoopAnimation = peteTopping.animations.play("toppingLoop");
            toppingLoopAnimation.onComplete.add(function () {
                pete.x += 15;
                blink.x += 15;
                pete.visible = true;
                peteTopping.destroy();
                def.resolve(pete);
            }, this);
        }, this);
    }, thisDelay);
    return def.promise();
}

function peteTalkAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteTalking = themePete.add.sprite(thisX - 18, thisY - 10, "pete_talk");
    var peteTalkingAnimationBob = peteTalking.animations.add("bob", [0, 1, 2, 3], 12, false);
    var peteTalkingAnimationTalk = peteTalking.animations.add("talk");

    pete.visible = false;
    setTimeout(function () {
        peteTalking.animations.play("bob");
        peteTalkingAnimationBob.onComplete.add(function () {
            setTimeout(function () {
                peteTalking.animations.play("talk", 12, false);
                peteTalkingAnimationTalk.onComplete.add(function () {
                    lastStageInstance = peteTalking;
                    def.resolve(peteTalking);
                }, this);
            }, 2000);
        }, this);
    }, 500);
    return def.promise();
}

function petePeelAnimationSequence(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var petePeel = themePete.add.sprite(thisX + 5, thisY - 10, "pete_peel_1");
    var petePeelAnimation = petePeel.animations.add("petePeel1");
    var petePeelOpeningAnimation;
    var ouch;
    var ouchAnimation;
    var peelSetDown;
    var peelSetDownAnimation;
    var pizzaPeelEndAnimation;

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    setTimeout(function () {
        petePeel.animations.play("petePeel1", 12, false);
        petePeelAnimation.onComplete.add(function () {
            petePeel.destroy();
            petePeel = themePete.add.sprite(thisX + 5, thisY - 10, "pete_peel_2");
            petePeelOpeningAnimation = petePeel.animations.add("open", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 12, false);
            petePeel.animations.play("open");
            petePeelOpeningAnimation.onComplete.add(function () {
                petePeel.frame = 15;
                petePeel.animations.add("end", [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 12, false);
                setTimeout(function () {
                    pizzaPeelEndAnimation = petePeel.animations.play("end");
                    pizzaPeelEndAnimation.onComplete.add(function () {
                        ouch = themePete.add.sprite(thisX + 5, thisY - 19, "pete_peel_ouch");
                        ouchAnimation = ouch.animations.add("ouch");
                        petePeel.destroy();
                        ouch.play("ouch", 12, false);
                        ouchAnimation.onComplete.add(function () {
                            peelSetDown = themePete.add.sprite(thisX + 5, thisY - 14, "pete_peel_drop");
                            peelSetDownAnimation = peelSetDown.animations.add("look", [0, 1, 2, 3], 12, false);
                            ouch.destroy();
                            peelSetDownAnimation = peelSetDown.animations.play("look");
                            peelSetDownAnimation.onComplete.add(function () {
                                setTimeout(function () {
                                    peelSetDown.animations.add("setDown", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 12, false);
                                    peelSetDownAnimation = peelSetDown.animations.play("setDown");
                                    peelSetDownAnimation.onComplete.add(function () {
                                        lastStageInstance = peelSetDown;
                                        def.resolve(peelSetDown);
                                    }, this);
                                }, 800);
                            }, this);
                        }, this);
                    }, this);
                }, 3000);
            }, this);
        }, this);
    }, 3000);
    return def.promise();
}

function peteLiftHand(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteHandLift = themePete.add.sprite(thisX + 5, thisY - 12, "pete_hand_lift");
    var peteHandLiftAnimation = peteHandLift.animations.add("liftHand");

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    setTimeout(function () {
        peteHandLift.animations.play("liftHand", 12, false);
        peteHandLiftAnimation.onComplete.add(function () {
            lastStageInstance = peteHandLift;
            def.resolve(peteHandLift);
        }, this);
    }, 2000);
    return def.promise();
}

function pizzaIntoTheOvenAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var pizzaInOven = themePete.add.sprite(thisX - 50, thisY - 10, "pete_into_the_oven");
    var pizzaInOvenAnimation = pizzaInOven.animations.add("putInOven");

    if (options && options.destroy) {
        options.destroy.destroy();
    }

    setTimeout(function () {
        pizzaInOven.animations.play("putInOven", 12, false);
        pizzaInOvenAnimation.onComplete.add(function () {
            pizzaInOven.destroy();
            pizzaInOven = themePete.add.sprite(thisX - 65, thisY - 10, "pete_into_the_oven_2");
            pizzaInOvenAnimation = pizzaInOven.animations.add("putInOven2");
            pizzaInOven.animations.play("putInOven2", 12, false);
            pizzaInOvenAnimation.onComplete.add(function () {
                pizzaInOven.destroy();
                pizzaInOven = themePete.add.sprite(thisX - 65, thisY - 10, "pete_into_the_oven_3");
                pizzaInOvenAnimation = pizzaInOven.animations.add("putInOven3");
                pizzaInOven.animations.play("putInOven3", 12, false);
                pizzaInOvenAnimation.onComplete.add(function () {
                    lastStageInstance = pizzaInOven;
                    def.resolve(pizzaInOven);
                }, this);
            }, this);
        }, this);
    }, thisDelay);

    return def.promise();
}

function peteWipeAnimation(options) {
    var def = $.Deferred();
    var spriteWidth = 131;
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var peteWipe = themePete.add.sprite(thisX + spriteWidth, thisY, "pete_wipe");
    var peteWipeAnim = peteWipe.animations.add("peteWipe");
    var peteWipeLoop = peteWipe.animations.add("wipeLoop", [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], 12, true);
    var ragBack = peteWipe.animations.add("ragBack", [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 12, false);

    clearInterval(blinkInterval);
    if (options && options.destroy) {
        options.destroy.destroy();
    }

    setTimeout(function () {
        peteWipe.animations.play("peteWipe", 12, false);
        peteWipeAnim.onComplete.add(function () {
            peteWipe.animations.play("wipeLoop");
            peteWipeLoop.onLoop.add(function () {
                if (peteWipeLoop.loopCount === 4) {
                    themePete.add.tween(peteWipe).to({ x: peteWipe.x + 100 }, 800, Phaser.Easing.Linear.In, true);
                } else if (peteWipeLoop.loopCount === 8) {
                    themePete.add.tween(peteWipe).to({ x: peteWipe.x + 100 }, 800, Phaser.Easing.Linear.In, true);
                } else if (peteWipeLoop.loopCount === 12) {
                    peteWipe.animations.stop();
                    peteWipe.animations.play("ragBack");
                    ragBack.onComplete.add(function () {
                        lastStageInstance = peteWipe;
                        def.resolve(peteWipe);
                    }, this);
                }
            }, this);
        }, this);
    }, thisDelay);

    return def.promise();
}

function peteWalkAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var direction = options && options.direction ? options.direction : "right";
    var distance = options && options.distance ? options.distance : 0;
    var spriteWidth = direction === "right" ? 102 : 0;
    var peteWalk = themePete.add.sprite(thisX + spriteWidth, thisY, "pete_walk");
    var peteTurnAnimation = peteWalk.animations.add("turn", [0, 1, 2, 3, 4, 5], 12, false);
    var peteTurnBackAnimation = peteWalk.animations.add("turnBack", [5, 4, 3, 2, 1, 0], 12, false);
    var toX = 0;

    if (pete) {
        pete.visible = false;
    }
    if (options && options.destroy) {
        options.destroy.destroy();
    }
    if (direction === "right") {
        peteWalk.scale.x *= -1;
        toX = thisX + distance + spriteWidth;
    } else {
        toX = thisX - distance;
    }
    setTimeout(function () {
        peteWalk.animations.play("turn");
        peteTurnAnimation.onComplete.add(function () {
            var walkTween = themePete.add.tween(peteWalk).to({ x: toX }, distance * 8, Phaser.Easing.Linear.In, true);
            peteWalk.animations.add("walkSequence", [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 12, true);
            peteWalk.animations.play("walkSequence");
            walkTween.onComplete.add(function () {
                if (options && options.turnBack) {
                    peteWalk.animations.play("turnBack");
                    peteTurnBackAnimation.onComplete.add(function () {
                        pete.x = peteWalk.x - spriteWidth;
                        lastStageInstance = peteWalk;
                        def.resolve(peteWalk);
                    }, this);
                } else {
                    peteWalk.animations.stop();
                    lastStageInstance = peteWalk;
                    def.resolve(peteWalk);
                }
            });
        }, this);
    }, thisDelay);
    return def.promise();
}

function pizzaAnimation() {
    setTimeout(function () {
        pizza = themePete.add.sprite(512, 80, "pizza");
        themePete.world.swap(pete, pizza);
        pizza.animations.add("pizzaAnimation");
        pizza.animations.play("pizzaAnimation", 8, false);
    }, 2000);
}

function getBoxAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteGetBox = themePete.add.sprite(thisX - 150, thisY, "pete_get_box");
    var peteGetBoxAnimation = peteGetBox.animations.add("getBox");

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    pizza.destroy();
    peteGetBox.animations.play("getBox", 12, false);
    peteGetBoxAnimation.onComplete.add(function () {
        lastStageInstance = peteGetBox;
        def.resolve(peteGetBox);
    }, this);
    return def.promise();
}

function getPizzaAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteGetPizza = themePete.add.sprite(thisX, thisY, "pete_get_pizza");
    var peteGetPizzaAnimation = peteGetPizza.animations.add("getPizza");

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteGetPizza.animations.play("getPizza", 12, false);
    peteGetPizzaAnimation.onComplete.add(function () {
        peteGetPizza.destroy();
        peteGetPizza = themePete.add.sprite(thisX, thisY, "pete_get_pizza2");
        peteGetPizzaAnimation = peteGetPizza.animations.add("getPizza2");
        peteGetPizza.animations.play("getPizza2", 12, false);
        peteGetPizzaAnimation.onComplete.add(function () {
            lastStageInstance = peteGetPizza;
            def.resolve(peteGetPizza);
        });
    }, this);
    return def.promise();
}

function cutPizzaAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteCutPizza = themePete.add.sprite(thisX, thisY, "pete_pizza_cut");
    var peteCutPizzaAnimation = peteCutPizza.animations.add("cutPizza", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], 12, false);

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteCutPizza.animations.play("cutPizza");
    peteCutPizzaAnimation.onComplete.add(function () {
        lastStageInstance = peteCutPizza;
        def.resolve(peteCutPizza);
    }, this);
    return def.promise();
}

function boxPizzaAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteBoxPizza = themePete.add.sprite(thisX, thisY, "pete_pizza_box");
    var peteBoxPizzaAnimation = peteBoxPizza.animations.add("peteBox");

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteBoxPizza.animations.play("peteBox", 12, false);
    peteBoxPizzaAnimation.onComplete.add(function () {
        lastStageInstance = peteBoxPizza;
        def.resolve(peteBoxPizza);
    }, this);
    return def.promise();
}

function peteTalkStage5Animation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteTalk = themePete.add.sprite(thisX, thisY, "pete_talk_stage_5");
    var peteTalkAnim = peteTalk.animations.add("talk");

    pete.visible = false;
    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteTalk.animations.play("talk", 12, false);
    peteTalkAnim.onComplete.add(function () {
        def.resolve(peteTalk);
    }, this);
    return def.promise();
}

function peteHeatwaveAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var thisDelay = options && options.delay ? options.delay : 0;
    var peteHeatwave = themePete.add.sprite(thisX, thisY, "pete_heatwave");
    var peteHeatwaveAnim = peteHeatwave.animations.add("part1");

    if (options && options.destroy) {
        options.destroy.destroy();
    }

    setTimeout(function () {
        peteHeatwave.animations.play("part1", 12, false);
        peteHeatwaveAnim.onComplete.add(function () {
            peteHeatwave.destroy();
            peteHeatwave = themePete.add.sprite(thisX, thisY, "pete_heatwave_2");
            themePete.world.swap(peteHeatwave, heatwaveBag);
            peteHeatwaveAnim = peteHeatwave.animations.add("part2");
            peteHeatwave.animations.play("part2", 12, false);
            peteHeatwaveAnim.onComplete.add(function () {
                def.resolve(peteHeatwave);
            }, this);
        }, this);
    }, thisDelay);

    return def.promise();
}

function peteHeatwavePickupAnimation(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var heatwavePickup = themePete.add.sprite(thisX, thisY, "pete_heatwave_pickup");
    var peteHeatwavePickupAnim = heatwavePickup.animations.add("pickup");

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    heatwaveBag.destroy();
    heatwavePickup.animations.play("pickup", 12, false);
    peteHeatwavePickupAnim.onComplete.add(function () {
        def.resolve(heatwavePickup);
    }, this);
    return def.promise();
}

function peteWalkHeatwaveSequence(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteHeatwaveWalk = themePete.add.sprite(thisX, thisY, "pete_walk_heatwave");
    var walkTween = themePete.add.tween(peteHeatwaveWalk).to({ x: themePete.width + 105 }, 2500, Phaser.Easing.Linear.In, true);

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    peteHeatwaveWalk.animations.add("walk");
    peteHeatwaveWalk.animations.play("walk", 12, true);
    walkTween.onComplete.add(function () {
        def.resolve(peteHeatwaveWalk);
    }, this);
    return def.promise();
}

function closingAnimationSequence(options) {
    var def = $.Deferred();
    var thisX = options && options.x ? options.x : pete.x;
    var thisY = options && options.y ? options.y : pete.y;
    var peteType = themePete.add.sprite(thisX, thisY, "pete_type");
    var peteTurnBack = peteType.animations.add("turnBack", [6, 5, 4, 3, 2, 1, 0], 12, false);

    function animationGo() {
        setTimeout(function () {
            peteType.animations.play("turnBack");
            peteTurnBack.onComplete.add(function () {
                peteType.visible = false;
                peteWaveAnimation({ y: peteType.y + 8 }).then(function (instance) {
                    pete.visible = false;
                    setTimeout(function () {
                        instance.destroy();
                        peteType.visible = true;
                        peteType.animations.add("turn", [1, 2, 3, 4, 5, 6, 7], 12, false);
                        peteType.animations.play("turn");
                    }, 3400);
                });
            }, this);
        }, 800);
    }

    if (options && options.destroy) {
        options.destroy.destroy();
    }
    pete.visible = false;
    pete.x = 175;
    themePete.world.swap(peteType, computer);
    peteType.frame = 7;
    if (previousStage === "1_complete") {
        pete.visible = false;
        peteType.visible = true;
        peteType.animations.play("turn");
        setTimeout(function () {
            animationGo();
        }, 1000);
    } else {
        animationGo();
    }
    return def.promise();
}

function peteBlink(options) {
    var thisX = options && options.x ? options.x : pete.x + 37;
    var thisY = options && options.y ? options.y : pete.y + 23;
    var thisInstance = options && options.instance ? options.instance : pete;

    if (blink.z <= thisInstance.z) {
        themePete.world.swap(blink, thisInstance);
    }
    blink.x = thisX;
    blink.y = thisY;
    blinkInterval = setInterval(function () {
        blink.visible = true;
        setTimeout(function () {
            blink.visible = false;
        }, 200);
    }, 4000);
}

function checkQueue() {
    function stage2() {
        var soundPromise;
        var animationPromise;

        animationPlaying = true;
        clearInterval(blinkInterval);
        blink.visible = false;

        soundPromise = $.Deferred(function (promise) {
            if (playAudio) {
                status2Audio.play();
                status2Audio.onStop.add(promise.resolve, this);
            } else {
                promise.resolve();
            }
        });

        animationPromise = peteMakePizzaAnimationSequence({ destroy: lastStageInstance, x: 175, y: -5 }).then(function (instance) {
            lastStageInstance = instance;
            return peteSauceAnimation({ x: 170, y: 0, destroy: instance });
        }).then(function (instance) {
            lastStageInstance = instance;
            return peteToppingAnimation({ x: 170, y: 0, destroy: instance, delay: 800 });
        });

        $.when(soundPromise, animationPromise).then(function () {
            peteBlink();
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage3() {
        var soundPromise;
        var animationPromise;

        animationPlaying = true;
        clearInterval(blinkInterval);
        blink.visible = false;
        if (pizzaDough) {
            pizzaDough.destroy();
        }
        pete.visible = false;

        soundPromise = $.Deferred(function (promise) {
            if (playAudio) {
                status3Audio.play();
                status3Audio.onStop.add(promise.resolve, this);
            } else {
                promise.resolve();
            }
        });

        animationPromise = peteTalkAnimation().then(function (instance) {
            return petePeelAnimationSequence({ destroy: instance });
        }).then(function (instance) {
            return peteLiftHand({ destroy: instance });
        }).then(function (instance) {
            return pizzaIntoTheOvenAnimation({ destroy: instance, delay: 3000 });
        }).then(function (instance) {
            peteBlink({ instance: instance, x: instance.x + 145, y: instance.y + 30 });
            return peteWipeAnimation({ x: instance.x - 20, y: instance.y, destroy: instance, delay: 8000 });
        }).then(function (instance) {
            return peteWalkAnimation({ destroy: instance, direction: "left", distance: 200, x: instance.x, y: instance.y, turnBack: true });
        });

        $.when(soundPromise, animationPromise).then(function () {
            peteBlink({ instance: lastStageInstance, x: lastStageInstance.x + 37, y: lastStageInstance.y + 28 });
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage4() {
        var soundPromise;
        var animationPromise;

        animationPlaying = true;
        clearInterval(blinkInterval);

        soundPromise = $.Deferred(function (promise) {
            if (playAudio) {
                status4Audio.play();
                status4Audio.onStop.add(promise.resolve, this);
            } else {
                promise.resolve();
            }
        });

        animationPromise = peteWalkAnimation({ destroy: lastStageInstance, direction: "right", distance: previousStage === "1" ? 305 : 270, x: previousStage === "1" ? 175 : 220, y: pete.y - 10, turnBack: false, delay: 2000 }).then(function (instance) {
            return getBoxAnimation({ destroy: instance, x: instance.x, y: instance.y });
        }).then(function (instance) {
            return getPizzaAnimation({ destroy: instance, x: instance.x - 12, y: instance.y });
        }).then(function (instance) {
            return cutPizzaAnimation({ destroy: instance, x: instance.x + 20, y: instance.y + 7 });
        }).then(function (instance) {
            return boxPizzaAnimation({ destroy: instance, x: instance.x, y: instance.y });
        });

        pizzaAnimation();

        $.when(soundPromise, animationPromise).then(function () {
            peteBlink({ instance: lastStageInstance, x: lastStageInstance.x + 72, y: lastStageInstance.y + 21 });
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage5() {
        var soundPromise;
        var animationPromise;

        animationPlaying = true;
        clearInterval(blinkInterval);

        soundPromise = $.Deferred(function (promise) {
            if (playAudio) {
                if (serviceMethod === "DELIVERY") {
                    status6Audio.play();
                    status6Audio.onStop.add(promise.resolve, this);
                } else {
                    status5Audio.play();
                    status5Audio.onStop.add(promise.resolve, this);
                }
            } else {
                promise.resolve();
            }
        });

        animationPromise = peteTalkStage5Animation({ destroy: lastStageInstance, x: 454, y: 0 }).then(function (instance) {
            return peteHeatwaveAnimation({ destroy: instance, x: instance.x, y: instance.y, delay: 3000 });
        }).then(function (instance) {
            return peteHeatwavePickupAnimation({ destroy: instance, x: 561, y: -1 });
        }).then(function (instance) {
            return peteWalkHeatwaveSequence({ destroy: instance, x: 588, y: -1 });
        }).then(function (instance) {
            return peteWalkAnimation({ destroy: instance, direction: "left", distance: 670, x: themePete.width, y: pete.y, turnBack: false, delay: 800 });
        }).then(function (instance) {
            return peteTypeAnimation({ x: instance.x - 80, y: instance.y, animate: false, destroy: instance });
        }).then(function (instance) {
            lastStageInstance = instance;
        });

        $.when(soundPromise, animationPromise).then(function () {
            animationPlaying = false;
            animationQueue.shift();
            checkQueue();
        });
    }

    function stage6() {
        clearInterval(blinkInterval);
        closingAnimationSequence({ destroy: lastStageInstance, x: 73, y: -3 });
        if (playAudio) {
            status7Audio.play();
        }
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
                    if (previousStage === "1_complete") {
                        peteWalkAnimation({ x: pete.x, distance: 279, direction: "right", turnBack: true }).then(function (instance) {
                            instance.destroy();
                            stage5();
                        });
                    } else {
                        stage5();
                    }
                    break;
                case "5_complete":
                    if (serviceMethod === "DELIVERY") {
                        stage6();
                    } else if (previousStage === "1_complete") {
                        peteWalkAnimation({ x: pete.x, distance: 279, direction: "right", turnBack: true }).then(function (instance) {
                            instance.destroy();
                            stage5();
                        });
                    } else {
                        stage5();
                    }
                    break;
                default:
                    animationQueue.shift();
                    checkQueue();
            }
            previousStage = animationQueue[0];
        }
    });
}

function stage1() {
    var soundPromise;
    var animationPromise;

    animationPlaying = true;

    soundPromise = $.Deferred(function (promise) {
        if (playAudio) {
            status1Audio.play();
            status1Audio.onStop.add(promise.resolve, this);
        } else {
            promise.resolve();
        }
    });

    animationPromise = peteWalkAnimation({ direction: "right", distance: 277, x: -102, y: 7, turnBack: true }).then(function (instance) {
        return peteWaveAnimation({ destroy: instance, x: 175, y: 7 });
    }).then(function (instance) {
        lastStageInstance = instance;
        return peteTypeAnimation({ destroy: instance, x: pete.x - 70, y: pete.y - 10, animate: true, delay: 1000 });
    });

    $.when(soundPromise, animationPromise).then(function () {
        peteBlink();
        animationPlaying = false;
        checkQueue();
    });
}

function create() {
    $.when(preloadPromise).then(function () {
        themePete.stage.disableVisibilityChange = true;
        themePete.add.sprite(0, 0, "background");
        logo = themePete.add.sprite(0, 0, "rollover_logo");
        logoAudio = themePete.add.audio("logo_audio");
        bowls = themePete.add.sprite(360, -70, "rollover_bowls");
        bowlsAudio = themePete.add.audio("bowls_audio");
        pizzaBox = themePete.add.sprite(590, -22, "rollover_pizzaBox");
        pizzaBoxAudio = themePete.add.audio("box_audio");
        oven = themePete.add.sprite(187, 46, "rollover_oven");
        ovenAudio = themePete.add.audio("oven_audio");
        ovenglow = themePete.add.sprite(280, 74, "rollover_ovenglow");
        computer = themePete.add.sprite(86, 36, "rollover_computer");
        computerAudio = themePete.add.audio("terminal_audio");
        computerAudioSecondary = themePete.add.audio("terminal_audio_type");
        paddle = themePete.add.sprite(684, -8, "rollover_paddle");
        paddleBackgroundAudio = themePete.add.audio("paddle_audio_background");
        paddleVoiceAudio = themePete.add.audio("paddle_audio_voice");
        pete = themePete.add.sprite(175, 7, "pete_idle");
        pete.visible = false;
        blink = themePete.add.sprite(212, 30, "blink");
        blink.visible = false;
        heatwaveBag = themePete.add.sprite(628, 72, "heatwave_bag");
        muteButton = themePete.add.sprite(750, 80, "mute_button");

        status1Audio = themePete.add.audio("status_1");

        logo.inputEnabled = true;
        bowls.inputEnabled = true;
        pizzaBox.inputEnabled = true;
        oven.inputEnabled = true;
        computer.inputEnabled = true;
        paddle.inputEnabled = true;
        muteButton.inputEnabled = true;

        // makes only the actual pixels the active hit spot instead of the whole rectangle
        logo.input.pixelPerfectOver = true;
        logo.input.pixelPerfectClick = true;

        bowls.input.pixelPerfectOver = true;
        bowls.input.pixelPerfectClick = true;

        pizzaBox.input.pixelPerfectOver = true;
        pizzaBox.input.pixelPerfectClick = true;

        oven.input.pixelPerfectOver = true;
        oven.input.pixelPerfectClick = true;

        computer.input.pixelPerfectOver = true;
        computer.input.pixelPerfectClick = true;

        logo.animations.add("over", [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]);
        logo.animations.add("click", [6, 7, 8, 9, 10, 10, 10, 9, 8, 7], 8, true);

        bowls.animations.add("over", [0, 1, 2, 3, 4, 5, 3, 2, 1, 0]);
        bowls.animations.add("click", [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0], 16, false);

        pizzaBox.animations.add("over", [0, 1, 2, 3, 4, 5, 3, 2, 1, 0]);
        pizzaBox.animations.add("click", [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0], 16, false);

        oven.animations.add("over", [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]);
        oven.animations.add("click", [0, 6, 7, 7, 6, 0], 16, false);

        ovenglow.animations.add("glow", [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0], 8, true);
        ovenglow.animations.play("glow");

        computer.animations.add("over", [0, 1, 2, 3, 2, 1, 0]);
        computer.animations.add("click", [2, 0, 0, 1, 0, 1, 0, 2, 0, 1, 0], 10, false);

        paddle.animations.add("over", [2, 3, 4, 5, 4, 3, 2]);
        paddle.animations.add("glow", [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]);
        paddle.animations.add("click", [6, 7, 8, 9, 10, 11, 12], 8, false);

        // Adding all the rollover and click handlers
        addLogoEvents();
        addBowlEvents();
        addPizzaBoxEvents();
        addOvenEvents();
        addComputerEvents();
        addPaddleEvents();
        addMuteButtonEvents();

        setRandomGlows();
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
                    document.getElementById("theme__name").innerHTML = translations[translations.hasOwnProperty(data.lang) ? data.lang : "default"].themeName;
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
themePete = new Phaser.Game(823, 249, Phaser.CANVAS, "theme__canvas", { preload: preload, create: create });
//# sourceMappingURL=pizzaPete.js.map
