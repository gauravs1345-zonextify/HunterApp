// api/sync.js
import { syncToZoho } from '../routes/syncData.js'; // adjust path if needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await syncToZoho();
      res.status(200).json({ message: "✅ Sync complete", ...result });
    } catch (err) {
      res.status(500).json({ error: "❌ Sync failed", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
