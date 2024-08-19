//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = [
    {
      id: 47,
      name: "Grandes",
      color: "#ff1ae0",
      item_ids: [1304, 1689, 4655, 7959, 8065, 8070, 8071, 8103, 8106, 8117],
    },
    {
      id: 48,
      name: "chiquitaje",
      color: "#00cc6d",
      item_ids: [
        2221, 3890, 3896, 3900, 3904, 3905, 4641, 4645, 4648, 4649, 4651, 8055,
        8084, 8085, 8087, 8088, 8089, 8093, 8094, 8095, 8096, 8097, 8098, 8099,
        8100, 8101,
      ],
    },
    {
      id: 49,
      name: "Medios",
      color: "#3499cb",
      item_ids: [373, 3877, 3899, 4650, 7962, 7965, 8075, 8079, 8110, 8111],
    },
    {
      id: 50,
      name: "Medios Plus",
      color: "#2850e2",
      item_ids: [
        552, 1491, 1920, 1957, 2624, 3304, 3876, 3879, 5142, 7923, 7960, 7961,
        7963, 8066, 8108,
      ],
    },
    {
      id: 162,
      name: "Dificil",
      color: "#ff0000",
      item_ids: [8060],
    },
  ];

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