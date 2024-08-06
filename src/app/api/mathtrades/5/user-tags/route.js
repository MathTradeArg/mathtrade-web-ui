//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = [
    {
      id: 814,
      name: "Euros",
      items: [36, 37],
      color: "#2c8a1f",
      wanted: [],
      value: null,
    },
    {
      id: 895,
      name: "W_expas",
      items: [3740, 8409, 5794],
      color: "#6529a3",
      wanted: [],
      value: null,
    },
    {
      id: 819,
      name: "otro 5",
      items: [62],
      color: "#d91164",
      wanted: [],
      value: null,
    },
  ];

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
