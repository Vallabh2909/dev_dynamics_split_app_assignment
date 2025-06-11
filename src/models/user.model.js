import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z\s]+$/.test(v); // Only letters and spaces allowed
      },
      message: "Name can only contain letters and spaces.",
    },
  }
});

const User = mongoose.model("User", UserSchema);

export default User;