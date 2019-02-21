./node_modules/.bin/electron-packager . --platform=linux --asar --overwrite --arch=x64 --icon=style/trjs.png --out=release
mkdir release/Trjs-linux-x64/resources/tools
cp tools/teicorpo.jar release/Trjs-linux-x64/resources/tools
cp tools/chatter.jar release/Trjs-linux-x64/resources/tools
cp tools/fonts.conf release/Trjs-linux-x64/resources/tools
cp tools/package.json release/Trjs-linux-x64/resources/tools
