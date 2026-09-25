import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/config/navigation";

export default function RootPage() {
  redirect(HOME_ROUTE);
}
