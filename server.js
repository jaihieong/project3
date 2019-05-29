const express = require("express");
const connectDB = require("./config/db");
const app = express();

//Connect DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://heroku_f2dc1gr7:75aYUR99_R6g2rlp4q1p6uwuOVE69ZuA@ds155278.mlab.com:55278/heroku_f2dc1gr7"
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
