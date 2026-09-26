import { redirect } from "next/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";

// "Contenido para medios" had no content since 2025-07; the links to it were
// removed. Kept as a redirect so old links still land somewhere.
export default function MediaPage() {
  redirect(PUBLIC_ROUTES.DEFAULT.path);
}
