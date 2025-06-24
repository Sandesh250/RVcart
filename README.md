# College Sensor Marketplace

A React web application where college students can buy and sell electronics sensors. Built with Firebase backend and styled with Tailwind CSS.

## Features

- 🔐 **College Email Authentication** - Only college email addresses (.edu, .ac.in, .college.edu) are allowed
- 📱 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- 📸 **Image Upload** - Upload images for sensor listings with Firebase Storage
- 🔍 **Search & Filter** - Search through available sensors
- 💬 **Contact Options** - Contact sellers via email or WhatsApp
- 🛡️ **Protected Routes** - Secure posting functionality for authenticated users
- 📊 **Real-time Data** - Firebase Firestore for real-time data management

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
3. Update the Firebase configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Firestore Security Rules

Set up Firestore security rules:

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

### 5. Storage Security Rules

Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Start the Development Server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Home.js          # Homepage with item listings
│   ├── ItemCard.js      # Individual item display
│   ├── Login.js         # Login form
│   ├── Navbar.js        # Navigation bar
│   ├── PostItem.js      # Item posting form
│   ├── PrivateRoute.js  # Route protection
│   └── Signup.js        # Registration form
├── contexts/
│   └── AuthContext.js   # Authentication context
├── App.js              # Main app component
├── firebase.js         # Firebase configuration
├── index.js           # App entry point
└── index.css          # Global styles
```

## Usage

### For Students

1. **Sign Up**: Create an account using your college email address
2. **Browse Items**: View all available sensors on the homepage
3. **Search**: Use the search bar to find specific sensors
4. **Contact Sellers**: Click "Email" or "WhatsApp" to contact sellers
5. **Post Items**: Click "Post Item" to sell your own sensors

### For Sellers

1. **Post Items**: Fill out the form with title, description, price, and optional image
2. **Manage Listings**: Your items will appear on the homepage
3. **Respond to Inquiries**: Check your email for buyer inquiries

## Features in Detail

### Authentication
- College email validation (.edu, .ac.in, .college.edu domains)
- Secure password requirements
- Protected routes for authenticated users

### Item Management
- Create listings with images
- Real-time updates
- Search and filter functionality
- Contact integration (Email & WhatsApp)

### User Experience
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback
- Modern, clean interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
