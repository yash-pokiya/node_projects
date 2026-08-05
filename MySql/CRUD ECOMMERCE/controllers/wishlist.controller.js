const db = require("../configs/db");

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const [isProduct] = await db.execute(
            `
            SELECT * FROM products
            WHERE id = ? 
            `, [productId]
        )
        if (!isProduct[0]) {
            return res
                .status(404)
                .json(
                    {
                        "msg": "product is not available..!"
                    }
                );
        }

        const insert = await db.execute(
            `
            INSERT INTO wishlists
            (user_id , product_id)
            VALUES(? , ?)
            `, [userId, productId]
        )
        return res
            .status(201)
            .json(
                {
                    msg: "product added to wishlist success..!"
                }
            )

    } catch (error) {
        return res
            .status(500)
            .json(
                {
                    error: error.message
                }
            )
    }
}


const seeWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const [wishlist] = await db.execute(
            `
         SELECT 
            p.product_name ,
            p.price ,
            p.id AS product_id,
            u.id AS user_id
 
         FROM wishlists w

         JOIN products p
            ON w.product_id = p.id
 
         JOIN users u
            ON w.user_id = u.id
         WHERE w.user_id = ?
         ORDER BY w.created_at DESC

         `, [userId]
        )
        if (wishlist.length <= 0) {
            return res
                .status(404)
                .json(
                    {
                        msg: "wishlist is empty"
                    }
                )
        }
        return res
            .status(201)
            .json(
                {
                    msg: "product fetch from wishlist success..!", wishlist
                }
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                {
                    error: error.message
                }
            )
    }
}

const removeItem = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user?.id;

        const [check] = await db.execute(
            `
            SELECT * FROM wishlists
            WHERE user_id = ? AND product_id
            `, [userId, productId]
        )
        if (check.length <= 0) {
            return res
                .status(404)
                .json(
                    {
                       "msg" : "Wishlist is Empty or can't find this item in your account..!"
                    }
                )
        }


        const remove = await db.execute(
            `
            DELETE FROM wishlists 
            WHERE user_id = ? AND product_id
            `, [userId, productId]
        )
        return res
            .status(201)
            .json(
                {
                    msg: "product remove from wishlist..!"
                }
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                {
                    error: error.message
                }
            )
    }

}

module.exports = {
    addToWishlist,
    seeWishlist,
    removeItem
}