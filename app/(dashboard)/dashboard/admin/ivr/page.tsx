import { IVRMonitoringClient } from "@/features/admin/ivr-monitoring-client";

export const metadata = {
  title: "IVR Monitoring | AgriHold AI",
};

export default function IVRMonitoringPage() {
  return (
    <div className="min-h-screen w-full bg-surface">
      <IVRMonitoringClient />
    </div>
  );
}
