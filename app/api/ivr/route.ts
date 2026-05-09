import { NextResponse } from "next/server";

const welcomeXML = (langMenuUrl: string) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Welcome to Agri Hold AI. The platform for rural prosperity.</Say>
    <Say>English ge ondu otti. Kannada kaagi yeradu otti. Hindi ke liye teen dabaye. Tulu gaagi naalku otti.</Say>
    <Gather numDigits="1" action="${langMenuUrl}" method="POST" timeout="10">
    </Gather>
</Response>`;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const menuUrl = `${url.origin}/api/ivr/menu`;

  return new NextResponse(welcomeXML(menuUrl), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

// Support GET for Exotel dashboard testing
export async function GET(request: Request) {
  return POST(request);
}
