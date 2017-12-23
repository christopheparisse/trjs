cd /devlopt/builds
cd Trjs-darwin-x64
zip -r ../trjs-v0.6.0-macos.zip Trjs.app
cd ..
scp trjs-v0.6.0-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.6.0-macos.zip ~/ownCloud/betatrjs
#
zip -r trjs-v0.6.0.zip trjs-zip
scp trjs-v0.6.0.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.6.0.zip ~/ownCloud/betatrjs
cd /devlopt/betatrjs
#scp trjs-v0.6.0-x64.exe parisse@ct3.ortolang.fr:/applis/download/
#scp trjs-v0.6.0-x86.exe parisse@ct3.ortolang.fr:/applis/download/
