// const fs = require("fs");
// const csv = require("csv-parser");
// const Client = require("../models/Client");

// const Deal = require("../models/Deal");

// // Import CSV
// const importClients = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ msg: "No file uploaded" });
//     }

//     const results = [];

//     // Read CSV
//     fs.createReadStream(req.file.path)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", async () => {
//         let addedCount = 0;
//         let skippedCount = 0;

//         for (const [index, row] of results.entries()) {
//           try {
//             const firstName = (row["First Name"] || "").trim();
//             const lastName = (row["Last Name"] || "").trim();
//             const email = (row["Email"] || "").trim().toLowerCase();
//             const phoneNumber = (row["Phone Number"] || "").trim();
//             const address = (row["Address"] || "").trim();
//             const broker = (row["Broker"] || "").trim();
//             const extraInfo = (row["Extra Info"] || "").trim();

//             const dobRaw = row["Date of Birth"];
//             const dob = dobRaw ? new Date(dobRaw) : null;

//             // Skip if email already exists
//             const existing = await Client.findOne({ email });
//             if (existing) {
//               console.error(`Skipped row ${index + 1}: duplicate email`, row);
//               skippedCount++;
//               continue;
//             }

//             // Auto-increment clientNumber
//             const lastClient = await Client.findOne().sort({
//               clientNumber: -1,
//             });
//             const clientNumber = lastClient ? lastClient.clientNumber + 1 : 1;

//             const client = new Client({
//               clientNumber,
//               firstName,
//               lastName,
//               email,
//               phoneNumber,
//               address,
//               extraInfo,
//               broker,
//               dateOfBirth: dob,
//             });

//             await client.save();
//             addedCount++;
//           } catch (rowErr) {
//             console.error(
//               `Error saving row ${index + 1}:`,
//               row,
//               rowErr.message,
//             );
//             skippedCount++;
//           }
//         }

//         // Delete the uploaded CSV
//         fs.unlinkSync(req.file.path);

//         res.json({
//           msg: `CSV processed`,
//           added: addedCount,
//           skipped: skippedCount,
//         });
//       });
//   } catch (err) {
//     console.error("Import error:", err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// const getClients = async (req, res) => {
//   try {
//     const clients = await Client.find().sort({ clientNumber: 1 });

//     const clientsWithDealsCount = await Promise.all(
//       clients.map(async (client) => {
//         const dealsCount = await Deal.countDocuments({ client: client._id });
//         return { ...client.toObject(), dealsCount };
//       }),
//     );

//     res.json(clientsWithDealsCount); // send clients with dealsCount
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // Create single client
// const createClient = async (req, res) => {
//   try {
//     const email = req.body.email?.trim().toLowerCase();
//     const existing = await Client.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "Email already exists" });

//     const lastClient = await Client.findOne().sort({ clientNumber: -1 });
//     const clientNumber = lastClient ? lastClient.clientNumber + 1 : 1;

//     const client = await Client.create({ clientNumber, ...req.body });
//     res.status(201).json(client);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
// // Update a client
// const updateClient = async (req, res) => {
//   try {
//     const clientNumber = Number(req.params.clientNumber);

//     if (req.body.email) {
//       const existing = await Client.findOne({
//         email: req.body.email.toLowerCase(),
//         clientNumber: { $ne: clientNumber },
//       });
//       if (existing)
//         return res.status(400).json({ msg: "Email already exists" });
//     }

//     const updatedClient = await Client.findOneAndUpdate(
//       { clientNumber },
//       req.body,
//       { new: true },
//     );

//     if (!updatedClient)
//       return res.status(404).json({ msg: "Client not found" });

//     res.json(updatedClient);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
// // Delete a client
// const deleteClient = async (req, res) => {
//   try {
//     const clientNumber = req.params.clientNumber;
//     const deletedClient = await Client.findOneAndDelete({ clientNumber });

//     if (!deletedClient)
//       return res.status(404).json({ msg: "Client not found" });

//     res.json({ msg: "Client deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get deals for a single client
// const getClientDeals = async (req, res) => {
//   try {
//     const clientId = req.params.id;
//     const deals = await Deal.find({ client: clientId }).sort({ createdAt: -1 });
//     res.json(deals);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// module.exports = {
//   importClients,
//   createClient,
//   getClients,
//   updateClient,
//   deleteClient,
//   getClientDeals,
// };
const fs = require("fs");
const csv = require("csv-parser");
const Client = require("../models/Client");
const Deal = require("../models/Deal");

/* ---------------- HELPER: SC001 ---------------- */
// const incrementClientNo = (last) => {
//   const num = parseInt(last.replace(/\D/g, "")) || 0;
//   return `SC${String(num + 1).padStart(3, "0")}`;
// };
const incrementClientNo = (last) => {
  if (!last) return "SC001";

  // remove ALL non-numeric safely
  const num = parseInt(last.toString().replace(/[^0-9]/g, "")) || 0;

  return `SC${String(num + 1).padStart(3, "0")}`;
};

/* ---------------- CSV IMPORT ---------------- */
const importClients = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        let added = 0;
        let skipped = 0;

        for (const [index, row] of results.entries()) {
          try {
            const email = (row["Email"] || "").trim().toLowerCase();

            const existsEmail = await Client.findOne({ email });
            if (existsEmail) {
              skipped++;
              continue;
            }

            const rawClientNo = row["Client No."];

            let clientNumber;

            //  CSV VALUE USE
            if (rawClientNo && rawClientNo.trim()) {
              clientNumber = rawClientNo.trim();
            } else {
              const last = await Client.findOne().sort({
                clientNumber: -1,
              });

              // clientNumber = last?.clientNumber
              //   ? incrementClientNo(last.clientNumber)
              //   : "SC001";
              let lastNumber = last?.clientNumber;

if (typeof lastNumber === "string" && lastNumber.startsWith("SC")) {
  lastNumber = lastNumber;
}

const clientNumber = lastNumber
  ? incrementClientNo(lastNumber)
  : "SC001";
            }

            const existsClientNo = await Client.findOne({
              clientNumber,
            });

            if (existsClientNo) {
              skipped++;
              continue;
            }

            const client = new Client({
              clientNumber,
              firstName: (row["First Name"] || "").trim(),
              lastName: (row["Last Name"] || "").trim(),
              email,
              phoneNumber: (row["Phone Number"] || "").trim(),
              address: (row["Address"] || "").trim(),
              broker: (row["Broker"] || "").trim(),
              extraInfo: (row["Extra Info"] || "").trim(),
              dateOfBirth: row["Date of Birth"]
                ? new Date(row["Date of Birth"])
                : null,
            });

            await client.save();
            added++;
          } catch (err) {
            console.log("Row error:", err.message);
            skipped++;
          }
        }

        fs.unlinkSync(req.file.path);

        res.json({
          msg: "CSV processed",
          added,
          skipped,
        });
      });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ---------------- MANUAL CREATE (AUTO SC) ---------------- */
const createClient = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    const exists = await Client.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already exists" });

    const last = await Client.findOne().sort({
      clientNumber: -1,
    });

    const clientNumber = last?.clientNumber
      ? incrementClientNo(last.clientNumber)
      : "SC001";

    const client = await Client.create({
      ...req.body,
      email,
      clientNumber,
    });

    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ---------------- GET CLIENTS ---------------- */
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({
      clientNumber: 1,
    });

    const result = await Promise.all(
      clients.map(async (c) => {
        const dealsCount = await Deal.countDocuments({
          client: c._id,
        });

        return { ...c.toObject(), dealsCount };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ---------------- UPDATE CLIENT ---------------- */
const updateClient = async (req, res) => {
  try {
    const updated = await Client.findOneAndUpdate(
      { clientNumber: req.params.clientNumber },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ msg: "Client not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ---------------- DELETE CLIENT ---------------- */
const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findOneAndDelete({
      clientNumber: req.params.clientNumber,
    });

    if (!deleted)
      return res.status(404).json({ msg: "Client not found" });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ---------------- CLIENT DEALS ---------------- */
const getClientDeals = async (req, res) => {
  try {
    const deals = await Deal.find({
      client: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(deals);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  importClients,
  createClient,
  getClients,
  updateClient,
  deleteClient,
  getClientDeals,
};