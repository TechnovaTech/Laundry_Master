# Build APK using Android Studio

## Step 1: Install Android Studio
1. Download: https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio

## Step 2: Open Project in Android Studio
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to: `c:\Users\vivek\Downloads\pixel-perfect-clone-0950-main\pixel-perfect-clone-0950-main\android`
4. Click "OK"

## Step 3: Sync Project
1. Android Studio will automatically sync Gradle
2. Wait for "Gradle sync finished" message
3. If prompted, install missing SDK components

## Step 4: Build APK
1. In Android Studio menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Wait for build to complete
3. Click "locate" when build finishes

## APK Location
After successful build:
`android\app\build\outputs\apk\debug\app-debug.apk`

## Alternative: Command Line in Android Studio
1. Open Terminal in Android Studio (bottom panel)
2. Run: `./gradlew assembleDebug`
3. APK will be generated in same location

## Troubleshooting
- If Gradle sync fails: File → Sync Project with Gradle Files
- If SDK missing: Tools → SDK Manager → Install required SDKs
- If build fails: Build → Clean Project, then Build → Rebuild Project