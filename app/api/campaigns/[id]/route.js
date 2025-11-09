import { getCampaignById, updateCampaign } from "@/lib/models";
import { verifyToken, parseAuthHeader } from "@/lib/auth";
import { NextResponse } from "next/server";

// =======================
// 📍 GET Campaign by ID
// =======================
export async function GET(request, { params: paramsPromise }) {
  try {
    // ✅ Proper async params handling
    const { id } = await paramsPromise;

    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

// =======================
// ✏️ Update Campaign
// =======================
export async function PUT(request, { params: paramsPromise }) {
  try {
    // ✅ Proper async params handling
    const { id } = await paramsPromise;

    // 🔒 Authentication
    const token = parseAuthHeader(request.headers.get("Authorization"));
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 Check existing campaign
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // 🔐 Authorization check
    if (campaign.entrepreneurId.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🛠️ Parse updates and apply changes
    const updates = await request.json();
    const updated = await updateCampaign(id, updates);

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}
