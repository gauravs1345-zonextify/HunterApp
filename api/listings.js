import connectDB from '../../config/db.js';
import Listing from '../../model/Listing.js';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  try {
    const listing = await Listing.findOne({ _id: id }).lean();

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
