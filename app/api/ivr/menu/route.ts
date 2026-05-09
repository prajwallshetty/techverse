import { NextResponse } from "next/server";

const menuXML = (actionUrl: string) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Main Menu.</Say>
    <Say>Press 1 for warehouse availability. Press 2 for crop prices. Press 3 for loan eligibility. Press 4 for marketplace status.</Say>
    <Gather numDigits="1" action="${actionUrl}" method="POST" timeout="10">
    </Gather>
</Response>`;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const actionUrl = `${url.origin}/api/ivr/action`;

  return new NextResponse(menuXML(actionUrl), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
