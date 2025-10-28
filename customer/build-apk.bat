@echo off
echo Building APK for PixelPerfect App...

REM Build the React app
echo Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)

REM Sync with Capacitor
echo Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Failed to sync with Capacitor
    pause
    exit /b 1
)

REM Try to build APK using Capacitor CLI
echo Building APK using Capacitor...
call npx cap build android
if %errorlevel% neq 0 (
    echo Capacitor build failed, trying direct Gradle build...
    cd android
    if exist gradlew.bat (
        call gradlew.bat assembleDebug
        if %errorlevel% equ 0 (
            echo APK built successfully!
            echo Location: app\build\outputs\apk\debug\app-debug.apk
        ) else (
            echo ERROR: Gradle build failed. Please install Java JDK 17+
            echo Download from: https://adoptium.net/temurin/releases/
        )
    ) else (
        echo ERROR: gradlew.bat not found
    )
    cd ..
) else (
    echo APK built successfully using Capacitor!
)

pause