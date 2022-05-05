; transcriberjs-x64.nsi
;
; This script is based on example1.nsi, but it remember the directory,
; has uninstall support and (optionally) installs start menu shortcuts.
;
; It will install transcriberjs.nsi into a directory that the user selects,

;--------------------------------
!include "MUI.nsh"
!include nsDialogs.nsh

;--------------------------------

; The name of the installer
Name "trjs-install-v0.7.8c-x64"

; The file to write
OutFile "trjs-v0.7.8c-x64.exe"

; The default installation directory
InstallDir "$PROGRAMFILES64\trjs"

; Registry key to check for directory (so if you install again, it will
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\trjs" "Install_Dir"

; Request application privileges for Windows Vista
RequestExecutionLevel admin

;--------------------------------

; Pages

Page components
Page directory
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

;--------------------------------

; The stuff to install
Section "trjs 64bits v0.7.8c (required)"

  SectionIn RO

  ; Put file there
  SetOutPath $INSTDIR
  File /r "c:\devlopt\builds\trjs-x64\Trjs-win32-x64\*.*"
 
  ; Write the installation path into the registry
  WriteRegStr HKLM SOFTWARE\trjs "Install_Dir" "$INSTDIR"

  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\trjs" "DisplayName" "trjs"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\trjs" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\trjs" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\trjs" "NoRepair" 1
  WriteUninstaller "uninstall.exe"

  CreateDirectory "$SMPROGRAMS\trjs"
  CreateShortCut "$SMPROGRAMS\trjs\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
  CreateShortCut "$SMPROGRAMS\trjs\trjs.lnk" "$INSTDIR\trjs.exe"
  
SectionEnd

; Optional section (can be disabled by the user)
Section "Desktop Shortcuts"

  CreateShortCut "$DESKTOP\trjs.lnk" "$INSTDIR\trjs.exe"
  
SectionEnd

;--------------------------------

; Uninstaller

Section "Uninstall"

  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\trjs"
  DeleteRegKey HKLM SOFTWARE\trjs

  ; Remove shortcuts, if any
  Delete "$SMPROGRAMS\trjs\*.*"
  Delete "$DESKTOP\trjs.lnk"

  ; Remove directories used
  RMDir "$SMPROGRAMS\trjs"
  RMDir /r "$INSTDIR"

SectionEnd
