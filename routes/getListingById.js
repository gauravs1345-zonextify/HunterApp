import express from "express";
import Listing from "../model/Listing.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    console.error("❌ Error fetching listing:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
