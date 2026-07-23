import dotenv from 'dotenv';
dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const SMTP_HOST = process.env.SMTP_HOST || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dhpublicidadgrafica@gmail.com';

/**
 * Send email helper (Logs securely and simulates real SMTP dispatch)
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  console.log(`[EMAIL SERVICE] Sending Email to: ${to}`);
  console.log(`[EMAIL SERVICE] Subject: ${subject}`);
  console.log(`[EMAIL SERVICE] Content Length: ${html.length} chars`);
  
  // Real nodemailer or SMTP client can be easily hooked here using standard env vars
  return true;
}

export async function sendDonorThankYouEmail(donorName: string, donorEmail: string, amount: number, currency: string, transactionId: string, frequency: string) {
  const subject = '❤️ ¡Gracias por tu donación a la Fundación Fundelibertad!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px; overflow: hidden;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">FUNDACIÓN FUNDELIBERTAD</h1>
        <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px;">Canal de Solidaridad por la Paz y los DDHH</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <h2 style="color: #0f172a; font-size: 18px;">¡Estimado/a ${donorName || 'Donante Solidario'}!</h2>
        <p>Hemos recibido con profundo agradecimiento tu aporte por valor de <strong>$${amount} ${currency}</strong> (${frequency === 'recurring' ? 'Aporte Mensual' : 'Aporte Único'}).</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>ID de Transacción:</strong> ${transactionId}</p>
          <p style="margin: 4px 0;"><strong>Monto:</strong> $${amount} ${currency}</p>
          <p style="margin: 4px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
          <p style="margin: 4px 0;"><strong>Destino:</strong> Programas de Defensa de DDHH y Jóvenes en Comuna 15, Medellín</p>
        </div>

        <p>Gracias a tu contribución, continuamos ofreciendo asesoría jurídica gratuita, formación para practicantes y protección de derechos en comunidades vulnerables.</p>
        
        <p style="margin-top: 24px;">Con gratitud,<br/><strong>Equipo de la Fundación Fundelibertad</strong><br/><em>Nit: 900.497.212-2 | Medellín, Colombia</em></p>
      </div>
    </div>
  `;

  return sendEmail({ to: donorEmail, subject, html });
}

export async function sendAdminNotificationEmail(donorName: string, donorEmail: string, amount: number, currency: string, transactionId: string) {
  const subject = `[NUEVA DONACIÓN] $${amount} ${currency} de ${donorName || 'Anónimo'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f1f5f9;">
      <h2>Notificación de Nueva Donación Recibida</h2>
      <p>Se ha registrado un nuevo pago exitoso a través de la plataforma web de Fundelibertad.</p>
      <ul>
        <li><strong>Donante:</strong> ${donorName || 'Anónimo'}</li>
        <li><strong>Correo:</strong> ${donorEmail}</li>
        <li><strong>Monto:</strong> $${amount} ${currency}</li>
        <li><strong>ID Transacción:</strong> ${transactionId}</li>
        <li><strong>Fecha:</strong> ${new Date().toISOString()}</li>
      </ul>
      <p><a href="https://fundelibertad.org/panel-control" style="background-color: #0284c7; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Ir al Panel de Control</a></p>
    </div>
  `;

  return sendEmail({ to: ADMIN_EMAIL, subject, html });
}
