//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data =     {
    id: 102960,
    name: "Zombicide (2nd Edition): Washington Z.C.",
    bgg_id: 292122,
    type: "game",
    dup_protection: true,
    wants: [
      {
        id: 7914,
        title: "Zombicide (2nd Edition): Washington Z.C. (2021)",
        user: {
          id: 441,
          first_name: "Juan Manuel",
          last_name: "Monti",
          avatar: "N/A",
          location: "",
          bgg_user: "dopita",
        },
        elements: [
          {
            name: "Zombicide (2nd Edition): Washington Z.C. (2021)",
            bgg_id: 292122,
            thumbnail:
              "https://cf.geekdo-images.com/4X20_SxkPlY1ctZOaqizvw__original/img/xBpQmY3ZROIVleKS1M2-gE_R3vg=/0x0/filters:format(jpeg)/pic6105993.jpg",
            language: "Spanish",
            status: "MB",
          },
        ],
        value: null,
      },
    ],
    items: [
      373, 552, 1304, 1491, 1689, 1920, 1957, 2221, 2624, 3304, 3876, 3877,
      3879, 3890, 3896, 3899, 3900, 3904, 3905, 4641, 4645, 4648, 4649, 4650,
      4651, 4655, 5142, 7923, 7959, 7960, 7961, 7962, 7963, 7965, 8055, 8065,
      8066, 8070, 8071, 8075, 8079, 8084, 8085, 8087, 8088, 8089, 8093, 8094,
      8095, 8096, 8097, 8098, 8099, 8100, 8101, 8103, 8106, 8108, 8110, 8111,
      8117,
    ],
    availables: [],
    tag: null,
    value: 0.0,
    game_type: 2,
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