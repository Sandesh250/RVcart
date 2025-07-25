# 🆓 Free Setup Guide - Sensor Marketplace

This app works completely FREE with Firebase's free tier!

## ✅ What's Included in Free Plan:
- **Authentication** - Unlimited users
- **Firestore Database** - 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Images** - Stored as data URLs (no storage costs)
- **Hosting** - Can deploy to Firebase Hosting (free)

## 🚀 Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "sensor-marketplace"
4. **Skip Google Analytics** (not needed)
5. Click "Create project"

### 2. Enable Authentication
1. In your project, click "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

### 3. Create Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location (choose closest to you)
5. Click "Done"

### 4. Get Your Config
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with name "sensor-marketplace-web"
6. **Copy the config object**

### 5. Update Your App
1. Open `src/firebase.js`
2. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 6. Test the App
1. The app is already running at `http://localhost:3000`
2. Try signing up with an RVCE email: `test@rvce.edu.in`
3. Post an item with an image
4. Everything works for FREE! 🎉

## 💰 Cost Breakdown
- **Authentication**: $0 (unlimited users)
- **Firestore**: $0 (1GB free, plenty for college project)
- **Storage**: $0 (using data URLs instead)
- **Total**: $0/month

## 🔧 Security Rules (Optional)
If you want to add basic security, go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Features Working
- ✅ RVCE email authentication
- ✅ Post items with images
- ✅ Search and browse items
- ✅ Contact sellers via email/WhatsApp
- ✅ Responsive design
- ✅ Real-time updates

## 🚨 Troubleshooting
- **"Failed to create account"**: Check your Firebase config
- **"Permission denied"**: Add the security rules above
- **Images not showing**: They're stored as data URLs (normal for free plan)

## 🚀 Ready to Deploy?
When you're ready to share your app:
1. Run `npm run build`
2. Deploy to Firebase Hosting (free) or any other hosting service

**That's it! Your app is completely free and fully functional! 🎉** 