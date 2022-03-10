rm -rf $1/trjs-x86
mkdir $1/trjs-x86
mkdir $1/trjs-x86/app
cp -vR ./doc $1/trjs-x86/app
cp -vR ./editor $1/trjs-x86/app
cp -vR ./js $1/trjs-x86/app
cp -vR ./external $1/trjs-x86/app
cp -vR ./node_modules $1/trjs-x86/app
cp -vR ./style $1/trjs-x86/app
cp -vR ./systemcall $1/trjs-x86/app
mkdir $1/trjs-x86/tools
cp -v ./tools/ffmpeg-x86.exe $1/trjs-x86/tools
# cp ./tools/node-x86.exe $1/trjs-x86/tools
cp -v ./tools/ffprobe-x86.exe $1/trjs-x86/tools
cp -v ./tools/fonts.conf $1/trjs-x86/tools
cp -vR ./tools/presets $1/trjs-x86/tools
cp -vR ./tools/java-x86 $1/trjs-x86/tools
cp -v ./tools/teicorpo.jar $1/trjs-x86/tools
cp -v ./tools/chatter.jar $1/trjs-x86/tools
cp -v ./tools/package.json $1/trjs-x86/tools
cp -v ./transcriberjs-x86.nsi $1/trjs-x86/app
cp -v ./index.js $1/trjs-x86/app
cp -v ./README.md $1/trjs-x86/app
cp -v ./gulpfile.js $1/trjs-x86/app
cp -v ./renderer.js $1/trjs-x86/app
cp -v ./index.html $1/trjs-x86/app
cp -v ./LICENSE.md $1/trjs-x86/app
cp -v ./package.json $1/trjs-x86/app
#cp -v ./trjslocal.html $1/trjs-x86/app
#cp -v ./trjsclient.html $1/trjs-x86/app
#cp -v ./trjsread.html $1/trjs-x86/app
#cp -v ./trjsdistant.html $1/trjs-x86/app
mkdir $1/trjs-x86/doc
cp -R ./doc/fonts $1/trjs-x86/doc
cp -R ./doc/img $1/trjs-x86/doc
cp -R ./doc/js $1/trjs-x86/doc
cp -R ./doc/style $1/trjs-x86/doc
cp ./doc/doc.css $1/trjs-x86/doc
cp ./doc/trjs_doc_fra.html $1/trjs-x86/doc
cp ./doc/trjs_pp_fra.html $1/trjs-x86/doc
cp ./doc/trjs_pp_eng.html $1/trjs-x86/doc
