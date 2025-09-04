import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Listing from "../model/Listing.js";

dotenv.config();

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    const listings = await Listing.find().lean();
    console.log("🔄 Zoho sync started at", new Date().toISOString());

    const now = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(now.getDate() - 1);

    const zohoPayloads = [];

    listings.forEach(item => {
      const timestamp = item["Processing timestamp"];
      if (!timestamp) return;

      const itemDate = new Date(timestamp * 1000);
      if (itemDate >= oneDayAgo && itemDate <= now) {
        zohoPayloads.push({
          Listing_Title: item["Listing title"],
          Company: item["Company/Dealer name"],
          ContactName: item["Contact person name"],
          Phone: item["Phone"],
          Email_addresses: item["Email addresses"],
          City: item["City"],
          Country: item["Country"],
          SellerAddres: item["Seller address"],
          id: item["_id"],
          CreatedTime: itemDate.toISOString(),
          Make: item["Make"],
          Model: item["Model"],
          Variant: item["Variant/Trim"],
          Model_Year: item["Model year"],
          Mileage_km: item["Mileage (km)"],
          Exterior_Color: item["Exterior color"],
          Horsepower: item["Horsepower"],
          Main_Price: item["Main price"],
          Currency: item["Currency"],
          Seller_Type: item["Seller type"],
          Dealer_Name: item["Company/Dealer name"],
          Source_URL: item["Source URL"],
          Main_Image: item["mainImage"],
          Listing_Date: itemDate.toISOString().split('T')[0],
          Options: Array.isArray(item["Options list"]) ? item["Options list"].join(", ") : "",
          Images: Array.isArray(item["images"]) ? item["images"].join(", ") : ""
        });
      }
    });

    console.log(`✅ Prepared ${zohoPayloads.length} listings for Zoho CRM`);

    const batches = chunkArray(zohoPayloads, 50);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const zohoResponse = await fetch('https://www.zohoapis.eu/crm/v7/functions/getmongodb_data/actions/execute?auth_type=apikey&zapikey=1003.b5548ba22119b0ba123c552679cd05ed.6c1cc7eba1040e39975ca3adf0986fa6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': '_zcsr_tmp=4c5ddb36-bc5c-4e32-a63c-f6d2c50eb13f; crmcsr=4c5ddb36-bc5c-4e32-a63c-f6d2c50eb13f'
        },
        body: JSON.stringify({ data: batch })
      });

      const result = await zohoResponse.text();
      console.log(`📤 Batch ${i + 1} response:`, result);
    }

    console.log("✅ Sync complete. Total listings synced:", zohoPayloads.length);
    res.status(200).json({ synced: zohoPayloads.length });
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
    res.status(500).json({ error: err.message });
  }
}





// // api/sync.js
// import { syncToZoho } from '../routes/syncData.js'; // adjust path if needed

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const result = await syncToZoho();
//       res.status(200).json({ message: "✅ Sync complete", ...result });
//     } catch (err) {
//       res.status(500).json({ error: "❌ Sync failed", details: err.message });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
