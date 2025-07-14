# Rent and Return - Full Stack Rental Management System

## Overview
Rent and Return is a comprehensive full-stack rental management application designed for campus communities. It enables users to rent products online, manage rentals, and provides administrators with powerful tools to oversee the entire rental ecosystem.

## Tech Stack

### Backend
- **Java 17** - Modern Java features
- **Spring Boot 3.5.0** - Main framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **JUnit** - Testing framework

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Modern icons
- **Radix UI** - Accessible components

## Features

### Authentication & User Management
- JWT-based authentication
- Role-based access control (USER/ADMIN)
- User registration and login
- Profile management
- Secure password handling

### Product Management
- Product listing with search and filtering
- Category-based organization
- Image support for products
- Inventory management
- Price per day rental system

### Rental System
- Complete rental lifecycle management
- Rental status tracking (PENDING, ACTIVE, RETURNED, CANCELLED)
- Cart functionality
- Rental history
- Due date management

### Admin Dashboard
- Comprehensive admin panel
- User management
- Product management
- Rental oversight
- Analytics and reporting
- Feedback management

### Modern UI/UX
- Responsive design
- Modern component library
- Smooth animations
- Toast notifications
- Accessible components
- Professional styling

## Setup Instructions
### Backend
1. Install JDK 17 and Maven.
2. Configure PostgreSQL and update the application properties.
3. Navigate to the `backend` directory.
4. Run the application with:
   ```sh
   mvn spring-boot:run
   ```

### Frontend
1. Ensure Node.js and npm are installed.
2. Navigate to the `frontend` directory.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Contribution Guidelines
Feel free to contribute to this project. Make sure to follow coding standards and include tests for new features.
