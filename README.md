# RemoveList - Moving Platform

A comprehensive moving platform that helps users plan, organize, and execute their moves efficiently.

## Features

- **User Authentication**: Secure email-based registration and login
- **Move Management**: Create and track moving projects
- **Inventory Management**: Organize and track items
- **Timeline Planning**: Visual timeline for move preparation
- **Checklist System**: Comprehensive moving checklists
- **Tips & Guidance**: Expert moving advice and tips
- **Responsive Design**: Works on all devices

## Tech Stack

### Backend
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **Django Simple JWT**: Authentication
- **SQLite**: Database (can be upgraded to PostgreSQL)
- **Django CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 19**: User interface
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **React Router**: Navigation
- **Lucide React**: Icons

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd removealist/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start backend server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd removealist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register/email/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/verify-email/` - Email verification
- `POST /api/auth/forgot-password/` - Password reset request
- `POST /api/auth/reset-password/` - Password reset confirmation
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

## Project Structure

```
removealist/
├── backend/                 # Django backend
│   ├── authentication/      # User authentication app
│   ├── core/               # Core utilities and permissions
│   ├── myproject/          # Django project settings
│   └── manage.py           # Django management script
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   └── App.js              # Main app component
├── public/                 # Static assets
└── package.json            # Frontend dependencies
```

## Development

### Backend Development
- The backend uses Django REST Framework for API development
- JWT tokens are used for authentication
- CORS is configured for frontend integration
- Phone verification is temporarily disabled (email-only for now)

### Frontend Development
- React components are organized by feature
- Tailwind CSS is used for styling
- Framer Motion provides smooth animations
- Protected routes require authentication

## Production Deployment

### Backend
1. Set `DEBUG=False` in production
2. Use environment variables for sensitive data
3. Configure proper database (PostgreSQL recommended)
4. Set up email backend for verification emails
5. Configure CORS for production domains

### Frontend
1. Build the application: `npm run build`
2. Serve static files from a web server
3. Configure environment variables
4. Set up proper routing for SPA

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.