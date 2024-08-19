//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request) {
  const data = [
    {
      price_markdown:
        "# Pago de envíos\n\nHola Pablo Cazorla\n\nEl detalle de lo que tenés que pagar por envíos del MT (15 juegos cambiados) por el trayecto hasta AMBA es:\n\n* $725 por Torres (2017) desde _Mar del Plata_\n* $1095 por Cat in the Box: Deluxe Edition (2022) desde _San Salvador de Jujuy_\n* $4500 de Costo fijo para logística, servidor, seguro, etc. ($300 por ítem cambiado)\n\n**Total a pagar: $6320**\n\nSi sos de AMBA y no vas al encuentro presencial, vas a tener que pagar después los envíos correspondientes.\n\nTenés que transferir **antes del 11/6/24** (y subir los comprobantes) a:\n\n* Bernabé Ibáñez $6320.00 (CBU/Alias mtargentina)",
      images:
        "https://res.cloudinary.com/dq0lqwq24/image/upload/v1717614331/pablo.david.cazorla/l9s9q4iam3dwaxyacotw.jpg",
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