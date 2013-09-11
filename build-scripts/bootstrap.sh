#!/bin/bash

if [ ! -d ../build/css/css ]; then mkdir -p ../build/css/css; fi

node lessc --yui-compress ../WebContent/css/bootstrap/bootstrap.less ../build/css/css/style.css
node lessc --yui-compress ../WebContent/css/custom/style.less >> ../build/css/css/style.css
node lessc --yui-compress ../WebContent/css/bootstrap/responsive.less >> ../build/css/css/style.css
node lessc --yui-compress ../WebContent/css/custom/overrides.less >> ../build/css/css/style.css

if [ ! -d ../build/css/images ]; then mkdir -p ../build/css/images; fi
cp -f ../WebContent/css/images/* ../build/css/images
