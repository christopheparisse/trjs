cd /devlopt/builds
cd trjs-macos/Trjs-darwin-x64
zip -r ../../trjs-v0.6.1-macos.zip Trjs.app
cd ../..
scp trjs-v0.6.1-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.6.1-macos.zip ~/ownCloud/betatrjs
#
zip -r trjs-v0.6.1.zip trjs-zip
scp trjs-v0.6.1.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.6.1.zip ~/ownCloud/betatrjs
cd /devlopt/trjs
scp doc/trjs_pp.html parisse@ct3.ortolang.fr:/applis/trjs/documentation/
#scp trjs-v0.6.1-x64.exe parisse@ct3.ortolang.fr:/applis/download/
#scp trjs-v0.6.1-x86.exe parisse@ct3.ortolang.fr:/applis/download/
