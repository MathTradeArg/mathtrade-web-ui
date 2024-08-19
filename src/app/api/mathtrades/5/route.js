import getDateMathtrade from "../../utils/getDateMathtrade";

export const dynamic = "force-dynamic"; // defaults to auto

// MATHTRADE
export async function GET(request) {
  const data = {
    id: 5,
    /*     name: "Math Trade 2024",
    status: "final",
    start_date: "2024-05-01T00:00:00-03:00",
    frezze_geek_date: "2024-05-08T11:59:00-03:00",
    frezze_wants_date: "2024-05-21T12:30:00-03:00",
    show_results_date: "2024-05-21T14:00:00-03:00",
    meeting_date: "2024-06-15T11:00:00-03:00", */
    ...getDateMathtrade(),
    location: {
      id: 1,
      name: "AMBA",
      province: "AMBA",
      geolocation: null,
      mandatory_attendance: true,
      referral: null,
    },
    items_count: 6502,
    games_count: 2746,
    users_count: 533,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
