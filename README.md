# 🏡 WanderLust — Full Stack Property Listing Platform

WanderLust is a full-stack web application inspired by modern property rental and travel platforms. Users can explore properties, search and filter listings, view locations on an interactive map, create and manage listings, write reviews, and securely authenticate using sessions.

## 🚀 Features

### 🔐 Authentication & Authorization
- User Signup / Login / Logout
- Session-based authentication
- Protected routes
- Authorization for listing owners
- MongoDB-backed session storage

### 🏠 Listings
- Create new property listings
- View all listings
- View individual listing details
- Edit and delete listings
- Owner-based authorization
- Category-based listings

### 🔎 Search & Filters
- Search listings by destination
- Search by title, location, and country
- Category filters
- Responsive filter UI

### ⭐ Reviews
- Add reviews to listings
- Delete reviews
- Review validation
- Author information using Mongoose `populate()`

### 🗺️ Map Integration
- Interactive map for property locations
- GeoJSON-based location data
- Latitude and longitude coordinates
- Listing location visualization

### 🖼️ Image Upload
- Cloudinary image storage
- Image upload during listing creation
- Image replacement during listing update
- Image preview on edit

### 💰 Tax Toggle
- Toggle between base price and price including taxes
- Dynamic price calculation using JavaScript

### 📱 Responsive UI
- Responsive navigation bar
- Mobile-friendly listing cards
- Responsive search interface
- Bootstrap-based UI
- Font Awesome icons

### 💾 Database & Sessions
- MongoDB Atlas
- Mongoose ODM
- MongoDB session store using `connect-mongo`
- Persistent user sessions

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS
- Bootstrap
- Font Awesome

### Backend
- Node.js
- Express.js
- Express Session
- Passport.js

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Cloud & APIs
- Cloudinary
- Map API

### Development Tools
- Git
- GitHub
- VS Code
- Postman
- Nodemon

---

## 🏗️ Architecture

The project follows an MVC-inspired architecture:

```text
User
  ↓
EJS Views
  ↓
Express Routes
  ↓
Controllers
  ↓
Mongoose Models
  ↓
MongoDB Atlas
