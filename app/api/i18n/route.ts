import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  try {
    const localeDir = path.join(process.cwd(), "src/locales", lang);
    const files = fs.readdirSync(localeDir);
    
    const translations: any = {};
    for (const file of files) {
      if (file.endsWith(".json")) {
        const content = fs.readFileSync(path.join(localeDir, file), "utf8");
        const domain = file.replace(".json", "");
        translations[domain] = JSON.parse(content);
      }
    }

    return NextResponse.json(translations);
  } catch (err) {
    return NextResponse.json({ error: "Locale not found" }, { status: 404 });
  }
}
