//export const dynamic = "force-dynamic"; // defaults to auto

const data = JSON.stringify({
  id: 52,
  first_name: "Paul",
  last_name: "Cazu",
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
  telegram: "telegram_paulcazu",
  email: "paulcazu@gmail.com",
  bgg_user: "paulcazu",
});

export async function GET(request) {

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function POST(request) {
  const data = {};

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}

export async function PUT(request) {
  const data = {};

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function DELETE(request) {
  const data = {};

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}

