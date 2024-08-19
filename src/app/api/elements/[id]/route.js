//export const dynamic = "force-dynamic"; // defaults to auto

export async function PUT(request) {
  const d = {};

  return new Response(JSON.stringify(d), {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function DELETE(request) {
  const d = {};

  return new Response(JSON.stringify(d), {
    status: 200,
    "Content-Type": "application/json",
  });
}
