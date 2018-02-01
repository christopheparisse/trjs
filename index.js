'use strict';
const electron = require('electron');
// Module to control application life.
const app = electron.app;
app.showExitPrompt = true;
var isReady = false;
var oneWindow = false;

process.listWindows = [];
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
const BrowserWindow = electron.BrowserWindow;
// Menu
const Menu = electron.Menu;

function createWindow() {
    for (var i in process.listWindows) {
        if (process.listWindows[i] === null || process.listWindows[i] === undefined) {
            startWindow(i);
            return i;
        }
    }
    startWindow(i+1);
    return i+1;
}

function startWindow(nth) {
    oneWindow = true;
    // Create the browser window.
    process.listWindows[nth] = new BrowserWindow({width: 800, height: 800});

    // and load the index.html of the app.
    process.listWindows[nth].loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    // process.listWindows[nth].webContents.openDevTools();

    // Emitted when the window is closed.
    process.listWindows[nth].on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        process.listWindows[nth]= null;
    });

    // Emitted when the window is closing.
    process.listWindows[nth].on('close', function (e) {
        if (app.showExitPrompt) {
            e.preventDefault(); // Prevents the window from closing
            electron.dialog.showMessageBox({
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Unsaved data will be lost. Are you sure you want to quit?'
            }, function (response) {
                if (response === 0) { // Runs the following if 'Yes' is clicked
                    app.showExitPrompt = false;
                    process.listWindows[nth].close();
                }
            });
        }
    });
}

function createMenu() {
    var template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open ...', accelerator: 'CmdOrCtrl+O', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('opentranscript', 'main');
                }
                },
                {
                    label: 'Open media ...', accelerator: 'Shift+CmdOrCtrl+O', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('openmedia', 'main');
                }
                },
                {
                    label: 'New transcription', accelerator: 'CmdOrCtrl+N', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('newtranscript', 'main');
                }
                },
                {
                    label: 'New window', accelerator: 'Shift+CmdOrCtrl+N', click: function () {
                    var nth = createWindow()
                    process.listWindows[nth].webContents.send('newtranscript', 'main');
                }
                },
                {
                    label: 'Save', accelerator: 'CmdOrCtrl+S', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('save', 'main');
                }
                },
                {
                    label: 'Save as ...', accelerator: 'Shift+CmdOrCtrl+S', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('saveas', 'main');
                }
                },
                {
                    label: 'Save in cache', accelerator: 'CmdOrCtrl+T', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('innersave', 'main');
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
                    window.webContents.send('clearmru', 'main');
                }
                },
                {type: 'separator'},
                {
                    label: 'Export', accelerator: 'Alt+CmdOrCtrl+S', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('export', 'main');
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
                    window.webContents.send('insertline', 'main');
                }
                },
                {
                    label: 'Delete line', accelerator: 'CmdOrCtrl+D', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('deleteline', 'main');
                }
                },
                {
                    label: 'Insert macro', accelerator: 'CmdOrCtrl+F1', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('insertmacro', 'main');
                }
                },
                {type: 'separator'},
                {label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('undo', 'main');
                }
                },
                {label: 'Undo list', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('undolist', 'main');
                }
                },
                {label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('redo', 'main');
                }
                },
                {type: 'separator'},
                {label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut'},
                {label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy'},
                {label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste'},
                {label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall'},
                {type: 'separator'},
                {label: 'Show/hide multiple selection', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('showhidemsel', 'main');
                }
                },
                {label: 'Select all', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('selectmsel', 'main');
                }
                },
                {label: 'Deselect all', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('deselectmsel', 'main');
                }
                },
                {label: 'Cut lines', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('cutmsel', 'main');
                }
                },
                {label: 'Copy lines', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('copymsel', 'main');
                }
                },
                {label: 'Paste Lines', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('pastemsel', 'main');
                }
                },
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {label: 'Search', accelerator: 'CmdOrCtrl+F', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('search', 'main');
                }
                },
                {type: 'separator'},
                {label: 'Metadata', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('showmeta', 'main');
                }
                },
                {label: 'Participants', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('showpart', 'main');
                }
                },
                {label: 'Templates', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('showtemp', 'main');
                }
                },
                {type: 'separator'},
                {label: 'Parameters', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('showparameters', 'main');
                }
                },
                {type: 'separator'},
                {label: 'Check transcription', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('checktranscript', 'main');
                }
                },
                {label: 'Shift all time links', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('shifttime', 'main');
                }
                },
                {label: 'Media convert', click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('mediaconvert', 'main');
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
                {label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize'},
                {label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close'},
                {type: 'separator'},
                {
                    label: 'Toolbox',
                    submenu: [
                        {   label: 'File Toolbox',
                            type: 'checkbox',
                            checked: true,
                            click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            window.webContents.send('palettefile', 'main');
                        }
                        },
                        {   label: 'Edit Toolbox',
                            type: 'checkbox',
                            checked: true,
                            click: function () {
                            var window = BrowserWindow.getFocusedWindow();
                            window.webContents.send('paletteedit', 'main');
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
                    window.webContents.send('helpstart', 'main');
                }
            },
            {
                label: 'Transcribing new data',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('helptranscribe', 'main');
                }
            },
            {
                label: 'Editing a previous transcription',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('helpedit', 'main');
                }
            },
            {
                label: 'Import and export',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('helpimportexport', 'main');
                }
            },
            {
                label: 'Parameters and special features',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('helpparams', 'main');
                }
            },
            {
                label: 'Online Help',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('help', 'main');
                }
            },
            {
                label: 'Key Bindings',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('messagebindings', 'main');
                }
            },
            {
                label: 'Messages',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('messages', 'main');
                }
            },
            {
                label: 'Reset messages',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('resetmessages', 'main');
                }
            },
            {
                label: 'About',
                click: function () {
                    var window = BrowserWindow.getFocusedWindow();
                    window.webContents.send('about', 'main');
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
                            window.webContents.send('about', 'main');
                        }
                    },
                    {type: 'separator'},
                    {label: 'Services', role: 'services', submenu: []},
                    {type: 'separator'},
                    {label: 'Parameters', click: function () {
                        var window = BrowserWindow.getFocusedWindow();
                        window.webContents.send('showparameters', 'main');
                    }},
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
    var localmenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(localmenu);
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
    if (process.platform !== 'darwin') {
        app.quit()
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
