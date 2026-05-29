import { NextResponse } from "next/server";
import { fetchPrivatePositions } from "@/server/mexc/positions";

export async function GET() {
  try {
    const data = await fetchPrivatePositions();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message ?? "positions error" },
      { status: 500 }
    );
  }
}
