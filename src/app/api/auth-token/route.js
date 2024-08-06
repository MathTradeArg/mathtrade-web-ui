//export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request) {
  const data = {
    token: "ab1198f0f5a7ad12bbb0fa01747d4ca156339dbe",
    change_required: false,
    user: {
      id: 52,
      first_name: "Pablo",
      last_name: "Cazorla",
      avatar: "https://cf.geekdo-static.com/avatars/avatar_id150448.jpg",
      location: "",
      bgg_user: "davicazu",
    },
    mathtrade: {
      id: 5,
      name: "Math Trade 2024",
      status: "final",
      start_date: "2024-05-01T00:00:00-03:00",
      frezze_geek_date: "2024-05-08T11:59:00-03:00",
      frezze_wants_date: "2024-05-21T12:30:00-03:00",
      show_results_date: "2024-05-21T14:00:00-03:00",
      meeting_date: "2024-06-15T11:00:00-03:00",
      location: {
        id: 1,
        name: "AMBA",
        province: "AMBA",
        geolocation: null,
        mandatory_attendance: true,
        referral: null,
      },
    },
    membership: {
      user_id: 52,
      location: 2,
      event_attendance: false,
      commitment: "2024-05-21T11:59:00-03:00",
      is_committed: true,
    },
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    "Content-Type": "application/json",
  });
}
