cd /devlopt/builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.4a-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.4a-macos.zip
cd ../..
scp trjs-v0.7.4a-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.4a-macos.zip ~/ownCloud/betatrjs
#
zip -r trjs-v0.7.4a.zip trjs-zip
scp trjs-v0.7.4a.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.4a.zip ~/ownCloud/betatrjs
cd /devlopt/trjs-v0.7.4a
scp doc/trjs_pp.html parisse@ct3.ortolang.fr:/applis/trjs/documentation/
scp doc/trjs_doc.html parisse@ct3.ortolang.fr:/applis/trjs/documentation/
#scp trjs-v0.7.4a-x64.exe parisse@ct3.ortolang.fr:/applis/download/
#scp trjs-v0.7.4a-x86.exe parisse@ct3.ortolang.fr:/applis/download/
