import { StatusTracker } from "@/components/status/StatusTracker";
export default function DashboardPage() {
  return (
    <main className="p-8">
      <h2 className="text-xl font-semibold mb-4">Your Service Status</h2>
      <StatusTracker />
    </main>
  );
} 