# Database Seeding Guide

This guide will help you populate your Connectr platform with realistic sample data to make it feel alive and functional.

## 🎯 What Gets Created

The seeding script creates:

- **70+ Users** with different roles (admin, moderators, regular users)
- **12 Networks** across various categories (Tech, Creative, Business, etc.)
- **80+ Posts** with realistic content and timestamps
- **200+ Comments** and reactions
- **User Connections** (friends, pending requests)
- **Network Memberships** and administrations
- **Realistic Timestamps** spanning the last 30 days

## 🚀 Quick Start

### Option 1: Using the Seeding Scripts

**For Linux/Mac:**

```bash
cd backend
chmod +x seed-database.sh
./seed-database.sh
```

**For Windows:**

```cmd
cd backend
seed-database.bat
```

### Option 2: Manual Commands

```bash
cd backend
npm run db:seed
```

### Option 3: Reset and Seed

```bash
cd backend
npm run db:reset
```

## 🔑 Default Login Credentials

After seeding, you can log in with:

- **Email:** `alex.johnson@email.com`
- **Password:** `password123`

This user has admin privileges and can access all features.

## 📊 Sample Data Overview

### Users

- **1 Admin User:** Full platform access
- **4 Moderator Users:** Limited admin privileges
- **65+ Regular Users:** Standard user accounts
- **Realistic Profiles:** Names, emails, contact info, profile pictures

### Networks

- **Tech Innovators:** Technology and development community
- **Creative Minds:** Artists, designers, writers
- **Business Leaders:** Entrepreneurs and executives
- **Science & Research:** Scientists and researchers
- **Sports & Fitness:** Athletes and fitness enthusiasts
- **Music & Entertainment:** Musicians and entertainers
- **Education & Learning:** Educators and students
- **Health & Wellness:** Health and wellness advocates
- **Environmental Action:** Environmentalists and sustainability advocates
- **Food & Cooking:** Food lovers and chefs
- **Gaming Community:** Gamers and developers
- **Photography Hub:** Photographers of all levels

### Content

- **Posts:** Mix of personal updates, professional insights, and community content
- **Comments:** Engaging responses and discussions
- **Reactions:** Upvotes, downvotes, and likes
- **Attachments:** Random images for posts and comments

### Connections

- **Friend Connections:** Accepted friend relationships
- **Pending Requests:** Connection requests awaiting approval
- **Network Memberships:** Users joined to various networks
- **Admin Roles:** Network administrators and moderators

## 🛠️ Customization

You can modify the seeding script (`prisma/seed.ts`) to:

- Add more users or networks
- Change the content types
- Adjust the data distribution
- Add custom categories or features

## 🔄 Re-seeding

To clear and re-seed the database:

```bash
npm run db:reset
```

This will:

1. Reset the database schema
2. Run the seeding script
3. Populate with fresh sample data

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**

- Ensure your `.env` file has the correct `DATABASE_URL`
- Check that your MongoDB instance is running

**Permission Errors:**

- Make sure the seeding script has write permissions
- Check that the database user has sufficient privileges

**Memory Issues:**

- The seeding process creates a lot of data
- Ensure you have sufficient memory available
- Consider reducing the data volume in the script

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all dependencies are installed (`npm install`)
4. Check that Prisma is properly configured

## 📈 Next Steps

After seeding:

1. **Start the Backend:** `npm run start:dev`
2. **Start the Frontend:** `cd ../frontend && npm run dev`
3. **Test the Platform:** Log in and explore the features
4. **Customize:** Modify the data or add new features

## 🎉 Enjoy Your Populated Platform!

Your Connectr platform now has realistic data that makes it feel like a thriving social network. Users can:

- Browse networks and join communities
- View posts and engage with content
- Connect with other users
- Experience the full social networking features

Happy networking! 🚀
