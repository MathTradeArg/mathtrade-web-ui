//export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request) {
  const d = await request.json();

  return new Response(JSON.stringify(d), {
    status: 200,
    "Content-Type": "application/json",
  });
}
