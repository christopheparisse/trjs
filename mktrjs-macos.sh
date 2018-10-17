rm -rf $1/trjs-macos
mkdir $1/trjs-macos
mkdir trjs-macos-app
cp -R ./doc $1/trjs-macos/trjs-macos-app
cp -R ./editor $1/trjs-macos/trjs-macos-app
cp -R ./js $1/trjs-macos/trjs-macos-app
cp -R ./node $1/trjs-macos/trjs-macos-app
cp -R ./node_modules $1/trjs-macos/trjs-macos-app
cp -R ./style $1/trjs-macos/trjs-macos-app
cp -R ./systemcall $1/trjs-macos/trjs-macos-app
mkdir $1/trjs-macos/tools
cp ./tools/ffmpeg $1/trjs-macos/tools
#cp ./tools/node $1/trjs-macos/tools
cp ./tools/ffprobe $1/trjs-macos/tools
cp ./tools/ffmpeg_10_6 $1/trjs-macos/tools
cp ./tools/ffprobe_10_6 $1/trjs-macos/tools
cp ./tools/fonts.conf $1/trjs-macos/tools
cp -R ./tools/presets $1/trjs-macos/tools
cp -R ./tools/java-osx $1/trjs-macos/tools
cp ./tools/teicorpo.jar $1/trjs-macos/tools
cp ./tools/package.json $1/trjs-macos/tools
cp ./index.js $1/trjs-macos/trjs-macos-app
cp ./README.md $1/trjs-macos/trjs-macos-app
cp ./gulpfile.js $1/trjs-macos/trjs-macos-app
cp ./renderer.js $1/trjs-macos/trjs-macos-app
cp ./index.html $1/trjs-macos/trjs-macos-app
cp ./LICENSE.md $1/trjs-macos/trjs-macos-app
cp ./package.json $1/trjs-macos/trjs-macos-app
#cp ./trjslocal.html $1/trjs-macos/trjs-macos-app
#cp ./trjsclient.html $1/trjs-macos/trjs-macos-app
#cp ./trjsread.html $1/trjs-macos/trjs-macos-app
#cp ./trjsdistant.html $1/trjs-macos/trjs-macos-app
