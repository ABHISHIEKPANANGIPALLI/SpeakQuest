const User = require("../models/User");

const testController = (req, res) => {
  res.send("Auth Controller Working");
};

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};




const loginController = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user,
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      message: "Something went wrong",
    });

  }
};


const saveHistoryController = async (req, res) => {
  try {

    const {
      userId,
      transcript,
      aiReply,
      fluency,
      confidence,
      grammarMistakes,
      fillers,
      mistakes,
      correctSentence,
    } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Add current conversation to history
    user.history.push({
      transcript,
      aiReply,
      fluency,
      confidence,
      grammarMistakes,
      fillers,
      mistakes,
      correctSentence,
    });

    // Save updated user
    await user.save();

    res.status(200).json({
      message: "History saved successfully",
      history: user.history,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });

  }
};



const getHistoryController = async (req, res) => {

  try {

    // Get user id from URL
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId);

    // Check user exists
    if (!user) {

      return res.status(404).json({

        message: "User not found"

      });

    }

    // Return history
    res.status(200).json({

      history: user.history

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Something went wrong"

    });

  }

};



module.exports = {
  testController,
  signupController,
  loginController,
  saveHistoryController,
  getHistoryController


};