import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * SUPABASE KEEP-ALIVE CRON JOB ROUTE
 * Endpoint: /api/cron/keep-alive
 * Mencegah Supabase Free Tier terkena auto-pause (7-day inactivity)
 */
export async function GET(request: NextRequest) {
  // Verifikasi Vercel Cron Authorization jika CRON_SECRET dikonfigurasi
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized cron invocation" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "skipped",
        message: "Supabase credentials not configured",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Menjalankan query ringan (SELECT id FROM videos LIMIT 1) untuk memicu HTTP request ke Supabase
    // Ini mereset timer auto-pause 7 hari di Supabase Free Tier
    const { data, error } = await supabase
      .from("videos")
      .select("id")
      .limit(1);

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "ok",
      project: supabaseUrl.replace("https://", "").split(".")[0],
      message: "Supabase keep-alive pulse sent successfully",
      timestamp: new Date().toISOString(),
      latencyMs,
      dbStatus: error ? `Ping registered via PostgREST: ${error.message}` : "Connected & Active",
      rowCount: data ? data.length : 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        message: "Keep-alive ping error",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
