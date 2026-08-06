// functions/api/config.js
//
// Cloudflare Pages Function — GET /api/config
//
// এই ফাইলটি Cloudflare Pages Dashboard-এ সেট করা Environment Variables
// (Settings → Environment Variables) থেকে Supabase URL এবং Anon Key পড়ে
// এবং browser-এর admin.html কে সরবরাহ করে।
//
// ⚠️ SECURITY NOTES:
//  - এখানে শুধুই SUPABASE_ANON_KEY (public/anon key) পাঠানো হচ্ছে —
//    এটি ক্লায়েন্ট সাইডে ব্যবহারের জন্যই তৈরি এবং Row Level Security (RLS)
//    দিয়ে সুরক্ষিত থাকা উচিত।
//  - SUPABASE_SERVICE_ROLE_KEY কখনোই এই এন্ডপয়েন্ট থেকে বা কোনো
//    ব্রাউজার-facing কোড থেকে পাঠাবেন না। Service role key সব RLS
//    বাইপাস করে, তাই এটি শুধুমাত্র সার্ভার-সাইড (Pages Function/Worker)
//    কোডে ব্যবহার করুন, যেখানে এটি ব্রাউজারে কখনো পাঠানো হয় না।
//
// process.env.SUPABASE_URL / process.env.SUPABASE_ANON_KEY এর সমতুল্য হলো
// Cloudflare Pages Functions-এ `env.SUPABASE_URL` / `env.SUPABASE_ANON_KEY`
// (Cloudflare Workers runtime-এ Node-style process.env নেই, তাই env
// parameter ব্যবহার করা হয় — এটিই Cloudflare-এর official পদ্ধতি)।

export async function onRequestGet({ env }) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  const googleSheetUrl = env.GOOGLE_SHEET_URL || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({
        error:
          "SUPABASE_URL / SUPABASE_ANON_KEY missing. Cloudflare Pages → Settings → Environment Variables এ সেট করুন।",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      supabaseUrl,
      supabaseAnonKey,
      googleSheetUrl,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // এই response ব্যক্তিগত ডেটা নয় (anon key পাবলিক ব্যবহারের জন্যই),
        // তবু ক্যাশিং এড়াতে no-store রাখা হলো যাতে env var আপডেট হলে সাথে সাথে প্রতিফলিত হয়
        "Cache-Control": "no-store",
      },
    }
  );
}
