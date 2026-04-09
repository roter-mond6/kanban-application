const User = require("../models/users"); // Import the User model

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = email || user.email;

    if (password) {
      user.password = password; // Password will be hashed automatically by the pre-save middleware in the User model
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.remove();

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Failed to delete user account" });
  }
};
