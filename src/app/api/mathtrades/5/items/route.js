import getData from "./data";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const params = Object.fromEntries(searchParams);

  const data = getData(params);

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
export async function DELETE() {
  return new Response('{}', {
    status: 200,
    "Content-Type": "application/json",
  });
}