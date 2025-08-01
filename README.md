# Rent and Return - Full Stack Rental Management System

## Overview
Rent and Return is a comprehensive full-stack rental management application designed for campus communities and small businesses. It enables users to browse and rent products, manage rentals, handle payments, and provides administrators with powerful tools to oversee the entire rental ecosystem.

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
- **Stripe** - Payment gateway integration
- **JavaMailSender** - Email notifications

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

### Product & Rental Management
- Product listing with search and filtering
- Category-based organization
- Image support for products
- Inventory management
- Price per day rental system
- Complete rental lifecycle management
- Rental status tracking (PENDING, ACTIVE, RETURNED, CANCELLED)
- Cart functionality
- Rental history
- Due date management

### Payments & Notifications
- Stripe payment gateway integration
- Payment status tracking
- Email notifications for rental confirmation and payment receipts

### Address & Wishlist
- User address management (CRUD, default address)
- Wishlist (add/remove/view products)

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

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login and get JWT |
| `/api/products` | GET | List all products |
| `/api/rentals` | POST | Create a rental |
| `/api/v1/payments/stripe/create-intent` | POST | Create Stripe payment intent |
| `/api/v1/payments/webhook` | POST | Stripe webhook endpoint |
| `/api/v1/addresses` | CRUD | Manage user addresses |
| `/api/v1/wishlist` | CRUD | Manage user wishlist |
| ... | ... | ... |

See the codebase for full API details and request/response formats.

## Setup Instructions

### Backend
1. Install JDK 17 and Maven.
2. Configure PostgreSQL and update the application properties or `.env` file.
3. Navigate to the `backend` directory.
4. Run the application:
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

## Sample Data

You can use the following SQL to insert sample users and products (see `backend/sample_data.sql`):

```sql
-- Sample admin user
INSERT INTO users (username, email, password, role, enabled, deleted, email_verified, account_non_locked)
VALUES ('admin', 'admin@rentreturn.com', '<bcrypt-password>', 'ADMIN', true, false, true, true);

-- Sample product
INSERT INTO products (name, description, price_per_day, category, available, image_url)
VALUES ('Sample Product', 'A demo product', 100, 'electronics', true, 'assets/products/1.jpg');
```

Or use the provided Python script: `bulk_create_products.py`.

## Running Tests

### Backend
- Run all tests:
  ```sh
  mvn test
  ```
- Integration tests are in `backend/src/test/java/com/arushr/rentreturn/service/`

### Frontend
- Run all tests:
  ```sh
  npm run test
  ```

## Screenshots

<!-- Add screenshots of your app here -->
![Home Page](frontend/public/assets/slide1.jpg)
![Admin Dashboard](frontend/public/assets/slide2.jpg)

## Demo

<!-- If deployed, add your live demo link here -->
[Live Demo](#)

## Production Deployment Guide

### Backend (Spring Boot) — Railway
- **Dockerfile** is ready for Railway deployment.
- **Required Environment Variables:**
  - `SPRING_DATASOURCE_URL` (e.g. from Supabase)
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `JWT_SECRET` (min 32 chars, keep secret!)
  - `JWT_EXPIRATION` (e.g. 86400000 for 1 day)
  - `STRIPE_SECRET_KEY` (for payments)
  - `ALLOWED_ORIGINS` (comma-separated, e.g. `https://your-frontend.vercel.app`)
  - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` (for email)
- **Healthcheck:** `/actuator/health` (enable actuator in prod if not already)
- **Port:** Railway expects the app to listen on `8080`.

### Database — Supabase (PostgreSQL)
- Create a new project in Supabase.
- Get the connection string and credentials.
- Set them as `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` in Railway.
- Run Flyway migrations automatically on app start.

### Frontend (React) — Vercel
- Deploy the `frontend/` directory to Vercel.
- **Required Environment Variables:**
  - `VITE_API_BASE_URL` (e.g. `https://your-backend-production-url.railway.app/api`)
  - `VITE_STRIPE_PUBLISHABLE_KEY` (for Stripe payments)
- Set CORS in backend to allow your Vercel domain.

### Best Practices
- Never commit secrets to the repo.
- Use strong, unique JWT and Stripe secrets.
- Set `SPRING_PROFILES_ACTIVE=prod` in Railway for production security headers.
- Monitor logs and health endpoints.

---

For more details, see the comments in `application.properties` and the Dockerfile.

## Environment Variables

See `.env.example` in both backend and frontend for required variables.

---

**Made with ❤️ by [Your Name]**
