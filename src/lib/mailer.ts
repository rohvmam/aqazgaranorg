import nodemailer from "nodemailer";

/**
 * Email delivery seam. With SMTP_* env configured (e.g. Gmail + App Password)
 * mail is sent for real; without it, messages are logged to the server
 * console so the flows stay testable in development.
 *
 * Env: SMTP_HOST, SMTP_PORT (587 STARTTLS / 465 SSL), SMTP_USER,
 * SMTP_PASSWORD, EMAIL_FROM.
 */

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

function transport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  if (!smtpConfigured()) {
    console.info(`[mail:log] to=${to} subject="${subject}"\n${text}`);
    return;
  }
  await transport().sendMail({
    from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    text,
  });
}

const OTP_SUBJECT: Record<string, string> = {
  en: "Your ATA sign-in code",
  fa: "کد ورود شما به آتا",
  ar: "رمز تسجيل الدخول إلى آتا",
  ru: "Ваш код входа в ATA",
  zh: "您的 ATA 登录验证码",
};

const OTP_BODY: Record<string, (code: string) => string> = {
  en: (code) =>
    `Your verification code is: ${code}\n\nIt expires in 10 minutes. If you didn't request this code, you can safely ignore this email.`,
  fa: (code) =>
    `کد تأیید شما: ${code}\n\nاین کد تا ۱۰ دقیقه معتبر است. اگر شما این کد را درخواست نکرده‌اید، این ایمیل را نادیده بگیرید.`,
  ar: (code) =>
    `رمز التحقق الخاص بك: ${code}\n\nتنتهي صلاحيته خلال 10 دقائق. إذا لم تطلب هذا الرمز فتجاهل هذه الرسالة.`,
  ru: (code) =>
    `Ваш код подтверждения: ${code}\n\nОн действует 10 минут. Если вы не запрашивали код, просто проигнорируйте это письмо.`,
  zh: (code) =>
    `您的验证码是：${code}\n\n有效期 10 分钟。如果您没有请求此验证码，请忽略本邮件。`,
};

export async function sendOtpEmail(
  to: string,
  code: string,
  locale = "en",
): Promise<void> {
  const subject = OTP_SUBJECT[locale] ?? OTP_SUBJECT.en;
  const body = (OTP_BODY[locale] ?? OTP_BODY.en)(code);
  await sendMail(to, subject, body);
}

export async function sendResetEmail(to: string, link: string): Promise<void> {
  await sendMail(
    to,
    "Reset your ATA password",
    `Use this link to reset your password (valid for 30 minutes):\n\n${link}\n\nIf you didn't request a reset, ignore this email.`,
  );
}
