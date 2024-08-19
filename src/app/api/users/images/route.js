//export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request) {
  const d = await request.json();

  const data = { asset_url: d.img_code };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
