import { getById } from "../data";

export async function PUT() {
  return new Response('{}', {
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

export async function GET(request,a) {
  const data = getById(a.params.id);

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}