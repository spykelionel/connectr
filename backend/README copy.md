# 🌐 Connectr - Social Network Platform

**Connectr** is a modern social networking platform built with NestJS and Prisma, designed to help people connect, share, and build communities.

## 🚀 Features

### 👤 User Management

- User registration and authentication
- Profile management with avatars
- Role-based access control
- User connections and networking

### 📝 Social Posts

- Create and share posts
- Upvote/downvote system
- Post attachments and media
- Network-specific posts

### 💬 Comments & Interactions

- Comment on posts
- Like comments
- Real-time interactions

### 🌐 Networks (Communities)

- Create and join networks
- Network administrators
- Member management
- Network-specific content

### 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and guards

## 🛠 Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer with Cloudinary

## 📋 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token

### Users

- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PATCH /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Posts

- `GET /post` - Get all posts
- `GET /post/:id` - Get post by ID
- `POST /post` - Create post
- `PATCH /post/:id` - Update post
- `DELETE /post/:id` - Delete post
- `POST /post/:id/react` - React to post (upvote/downvote)

### Comments

- `GET /comment` - Get all comments
- `GET /comment/post/:postId` - Get comments for a post
- `POST /comment` - Create comment
- `PATCH /comment/:id` - Update comment
- `DELETE /comment/:id` - Delete comment
- `POST /comment/:id/like` - Like comment

### Networks

- `GET /network` - Get all networks
- `GET /network/:id` - Get network by ID
- `POST /network` - Create network
- `PATCH /network/:id` - Update network
- `DELETE /network/:id` - Delete network
- `POST /network/:id/members` - Add member to network
- `DELETE /network/:id/members` - Remove member from network

### Roles

- `GET /role` - Get all roles
- `GET /role/:id` - Get role by ID
- `POST /role` - Create role
- `PATCH /role/:id` - Update role
- `DELETE /role/:id` - Delete role

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd connectr-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mongodb://localhost:27017/connectr"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_RefreshSecret="your-refresh-secret-key"
   PORT=3000
   NODE_ENV="development"
   ```

4. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

5. **Run database migration**

   ```bash
   npx prisma db push
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`
API documentation will be available at `http://localhost:3000/swagger`

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/swagger`

## 🔧 Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Connectr** - Where connections matter! 🌐✨
