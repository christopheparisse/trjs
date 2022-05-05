cd /devlopt/builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.8c-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.c-macos.zip
cd ../..
scp trjs-v0.7.8c-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.8c-macos.zip ~/ownCloud/betatrjs
cd /devlopt/prod-trjs