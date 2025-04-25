# Insightify

Insightify is a comprehensive analytics platform that includes a web application, mobile app, and backend services for analyzing YouTube comments and providing valuable insights.

## 🌟 Features

- Web Application: React-based dashboard for detailed analytics
- Mobile App: React Native application for on-the-go insights
- Backend: Django-powered API with ML capabilities
- YouTube Comment Analysis
- Sentiment Analysis
- Interactive Visualizations
- Cross-platform Support

## 📁 Project Structure

```
Insightify/
├── Frontend/          # React Web Application
├── MobileApp/         # React Native Mobile Application
├── yt_comment_analyzer/ # Django Backend
├── Documentation/     # Project documentation
└── requirements.txt   # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn
- Expo CLI (for mobile app)
- Virtual environment (recommended for Python)

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix or MacOS
source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Navigate to backend directory and run migrations:
```bash
cd yt_comment_analyzer
python manage.py migrate
```

4. Start the backend server:
```bash
python manage.py runserver 
```

### Web Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The web application will be available at `http://localhost:3000`

### Mobile App Setup

1. Navigate to the MobileApp directory:
```bash
cd MobileApp
```

2. Install dependencies:
```bash
npm install
```

3. Configure IP Address:
   - Open `MobileApp/constants/api.ts` or your API configuration file
   - Replace the API URL with your local IP address (not localhost or 127.0.0.1)
   - Example: `http://192.168.1.5:8000` (Use your actual local IP address)
   
   To find your IP address:
   - Windows: Run `ipconfig` in CMD/PowerShell
   - Mac/Linux: Run `ifconfig` in Terminal
   - Or check your network settings

4. Start the Expo development server:
```bash
npx expo start
```

5. Run on Android:
```bash
npm run android
```

6. Run on iOS (requires MacOS):
```bash
npm run ios
```

Note: When testing on a physical device:
- Ensure your mobile device is on the same WiFi network as your development machine
- Use your machine's local IP address in the API configuration
- If using Expo Go, scan the QR code from the Expo development server

## 📱 Mobile App Features

- Cross-platform support (iOS & Android)
- Built with React Native and Expo
- Native UI components
- Offline support
- Real-time analytics

## 🛠 Tech Stack

### Backend
- Django
- Python
- NLTK
- TextBlob
- PyTorch
- Transformers

### Web Frontend
- React
- TailwindCSS
- Victory Charts
- Axios

### Mobile App
- React Native
- Expo
- NativeWind
- React Navigation
- Victory Native
- Zustand

## 📦 Dependencies

### Backend Dependencies
- Django
- google-api-python-client
- nltk
- emoji
- textblob
- torch
- transformers
- django-cors-headers

### Mobile App Dependencies
- expo
- react-native
- nativewind
- react-navigation
- victory-native
- zustand
- And more (see MobileApp/package.json)

## 🔧 Configuration

1. Backend Configuration:
   - Set up your YouTube API credentials
   - Configure Django settings
   - Set up environment variables

2. Frontend Configuration:
   - Configure API endpoints
   - Set up environment variables

3. Mobile App Configuration:
   - Configure Expo settings
   - Set up environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Lead Developers
- Irfan Naikwade
- Sandesh Pol


## 🔮 Future Enhancements

- Enhanced ML capabilities
- Advanced visualization options
- Integration with more platforms
- Extended mobile features