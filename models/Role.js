const RoleSchema = new mongoose.Schema({
  name: String,
  permissions: [String],
});
