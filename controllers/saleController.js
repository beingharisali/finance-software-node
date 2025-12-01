
// // // // // const Sale = require("../models/Sale");
// // // // // const { StatusCodes } = require("http-status-codes");

// // // // // //Create Sale
// // // // // exports.createSale = async (req, res) => {
// // // // //   try {
// // // // //     const {
// // // // //       productType, productId, productDescription, price, broker, commission
// // // // //     } = req.body;

// // // // //     const agentId = req.user.userId; 

 
// // // // //     if (!productType || !productId || !productDescription || !price || !broker || !commission) {
// // // // //       return res.status(StatusCodes.BAD_REQUEST).json({
// // // // //         success: false,
// // // // //         message: "Missing required fields",
// // // // //       });
// // // // //     }

// // // // //     const sale = new Sale({
// // // // //   productType,
// // // // //   productId,
// // // // //   productDescription,
// // // // //   price,
// // // // //   broker,
// // // // //   commission,
// // // // //   agent: agentId,
// // // // //     });

// // // // //     await sale.save();

// // // // //     res.status(StatusCodes.CREATED).json({ success: true, sale });
// // // // //   } catch (error) {
// // // // //     console.error(error);
// // // // //     res
// // // // //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// // // // //       .json({ success: false, message: error.message });
// // // // //   }
// // // // // };

// // // // // // Get All Sales for Logged-in Agent
// // // // // exports.getMySales = async (req, res) => {
// // // // //   try {
// // // // //     const agentId = req.user.userId;
// // // // //     const sales = await Sale.find({ agent: agentId }).sort({ createdAt: -1 });
// // // // //     res.status(StatusCodes.OK).json({ success: true, sales });
// // // // //   } catch (error) {
// // // // //     res
// // // // //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// // // // //       .json({ success: false, message: error.message });
// // // // //   }
// // // // // };

// // // // // //Delete Sale
// // // // // exports.deleteSale = async (req, res) => {
// // // // //   try {
// // // // //     const sale = await Sale.findById(req.params.id);

// // // // //     if (!sale) {
// // // // //       return res
// // // // //         .status(StatusCodes.NOT_FOUND)
// // // // //         .json({ message: "Sale not found" });
// // // // //     }

// // // // //     if (sale.agent.toString() !== req.user.userId) {
// // // // //       return res
// // // // //         .status(StatusCodes.FORBIDDEN)
// // // // //         .json({ message: "Not authorized" });
// // // // //     }

// // // // //     await sale.deleteOne();
// // // // //     res.status(StatusCodes.OK).json({ message: "Sale deleted" });
// // // // //   } catch (error) {
// // // // //     res
// // // // //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
// // // // //       .json({ message: error.message });
// // // // //   }
// // // // // };
// // // // const Sale = require("../models/Sale");
// // // // const { StatusCodes } = require("http-status-codes");

// // // // // Create Sale → Admin, Manager, Agent
// // // // exports.createSale = async (req, res) => {
// // // //   try {
// // // //     const { productType, productId, productDescription, price, broker, commission } = req.body;
// // // //     const agentId = req.user.userId;

// // // //     if (!productType || !productId || !productDescription || !price || !broker || !commission) {
// // // //       return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
// // // //     }

// // // //     const sale = new Sale({
// // // //       productType,
// // // //       productId,
// // // //       productDescription,
// // // //       price,
// // // //       broker,
// // // //       commission,
// // // //       agent: agentId,
// // // //     });

// // // //     await sale.save();
// // // //     res.status(StatusCodes.CREATED).json({ success: true, sale });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // // //   }
// // // // };

// // // // // Get Sales → Admin & Manager get ALL, Agent gets their own
// // // // exports.getSales = async (req, res) => {
// // // //   try {
// // // //     const userId = req.user.userId;
// // // //     const role = req.user.role; // Ensure your auth middleware sets req.user.role

// // // //     let sales;

// // // //     if (role === "admin" || role === "manager") {
// // // //       // Admin & Manager → fetch all sales
// // // //       sales = await Sale.find()
// // // //         .sort({ createdAt: -1 })
// // // //         .populate("agent", "fullname email"); // populate agent info
// // // //     } else {
// // // //       // Agent → only their own sales
// // // //       sales = await Sale.find({ agent: userId })
// // // //         .sort({ createdAt: -1 })
// // // //         .populate("agent", "fullname email");
// // // //     }

// // // //     res.status(StatusCodes.OK).json({ success: true, sales });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // // //   }
// // // // };

// // // // // Delete Sale → Only Admin & Manager
// // // // exports.deleteSale = async (req, res) => {
// // // //   try {
// // // //     const sale = await Sale.findById(req.params.id);

// // // //     if (!sale) {
// // // //       return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });
// // // //     }

// // // //     if (req.user.role !== "admin" && req.user.role !== "manager") {
// // // //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// // // //     }

// // // //     await sale.deleteOne();
// // // //     res.status(StatusCodes.OK).json({ message: "Sale deleted" });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
// // // //   }
// // // // };
// // // // const Sale = require("../models/Sale");
// // // // const { StatusCodes } = require("http-status-codes");

// // // // // Create Sale
// // // // exports.createSale = async (req, res) => {
// // // //   try {
// // // //     let { productType, productId, productDescription, price, broker, commission, agent } = req.body;
    
// // // //     const role = req.user.role;

// // // //     // Admin/Manager can create for any agent, otherwise use logged-in agent
// // // //     if (role !== "admin" && role !== "manager" && role !== "assistant" ) {
// // // //       agent = req.user.userId;
// // // //     }

// // // //     if (!productType || !productId || !productDescription || !price || !broker || !commission || !agent) {
// // // //       return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
// // // //     }

// // // //     const sale = new Sale({ productType, productId, productDescription, price, broker, commission, agent });
// // // //     await sale.save();
// // // //     res.status(StatusCodes.CREATED).json({ success: true, sale });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // // //   }
// // // // };

// // // // // Get Sales
// // // // exports.getSales = async (req, res) => {
// // // //   try {
// // // //     const role = req.user.role;
// // // //     const userId = req.user.userId;

// // // //     let sales;

// // // //     if (role === "admin" || role === "manager" || role !== "assistant") {
// // // //       sales = await Sale.find().sort({ createdAt: -1 }).populate("agent", "fullname email role");
// // // //     } else {
// // // //       sales = await Sale.find({ agent: userId }).sort({ createdAt: -1 }).populate("agent", "fullname email");
// // // //     }

// // // //     res.status(StatusCodes.OK).json({ success: true, sales });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // // //   }
// // // // };

// // // // // Update Sale
// // // // exports.updateSale = async (req, res) => {
// // // //   try {
// // // //     const sale = await Sale.findById(req.params.id);
// // // //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// // // //     const role = req.user.role;

// // // //     // Only admin/manager or owner agent can update
// // // //     if (role !== "admin" && role !== "manager" && role !== "assistant" && sale.agent.toString() !== req.user.userId) {
// // // //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// // // //     }

// // // //     const { productType, productId, productDescription, price, broker, commission, agent } = req.body;

// // // //     // Only admin/manager can change agent
// // // //     if (role === "admin" || role === "manager" || role !== "assistant") {
// // // //       sale.agent = agent || sale.agent;
// // // //     }

// // // //     sale.productType = productType || sale.productType;
// // // //     sale.productId = productId || sale.productId;
// // // //     sale.productDescription = productDescription || sale.productDescription;
// // // //     sale.price = price ?? sale.price;
// // // //     sale.broker = broker || sale.broker;
// // // //     sale.commission = commission ?? sale.commission;

// // // //     await sale.save();
// // // //     res.status(StatusCodes.OK).json({ success: true, sale });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // // //   }
// // // // };

// // // // // Delete Sale
// // // // exports.deleteSale = async (req, res) => {
// // // //   try {
// // // //     const sale = await Sale.findById(req.params.id);
// // // //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// // // //     const role = req.user.role;

// // // //     if (role !== "admin" && role !== "manager" && sale.agent.toString() !== req.user.userId) {
// // // //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// // // //     }

// // // //     await sale.deleteOne();
// // // //     res.status(StatusCodes.OK).json({ message: "Sale deleted" });
// // // //   } catch (error) {
// // // //     console.error(error);
// // // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
// // // //   }
// // // // };
// // // const Sale = require("../models/Sale");
// // // const { StatusCodes } = require("http-status-codes");

// // // // ---------------------------
// // // // CREATE SALE
// // // // ---------------------------
// // // exports.createSale = async (req, res) => {
// // //   try {
// // //     let { productType, productId, productDescription, price, broker, commission, agent } = req.body;
// // //     const role = req.user.role;

// // //     // Admin/Manager/Assistant can create for any agent, others use logged-in user
// // //     if (!["admin", "manager", "assistant"].includes(role)) {
// // //       agent = req.user.userId;
// // //     }

// // //     if (!productType || !productId || !productDescription || !price || !broker || !commission || !agent) {
// // //       return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
// // //     }

// // //     const sale = new Sale({ productType, productId, productDescription, price, broker, commission, agent });
// // //     await sale.save();
// // //     res.status(StatusCodes.CREATED).json({ success: true, sale });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // //   }
// // // };

// // // // ---------------------------
// // // // GET SALES
// // // // ---------------------------
// // // exports.getSales = async (req, res) => {
// // //   try {
// // //     const role = req.user.role;
// // //     const userId = req.user.userId;

// // //     let sales;

// // //     if (["admin", "manager", "assistant"].includes(role)) {
// // //       // Admin, Manager, Assistant → see all sales
// // //       sales = await Sale.find()
// // //         .sort({ createdAt: -1 })
// // //         .populate("agent", "fullname email role")
// // //         .populate("broker", "fullname email role");
// // //     } else {
// // //       // Agents → only own sales
// // //       sales = await Sale.find({ agent: userId })
// // //         .sort({ createdAt: -1 })
// // //         .populate("agent", "fullname email")
// // //         .populate("broker", "fullname email");
// // //     }

// // //     res.status(StatusCodes.OK).json({ success: true, sales });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // //   }
// // // };

// // // // ---------------------------
// // // // UPDATE SALE
// // // // ---------------------------
// // // exports.updateSale = async (req, res) => {
// // //   try {
// // //     const sale = await Sale.findById(req.params.id);
// // //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// // //     const role = req.user.role;

// // //     // Only Admin/Manager/Assistant or owner agent can update
// // //     if (!["admin", "manager", "assistant"].includes(role) && sale.agent.toString() !== req.user.userId) {
// // //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// // //     }

// // //     const { productType, productId, productDescription, price, broker, commission, agent } = req.body;

// // //     // Admin/Manager/Assistant can change agent, others cannot
// // //     if (["admin", "manager", "assistant"].includes(role)) {
// // //       sale.agent = agent || sale.agent;
// // //     }

// // //     sale.productType = productType || sale.productType;
// // //     sale.productId = productId || sale.productId;
// // //     sale.productDescription = productDescription || sale.productDescription;
// // //     sale.price = price ?? sale.price;
// // //     sale.broker = broker || sale.broker;
// // //     sale.commission = commission ?? sale.commission;

// // //     await sale.save();
// // //     res.status(StatusCodes.OK).json({ success: true, sale });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // //   }
// // // };

// // // // ---------------------------
// // // // DELETE SALE
// // // // ---------------------------
// // // exports.deleteSale = async (req, res) => {
// // //   try {
// // //     const sale = await Sale.findById(req.params.id);
// // //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// // //     const role = req.user.role;

// // //     // Admin/Manager/Assistant → can delete any sale, Agent → only own sale
// // //     if (!["admin", "manager", "assistant"].includes(role) && sale.agent.toString() !== req.user.userId) {
// // //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// // //     }

// // //     await sale.deleteOne();
// // //     res.status(StatusCodes.OK).json({ success: true, message: "Sale deleted" });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// // //   }
// // // };
// // const Sale = require("../models/Sale");
// // const { StatusCodes } = require("http-status-codes");

// // // ---------------------------
// // // CREATE SALE
// // // ---------------------------
// // exports.createSale = async (req, res) => {
// //   try {
// //     let { productType, productId, productDescription, price, broker, commission, agent } = req.body;
// //     const role = req.user.role;

// //     // Admin/Manager/Assistant/Broker can create for any agent, others use logged-in user
// //     if (!["admin", "manager", "assistant", "broker"].includes(role)) {
// //       agent = req.user.userId;
// //     }

// //     if (!productType || !productId || !productDescription || !price || !broker || !commission || !agent) {
// //       return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
// //     }

// //     const sale = new Sale({ productType, productId, productDescription, price, broker, commission, agent });
// //     await sale.save();
// //     res.status(StatusCodes.CREATED).json({ success: true, sale });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// //   }
// // };

// // // ---------------------------
// // // GET SALES
// // // ---------------------------
// // exports.getSales = async (req, res) => {
// //   try {
// //     const role = req.user.role;
// //     const userId = req.user.userId;

// //     let sales;

// //     if (["admin", "manager", "assistant", "broker"].includes(role)) {
// //       // Admin/Manager/Assistant/Broker → see all sales
// //       sales = await Sale.find()
// //         .sort({ createdAt: -1 })
// //         .populate("agent", "fullname email role")
// //         .populate("broker", "fullname email role");
// //     } else {
// //       // Agents → only own sales
// //       sales = await Sale.find({ agent: userId })
// //         .sort({ createdAt: -1 })
// //         .populate("agent", "fullname email")
// //         .populate("broker", "fullname email");
// //     }

// //     res.status(StatusCodes.OK).json({ success: true, sales });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// //   }
// // };

// // // ---------------------------
// // // UPDATE SALE
// // // ---------------------------
// // exports.updateSale = async (req, res) => {
// //   try {
// //     const sale = await Sale.findById(req.params.id);
// //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// //     const role = req.user.role;

// //     // Only Admin/Manager/Assistant/Broker or owner agent can update
// //     if (!["admin", "manager", "assistant", "broker"].includes(role) && sale.agent.toString() !== req.user.userId) {
// //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// //     }

// //     const { productType, productId, productDescription, price, broker, commission, agent } = req.body;

// //     // Admin/Manager/Assistant/Broker can change agent, others cannot
// //     if (["admin", "manager", "assistant", "broker"].includes(role)) {
// //       sale.agent = agent || sale.agent;
// //     }

// //     sale.productType = productType || sale.productType;
// //     sale.productId = productId || sale.productId;
// //     sale.productDescription = productDescription || sale.productDescription;
// //     sale.price = price ?? sale.price;
// //     sale.broker = broker || sale.broker;
// //     sale.commission = commission ?? sale.commission;

// //     await sale.save();
// //     res.status(StatusCodes.OK).json({ success: true, sale });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// //   }
// // };

// // // ---------------------------
// // // DELETE SALE
// // // ---------------------------
// // exports.deleteSale = async (req, res) => {
// //   try {
// //     const sale = await Sale.findById(req.params.id);
// //     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

// //     const role = req.user.role;

// //     // Admin/Manager/Assistant/Broker → can delete any sale, Agent → only own sale
// //     if (!["admin", "manager", "assistant", "broker"].includes(role) && sale.agent.toString() !== req.user.userId) {
// //       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
// //     }

// //     await sale.deleteOne();
// //     res.status(StatusCodes.OK).json({ success: true, message: "Sale deleted" });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
// //   }
// // };
// const Sale = require("../models/Sale");
// const { StatusCodes } = require("http-status-codes");

// // ---------------------------
// // CREATE SALE
// // ---------------------------
// exports.createSale = async (req, res) => {
//   try {
//     let { productType, productId, productDescription, price, broker, commission } = req.body;
//     const role = req.user.role;

//     // Required fields validation
//     if (
//       !productType ||
//       !productId ||
//       !productDescription ||
//       price == null ||      // 0 is allowed
//       !broker ||
//       commission == null    // 0 is allowed
//     ) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     // Create Sale
//     const sale = new Sale({
//       productType,
//       productId,
//       productDescription,
//       price,
//       broker,
//       commission,
//     });

//     await sale.save();
//     res.status(StatusCodes.CREATED).json({ success: true, sale });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message });
//   }
// };

// // ---------------------------
// // GET SALES
// // ---------------------------
// exports.getSales = async (req, res) => {
//   try {
//     const role = req.user.role;
//     const userId = req.user.userId;

//     let sales;

//     if (["admin", "manager", "assistant", "broker"].includes(role)) {
//       // Admin/Manager/Assistant/Broker → see all sales
//       sales = await Sale.find()
//         .sort({ createdAt: -1 })
//         .populate("broker", "fullname email role");
//     } else {
//       // Other users → only their own sales (if needed)
//       sales = await Sale.find({ broker: userId })
//         .sort({ createdAt: -1 })
//         .populate("broker", "fullname email");
//     }

//     res.status(StatusCodes.OK).json({ success: true, sales });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message });
//   }
// };

// // ---------------------------
// // UPDATE SALE
// // ---------------------------
// exports.updateSale = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.id);
//     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

//     const role = req.user.role;
//     const userId = req.user.userId;

//     // Only Admin/Manager/Assistant/Broker or owner broker can update
//     if (!["admin", "manager", "assistant", "broker"].includes(role) && sale.broker.toString() !== userId) {
//       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
//     }

//     const { productType, productId, productDescription, price, broker, commission } = req.body;

//     sale.productType = productType || sale.productType;
//     sale.productId = productId || sale.productId;
//     sale.productDescription = productDescription || sale.productDescription;
//     sale.price = price != null ? price : sale.price;
//     sale.broker = broker || sale.broker;
//     sale.commission = commission != null ? commission : sale.commission;

//     await sale.save();
//     res.status(StatusCodes.OK).json({ success: true, sale });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message });
//   }
// };

// // ---------------------------
// // DELETE SALE
// // ---------------------------
// exports.deleteSale = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.id);
//     if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ message: "Sale not found" });

//     const role = req.user.role;
//     const userId = req.user.userId;

//     // Admin/Manager/Assistant/Broker → can delete any sale, broker → only own
//     if (!["admin", "manager", "assistant", "broker"].includes(role) && sale.broker.toString() !== userId) {
//       return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });
//     }

//     await sale.deleteOne();
//     res.status(StatusCodes.OK).json({ success: true, message: "Sale deleted" });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message });
//   }
// };


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
    let assignedBroker = broker;
    if (role === "broker") assignedBroker = userId;

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
    let sales;

    if (["admin", "manager", "assistant"].includes(role)) {
      // Admin/Manager/Assistant → see all sales
      sales = await Sale.find().sort({ createdAt: -1 }).populate("broker", "fullname email role");
    } else if (role === "broker") {
      // Broker → see only own sales
      sales = await Sale.find({ broker: userId }).sort({ createdAt: -1 }).populate("broker", "fullname email role");
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Not authorized" });
    }

    res.status(StatusCodes.OK).json({ success: true, sales });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// ---------------------------
// UPDATE SALE
// ---------------------------
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Sale not found" });

    const { role, userId } = req.user;

    // Broker can only update own sales
    if (role === "broker" && sale.broker.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Not authorized" });
    }

    const { productType, productId, productDescription, price, broker, commission } = req.body;

    sale.productType = productType || sale.productType;
    sale.productId = productId || sale.productId;
    sale.productDescription = productDescription || sale.productDescription;
    sale.price = price != null ? price : sale.price;
    sale.commission = commission != null ? commission : sale.commission;

    // Only Admin/Manager/Assistant can change broker
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

    // Broker can only delete own sales
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
