// export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {
    id: 52,
    first_name: "Pablo",
    last_name: "Cazorla",
    email: "email@email.com",
    bgg_user: "davicazu",
    avatar: "https://cf.geekdo-static.com/avatars/avatar_id150448.jpg",
    phone: "02444444444",
    telegram: "telegramexample",
    whatsapp: "02444444444",
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
