import { getInvestmentById, updateInvestment } from "@/lib/models";
import { verifyToken, parseAuthHeader } from "@/lib/auth";
import { NextResponse } from "next/server";

// =======================
// 📍 GET Investment by ID
// =======================
export async function GET(request, { params: paramsPromise }) {
  try {
    // ✅ Proper async unwrapping for Next.js 15+
    const { id } = await paramsPromise;

    const investment = await getInvestmentById(id);

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, investment });
  } catch (error) {
    console.error("Get investment error:", error);
    return NextResponse.json({ error: "Failed to fetch investment" }, { status: 500 });
  }
}

// =======================
// ✏️ Update Investment
// =======================
export async function PUT(request, { params: paramsPromise }) {
  try {
    // ✅ Proper async unwrapping
    const { id } = await paramsPromise;

    // 🔒 Authorization: only admin can update
    const token = parseAuthHeader(request.headers.get("Authorization"));
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🛠️ Parse update data and apply changes
    const updates = await request.json();
    const updated = await updateInvestment(id, updates);

    return NextResponse.json({ success: true, investment: updated });
  } catch (error) {
    console.error("Update investment error:", error);
    return NextResponse.json({ error: "Failed to update investment" }, { status: 500 });
  }
}

// =======================
// ⚙️ Optional: Disable caching
// =======================
export const dynamic = "force-dynamic";
export const revalidate = 0;
