/**
 * Email sending utility
 *
 * Development  → Mailtrap Sandbox (catches all emails in one inbox, nothing goes to real inboxes)
 * Production   → swap MAILTRAP_TOKEN for your transactional provider and hit /api/send instead
 */

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendMail({ to, subject, html }: MailOptions): Promise<void> {
  const token = process.env.MAILTRAP_TOKEN || "7ebb30d3212a47998a6828ed482b4306";
  const inboxId = process.env.MAILTRAP_INBOX_ID || "4975354";

  if (!token || !inboxId) {
    console.error("❌ [Mailtrap] Missing MAILTRAP_TOKEN or MAILTRAP_INBOX_ID in environment variables!");
    throw new Error("Mailtrap credentials not configured");
  }

  const url = `https://sandbox.api.mailtrap.io/api/send/${inboxId}`;

  console.log(`📨 [Mailtrap] Sending email to "${to}" (Inbox: ${inboxId})...`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      from: { email: "noreply@agendah.com", name: "أجندة" },
      to: [{ email: to }],
      subject,
      html,
    }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    console.error(`❌ [Mailtrap] Error (${res.status}):`, responseText);
    throw new Error(`Mailtrap error ${res.status}: ${responseText}`);
  }

  console.log(`✅ [Mailtrap] Email sent successfully! Response:`, responseText);
}

// ──────────────────────────────────────────────────────────────────────────────
// Verification email
// ──────────────────────────────────────────────────────────────────────────────

export async function sendVerficationTokenMails(
  email: string,
  token: string
): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const link = `${baseUrl}/auth/verify?token=${token}`;

  const html = /* html */ `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>تأكيد الحساب</title>
  </head>

  <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Tahoma,sans-serif;color:#111827;">

    <!-- Main Background -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:#f4f7fb;padding:40px 16px;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="max-width:680px;background-color:#ffffff;border-radius:24px;
                   overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">

            <!-- Header -->
            <tr>
              <td align="center" style="padding:42px 30px 20px;">
                <div style="font-size:30px;font-weight:800;color:#087F6A;letter-spacing:-1px;">
                  أجندة
                </div>
              </td>
            </tr>

            <!-- Icon -->
            <tr>
              <td align="center" style="padding:10px 30px 20px;">
                <div style="width:80px;height:80px;margin:0 auto;border-radius:50%;
                            background-color:#DDF4EE;display:flex;align-items:center;justify-content:center;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="3" fill="#087F6A" opacity=".15"/>
                    <path d="M2 7l10 7 10-7" stroke="#087F6A" stroke-width="1.8"
                          stroke-linecap="round"/>
                    <rect x="2" y="4" width="20" height="16" rx="3"
                          stroke="#087F6A" stroke-width="1.8" fill="none"/>
                  </svg>
                </div>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding:10px 30px 0;">
                <h1 style="margin:0;font-size:28px;line-height:1.4;font-weight:800;color:#111827;">
                  تأكيد حسابك
                </h1>
              </td>
            </tr>

            <!-- Description -->
            <tr>
              <td align="center" style="padding:16px 40px 0;">
                <p style="margin:0;font-size:16px;line-height:1.8;color:#475569;">
                  أهلًا بك في <strong style="color:#087F6A;">أجندة</strong>
                </p>
                <p style="margin:8px 0 0;font-size:15px;line-height:1.8;color:#64748b;">
                  اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding:32px 30px;">
                <a href="${link}" target="_blank"
                   style="display:inline-block;min-width:220px;padding:16px 34px;
                          background-color:#087F6A;color:#ffffff;text-decoration:none;
                          font-size:17px;font-weight:700;border-radius:12px;
                          box-shadow:0 8px 20px rgba(8,127,106,0.25);">
                  تأكيد الحساب &nbsp;←
                </a>
              </td>
            </tr>

            <!-- Fallback link -->
            <tr>
              <td style="padding:0 40px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                  <tr>
                    <td style="padding:22px;">
                      <p style="margin:0 0 12px;font-size:14px;line-height:1.8;color:#64748b;">
                        إذا لم يعمل الزر، انسخ الرابط التالي والصقه في متصفحك:
                      </p>
                      <a href="${link}" target="_blank"
                         style="display:block;font-size:13px;color:#087F6A;text-decoration:none;
                                word-break:break-all;direction:ltr;text-align:left;">
                        ${link}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 40px;">
                <div style="height:1px;background-color:#e2e8f0;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:28px 30px 40px;">
                <p style="margin:0;font-size:14px;line-height:1.8;color:#94a3b8;">
                  إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.
                </p>
                <p style="margin:18px 0 0;font-size:14px;color:#64748b;">مع تحيات،</p>
                <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#334155;">
                  فريق أجندة
                </p>
              </td>
            </tr>

          </table>

          <!-- Bottom text -->
          <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;text-align:center;">
            © ${new Date().getFullYear()} أجندة — Agendah. جميع الحقوق محفوظة.
          </p>

        </td>
      </tr>
    </table>

  </body>
</html>
  `.trim();

  try {
    await sendMail({ to: email, subject: "تأكيد حسابك في أجندة", html });
  } catch (error) {
    console.error("[sendVerficationTokenMails] Error sending verification email:", error);
  }
}
