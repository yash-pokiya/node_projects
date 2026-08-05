const db = require("../configs/db")

const createCategory = async (req, res) => {
    try {

        const { categoryName, description } = req.body;

        if (!categoryName || !description) {
            return res
                .status(400)
                .json(
                    {
                        msg: "Must be enter category_name and description"
                    }
                )
        }

        const [isAlreadyExist] = await db.execute(
            `
            SELECT * FROM categories
            WHERE category_name = ?
            `, [categoryName]
        )

        if (isAlreadyExist[0]) {
            return res
                .status(400)
                .json(
                    {
                        msg: "Category already exist..!"
                    }
                )
        }

        const category = await db.execute(
            `
            INSERT INTO categories
            (category_name , description)
            VALUES (? , ?)
            `,
            [categoryName, description]
        )

        return res
            .status(200)
            .json(
                {
                    "msg": "category added success..!"
                }
            )
    } catch (error) {
        return res.
            status(200)
            .json(
                {
                    "msg": error.message
                }
            )
    }
}

const allCategories = async (req, res) => {
    try {
        const [categories] = await db.execute(
            `
         SELECT * FROM categories
         `
        )

        return res
            .status(200)
            .json(
                {
                    msg: "category fetched successfully..!",
                    categories
                }
            )
    } catch (error) {
        return res.
            status(200)
            .json(
                {
                    "msg": error.message
                }
            )
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { categoryName, description } = req.body;

        if (!categoryName || !description) {
            return res
                .status(400)
                .json(
                    {
                        msg: "Must be enter category_name and description"
                    }
                )
        }

        const updatedProduct = await db.execute(
            `
            UPDATE categories
            SET 
            category_name = COALESCE(? , category_name),
            description = COALESCE(? , description)
            WHERE id = ?
            `, [
            categoryName,
            description,
            categoryId
        ]
        )

        return res
            .status(200)
            .json(
                {
                    "msg": `update category successful where id is ${categoryId}`,
                    "note": "show only fields that updated",
                    updateField: {
                        "category name": categoryName || null,
                        "description": description || null
                    }
                }
            )

    } catch (error) {
        return res.
            status(200)
            .json(
                {
                    "msg": error.message
                }
            )
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const [isExist] = await db.execute(
            `
            SELECT * FROM categories
            WHERE id = ?
            `, [categoryId]
        )
        if (!isExist[0]) {
            return res
                .status(400)
                .json(
                    {
                        msg: "Category Not Found..!"
                    }
                )
        }

        const deletedCategory = await db.execute(
            `
            DELETE FROM categories
            WHERE id = ?
            `, [categoryId]
        )

        return res
            .status(200)
            .json(
                {
                    msg: "Category delete success..!",
                    "deleted category": isExist[0].category_name
                }
            )
    } catch (error) {
        return res.
            status(500)
            .json(
                {
                    "msg": error.message
                }
            )
    }

}

module.exports = {
    createCategory,
    allCategories,
    updateCategory,
    deleteCategory
}   

