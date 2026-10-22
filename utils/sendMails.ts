import { Resend } from "resend";
import nodemailer from "nodemailer";
export const sendVerficationTokenMails = async (
  email: string,
  token: string,
) => {
  // handle link will go if he click on verify in gmail
  const link = `http://localhost:3000/auth/verify?token=${token}`;
  // send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Agendah" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account",
      html: `
            <!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>تأكيد الحساب</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, Tahoma, sans-serif;
      color: #111827;
    "
  >

    <!-- Main Background -->
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        background-color: #f4f7fb;
        padding: 40px 16px;
      "
    >
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 680px;
              background-color: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
            "
          >

            <!-- Header -->
            <tr>
              <td
                align="center"
                style="
                  padding: 42px 30px 20px;
                "
              >

                <!-- Logo -->
                <div
                  style="
                    font-size: 30px;
                    font-weight: 800;
                    color: #172554;
                    letter-spacing: -1px;
                  "
                >
                  Agendah
                </div>

              </td>
            </tr>


            <!-- Illustration -->
            <tr>
              <td align="center" style="padding: 10px 30px 20px;">

                <div
                  style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto;
                    border-radius: 60px;
                    background-color: #eff6ff;
                    position: relative;
                  "
                >

                  <!-- Envelope -->
                  <div
                    style="
                      position: relative;
                      top: 30px;
                      width: 72px;
                      height: 52px;
                      margin: 0 auto;
                      background-color: #2563eb;
                      border-radius: 8px;
                    "
                  >

                    <!-- Envelope flap -->
                    <div
                      style="
                        position: absolute;
                        top: 0;
                        left: 8px;
                        width: 56px;
                        height: 56px;
                        background-color: #3b82f6;
                        transform: rotate(45deg);
                        border-radius: 5px;
                      "
                    ></div>

                  </div>

                  <!-- Shield -->
                  <div
                    style="
                      position: absolute;
                      top: 20px;
                      right: 30px;
                      width: 42px;
                      height: 48px;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.18);
                      z-index: 2;
                    "
                  >
                    <div
                      style="
                        margin: 10px auto 0;
                        width: 24px;
                        height: 28px;
                        background-color: #2563eb;
                        border-radius: 50% 50% 45% 45%;
                      "
                    ></div>
                  </div>

                </div>

              </td>
            </tr>


            <!-- Title -->
            <tr>
              <td
                align="center"
                style="
                  padding: 10px 30px 0;
                "
              >
                <h1
                  style="
                    margin: 0;
                    font-size: 34px;
                    line-height: 1.4;
                    font-weight: 800;
                    color: #111827;
                  "
                >
                  تأكيد حسابك
                </h1>
              </td>
            </tr>


            <!-- Description -->
            <tr>
              <td
                align="center"
                style="
                  padding: 16px 40px 0;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 18px;
                    line-height: 1.8;
                    color: #475569;
                  "
                >
                  أهلًا بك في <strong style="color: #2563eb;">Agendah</strong>
                </p>

                <p
                  style="
                    margin: 8px 0 0;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #64748b;
                  "
                >
                  اضغط على الزر بالأسفل لتأكيد بريدك الإلكتروني
                  وتفعيل حسابك.
                </p>
              </td>
            </tr>


            <!-- Button -->
            <tr>
              <td
                align="center"
                style="
                  padding: 32px 30px;
                "
              >

                <a
                  href="${link}"
                  target="_blank"
                  style="
                    display: inline-block;
                    min-width: 220px;
                    padding: 16px 34px;
                    background-color: #2563eb;
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 17px;
                    font-weight: 700;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
                  "
                >
                  تأكيد الحساب &nbsp; ←
                </a>

              </td>
            </tr>


            <!-- Fallback Link Box -->
            <tr>
              <td style="padding: 0 40px 30px;">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                  "
                >
                  <tr>
                    <td style="padding: 22px;">

                      <p
                        style="
                          margin: 0 0 12px;
                          font-size: 14px;
                          line-height: 1.8;
                          color: #64748b;
                        "
                      >
                        إذا لم يعمل الزر، يمكنك نسخ الرابط التالي
                        ولصقه في متصفحك:
                      </p>

                      <a
                        href="${link}"
                        target="_blank"
                        style="
                          display: block;
                          font-size: 13px;
                          line-height: 1.8;
                          color: #2563eb;
                          text-decoration: none;
                          word-break: break-all;
                          direction: ltr;
                          text-align: left;
                        "
                      >
                        ${link}
                      </a>

                    </td>
                  </tr>
                </table>

              </td>
            </tr>


            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">

                <div
                  style="
                    height: 1px;
                    background-color: #e2e8f0;
                  "
                ></div>

              </td>
            </tr>


            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  padding: 28px 30px 40px;
                "
              >

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.8;
                    color: #94a3b8;
                  "
                >
                  إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل
                  هذه الرسالة بأمان.
                </p>

                <p
                  style="
                    margin: 18px 0 0;
                    font-size: 14px;
                    color: #64748b;
                  "
                >
                  مع تحيات،
                </p>

                <p
                  style="
                    margin: 4px 0 0;
                    font-size: 15px;
                    font-weight: 700;
                    color: #334155;
                  "
                >
                  فريق Agendah
                </p>

              </td>
            </tr>

          </table>

          <!-- Bottom Text -->
          <p
            style="
              margin: 20px 0 0;
              font-size: 12px;
              color: #94a3b8;
              text-align: center;
            "
          >
            © ${new Date().getFullYear()} Agendah. جميع الحقوق محفوظة.
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>
         `,
    });
  } catch (error) {
    console.log(error);
  }
};
