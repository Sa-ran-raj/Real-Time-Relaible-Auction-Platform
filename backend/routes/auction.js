const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const AuctionItem = require("../models/AuctionItem");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {  // Passport checks if user is logged in
      return next();
  }
  res.status(401).json({ message: "Please log in first" });
}

router.post("/upload", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const user = req.user;  // ✅ FIXED: use Passport's injected user
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const fileBuffer = req.file.buffer;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "auction-items" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        const newItem = new AuctionItem({
          title: req.body.title,
          description: req.body.description,
          startingPrice: req.body.startingPrice,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          imageUrl: result.secure_url,
          userId: user._id  // ✅ This should now work correctly
        });

        await newItem.save();
        res.status(201).json({ message: "Auction item uploaded", item: newItem });
      }
    );

    uploadStream.end(fileBuffer);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.get("/mine", isAuthenticated, async (req, res) => {
  const user = req.user;
  try {
    const items = await AuctionItem.find({ userId: user._id });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

module.exports = router;
