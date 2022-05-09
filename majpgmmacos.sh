cd ../builds
cd trjs-macos/Trjs-darwin-x64
# zip -r ../../trjs-v0.7.8c-macos.zip Trjs.app
ditto -ck --rsrc --sequesterRsrc --keepParent Trjs.app ../../trjs-v0.7.c-macos.zip
cd ../..
scp trjs-v0.7.8c-macos.zip parisse@vheborto-ct3.inist.fr:/applis/download/
cp trjs-v0.7.8c-macos.zip ~/ownCloud/betatrjs
cd ../prod-trjs
