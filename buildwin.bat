cd \devlopt\builds\trjs-x64
cmd /c electron-packager app --platform=win32 --asar=true --arch=x64 --overwrite --icon=app\style\trjs.ico
md Trjs-win32-x64\resources\tools
xcopy /s/y/c tools\*.* Trjs-win32-x64\resources\tools
cd \devlopt\builds\trjs-x86
cmd /c electron-packager app --platform=win32 --asar=true --arch=ia32 --overwrite --icon=app\style\trjs.ico
md Trjs-win32-ia32\resources\tools
xcopy /s/y/c tools\*.* Trjs-win32-ia32\resources\tools
cd \devlopt\trjs
"C:\Program Files (x86)\NSIS\Bin\makensis.exe" transcriberjs-x64.nsi
"C:\Program Files (x86)\NSIS\Bin\makensis.exe" transcriberjs-x86.nsi
