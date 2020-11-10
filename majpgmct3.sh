cd /devlopt/builds
zip -r trjs-v0.7.8.zip trjs-zip
scp trjs-v0.7.8.zip parisse@ct3.ortolang.fr:/applis/download/
cp trjs-v0.7.8.zip ~/ownCloud/betatrjs
cd /devlopt/prod-trjs
scp doc/trjs_pp_fra.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/trjs_pp_eng.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/trjs_doc.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/index.html parisse@ct3.ortolang.fr:/applis/trjs/doc/
scp doc/doc.css parisse@ct3.ortolang.fr:/applis/trjs/doc/
rsync -auv doc/img parisse@ct3.ortolang.fr:/applis/trjs/doc/
#scp trjs-v0.7.8-x64.exe parisse@ct3.ortolang.fr:/applis/download/
#scp trjs-v0.7.8-x86.exe parisse@ct3.ortolang.fr:/applis/download/
