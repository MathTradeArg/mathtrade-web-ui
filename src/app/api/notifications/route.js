//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {
    count: 0,
    current: 1,
    unread: 0,
    item_count: 0,
    item_unread: 0,
    want_count: 0,
    want_unread: 0,
    admin_count: 1,
    admin_unread: 0,
    results: [],
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