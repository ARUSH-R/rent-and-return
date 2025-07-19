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
- **Flyway** - Database migrations
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
4. Run database migrations (Flyway runs automatically on startup).
5. Run the application:
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

## Deployment Instructions

### Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. Copy `.env.example` to `.env` in both `backend` and `frontend` directories and fill in secrets as needed.
3. From the project root, run:
   ```sh
   docker-compose up --build
   ```
4. The backend will be available at `http://localhost:8080`, frontend at `http://localhost:5173`.

### Manual Deployment

- **Backend:** Deploy to any Java-supporting cloud (Render, Railway, Heroku, AWS). Set environment variables as per `.env.example`.
- **Frontend:** Deploy static build (from `npm run build`) to Vercel, Netlify, or any static host. Set `VITE_API_BASE_URL` as needed.
- **Database:** Use managed PostgreSQL (Supabase, AWS RDS, etc.).

## Environment Variables

See `.env.example` in both backend and frontend for required variables.

---

**Made with ❤️ by [Your Name]**
