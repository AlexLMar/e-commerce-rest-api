require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

// -------------------------------- Users ------------------------------------

const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const { rows } = await pool.query(query);
    return rows;
};

const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
};

const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const createUser = async ({ name, username, email, password }) => {
    const query = `
        INSERT INTO users (name, username, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, username, email, created_at
      `;
    const { rows } = await pool.query(query, [name, username, email, password]);
    return rows[0];
};

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
};

// -------------------------------- Products ------------------------------------

const getAllProducts = async () => {
    const query = 'SELECT * FROM products';
    const { rows } = await pool.query(query);
    return rows;
};

// -------------------------------- Orders ------------------------------------

const getAllOrders = async () => {
    const query = 'SELECT * FROM orders';
    const { rows } = await pool.query(query);
    return rows;
};

// -------------------------------- Reviews ------------------------------------

const getAllReviews = async () => {
    const query = 'SELECT * FROM reviews';
    const { rows } = await pool.query(query);
    return rows;
};

// -------------------------------- Categories ------------------------------------

const getAllCategories = async () => {
    const query = 'SELECT * FROM categories';
    const { rows } = await pool.query(query);
    return rows;
};

// -------------------------------- Cart ------------------------------------

const createCart = async ({ user_id }) => {
    const query = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id';
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
};

const assignCartIdToUserByUserId = async (user_id, cart_id) => {
    const query = 'UPDATE users SET cart_id = $1 WHERE id = $2';
    await pool.query(query, [cart_id, user_id]);
}; 

const getCartIdByUserId = async (user_id) => {
    const query = 'SELECT id as cart_id FROM Carts WHERE user_id = $1';
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
};

const getCartByUserId = async (user_id) => {
    const query = `
        SELECT 
            Carts.id as cart_id, 
            Carts.user_id, 
            Cart_Items.product_id, 
            Cart_Items.quantity,
            Products.name,
            Products.description
        FROM Carts
        LEFT JOIN Cart_Items ON Carts.id = Cart_Items.cart_id
        LEFT JOIN Products ON Cart_Items.product_id = Products.id
        WHERE Carts.user_id = $1
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};

const createCartItem = async (cart_id, { product_id, quantity }) => {
    const query = 'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [cart_id, product_id, quantity]);
    return rows[0];
};

const updateCartItem = async (product_id, cart_id, { quantity }) => {
    const query = 'UPDATE cart_items SET quantity = $1 WHERE product_id = $2 AND cart_id = $3 RETURNING *';
    const { rows } = await pool.query(query, [quantity, product_id, cart_id]);
    return rows[0];
};

const deleteCartItem = async (product_id, { cart_id }) => {
    const query = 'DELETE FROM cart_items WHERE product_id = $1 AND cart_id = $2';
    await pool.query(query, [product_id, cart_id]);
};

const deleteCart = async (cart_id) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction
        
        const deleteCartIdFromUsersQuery = `
            UPDATE users 
            SET cart_id = NULL 
            WHERE cart_id = $1;
        `;

        const deleteCartItemsQuery = `
            DELETE 
            FROM cart_items 
            WHERE cart_id = $1;
        `;

        const deleteCartQuery = `
            DELETE 
            FROM carts 
            WHERE id = $1;
        `;

        await client.query(deleteCartIdFromUsersQuery, [cart_id]);
        await client.query(deleteCartItemsQuery, [cart_id]);
        await client.query(deleteCartQuery, [cart_id]);

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        throw error; // Re-throw the error to handle it in the calling function
    } finally {
        client.release(); // Release the client back to the pool
    }
};


module.exports = {
    getAllUsers,
    getUserByEmail,
    getUserById,
    createUser,
    deleteUser,
    getAllProducts,
    getAllOrders,
    getAllReviews,
    getAllCategories,
    createCart,
    assignCartIdToUserByUserId,
    getCartIdByUserId,
    getCartByUserId,
    createCartItem,
    updateCartItem,
    deleteCartItem,
    deleteCart,
    pool,
};
