/**
 * TwiML helper — generates valid Twilio Voice XML without the heavy twilio SDK.
 * This avoids cold-start crashes and Vercel/Turbopack compatibility issues.
 */

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export class TwiML {
  private parts: string[] = [];

  say(text: string, opts?: { language?: string; voice?: string }) {
    const lang = opts?.language || "en-IN";
    const voice = opts?.voice || "Polly.Aditi";
    this.parts.push(`<Say language="${lang}" voice="${voice}">${escapeXml(text)}</Say>`);
    return this;
  }

  gather(opts: { numDigits: number; action: string; method?: string; timeout?: number }) {
    const method = opts.method || "POST";
    const timeout = opts.timeout || 10;
    return {
      say: (text: string, sayOpts?: { language?: string; voice?: string }) => {
        const lang = sayOpts?.language || "en-IN";
        const voice = sayOpts?.voice || "Polly.Aditi";
        this.parts.push(
          `<Gather numDigits="${opts.numDigits}" action="${escapeXml(opts.action)}" method="${method}" timeout="${timeout}">` +
          `<Say language="${lang}" voice="${voice}">${escapeXml(text)}</Say>` +
          `</Gather>`
        );
      }
    };
  }

  redirect(url: string) {
    this.parts.push(`<Redirect>${escapeXml(url)}</Redirect>`);
    return this;
  }

  pause(seconds: number = 1) {
    this.parts.push(`<Pause length="${seconds}"/>`);
    return this;
  }

  hangup() {
    this.parts.push(`<Hangup/>`);
    return this;
  }

  toString(): string {
    return `<?xml version="1.0" encoding="UTF-8"?><Response>${this.parts.join("")}</Response>`;
  }
}
