const request = require("supertest");
const app = require("../app"); // Adjust the path to your Express app
const db = require("../db");

// Ensure the database connection pool is properly closed after all tests to avoid
// lingering open connections (TCP handles) that would prevent Jest from exiting cleanly.
// pool.end() method is asynchronous
afterAll(async () => {
  await db.pool.end();
});

describe("API Tests", () => {
  // Test for Users
  describe("GET /users/all", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/users/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for Products
  describe("GET /products/all", () => {
    it("should return all products", async () => {
      const res = await request(app).get("/products/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for Orders
  describe("GET /orders/all", () => {
    it("should return all orders", async () => {
      const res = await request(app).get("/orders/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for Reviews
  describe("GET /reviews/all", () => {
    it("should return all reviews", async () => {
      const res = await request(app).get("/reviews/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for Categories
  describe("GET /categories/all", () => {
    it("should return all categories", async () => {
      const res = await request(app).get("/categories/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for User Registration
  describe("POST /users/register", () => {
    let userId;

    it("should register a new user", async () => {
      const res = await request(app).post("/users/register").send({
        name: "New User",
        username: "newuser",
        email: "newuser@test.com",
        password: "password123",
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("email", "newuser@test.com");
      expect(res.body).toHaveProperty("name", "New User");

      // Store the user ID for cleanup
      userId = res.body.id;
    });

    it("should not register a user with an existing email", async () => {
      const res = await request(app).post("/users/register").send({
        name: "Alice Johnson",
        username: "alice",
        email: "alice@example.com", // Assuming this email already exists
        password: "alice",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    afterEach(async () => {
      if (userId) {
        await request(app).delete(`/users/${userId}`);
        userId = null;
      }
    });
  });

  // Test for User Login
  describe("POST /users/login", () => {
    it("should login a user with correct credentials", async () => {
      const res = await request(app).post("/users/login").send({
        email: "alice@example.com", // Assuming this email already exists
        password: "alice",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Logged in successfully");
    });

    it("should not login a user with incorrect credentials", async () => {
      const res = await request(app).post("/users/login").send({
        email: "test@test.com",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(401);
    });
  });

  // Test for User Profile
  describe("GET /users/profile", () => {
    let agent = request.agent(app);

    beforeAll(async () => {
      await agent.post("/users/login").send({
        email: "alice@example.com", // Assuming this email already exists
        password: "alice",
      });
    });

    it("should return the user profile for authenticated user", async () => {
      const res = await agent.get("/users/profile");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("email", "alice@example.com");
    });

    it("should not return the user profile for unauthenticated user", async () => {
      const res = await request(app).get("/users/profile");
      expect(res.statusCode).toEqual(401);
    });
  });
});

// -------------- Cart API Tests-------------------------

describe("Cart API Tests", () => {
  let agent = request.agent(app);
  let existing_product_id = 1; // Assuming a product with ID 1 exists
  let product_to_delete_id = 2; // Assuming a product with ID 2 exists (Laptop)
  let new_product_id = 3; // Assuming a product with ID 3 exists (Book)
  let user_profile;

  beforeAll(async () => {
    // Log in as a user to get authenticated
    await agent.post("/users/login").send({
      email: "alice@example.com", // Assuming this email already exists
      password: "alice",
    });
    const res = await agent.get("/users/profile");
    console.log(res.body);
    user_profile = { id: res.body.id, cart_id: res.body.cart_id };
  });

  // Test for creating a cart
  describe("POST /cart", () => {
    it("should not create a cart if one already exists", async () => {
      const res = await agent.post("/cart");
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Cart already exists");
    });
  });

  // Test for getting the cart
  describe("GET /cart", () => {
    it("should return the user's cart", async () => {
      const res = await agent.get("/cart");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
    });
  });

  // Test for adding an item to the cart
  describe("POST /cart/items", () => {
    it("should add an item to the cart", async () => {
      console.log(`productId: ${new_product_id}`, `user_profile: ${user_profile}`);
      const res = await agent.post("/cart/items").send({
        product_id: new_product_id,
        quantity: 2,
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("cart_id", user_profile.cart_id);
      expect(res.body).toHaveProperty("product_id", new_product_id);
      expect(res.body).toHaveProperty("quantity", 2);
    });

    afterEach(async () => {
      await agent.delete(`/cart/items/${new_product_id}`);
    });
  });

  // Test for updating an item in the cart
  describe("PUT /cart/items/:product_id", () => {
    it("should update the quantity of an item in the cart", async () => {
      const res = await agent.put(`/cart/items/${existing_product_id}`).send({
        quantity: 3,
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("quantity", 3);
    });
  });

  // Test for deleting an item from the cart
  describe("DELETE /cart/items/:id", () => {
    it("should delete an item from the cart", async () => {
      const res = await agent.delete(`/cart/items/${product_to_delete_id}`);
      expect(res.statusCode).toEqual(204);
    });
  });

  // Test for deleting the cart
  describe("DELETE /cart", () => {
    it("should delete the user's cart", async () => {
      const res = await agent.delete("/cart");
      expect(res.statusCode).toEqual(204);
    });
  });
});
