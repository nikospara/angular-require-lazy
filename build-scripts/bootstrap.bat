@echo off
mkdir ..\build\css\css

REM node lessc --yui-compress ..\WebContent\css\style.less ..\build\css\style.css
REM node lessc --yui-compress ..\WebContent\css\overrides.less ..\build\css\overrides.css
REM node lessc --yui-compress ..\WebContent\css\bootstrap\bootstrap.less ..\build\css\bootstrap\bootstrap.css
REM node lessc --yui-compress ..\WebContent\css\bootstrap\responsive.less ..\build\css\bootstrap\responsive.css

node lessc --yui-compress ..\WebContent\css\bootstrap\bootstrap.less ..\build\css\css\style.css
node lessc --yui-compress ..\WebContent\css\custom\style.less >> ..\build\css\css\style.css
node lessc --yui-compress ..\WebContent\css\bootstrap\responsive.less >> ..\build\css\css\style.css
node lessc --yui-compress ..\WebContent\css\custom\overrides.less >> ..\build\css\css\style.css

mkdir ..\build\css\images
copy /Y ..\WebContent\css\images ..\build\css\images
