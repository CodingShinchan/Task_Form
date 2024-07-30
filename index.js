const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const val = require("./config");
const path = require("path");
const User = require("./model");

const app = express();

val();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://kumawatpoornima7:poor1234@cluster0000.jjhjrmg.mongodb.net/Project', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate();
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    const errorMessages = {};
    if (error.errors) {
      for (const key in error.errors) {
        errorMessages[key] = error.errors[key].message;
      }
    } else {
      errorMessages.general = error.message;
    }
    res
      .status(400)
      .send({ message: "Error saving user", errors: errorMessages });
  }
});

// GET route for fetching users
app.get('/api/users', async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});