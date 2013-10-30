@echo off
mkdir ..\build\css\css

node lessc --yui-compress ..\WebContent\css\style.less ..\build\css\css\style.css

mkdir ..\build\css\images
copy /Y ..\WebContent\css\images ..\build\css\images
