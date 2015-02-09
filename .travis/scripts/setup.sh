#!/bin/sh

# start browsers
firefox http://localhost:1111/capture &
sleep 5
which google-chrome > /dev/null 2>&1
if [ $? -eq 0 ] ; then # Google Chrome
    google-chrome --no-default-browser-check --no-first-run --disable-default-apps --no-sandbox http://localhost:1111/capture &
    sleep 5
fi
