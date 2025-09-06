// import mongoose from "mongoose";

// // Use a flexible schema to capture all fields
// const listingSchema = new mongoose.Schema({}, { strict: false });

// const Listing = mongoose.model("Listing", listingSchema, "unified_database_new");

// export default Listing;
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  _id: {
    type: String, // 👈 This tells Mongoose to treat _id as a string
    required: true
  },
  // ... other fields
});
const Listing = mongoose.model("Listing", listingSchema, "unified_database_new");
<<<<<<< HEAD
export default Listing;
=======
export default Listing;
>>>>>>> 1de302cb77b60f131d93cd8d5f578e783e2559ff
