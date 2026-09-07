import { fetchHostingStatus } from "@/lib/platform-status/hosting";

// Polled by the homepage banner. Server-side so the upstream feed is never
// fetched from the browser and so the provider's name is stripped before the
// response leaves our origin.
export const revalidate = 60;

export async function GET() {
  try {
    return Response.json(await fetchHostingStatus());
  } catch {
    // A status feed being unreachable is not an incident worth showing. Report
    // healthy-and-empty so the banner stays quiet rather than alarming.
    return Response.json({
      page: { name: "Hosting Platform", url: "", status: "UP" },
      activeIncidents: [],
      activeMaintenances: [],
    });
  }
}
