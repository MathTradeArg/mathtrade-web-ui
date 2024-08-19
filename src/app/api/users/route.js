// export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {
    id: 52,
    first_name: "Paul",
    last_name: "Cazu",
    email: "paulcazu@email.com",
    bgg_user: "paulcazu",
    avatar: "https://cf.geekdo-static.com/avatars/avatar_id150448.jpg",
    phone: "02444444444",
    telegram: "telegram_paulcazu",
    whatsapp: "02444444444",
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function POST() {
  return new Response('{}', {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function PUT() {
  return new Response('{}', {
    status: 200,
    "Content-Type": "application/json",
  });
}
