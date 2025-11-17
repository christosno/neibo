# Renaming Project to Neibo - Final Steps

All code references have been updated! Here are the remaining steps to complete the renaming:

## ✅ Already Completed
- ✅ Updated `package.json` name to "neibo"
- ✅ Updated `app.json` (name, slug, scheme, bundle IDs)
- ✅ Renamed components: `PlantlyButton` → `NeiboButton`, `PlantlyImage` → `NeiboImage`, `PlantlyForm` → `NeiboForm`
- ✅ Updated all component imports and usages
- ✅ Updated store names: `neibo-plants-store`, `neibo-user-store`
- ✅ Updated display text "Plantly" → "Neibo"

## 📋 Remaining Steps

### 1. Rename Asset File (Optional)
If you want to rename the default image:
```bash
cd /Users/c.nounis/rn-projects/plantly
mv assets/plantly.png assets/neibo.png
```
Or replace it with a new image named `neibo.png`

### 2. Update package-lock.json
Run this to update package-lock.json with the new name:
```bash
npm install
```

### 3. Rename the Project Folder
```bash
cd /Users/c.nounis/rn-projects
mv plantly neibo
cd neibo
```

### 4. Rename GitHub Repository

#### Option A: Rename on GitHub Website
1. Go to https://github.com/christosno/plantly
2. Click "Settings" tab
3. Scroll down to "Repository name"
4. Change from `plantly` to `neibo`
5. Click "Rename"

#### Option B: Create New Repo (if you prefer)
```bash
# Create new repo on GitHub first, then:
git remote set-url origin https://github.com/christosno/neibo.git
git push -u origin main
```

### 5. Update Git Remote URL
After renaming on GitHub:
```bash
git remote set-url origin https://github.com/christosno/neibo.git
git remote -v  # Verify the change
```

### 6. Clean Build (Recommended)
After renaming, clean and rebuild:
```bash
# Clean Expo cache
npx expo start --clear

# Or if you have native builds:
rm -rf ios android
npx expo prebuild
```

### 7. Update iOS/Android Native Code (if needed)
If you've already built native apps, you may need to:
- Update Xcode project name
- Update Android package name in native files
- Rebuild the apps

## 🎉 You're Done!

Your project is now renamed to "Neibo"!

