//export const dynamic = "force-dynamic"; // defaults to auto

export async function PUT() {
  return new Response('{}', {
    status: 200,
    "Content-Type": "application/json",
  });
}
