// testMongo.js
const mongoose = require('mongoose');
require('dotenv').config();
console.log("MONGODB_URI =", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  process.exit(0);
})
.catch(err => {
  console.error("MongoDB Connection Failed:", err);
  process.exit(1);
});
