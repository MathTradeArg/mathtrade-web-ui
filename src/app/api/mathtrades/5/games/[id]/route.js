import { getById } from "../data";

export async function GET(request,a) {


  const data = getById(a.params.id);

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}