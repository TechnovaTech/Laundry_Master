@echo off
echo Opening Android project in Android Studio...

REM Try to find Android Studio installation
set STUDIO_PATH=""

REM Common Android Studio paths
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    set STUDIO_PATH="C:\Program Files\Android\Android Studio\bin\studio64.exe"
)
if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\tools\android.bat" (
    set STUDIO_PATH="C:\Users\%USERNAME%\AppData\Local\Android\Sdk\tools\android.bat"
)

if %STUDIO_PATH%=="" (
    echo Android Studio not found in common locations
    echo Please install Android Studio from: https://developer.android.com/studio
    echo Then manually open the 'android' folder in Android Studio
    start "" "android"
    pause
    exit /b 1
)

echo Found Android Studio at: %STUDIO_PATH%
echo Opening project...

REM Open Android Studio with the android project folder
%STUDIO_PATH% "android"

echo.
echo Instructions:
echo 1. Wait for Gradle sync to complete
echo 2. Go to Build menu → Build Bundle(s) / APK(s) → Build APK(s)
echo 3. APK will be at: android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause