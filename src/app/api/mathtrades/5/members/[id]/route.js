//export const dynamic = "force-dynamic"; // defaults to auto

const data = JSON.stringify({
  user_id: 52,
  location: 2,
  event_attendance: false,
  commitment: "2024-05-21T11:59:00-03:00",
  is_committed: true,
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

