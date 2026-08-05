# API Suggestions for E-Commerce Practice

Since you are in a training period, here are some great APIs you can try building to improve your skills. They are categorized from beginner to advanced.

## 🟢 Beginner Level (Good for basic CRUD practice)

### 1. Categories API
Currently, you store category as a string in the product table. Try creating a separate `categories` table and linking it.
*   `POST /category` - Create a new category 👍👍✔
*   `GET /categories` - List all categories 👍👍✔
*   `PUT /update/:id` - Update a category name 👍👍✔
*   `DELETE /category/:id` - Delete a category 👍👍✔

### 2. User Profile/Address API
Instead of just one address string in the `users` table, allow users to manage multiple addresses.
*   `POST /user/address` - Add a new delivery address 👍👍✔
*   `GET /user/addresses` - View all saved addresses 👍👍✔
*   `DELETE /user/address/:id` - Remove an address 👍👍✔

---

## 🟡 Intermediate Level (Good for learning relationships and logic)

### 3. Cart Management API
Instead of creating an order directly, let users add items to a shopping cart first.
*   `POST /cart/add` - Add a product to the user's cart 👍👍✔
*   `GET /cart` - View items currently in the cart 👍👍✔
*   `PUT /cart/update` - Change the quantity of an item in the cart 👍👍✔
*   `DELETE /cart/remove/:productId` - Remove an item from the cart 👍👍✔
*   `DELETE /cart/clear` - Empty the cart 👍👍✔

### 4. Reviews & Ratings API
Allow users to review products they bought.
*   `POST /product/:id/review` - Submit a review (1-5 stars + comment) 👍👍✔
*   `GET /product/:id/reviews` - See all reviews for a product  👍👍✔
*   *Challenge:* Calculate and return the average rating for a product when fetching it! 

### 5. Wishlist API
Let users save products for later.
*   `POST /wishlist/add/:productId` - Add to wishlist 👍👍✔
*   `GET /wishlist` - View wishlist items 👍👍✔
*   `DELETE /wishlist/remove/:productId` - Remove from wishlist 👍👍✔

---

## 🔴 Advanced Level (Good for complex queries and integrations)

### 6. Admin Dashboard Stats API
Create endpoints that only an admin (you'd need an `isAdmin` flag in the users table) can access to see how the business is doing.
*   `GET /admin/stats/sales` - Get total sales amount 👍👍✔
*   `GET /admin/stats/users` - Get total registered users 👍👍✔
*   `GET /admin/stats/top-products` - Find the top 5 most sold products using SQL `GROUP BY` and `ORDER BY` 👍👍✔

### 7. Order Status Management API
Right now orders are just created. What if they need to be shipped?
*   `PUT /order/:id/status` - Update order status (Pending -> Processing -> Shipped -> Delivered)
*   *Challenge:* Send a simulated email or notification when the status changes.

### 8. Search & Filter API
Enhance your `GET /product` API to support search and filtering.
*   `GET /product?search=phone&minPrice=100&maxPrice=500&category=electronics`
*   *Challenge:* Use SQL `LIKE` and `BETWEEN` clauses to filter the database results based on query parameters.

