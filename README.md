# E-Commerce Application REST API

This is a RESTful API for an e-commerce application, built using Node.js, Express, and PostgreSQL. The API supports user authentication, product management, order processing, and cart management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Features

- User registration and authentication using Passport.js
- Product, category, and order management
- Cart management with item addition, update, and deletion
- Review system for products
- Secure password hashing with bcrypt
- Session management with express-session

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/e-commerce-api.git
   cd e-commerce-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the PostgreSQL database:**

   - Ensure PostgreSQL is installed and running.
   - Create a database using the provided SQL script:

     ```bash
     psql -U yourusername -f sql/psql_database_setup.sql
     ```

## Configuration

1. **Environment Variables:**

   Create a `.env` file in the root directory and configure the following variables:

   ```plaintext
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_NAME=e_commerce_database
   SESSION_SECRET=your_session_secret
   ```

2. **Passport Configuration:**

   The `config/passport.js` file is already set up for local strategy authentication.

## Usage

1. **Start the server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

## API Endpoints

### User Routes

- **POST /users/register** - Register a new user

  **Payload:**
  ```json
  {
    "name": "New User",
    "username": "newuser",
    "email": "newuser@test.com",
    "password": "password123"
  }
  ```

- **POST /users/login** - Login a user

  **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }
  ```

- **GET /users/profile** - Get the authenticated user's profile

- **DELETE /users/:id** - Delete a user by ID

### Product Routes

- **GET /products/all** - Get all products

### Order Routes

- **GET /orders/all** - Get all orders

### Review Routes

- **GET /reviews/all** - Get all reviews

### Category Routes

- **GET /categories/all** - Get all categories

### Cart Routes

- **POST /cart** - Create a cart for the authenticated user

- **GET /cart** - Get the authenticated user's cart

- **POST /cart/items** - Add an item to the cart

  **Payload:**
  ```json
  {
    "product_id": 1,
    "quantity": 2
  }
  ```

- **PUT /cart/items/:product_id** - Update an item in the cart

  **Payload:**
  ```json
  {
    "quantity": 3
  }
  ```

- **DELETE /cart/items/:product_id** - Delete an item from the cart

- **DELETE /cart** - Delete the user's cart

## Testing

Run the tests using Jest, and the database setup script:

```bash
npm run test:db
```
The database setup script will re-create the database and tables, and insert some data, each time the test suite is run.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
