const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
    trim: true, // Remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
    trim: true,
    lowercase: true, // Convert email to lowercase
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    try {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;