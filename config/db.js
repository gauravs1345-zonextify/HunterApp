import mongoose from "mongoose";

const dbURI = "mongodb+srv://autohunter:Kim7340@autohunter.mchm6yb.mongodb.net/unified?retryWrites=true&w=majority&appName=autohunter";
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection is Failed", err.message);
    process.exit(1);
  }
};

export default connectDB;
