# TRJS - TranscriberJS

To install TRJS from sources, you have to:

1- install node.js and npm

2- Download this repository (trjs), unzip it or better clone it with
```
git clone https://github.com/christopheparisse/trjs.git
```

3- Download a distribution of Java and FFMPEG. FFMPEG excecutables should be copied into 
./tools (named ffmpeg, ffprobe, ffmpeg-x64.exe, ffprobe-x64.exe). Java runtimes shoudl be 
copied into ./tools/java-osx (for MacOS) and ./tools/java-x64 (for Windows x64)
 
4- Run the following commands 
```
npm install
npm update
npm rebuild
```

5- Start the program
```
npm start
```

6- Build the standalone application
```
npm rebuild
npm run build
npm run git
npm run dist

or

sh ver.sh
sh mktrjs-macos.sh pathtobuild
sh buildmacos.sh pathtobuild
```

This should create the application for MacOS.

For windows, use mktrjs-x64.sh (under ubuntu shell) and buildwin.bat (under windows).
It uses the NSIS software. Ubuntu shell is not mandatory, but you should then 
create a .bat file that does the same thing than mktrjs-x64.sh
