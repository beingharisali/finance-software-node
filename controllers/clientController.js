
const fs = require("fs");
const csv = require("csv-parser");
const Client = require("../models/Client");

// Import CSV
const importClients = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const results = [];

    // Read CSV
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        let addedCount = 0;
        let skippedCount = 0;

        for (const [index, row] of results.entries()) {
          try {
            // Trim CSV values
            const firstName = row["First Name"]?.trim() || "";
            const lastName = row["Last Name"]?.trim() || "";
            const email = row["Email"]?.trim().toLowerCase() || "";
            const phoneNumber = row["Phone Number"]?.trim() || "";
            const address = row["Address"]?.trim() || "";
            const extraInfo = row["Extra Info"]?.trim() || "";
            const dob = row["Date of Birth"] ? new Date(row["Date of Birth"]) : null;

            // Skip if required fields missing
            if (!firstName || !lastName || !email || !phoneNumber || !address || !dob) {
              console.error(`Skipped row ${index + 1}: missing required field`, row);
              skippedCount++;
              continue;
            }

            // Skip if email already exists
            const existing = await Client.findOne({ email });
            if (existing) {
              console.error(`Skipped row ${index + 1}: duplicate email`, row);
              skippedCount++;
              continue;
            }

            // Auto-increment clientNumber
            const lastClient = await Client.findOne().sort({ clientNumber: -1 });
            const clientNumber = lastClient ? lastClient.clientNumber + 1 : 1;

            const client = new Client({
              clientNumber,
              firstName,
              lastName,
              email,
              phoneNumber,
              address,
              extraInfo,
              dateOfBirth: dob,
            });

            await client.save();
            addedCount++;
          } catch (rowErr) {
            console.error(`Error saving row ${index + 1}:`, row, rowErr.message);
            skippedCount++;
          }
        }

        // Delete the uploaded CSV
        fs.unlinkSync(req.file.path);

        res.json({
          msg: `CSV processed`,
          added: addedCount,
          skipped: skippedCount,
        });
      });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ clientNumber: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create single client
const createClient = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const existing = await Client.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const lastClient = await Client.findOne().sort({ clientNumber: -1 });
    const clientNumber = lastClient ? lastClient.clientNumber + 1 : 1;

    const client = await Client.create({ clientNumber, ...req.body });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Update a client
const updateClient = async (req, res) => {
  try {
    const clientNumber = Number(req.params.clientNumber); 

    if (req.body.email) {
      const existing = await Client.findOne({
        email: req.body.email.toLowerCase(),
        clientNumber: { $ne: clientNumber }
      });
      if (existing) return res.status(400).json({ msg: "Email already exists" });
    }

    const updatedClient = await Client.findOneAndUpdate(
      { clientNumber },
      req.body,
      { new: true }
    );

    if (!updatedClient) return res.status(404).json({ msg: "Client not found" });

    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Delete a client
const deleteClient = async (req, res) => {
  try {
    const clientNumber = req.params.clientNumber;
    const deletedClient = await Client.findOneAndDelete({ clientNumber });

    if (!deletedClient) return res.status(404).json({ msg: "Client not found" });

    res.json({ msg: "Client deleted successfully" });
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
};