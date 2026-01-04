# Loan Management Mobile App

A React Native mobile application for loan management system with role-based dashboards for Admin, Staff, and Collection Agents.

## Features

### 🔐 Authentication
- Login/Signup with role-based access
- Token-based authentication
- Secure storage with AsyncStorage

### 👨‍💼 Admin Dashboard
- Total loans and customer overview
- Collection analytics with charts
- Agent management
- Real-time metrics

### 👥 Staff Dashboard  
- Team performance monitoring
- Agent assignment management
- Collection reports
- Top performer tracking

### 🏃‍♂️ Collection Agent Dashboard
- Assigned loan schedules
- Payment collection interface
- Pending dues tracking
- Performance metrics

### 📱 Mobile Features
- Responsive design for all screen sizes
- Pull-to-refresh functionality
- Offline-ready architecture
- Push notifications support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: React Native Chart Kit
- **Icons**: React Native Vector Icons
- **UI Components**: React Native Paper & Elements

## API Integration

The app integrates with the same Django backend as the web application:

- **Base URL**: `http://127.0.0.1:8000/api`
- **Authentication**: Token-based
- **Endpoints**: 
  - `/auth/login/` - User authentication
  - `/auth/customers/` - Customer management
  - `/auth/loans/` - Loan operations
  - `/auth/loan-schedules/` - Payment schedules
  - `/daily-collections/` - Collection tracking

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For web
   npm run web
   ```

### Configuration

1. **API Configuration**
   - Update the API base URL in `src/services/api.js`
   - Ensure the Django backend is running

2. **Environment Setup**
   - Configure your development environment
   - Set up Android/iOS simulators

## Project Structure

```
mobile-app/
├── src/
│   ├── context/
│   │   └── AuthContext.js          # Authentication state management
│   ├── navigation/
│   │   └── AppNavigator.js         # Navigation configuration
│   ├── screens/
│   │   ├── dashboards/
│   │   │   ├── AdminDashboard.js   # Admin role dashboard
│   │   │   ├── AgentDashboard.js   # Collection agent dashboard
│   │   │   └── ManagerDashboard.js # Staff role dashboard
│   │   ├── LoginScreen.js          # Authentication screen
│   │   ├── SignupScreen.js         # Registration screen
│   │   └── LoadingScreen.js        # Loading indicator
│   └── services/
│       ├── api.js                  # HTTP client configuration
│       └── loanService.js          # API service methods
├── assets/                         # Images and icons
├── App.js                         # Main application component
├── app.json                       # Expo configuration
└── package.json                   # Dependencies and scripts
```

## User Roles & Permissions

### Master Admin
- Full system access
- User management
- System configuration
- Analytics and reporting

### Staff Manager
- Agent management
- Loan assignment
- Performance monitoring
- Team reports

### Collection Agent
- Assigned loan schedules
- Payment collection
- Customer interaction
- Performance tracking

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React Native best practices
- Implement proper error handling
- Use TypeScript for type safety (optional)

### Performance
- Implement lazy loading for large lists
- Use FlatList for performance optimization
- Optimize images and assets
- Implement proper caching strategies

### Security
- Secure token storage
- Input validation
- API request encryption
- Biometric authentication (future)

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### App Store Deployment
1. Configure app signing
2. Update app.json with production settings
3. Build and submit to respective stores

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This mobile app mirrors the functionality of the web application and uses the same backend API for seamless data synchronization.