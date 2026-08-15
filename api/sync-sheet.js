// api/sync-sheet.js
//
// Vercel Serverless Function — POST /api/sync-sheet
//
// admin.html আগে সরাসরি script.google.com/macros/... URL-এ fetch করত —
// মানে সেই URL browser-এর মধ্যেই hardcoded থাকত, ভিউ-সোর্স করলেই দেখা যেত।
// এখন browser শুধু এই /api/sync-sheet এন্ডপয়েন্টে POST করে; আসল Google
// Apps Script URL শুধু এই সার্ভারলেস ফাংশনের ভেতরেই থাকে, Vercel-এর
// GOOGLE_SHEET_URL environment variable থেকে পড়া হয় — browser কখনো এটা দেখে না।
//
// ⚠️ SECURITY: এই ফাইলে কোনো URL/key hardcode করবেন না। Vercel Dashboard →
// Settings → Environment Variables → GOOGLE_SHEET_URL এ বসান।

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

  if (!googleSheetUrl) {
    res.status(500).json({
      error:
        "GOOGLE_SHEET_URL missing. Vercel → Settings → Environment Variables এ সেট করুন।",
    });
    return;
  }

  try {
    // admin.html 'text/plain' দিয়ে পাঠায় (Google Apps Script-এর CORS preflight
    // এড়াতে) — তাই req.body এখানে raw string হিসেবে আসতে পারে, object হিসেবেও
    // আসতে পারে। দুই ক্ষেত্রেই handle করা হচ্ছে।
    const payload =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});

    const sheetRes = await fetch(googleSheetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: payload,
    });

    const text = await sheetRes.text().catch(() => "");
    res.status(200).json({ ok: true, forwarded: sheetRes.status, response: text });
  } catch (e) {
    res.status(502).json({ ok: false, error: "Google Sheet sync failed" });
  }
}
