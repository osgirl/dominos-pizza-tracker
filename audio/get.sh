#!/usr/bin/env bash

THEME=heavymetal
cd $THEME
for i in $(seq 1 7); do
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.mp3
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.ogg
done
cd ..

THEME=baseball
cd $THEME
for i in $(seq 1 7); do
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.mp3
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.ogg
done
cd ..

THEME=paradise
cd $THEME
for i in $(seq 1 7); do
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.mp3
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.ogg
done
cd ..

THEME=pete
cd $THEME
for i in $(seq 1 7); do
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.mp3
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.ogg
done
cd ..

THEME=romance
cd $THEME
for i in $(seq 1 7); do
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.mp3
    wget https://www.dominos.com/en/assets/build/js/site/tracker/themes/${THEME}/assets/audio/status_${i}.ogg
done
cd ..
