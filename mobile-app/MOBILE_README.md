# Loan Management Mobile App

A comprehensive React Native mobile application for loan management system with role-based access control and complete feature parity with the web application.

## Features

### 🔐 Authentication & Authorization
- Secure login/signup with JWT token authentication
- Role-based access control (Admin, Staff, Collection Agent)
- Persistent authentication with AsyncStorage
- Automatic token refresh and logout

### 👥 User Roles & Dashboards

#### Admin Dashboard
- **Customer Management**: Add, edit, view customer profiles
- **Loan Applications**: Create and manage loan applications
- **Disbursement Management**: Process loan disbursements
- **User & Role Management**: Manage user roles and permissions
- **Audit Trail**: Track all system activities and changes
- **Comprehensive Analytics**: Charts and metrics for business insights

#### Staff Dashboard (Manager)
- **Agent Management**: Oversee collection agents
- **Performance Metrics**: Track team and individual performance
- **Collection Reports**: Generate and view collection reports
- **Target Setting**: Set and monitor collection targets
- **Team Overview**: Monitor team activities and attendance

#### Collection Agent Dashboard
- **Assigned Loans**: View and manage assigned loan collections
- **Today's Summary**: Daily collection targets and achievements
- **Collection History**: Track payment collection history
- **Pending Dues**: Monitor overdue payments
- **Performance Tracking**: Personal performance metrics
- **Quick Actions**: Fast access to common tasks

### 📊 Core Functionality

#### Loan Management
- Create new loan applications
- Loan approval/rejection workflow
- Disbursement processing
- Repayment scheduling
- Collection tracking

#### Customer Management
- Customer profile creation and editing
- Document management
- Loan history tracking
- Contact information management

#### Payment & Collections
- Payment collection interface
- Multiple payment methods support
- Receipt generation
- Collection reporting
- Overdue management

#### Reports & Analytics
- Collection performance reports
- Disbursement reports
- Agent performance analytics
- Financial dashboards with charts
- Export functionality

### 🔧 Technical Features
- **Offline Support**: Core functionality works offline
- **Real-time Updates**: Live data synchronization
- **Push Notifications**: Important alerts and reminders
- **Secure API Integration**: RESTful API with token authentication
- **Responsive Design**: Optimized for all screen sizes
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth user experience with loading indicators

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **Storage**: AsyncStorage for persistence
- **HTTP Client**: Axios for API calls
- **Charts**: React Native Chart Kit
- **Icons**: MaterialIcons from Expo
- **Authentication**: JWT tokens

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoints**
   Update the API base URL in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://your-backend-url/api';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   │   └── AuthContext.js  # Authentication context
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js # Main navigation setup
│   ├── screens/           # Screen components
│   │   ├── dashboards/    # Role-specific dashboards
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── CustomerManagementScreen.js
│   │   ├── LoanApplicationFormScreen.js
│   │   ├── DisbursementScreen.js
│   │   ├── RolesPermissionsScreen.js
│   │   └── AuditTrailScreen.js
│   └── services/          # API services
│       ├── api.js         # API configuration
│       └── loanService.js # Loan-related API calls
├── assets/               # Images and static assets
├── App.js               # Main app component
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## API Integration

The mobile app integrates with the Django backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/refresh/` - Token refresh

### Core Endpoints
- `GET /api/loans/` - Get loans list
- `POST /api/loans/` - Create new loan
- `GET /api/customers/` - Get customers
- `POST /api/customers/` - Add customer
- `GET /api/loan-schedules/` - Get payment schedules
- `POST /api/loan-schedules/{id}/collect/` - Collect payment

### Admin Endpoints
- `GET /api/users/` - Get all users
- `PATCH /api/users/{id}/` - Update user role
- `GET /api/audit-logs/` - Get audit trail
- `GET /api/reports/` - Generate reports

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different UI/functionality based on user role
- **API Security**: All API calls include authentication headers
- **Data Validation**: Input validation on both client and server
- **Secure Storage**: Sensitive data stored securely using AsyncStorage

## Performance Optimizations

- **Lazy Loading**: Screens loaded on demand
- **Image Optimization**: Compressed images for faster loading
- **API Caching**: Intelligent caching of API responses
- **Memory Management**: Efficient component lifecycle management
- **Bundle Optimization**: Optimized build for production

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Building for Production

### Android
```bash
# Generate APK
expo build:android

# Generate AAB (recommended for Play Store)
expo build:android -t app-bundle
```

### iOS
```bash
# Generate IPA
expo build:ios
```

## Deployment

### Android Play Store
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure app details and screenshots
4. Submit for review

### iOS App Store
1. Generate IPA file
2. Upload using Xcode or Application Loader
3. Configure app metadata in App Store Connect
4. Submit for review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Changelog

### Version 1.0.0
- Initial release with complete loan management functionality
- Role-based dashboards for Admin, Staff, and Collection Agent
- Customer and loan management
- Payment collection and tracking
- Reports and analytics
- Audit trail and user management

---

**Note**: This mobile app provides complete feature parity with the web application, ensuring a consistent user experience across all platforms.