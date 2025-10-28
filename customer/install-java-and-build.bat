@echo off
echo ========================================
echo PixelPerfect App - APK Builder
echo ========================================

echo Step 1: Download and Install Java JDK 17
echo.
echo Please follow these steps:
echo 1. Go to: https://adoptium.net/temurin/releases/
echo 2. Download "OpenJDK 17 LTS" for Windows x64
echo 3. Install it (remember the installation path)
echo 4. Add JAVA_HOME environment variable
echo.
echo After installing Java, run: build-apk.bat
echo.

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo Java is already installed! Running build...
    call build-apk.bat
) else (
    echo Java is not installed. Please install it first.
    echo.
    echo Quick Install Steps:
    echo 1. Download: https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.9%%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.9_9.msi
    echo 2. Run the installer
    echo 3. Restart Command Prompt
    echo 4. Run this script again
)

pause