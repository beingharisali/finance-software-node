
const Sale = require("../models/Sale");
const { StatusCodes } = require("http-status-codes");

//Create Sale
exports.createSale = async (req, res) => {
  try {
    const {
      saleName,
      productName,
      description,
      price,
      clientName,
      rating,
      review,
      date,
    } = req.body;

    const agentId = req.user.userId; // from authentication middleware

    // Validate required fields
    if (!saleName || !productName || !price || !clientName || !date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const sale = new Sale({
      saleName,
      productName,
      description,
      price,
      clientName,
      rating,
      review,
      date,
      agent: agentId,
    });

    await sale.save();

    res.status(StatusCodes.CREATED).json({ success: true, sale });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// Get All Sales for Logged-in Agent
exports.getMySales = async (req, res) => {
  try {
    const agentId = req.user.userId;
    const sales = await Sale.find({ agent: agentId }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ success: true, sales });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

//Delete Sale
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Sale not found" });
    }

    if (sale.agent.toString() !== req.user.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Not authorized" });
    }

    await sale.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Sale deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
