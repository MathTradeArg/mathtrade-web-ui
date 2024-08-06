//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = {
    type: {
      1: 2245,
      2: 437,
      3: 62,
    },
    dependency: {
      0: 1393,
      3: 354,
      2: 448,
      4: 110,
      1: 439,
    },
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
