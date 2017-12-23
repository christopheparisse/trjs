cd $1/trjs-macos
electron-packager trjs-macos-app --platform=darwin --asar=true --overwrite --icon=trjs-macos-app/style/trjs.icns
cp -R tools Trjs-darwin-x64/Trjs.app/Contents/Resources/
cd /devlopt/betatrjs
