const db = require("../configs/db");

const addAddress = async (req, res) => {
  try {
    const { address, city, state, pincode, country } = req.body;
    const finalCountry = country || "India";
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        msg: "Unauthorize..",
      });
    }
    if (!address || !city) {
      return res.status(400).json({
        msg: "Address and city must be required..!",
      });
    }
    const newAddress = await db.execute(
      `
           INSERT INTO addresses
           (user_id , address , city , state , pincode , country)
           VALUES(? , ? , ? , ? , ? , ?)
           `,
      [userId, address, city, state || null, pincode || null, finalCountry],
    );

    return res.status(200).json({
      msg: "address saved..!",
      address: {
        userId,
        address,
        city,
        state: state || null,
        pincode: pincode || null,
        country: finalCountry,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [allAddresses] = await db.execute(
      `
          SELECT * FROM addresses
          WHERE user_id = ?
          `,
      [userId],
    );
    if (allAddresses.length <= 0) {
      return res.status(201).json({
        msg: "You still dont save any address..!",
      });
    }
    return res.status(201).json({
      addresses: allAddresses,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params?.id;
    const [isExist] = await db.execute(
      `
            SELECT * FROM addresses
            WHERE id = ? AND user_id = ?
            `,
      [addressId, userId],
    );
    if (!isExist[0]) {
      return res.status(401).json({
        msg: "address not found in your account..!",
      });
    }
    const address = await db.execute(
      `
            DELETE FROM addresses
            WHERE id = ? AND user_id = ?
            `,
      [addressId, userId],
    );
    return res.status(201).json({
      msg: "address deleted successfully..!",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddress,
  deleteAddress,
};
