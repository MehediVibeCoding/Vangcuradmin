// api/config.js
//
// Vercel Serverless Function — GET /api/config
//
// এই ফাইলটি Vercel Dashboard-এ সেট করা Environment Variables থেকে
// Supabase URL এবং Anon Key পড়ে এবং browser-এর admin.html কে সরবরাহ করে।
// Vercel-এর Node.js runtime-এ সত্যিকারের process.env ব্যবহার করা যায়
// (Cloudflare Workers-এর মতো env parameter লাগে না)।
//
// ⚠️ SECURITY: এখানে শুধুই SUPABASE_ANON_KEY (public/anon key) পাঠানো
// হচ্ছে। SUPABASE_SERVICE_ROLE_KEY কখনোই এই এন্ডপয়েন্ট থেকে বা কোনো
// ব্রাউজার-facing কোড থেকে পাঠাবেন না।

export default function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({
      error:
        "SUPABASE_URL / SUPABASE_ANON_KEY missing. Vercel → Settings → Environment Variables এ সেট করুন।",
    });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    supabaseUrl,
    supabaseAnonKey,
    googleSheetUrl,
  });
}
