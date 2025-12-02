
const Sale = require("../models/Sale");
const { StatusCodes } = require("http-status-codes");

// ---------------------------
// CREATE SALE
// ---------------------------
exports.createSale = async (req, res) => {
  try {
    const { productType, productId, productDescription, price, broker, commission } = req.body;
    const { role, userId } = req.user;

    if (!productType || !productId || !productDescription || price == null || !broker || commission == null) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
    }

    // Broker cannot assign sale to another broker
    const assignedBroker = role === "broker" ? userId : broker;

    const sale = new Sale({
      productType,
      productId,
      productDescription,
      price,
      commission,
      broker: assignedBroker,
    });

    await sale.save();
    res.status(StatusCodes.CREATED).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ---------------------------
// GET SALES
// ---------------------------

exports.getSales = async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { broker } = req.query; // <-- add this

    let filter = {};

    if (role === "broker") {
      filter.broker = userId; // Broker → only own sales
    } else if (broker) {
      filter.broker = broker; // Admin/Manager/Assistant → filter by broker if query provided
    }

    const sales = await Sale.find(filter)
      .sort({ createdAt: -1 })
      .populate("broker", "fullname email role");

    res.status(StatusCodes.OK).json({ success: true, sales });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// exports.getSales = async (req, res) => {
//   try {
//     const { role, userId } = req.user;
//     let sales;

//     if (role === "broker") {
//       // Broker → only own sales
//       sales = await Sale.find({ broker: userId })
//         .sort({ createdAt: -1 })
//         .populate("broker", "fullname email role");
//     } else {
//       // Admin / Manager / Assistant → all broker sales
//       sales = await Sale.find()
//         .sort({ createdAt: -1 })
//         .populate("broker", "fullname email role");
//     }

//     res.status(StatusCodes.OK).json({ success: true, sales });
//   } catch (error) {
//     console.error(error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
//   }
// };

// ---------------------------
// UPDATE SALE
// ---------------------------
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Sale not found" });

    const { role, userId } = req.user;

    if (role === "broker" && sale.broker.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Not authorized" });
    }

    const { productType, productId, productDescription, price, broker, commission } = req.body;

    sale.productType = productType || sale.productType;
    sale.productId = productId || sale.productId;
    sale.productDescription = productDescription || sale.productDescription;
    sale.price = price != null ? price : sale.price;
    sale.commission = commission != null ? commission : sale.commission;

    if (["admin", "manager", "assistant"].includes(role) && broker) sale.broker = broker;

    await sale.save();
    res.status(StatusCodes.OK).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ---------------------------
// DELETE SALE
// ---------------------------
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Sale not found" });

    const { role, userId } = req.user;

    if (role === "broker" && sale.broker.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Not authorized" });
    }

    await sale.deleteOne();
    res.status(StatusCodes.OK).json({ success: true, message: "Sale deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};
