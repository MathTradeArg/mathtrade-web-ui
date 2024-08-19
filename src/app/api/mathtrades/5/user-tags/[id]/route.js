//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data =  {
    id: 814,
    name: "Euros",
    items: [36, 37],
    color: "#2c8a1f",
    wanted: [],
    value: null,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}

export async function PUT() {
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