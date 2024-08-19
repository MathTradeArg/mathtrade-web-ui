//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {
    id: 52,
    first_name: "Pablo",
    last_name: "Cazorla",
    location: {
      id: 2,
      name: "Mendoza",
      province: "Mendoza",
      geolocation: null,
      mandatory_attendance: false,
    },
    avatar: "https://cf.geekdo-static.com/avatars/avatar_id150448.jpg",
    commitment: true,
    trades: 15,
    event_attendance: false,
    last_update: "2024-05-20T12:59:41Z",
    commitment_datetime: "2024-05-21T14:59:00Z",
    items: 62,
    games: 70,
    telegram: "Davicazu",
    email: "pablo.david.cazorla@gmail.com",
    bgg_user: "davicazu",
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
