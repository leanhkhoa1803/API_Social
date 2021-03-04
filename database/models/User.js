const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

mongoose.set("runValidators", true);
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name have must more 6 character"],
    },
    gender: { type: String, default: "male" },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-dafault.jpg" },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: [6, "Password have must more 6 character"],
      required: [true, "Password is required"],
    },
    isActive: { type: Boolean, default: false },
    verifyToken: { type: String },
    refreshToken: { type: String, default: "", default: null },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.statics = {
  comparePassword(hashPassword, password) {
    const checkPassword = bcrypt.compare(hashPassword, password);
    return checkPassword;
  },
  findByEmail(email) {
    return this.findOne({ email: email });
  },
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
