//export const dynamic = "force-dynamic"; // defaults to auto

const data = JSON.stringify({
  id: 373,
  title: "Draftosaurus (2019)",
  user: {
    id: 52,
    first_name: "Pablo",
    last_name: "Cazorla",
    avatar: "https://cf.geekdo-static.com/avatars/avatar_id150448.jpg",
    location: "",
    bgg_user: "davicazu",
  },
  elements: [
    {
      id: 419,
      game: {
        bgg_id: 264055,
        type: 1,
        primary_name: "Draftosaurus",
        names:
          "Draftosaurus,Draftozaur,Драфтозаври,Драфтозавры,抽恐龍,龍龍公園,드래프토사우르스",
        dependency: 0,
        dependency_votes: "30|0|0|0|0",
        rank: 628,
        rate: 7.09862,
        rate_votes: "14077",
        year_published: 2019,
        weight: 1.2419,
        weight_votes: "310",
        game_thumbnail:
          "https://cf.geekdo-images.com/JahbLRZ_jEe8P8gisXUtJw__original/img/Ug7yXzMmgpaqcv7B_lNTXsAk7_g=/0x0/filters:format(jpeg)/pic4447676.jpg",
      },
      bgg_version_id: "537475",
      thumbnail:
        "https://cf.geekdo-images.com/6PdWLzGfqIHpxi4xmKFfTA__thumb/img/qVEkgqW822IFW1R7CC5cx6sNb70=/fit-in/200x150/filters:strip_icc()/pic5804851.png",
      name: "Draftosaurus (2019)",
      language: "Spanish",
      publisher: "Neptuno Games",
      year: "2020",
      status: "NU",
      comment: "",
      item_id: 373,
      images: "",
    },
  ],
  value: 5.0,
  mathtrade: 5,
});

export async function GET(request) {

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function POST(request) {


  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}

export async function PUT(request) {
 

  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}
export async function DELETE(request) {


  return new Response(data, {
    status: 200,
    "Content-Type": "application/json",
  });
}

