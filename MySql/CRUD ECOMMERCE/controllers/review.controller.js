const db = require("../configs/db")

const submitReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const userId = req.user.id;
        const productId = req.params.id;
        if (!rating) {
            return res
                .status(400)
                .json(
                    {
                        "msg": "Must enter rating..!"
                    }
                );
        }

        if (rating > 5 || rating < 1) {
            return res
                .status(400)
                .json(
                    {
                        "msg": "rating only between 1 to 5..!"
                    }
                );
        }
        const [checkReview] = await db.execute(
            `
            SELECT * FROM reviews
            WHERE product_id = ? AND user_id = ?
            `, [productId, userId]
        )
        if (checkReview[0]) {
            return res
                .status(400)
                .json(
                    {
                        "msg": "review already submited for this product from this account..!"
                    }
                );
        }
        const submit = await db.execute(
            `
            INSERT INTO reviews
            (user_id , product_id , rating , review)
            VALUES(? , ? , ? , ?)
            `, [userId, productId, rating, review]
        )

        return res
            .status(200)
            .json(
                {
                    msg: `review sublited successfully.!!`
                }
            )
    } catch (error) {
        return res.status(500).json({ "msg": error.message })
    }
}   

const showReviewOfProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const [reviews] = await db.execute(
            `
         SELECT u.username , u.id AS userId,
                 p.product_name , p.id AS product_id,
                  r.review , r.rating,
                  (
                  SELECT ROUND(avg(r2.rating)) AS rating 
                  FROM reviews r2
                  WHERE r2.product_id = r.product_id
                  )AS average_rating
 
                 FROM reviews r
                     JOIN users u
                     ON u.id = r.user_id
 
                     JOIN products p
                     ON p.id = r.product_id
                 WHERE r.product_id = ?
                 ORDER BY r.created_at desc
         `, [productId]
        )

        if (reviews.length <= 0) {
            return res.
                status(201)
                .json({
                    msg: "Product still not have review or rating..!"
                })
        }

        return res.
            status(201)
            .json({
                msg: "All review ferched..!",
                reviews
            })
    } catch (error) {
         return res.status(500).json({ "msg": error.message })
    }
}


module.exports = {
    submitReview,
    showReviewOfProduct
}   