cd /devlopt/builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.7a-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.7a-macos.zip
cd ../..
scp trjs-v0.7.7a-macos.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.7a-macos.zip ~/ownCloud/betatrjs
#
zip -r trjs-v0.7.7a.zip trjs-zip
scp trjs-v0.7.7a.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.7a.zip ~/ownCloud/betatrjs
cd /devlopt/prod-trjs
scp doc/trjs_pp_fra.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/trjs_pp_eng.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/trjs_doc.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/index.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/doc.css parisse@ct3.ortolang.fr:/applis/trjs/doc/
rsync -auv doc/img parisse@ct3.ortolang.fr:/applis/trjs/doc/
#scp trjs-v0.7.7a-x64.exe parisse@ct3.ortolang.fr:/applis/download/
#scp trjs-v0.7.7a-x86.exe parisse@ct3.ortolang.fr:/applis/download/
