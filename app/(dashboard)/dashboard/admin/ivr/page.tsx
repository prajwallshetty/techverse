import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db/mongoose";
import { IvrCall } from "@/models/IvrCall";
import { IvrDashboardClient } from "@/features/admin/ivr-dashboard-client";

export const metadata = {
  title: "IVR Analytics | AgriHold AI Admin",
};

export default async function AdminIvrPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/signin");
  }

  await dbConnect();

  // Fetch recent calls
  const rawCalls = await IvrCall.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const serializedCalls = rawCalls.map(call => ({
    ...call,
    _id: call._id.toString(),
    createdAt: call.createdAt?.toISOString(),
    updatedAt: call.updatedAt?.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-surface p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground">IVR Analytics Dashboard</h1>
        <p className="text-muted font-medium mt-1">Monitor realtime rural telephonic bookings and interactions.</p>
      </div>

      <IvrDashboardClient initialCalls={serializedCalls} />
    </div>
  );
}
