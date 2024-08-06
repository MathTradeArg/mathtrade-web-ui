//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {};

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
