const db = require("../configs/db");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

const createProduct = async (req, res) => {
  try {
    const { productName, description, price, stock, categoryId } = req.body;
    if (!productName || !description || !price || !stock || !categoryId) {
      return res
        .status(200)
        .json({ msg: "All fields must be required for add product..!" });
    }
    const imagePath = req.file?.path;
    const imageUrl = await uploadOnCloudinary(imagePath);
    const [createdProduct] = await db.execute(
      `
            INSERT INTO products
            (product_name , description , price , stock , category_id , imageUrl  )
            VALUES(? , ? , ? , ? , ? , ?)
            `,
      [productName, description, price, stock, categoryId, imageUrl.url],
    );
    return res.status(200).json({
      msg: "Product Added Successfully..!",
      product: {
        product_name: productName,
        description,
        price,
        stock,
        categoryId,
        imageUrl: imageUrl.url,
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const [product] = await db.execute(
      `
            SELECT 
            p.id,
            p.imageUrl,
            p.product_name,
            p.description,
            p.price,
            p.stock,
            p.created_at,
            p.category_id,
            c.category_name,
            c.description AS category_description

            FROM products p
            JOIN categories c
            ON p.category_id = c.id
            `,
    );
    

    if (product.length <= 0) {
      return res.status(404).json({ msg: "No any Product found..!" });
    }
    return res.status(200).json({
      msg: "Products fetched success..!",
      product,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const productId = req.params.id;
    const [getItem] = await db.execute(
      `
         SELECT * FROM products
         WHERE id = ?
         `,
      [productId],
    );
    return res.status(200).json({
      msg: "Product fetched success..!",
      products: [getItem][0],
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { productName, description, price, stock, category } = req.body;
    if (!productName || !description || !price || !stock || !category) {
      return res
        .status(200)
        .json({ msg: "All fields must be required for add product..!" });
    }
    const imagePath = req.file?.path;
    let imageUrl ;
    if(imagePath){
        imageUrl = await uploadOnCloudinary(imagePath);
    }
   
    const updatedProduct = await db.execute(
      `
            UPDATE products
            SET 
            product_name = COALESCE(? , product_name),
            description = COALESCE(? , product_name),
            price = COALESCE(? , price),
            stock = COALESCE(? , stock),
            category_id = COALESCE(? , category_id),
            imageUrl = COALESCE(? , imageUrl)
            where id = ?
            `,
      [productName, description, price, stock, category, imageUrl.url, productId ],
    );
    return res.status(200).json({
      msg: "Product Updated successfull..!",
      note: "Return only the updated fields...!",
      updatedUser: {
        productName: productName ?? null,
        description: description ?? null,
        price: price ?? null,
        stock: stock ?? null,
        category: category ?? null,
        imageUrl: imageUrl.url ?? null
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [product] = await db.execute(`SELECT * FROM products where id = ?`, [
      productId,
    ]);

    if (!product[0])
      return res
        .status(400)
        .json({ msg: "Product not found or already deleted..!" });

    const [removeProduct] = await db.execute(
      `
                DELETE FROM products
                WHERE id = ?
            `,
      [productId],
    );

    return res.status(200).json({
      msg: "Product deleted successfull..!",
      deletedUser: product[0],
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getOne,
  editProduct,
  deleteProduct,
};
