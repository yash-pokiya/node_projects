const db = require("../configs/db");

const createOrder = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ msg: "Enter Qantity" });
    }

    const userId = req.user?.id;
    const productId = req.params.id;

    const [product] = await db.execute(
      `
         SELECT * FROM 
         products 
         WHERE id = ?
         `,
      [productId],
    );

    if (!product[0]) {
      return res.status(400).json({ msg: "Product Not Found..!" });
    }

    const [order] = await db.execute(
      `INSERT INTO orders
         (user_id , amount , product_id , quantity)
         VALUES (? , ? , ? , ?)
         `,
      [userId, product[0].price * quantity, product[0].id, quantity],
    );

    const reduceStock = await db.execute(
      `
            UPDATE products
            set stock = stock - ?
            WHERE id = ?
            `,
      [quantity, productId],
    );

    return res.status(200).json({ msg: "order create successfully..!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const seeOrders = async (req, res) => {
  const userId = req.user?.id;

  const [orderDetails] = await db.execute(
    `
        SELECT 
            p.product_name,
            o.quantity,
            o.created_at,
            o.status,
            o.amount  total_amount

            FROM orders o
            JOIN products p
            ON o.product_id = p.id
            WHERE o.user_id = ?
       `,[userId]
  );
  if (orderDetails.length <= 0) {
    return res.status(400).json({ msg: "Orders not found..!" });
  }

  return res
    .status(200)
    .json({ msg: "Product fetch successfull..!", product: [orderDetails] });
};

const checkAllOrders = async (req, res) => {
  try {
    const [allOrders] = await db.execute(
      `
            SELECT 
                u.fullname,
                u.username,
                u.email,
                o.id,
                o.product_id,
                o.amount,
                o.status,
                o.created_at,
                p.product_name
            FROM orders as o
            LEFT JOIN users as u
            ON o.user_id = u.id

            JOIN products p 
            ON o.product_id = p.id
            `,
    );

    return res
      .status(200)
      .json({ msg: "orders fetch successfull..!", orders: [allOrders][0] });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    await db.execute(
      `
         UPDATE orders
         SET status = ?
         WHERE id = ?
         `,
      [status, orderId],
    );
    return res.status(201).json({
      msg: `status updated on orderId : ${orderId}..!`,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createOrder,
  seeOrders,
  checkAllOrders,
  updateOrderStatus,
};
