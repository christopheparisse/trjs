cd /Users/cp/devlopt/builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.8b-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.8b-macos.zip
cd ../..
scp trjs-v0.7.8b-macos.zip parisse@vheborto-ct3.inist.fr:/applis/download/
cp trjs-v0.7.8b-macos.zip ~/ownCloud/betatrjs
#
zip -r trjs-v0.7.8b.zip trjs-zip
scp trjs-v0.7.8b.zip parisse@vheborto-ct3.inist.fr:/applis/download/
cp trjs-v0.7.8b.zip ~/ownCloud/betatrjs
cd /Users/cp/devlopt/prod-trjs
scp doc/trjs_pp_fra.html parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
scp doc/trjs_pp_eng.html parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
scp doc/trjs_doc.html parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
scp doc/index.html parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
scp doc/doc.css parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
rsync -auv doc/img parisse@vheborto-ct3.inist.fr:/applis/trjs/doc/
#scp trjs-v0.7.8b-x64.exe parisse@vheborto-ct3.inist.fr:/applis/download/
#scp trjs-v0.7.8b-x86.exe parisse@vheborto-ct3.inist.fr:/applis/download/
