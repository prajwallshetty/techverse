import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USER,
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
      accessToken: process.env.MAIL_ACCESS_TOKEN,
    },
  });

  const mailOptions = {
    from: `"Krishi Hub" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eef5ea; border-radius: 12px; background-color: #f7faf5;">
        <h2 style="color: #1e7b4b; margin-top: 0;">Welcome to Krishi Hub!</h2>
        <p style="color: #172017; font-size: 16px; line-height: 1.5;">
          Thank you for signing up. Please verify your email address to get started with your account.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${confirmLink}" 
             style="background-color: #1e7b4b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #737873; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmLink}" style="color: #1a3a6c;">${confirmLink}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #d9e5d3; margin: 20px 0;">
        <p style="color: #737873; font-size: 12px; text-align: center;">
          &copy; 2026 Krishi Hub. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
