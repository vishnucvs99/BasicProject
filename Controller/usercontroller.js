const User = require("../Models/User");

const getUser = async (req, res) => {
  try {
    console.log(req);
    const admin = await User.find();

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.emailid;
    const user = await User.findOne({ emailid: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { userName,address,mobileNumber,telephoneNumber,faxNumber,emailId,insurerCode,role,isActive} = req.body;

    const currentUser = req.user;
    if (
      currentUser.role === "IIBAdmin" &&
      !["IIBAdmin", "InsurerAdmin"].includes(role)
    ) {
      throw new Error("User cannot be created with this role.");
    } else if (currentUser.role === "InsurerAdmin") {
      if(role != 'InsurerUser') {
        throw new Error("User cannot be created with this role.");
      }
      //25 users logic
      //with currentUSerId fetch all theuser createdBy == currentUser.id
      const usersList = await User.find({
          createdBy: currentUser._id.toString()
      });
      console.log('usersList.length',usersList.length)
      if (usersList.length > 25)
        throw new Error("You cannot create more than 25 insurer users.");
    }
    // const hashedPassword = await bcrypt.hash(req.body.password, 10);
//const password = //entrypt('iib123)
    const newUser = new User({
      userName,
      address,
      mobileNumber,
      telephoneNumber,
      faxNumber,
      emailId,
      insurerCode,
      role,
      isActive,
      createdBy:currentUser._id,

      // password: hashedPassword, // assuming the password field is still part of the schema
      // isActive and insuranceCode might also be included in the schema but are not explicitly mentioned here
    });
    console.log(newUser);
    const savedUser = await newUser.save();
    //
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.userId; // Assuming you pass the user ID as a parameter in the URL
    const updateData = req.body; // Assuming you pass the update data in the request body

    const currentUser = req.user;
    // Add any necessary validation or authorization checks based on your requirements

    // Check if the current user has the authority to update the user
    // if (currentUser.role !== "IIBAdmin" && currentUser._id.toString() !== userIdToUpdate) {
    //   throw new Error("You are not authorized to update this user.");
    // }

    // Assuming you have a User model defined with Mongoose
    const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, updateData, { new: true });

    if (!updatedUser) {
      throw new Error("User not found.");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.userId; // Assuming you pass the user ID as a parameter in the URL

    const currentUser = req.user;
    // Add any necessary validation or authorization checks based on your requirements

    // Check if the current user has the authority to delete the user
    // if (currentUser.role !== "IIBAdmin" && currentUser._id.toString() !== userIdToDelete) {
    //   throw new Error("You are not authorized to delete this user.");
    // }

    // Assuming you have a User model defined with Mongoose
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      throw new Error("User not found.");
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUser, getUserByEmail, addUser, updateUser, deleteUser };
