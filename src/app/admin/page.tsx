import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin — Wedding",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
