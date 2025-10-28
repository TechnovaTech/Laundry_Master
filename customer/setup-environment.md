# Setup Environment for APK Build

## 1. Install Java JDK
1. Download Java JDK 17 from: https://adoptium.net/temurin/releases/
2. Install it and note the installation path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`)
3. Set JAVA_HOME environment variable:
   - Open System Properties → Advanced → Environment Variables
   - Add new System Variable: `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`
   - Add to PATH: `%JAVA_HOME%\bin`

## 2. Install Android SDK (Optional - for signing)
1. Download Android Command Line Tools from: https://developer.android.com/studio#command-tools
2. Extract to `C:\Android\cmdline-tools\latest`
3. Set ANDROID_HOME environment variable:
   - Add new System Variable: `ANDROID_HOME` = `C:\Android`
   - Add to PATH: `%ANDROID_HOME%\cmdline-tools\latest\bin`

## 3. Build APK
After setting up Java, run:
```bash
build-apk.bat
```

Or manually:
```bash
npm run build
npx cap sync android
cd android
gradlew.bat assembleDebug
```

## 4. Find Your APK
The APK will be located at:
`android\app\build\outputs\apk\debug\app-debug.apk`

## Quick Java Installation Check
Open Command Prompt and run:
```bash
java -version
```
You should see Java version information.