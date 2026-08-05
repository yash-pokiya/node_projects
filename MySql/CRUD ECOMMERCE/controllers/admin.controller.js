const db = require("../configs/db");

const salesState = async (req, res) => {
  try {
    const [report] = await db.execute(
      `
            SELECT 
            u.fullname,
            u.email,
            p.product_name,
            p.price,
            o.quantity,
            (SELECT o2.amount  
                FROM orders o2 
                WHERE o2.id = o.id
            ) AS total
    
            FROM orders o
    
            JOIN users u
            ON u.id = o.user_id
    
            JOIN products p
            ON p.id = o.product_id
            `,
    );

    let calculateSale = 0;
    report.forEach((a) => {
      calculateSale += a.total;
    });


    return res.status(201).json({
      msg: "Report generated..!",
      "all time total sale ": calculateSale,
      report,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const userStates = async (req, res) => {
  try {
    const [users] = await db.execute(
      `
            SELECT 
            u.username,
            u.email,
            u.fullname
            FROM users u
            ORDER BY u.id ASC
            `,
    );
    const [totalUser] = await db.execute(
      `
            SELECT COUNT(id) AS total_users
            FROM users
            AS total_user
            `,
    );


    return res.status(201).json({
      msg: "Report generated..!",
      totalUser: totalUser[0].total_users,
      users: users,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const topProducts = async (req, res) => {
  try {
    const [top] = await db.execute(
      `
           SELECT
            p.id,
            p.product_name,
            p.price,
            SUM(o.quantity) AS total_quantity_sold,
            SUM(o.amount) AS total_sales
        FROM orders o
        JOIN products p
        ON o.product_id = p.id
        GROUP BY p.id, p.product_name, p.price
        ORDER BY total_quantity_sold DESC
        LIMIT 5;
            `,
    );
    return res.status(201).json({
      msg: "Report generated..!",
      top,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  salesState,
  userStates,
  topProducts,
};
