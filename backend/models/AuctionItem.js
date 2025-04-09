const mongoose = require("mongoose");

const auctionItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingPrice: Number,
  imageUrl: String,
  startTime: Date,
  endTime: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to logged-in user
}, { timestamps: true });

module.exports = mongoose.model("AuctionItem", auctionItemSchema);
