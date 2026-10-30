import nodemailer from "nodemailer";

export function createMailer(config) {
  const available = Boolean(
    (config.resend.key && config.resend.from) ||
    (config.smtp.host && config.smtp.from),
  );
  const transport = config.smtp.host
    ? nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        ...(config.smtp.user
          ? { auth: { user: config.smtp.user, pass: config.smtp.pass } }
          : {}),
        connectionTimeout: 10000,
        socketTimeout: 15000,
      })
    : null;
  return {
    available,
    async send({ to, purpose, token }) {
      if (!available) return false;
      const url = new URL(config.publicUrl);
      url.hash = `${purpose}=${token}`;
      const subject =
        purpose === "verify"
          ? "Verifica tu correo institucional en CampusTrade"
          : "Recupera tu acceso a CampusTrade";
      const text = `${subject}\n\nAbre este enlace: ${url.href}\n\nEl enlace es de un solo uso y caduca. Si no solicitaste esta acción, ignora este mensaje.`;
      if (config.resend.key) {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.resend.key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: config.resend.from,
            to: [to],
            subject,
            text,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("MAIL_PROVIDER_ERROR");
      } else
        await transport.sendMail({ from: config.smtp.from, to, subject, text });
      return true;
    },
  };
}
