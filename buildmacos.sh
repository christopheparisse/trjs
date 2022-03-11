cd $1/trjs-macos
node ~/devlopt/prod-trjs/node_modules/electron-packager/bin/electron-packager.js trjs-macos-app --platform=darwin --asar --overwrite --icon=trjs-macos-app/style/trjs.icns
cp -R tools Trjs-darwin-x64/Trjs.app/Contents/Resources/
cp -R doc Trjs-darwin-x64/Trjs.app/Contents/Resources/
cd /Users/cp/devlopt/prod-trjs
