'use strict';
var electron = require('electron');
// Module to control application life.
var app = electron.app;
var Store = require('electron-store');
var store = new Store();

app.stopExit = true;
var isReady = false;
var oneWindow = false;

process.listWindows = [];
process.ischangedWindows = [];
process.idWindows = [];
process.argsOpenFile = null;

// copy first instance command line


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// var process.mainWindow;

//var process = require(process);
//console.log(process.argv);

var secondInstance = app.makeSingleInstance(function(commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    commandLine.push('--secondInstance');
    process.argsOpenFile = commandLine;
    console.log('secondInstance', commandLine, workingDirectory);
    var nth = createWindow();
    // process.listWindows[nth].webContents.send('readtranscript', 'path');
    /*
    if (process.mainWindow) {
        if (process.mainWindow.isMinimized()) process.mainWindow.restore();
        process.mainWindow.focus();
        if (commandLine.length>1 && commandLine[1] !== 'index.js') {
            process.mainWindow.webContents.send('readtranscript', commandLine[1]);
        } else if (commandLine.length>2) {
            process.mainWindow.webContents.send('readtranscript', commandLine[2]);
        }
    }
    */
});

if (secondInstance) {
    //app.quit();
    return;
}

app.on('open-file', function(event, path) {
    console.log('open-file', event, path);

    function openFile() {
        process.macosxOpenFile = path;
        var nth = createWindow();
        process.listWindows[nth].webContents.send('readtranscript', path);
    }

    function waitForReady() {
        if (isReady === false) {
            oneWindow = true; // the window will be create later. do not open one
            setTimeout(waitForReady, 2000);
        } else {
            openFile();
        }
    }

    waitForReady();

});

// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
// Menu
var Menu = electron.Menu;

function createWindow(arg) {
    for (var i in process.listWindows) {
        if (process.listWindows[i] === null || process.listWindows[i] === undefined) {
            process.listWindows[i] = startWindow(arg);
            process.ischangedWindows[i] = false;
            process.idWindows[i] = process.listWindows[i].id;

            // Emitted when the window is closed.
            process.listWindows[i].on('closed', function () {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                process.listWindows[i] = null;
                process.ischangedWindows[i] = false;
                // test whether there are other opened windows
                // console.log("w.on CLOSED: test");
                for (var k=0; k < process.listWindows.length; k++) {
                    if (process.listWindows[k] !== null) {
                        return;
                    }
                    // console.log("NO windows opened");
                    if (process.platform !== 'darwin') {
                        app.quit();
                    }
                }
            });
            return i;
        }
    }

    process.listWindows.push(startWindow(arg));
    process.ischangedWindows.push(false);
    i = process.listWindows.length-1;
    process.idWindows.push(process.listWindows[i].id);

    // Emitted when the window is closed.
    process.listWindows[i].on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        process.listWindows[i] = null;
    });
    return i;
}

function startWindow(arg) {
    oneWindow = true;
    // Create the browser window.
    var wth = parseInt(store.get('width'));
    var hgt = parseInt(store.get('height'));
//    console.log(wth, hgt);

    /*
    if (wth < 200 || wth > 5000) wth = 800;
    if (hgt < 200 || hgt > 4000) hgt = 900;
    console.log(wth, hgt);
    */

    var displaysize = electron.screen.getPrimaryDisplay().size;
//    console.log(displaysize);
    if (wth > displaysize.width) wth = displaysize.width - 10;
    if (hgt > displaysize.height) hgt = displaysize.height - 10;
//    console.log(wth, hgt);

    var wnd = new BrowserWindow({width: wth, height: hgt});

    if (arg) {
        wnd.loadURL('file://' + __dirname + '/index.html?newtranscript');
    } else {
        // and load the index.html of the app.
        wnd.loadURL('file://' + __dirname + '/index.html');
    }

    // Open the DevTools.
    // wnd.webContents.openDevTools();

    // Emitted when the window is closing.
    wnd.on('close', function (e) {
        if (app.stopExit) {
            e.preventDefault(); // Prevents the window from closing
            //console.log("w.on close");

            var sz = e.sender.getSize();
            // console.log("w: ",e);
            //console.log('sz: ', sz );
            store.set('width', sz[0]);
            store.set('height', sz[1]);

            /*
            electron.dialog.showMessageBox({
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Main: Unsaved data will be lost. Are you sure you want to quit?'
            }, function (response) {
                if (response === 0) { // Runs the following if 'Yes' is clicked
                    app.stopExit = false;
                    w.close();
                }
            });
            */
        }
    });

    return wnd;
}

function createMenu() {
    var template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open ...', accelerator: 'CmdOrCtrl+O', click: function () {
//                    label: 'Open Ctrl+O ...', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (!window) {
                            var n = createWindow();
                            process.listWindows[n].webContents.send('opentranscript', 'main');
                        } else {
                            window.webContents.send('opentranscript', 'main');
                        }
                    }
                },
                {
                    label: 'Open media ...', accelerator: 'Shift+CmdOrCtrl+O', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (!window) {
                            var n = createWindow();
                            process.listWindows[n].webContents.send('openmedia', 'main');
                        } else {
                            window.webContents.send('openmedia', 'main');
                        }
                    }
                },
                {
                    label: 'New transcription', accelerator: 'CmdOrCtrl+N', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (!window) {
                        var n = createWindow( true );
                        process.listWindows[n].webContents.send('newtranscript', 'main');
                    } else {
                        window.webContents.send('newtranscript', 'main');
                    }
                }
                },
                {
                    label: 'New window', accelerator: 'Shift+CmdOrCtrl+N', click: function () {
                    var nth = createWindow();
                    process.listWindows[nth].webContents.send('newtranscript', 'main');
                }
                },
                {
                    label: 'Save', accelerator: 'CmdOrCtrl+S', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('save', 'main');
                }
                },
                {
                    label: 'Save as ...', accelerator: 'Shift+CmdOrCtrl+S', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('saveas', 'main');
                    }
                },
                {
                    label: 'Save in cache', accelerator: 'CmdOrCtrl+T', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('innersave', 'main');
                    }
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {type: 'separator'},
                {
                    label: 'Recent Files',
                    submenu: [
                    ]
                },
                {
                    label: 'Clear recent files', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('clearmru', 'main');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Export', accelerator: 'Alt+CmdOrCtrl+S', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('export', 'main');
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Insert line', accelerator: 'F6', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('insertline', 'main');
                    }
                },
                {
                    label: 'Delete line', accelerator: 'CmdOrCtrl+D', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('deleteline', 'main');
                    }
                },
                {
                    label: 'Insert macro', accelerator: 'CmdOrCtrl+F1', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('insertmacro', 'main');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('undo', 'main');
                    }
                },
                {
                    label: 'Undo list', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('undolist', 'main');
                    }
                },
                {
                    label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('redo', 'main');
                    }
                },
                {type: 'separator'},
                {label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
                {label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
                {label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
                {label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall'},
                {type: 'separator'},
                {
                    label: 'Show/hide multiple selection', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('showhidemsel', 'main');
                    }
                },
                {
                    label: 'Select all', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('selectmsel', 'main');
                    }
                },
                {
                    label: 'Deselect all', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('deselectmsel', 'main');
                    }
                },
                {
                    label: 'Cut lines', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('cutmsel', 'main');
                    }
                },
                {
                    label: 'Copy lines', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('copymsel', 'main');
                    }
                },
                {
                    label: 'Paste Lines', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('pastemsel', 'main');
                    }
                },
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Search', accelerator: 'CmdOrCtrl+F', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('search', 'main');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Tiers', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('showtemp', 'main');
                    }
                },
                {
                    label: 'Other information',
                    submenu: [
                        {
                            label: 'Metadata', click: function () {
                                var window = BrowserWindow.getFocusedWindow();
                                if (window) window.webContents.send('showmeta', 'main');
                            }
                        },
                        {
                            label: 'Speaker data', click: function () {
                                var window = BrowserWindow.getFocusedWindow();
                                if (window) window.webContents.send('showpart', 'main');
                            }
                        }
                    ]
                },
                {type: 'separator'},
                {
                    label: 'Parameters', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('showparameters', 'main');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Macros',
                    click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('macros', 'main');
                    }
                },
                {type: 'separator'},
                {
                    label: 'Check transcription', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('checktranscript', 'main');
                    }
                },
                {
                    label: 'Shift all time links', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('shifttime', 'main');
                    }
                },
                {
                    label: 'Media convert', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('mediaconvert', 'main');
                    }
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Full Screen', accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                    })(),
                    click: function (item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                    },
                {
                    label: 'Zoom in (all window)', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('wndzoomin', 'main');
                    }
                },
                {
                    label: 'Zoom out (all window)', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('wndzoomout', 'main');
                    }
                },
                {
                    label: 'Zoom reset (all window)', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        if (window) window.webContents.send('wndzoomreset', 'main');
                    }
                },
                {label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
                {label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close'},
                {type: 'separator'},
                {
                    label: 'Toolbox',
                    submenu: [
                        {   label: 'File Toolbox',
                            type: 'checkbox',
                            checked: true,
                            id: 'palettefile',
                            click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            if (window) window.webContents.send('palettefile', 'main');
                        }
                        },
                        {   label: 'Edit Toolbox',
                            type: 'checkbox',
                            checked: true,
                            id: 'paletteedit',
                            click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            if (window) window.webContents.send('paletteedit', 'main');
                        }
                        },
                    ]
                },
                {type: 'separator'},
                {
                    label: 'Toggle Developer Tools', accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Alt+Command+Z';
                    else
                        return 'Ctrl+Shift+Z';
                })(),
                    click: function (item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.toggleDevTools();
                    }
                },
            ]
        },
        {
            label: 'Help', role: 'help',
            submenu: [
            {
                label: 'Start/open a transcription',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('helpstart', 'main');
                }
            },
            {
                label: 'Transcribing new data',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('helptranscribe', 'main');
                }
            },
            {
                label: 'Editing a previous transcription',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('helpedit', 'main');
                }
            },
            {
                label: 'Import and export',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('helpimportexport', 'main');
                }
            },
            {
                label: 'Parameters and special features',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('helpparams', 'main');
                }
            },
            {type: 'separator'},
            {
                label: 'Online Help',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('help', 'main');
                }
            },
            {type: 'separator'},
            {
                label: 'Key Bindings',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('messagebindings', 'main');
                }
            },
            {
                label: 'Messages',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('messages', 'main');
                }
            },
            {
                label: 'Reset messages',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('resetmessages', 'main');
                }
            },
            {type: 'separator'},
            {
                label: 'About',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    if (window) window.webContents.send('about', 'main');
                }
            },
        ]
        },
    ];

    if (process.platform === 'darwin') {
        var name = require('electron').app.getName();
        template.unshift(
            {
                label: name,
                submenu: [
                    {label: 'About ' + name,
                        click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            if (window) window.webContents.send('about', 'main');
                        }
                    },
                    {type: 'separator'},
                    {label: 'Services', role: 'services', submenu: []},
                    {type: 'separator'},
                    {
                        label: 'Parameters', click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            if (window) window.webContents.send('showparameters', 'main');
                        }
                    },
                    {type: 'separator'},
                    {label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide'},
                    {label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers'},
                    {label: 'Show All', role: 'unhide'},
                    {type: 'separator'},
                    {
                        label: 'Quit', accelerator: 'Command+Q', click: function () {
                        app.quit();
                    }
                    },
                ]
            });
        // Window menu.
        template[4].submenu.push({type: 'separator'});
        template[4].submenu.push({label: 'Bring All to Front', role: 'front'});
    } else {
        // Windows & linux menu.
        template[0].submenu.push({type: 'separator'});
        template[0].submenu.push({
            label: 'Quit', accelerator: 'Alt+F4', click: function () {
                app.quit();
            }
        });
    }
    process.localmenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(process.localmenu);
/*
    const globalShortcut = electron.globalShortcut;
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    });
*/
    /*
    if (process.macosx_open_file !== undefined) {
        if (process.mainWindow)
            process.mainWindow.webContents.send('readtranscript', path);
        process.macosx_open_file = undefined;
    }
    */
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    isReady = true;
    //createWindow(0);
    createMenu();
    if (oneWindow === false) {
        createWindow();
    }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // console.log('window-all-closed');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    for (var i in process.listWindows) {
        if (process.listWindows[i] !== null && process.listWindows[i] !== undefined) return;
    }
    if (isReady === true) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
