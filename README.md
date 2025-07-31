# JS API

A modern Node.js REST API built with Express.js, Sequelize ORM, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Complete user CRUD operations
- **Order System**: Order management functionality
- **Database Integration**: PostgreSQL with Sequelize ORM
- **Security**: Password hashing with bcrypt
- **Logging**: Comprehensive logging with Winston
- **Code Quality**: ESLint and Prettier for code formatting
- **Development Tools**: Hot reload with Nodemon

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL
- **ORM**: Sequelize 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Logging**: Winston
- **Development**: Nodemon, ESLint, Prettier

## 📁 Project Structure

```
jsapi/
├── config/                 # Configuration files
│   └── config.js
├── controllers/            # Route controllers
│   └── userController.js
├── db/                     # Database configuration and models
│   ├── db.js
│   └── models/
│       ├── userModel.js
│       └── orderModel.js
├── exceptions/             # Error handling
│   ├── errors.js
│   └── statusCode.js
├── logger/                 # Logging configuration
│   └── logger.js
├── middleware/             # Custom middleware
│   └── authetification.js
├── migrations/             # Database migrations
│   └── 20250724102725-createUserTable.cjs
├── routs/                  # API routes
│   ├── index.js
│   ├── authentication.js
│   └── userRoute.js
├── seeders/                # Database seeders
│   └── 20250724132547-user-seed.cjs
├── services/               # Business logic
│   └── user.js
├── index.js                # Application entry point
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jsapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env-example.txt .env
   ```
   
   Fill in your environment variables:
   ```env
   PORT=3000
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Run seeders (optional)
   npx sequelize-cli db:seed:all
   ```

5. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run restart
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run restart` - Start development server with auto-reload
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🗃️ Database

This project uses PostgreSQL with Sequelize ORM. The database includes:

- **Users Table**: User authentication and profile data
- **Orders Table**: Order management system

### Migrations

Database migrations are located in the `migrations/` folder and can be run using Sequelize CLI:

```bash
npx sequelize-cli db:migrate
```

### Seeders

Sample data can be inserted using seeders:

```bash
npx sequelize-cli db:seed:all
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- **Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for obtaining new access tokens
- **Password Security**: Passwords are hashed using bcrypt

## 📝 Logging

The application uses Winston for logging with different log levels:

- **Error**: Error messages
- **Warn**: Warning messages  
- **Info**: Informational messages
- **Debug**: Debug information

Logs are written to `app.log` file and console output.

## 🧪 Development

### Code Style

This project uses ESLint and Prettier for code formatting and linting:

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Hot Reload

Development server supports hot reload using Nodemon:

```bash
npm run restart
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you have any questions or need help, please open an issue in the repository.
