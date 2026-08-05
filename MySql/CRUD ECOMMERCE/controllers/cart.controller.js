const db = require("../configs/db");

const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.
                status(400)
                .json({ msg: "Must enter productId..!" })
        }
        const [findProduct] = await db.execute(
            `
            SELECT * FROM products
            WHERE id = ?
            `, [productId]
        )
        if (!findProduct[0]) {
            return res.
                status(400)
                .json({ msg: "Product Not Found..!" })
        }
        const cart = await db.execute(
            `
            INSERT INTO cart
            (user_id , product_id , quantity)
            VALUES(? , ? , ?)
            `, [userId, productId, quantity || 1]
        );


        return res
            .status(200)
            .json({
                msg: "Product Added to cart..!",

            })
    }

    catch (error) {
        return res.status(500).json({ msg: error.message })
    }


}

const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const [showCart] = await db.execute(
            `
         SELECT u.id AS userId, u.username,
         p.id AS productId , p.product_name , p.price
 
         FROM cart c
          JOIN users u
             ON c.user_id = u.id
         
          JOIN products p
             ON c.product_id = p.id
         
         WHERE c.user_id = ?
 
         ` , [userId]
        )
        return res
            .status(200)
            .json({
                msg: "Cart fetched Successfully..!",
                cart: showCart
            })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.body) return res.status(400).json({ msg: "Body is empty.." })

        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ msg: "Must enter productId and quantity" })
        }

        if (quantity <= 0) {
            return res.status(400).json({ msg: "quantity must be more than 0...!" })
        }

        const update = await db.execute(
            `
            UPDATE cart
            SET quantity = ? 
            WHERE product_id = ? AND user_id = ?
            `, [quantity, productId, userId]
        )

        return res
            .status(200)
            .json({
                msg: "Cart update Successfully..!",
            })

    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id

        if (!productId) return res.status(400).json({ msg: "can't get productId " })

        const remove = await db.execute(
            `
         DELETE FROM cart
         WHERE user_id = ? AND product_id = ?
         `, [userId, productId]
        )
        return res
            .status(200)
            .json({
                msg: "Cart item deleted Successfully..!",
            })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

}

const clearCart = async (req, res) => {         
    try {
        const userId = req.user.id;
        const [isCartClear] = await db.execute(
            `
            SELECT * FROM cart
            WHERE user_id = ?
            ` , [userId]
        )
        if (isCartClear.length <= 0) return res.status(400).json({ msg: `cart already clear..!` });

        const clear = await db.execute(
            `
            DELETE FROM cart
            WHERE user_id = ?
            `, [userId]
        );

        return res
            .status(200)
            .json({
                msg: "Cart clear Successfully..!",
            });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCart,
    deleteCartItem,
    clearCart
}
    