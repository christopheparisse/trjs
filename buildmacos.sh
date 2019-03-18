cd $1/trjs-macos
electron-packager trjs-macos-app --platform=darwin --asar --overwrite --icon=trjs-macos-app/style/trjs.icns
cp -R tools Trjs-darwin-x64/Trjs.app/Contents/Resources/
cp -R doc Trjs-darwin-x64/Trjs.app/Contents/Resources/
cd /devlopt/prod-trjs
