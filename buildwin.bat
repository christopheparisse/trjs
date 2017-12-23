cd \devlopt\builds
cmd /c electron-packager trjs-x64 --platform=win32 --arch=x64 --overwrite --icon=trjs-x64\style\trjs.ico
cmd /c electron-packager trjs-x86 --platform=win32 --arch=ia32 --overwrite --icon=trjs-x86\style\trjs.ico
