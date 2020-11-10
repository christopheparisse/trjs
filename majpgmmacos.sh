cd /devlopt/builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.8-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.8-macos.zip
cd ../..
scp trjs-v0.7.8-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.8-macos.zip ~/ownCloud/betatrjs
cd /devlopt/prod-trjs