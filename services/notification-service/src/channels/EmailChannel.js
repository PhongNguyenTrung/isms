const nodemailer = require('nodemailer');

/**
 * EmailChannel - Handles email dispatch via Nodemailer.
 * Uses SMTP_HOST/PORT/USER/PASS env vars. Falls back to Ethereal test account when unset.
 */
class EmailChannel {
  constructor() {
    this._transporter = null;
  }

  async _getTransporter() {
    if (this._transporter) return this._transporter;

    if (process.env.SMTP_HOST) {
      this._transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development fallback: Ethereal catch-all SMTP
      const testAccount = await nodemailer.createTestAccount();
      this._transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.log('[EmailChannel] Using Ethereal test account:', testAccount.user);
    }

    return this._transporter;
  }

  _buildSubjectAndBody(payload) {
    const type = payload._eventType || 'Alert';
    if (type === 'InventoryLow') {
      return {
        subject: `[IRMS] Low Stock Alert — ${payload.ingredientId}`,
        html: `
          <h2>Low Stock Warning</h2>
          <p>Ingredient <strong>${payload.ingredientId}</strong> is running low.</p>
          <ul>
            <li>Current level: <strong>${payload.level} ${payload.unit}</strong></li>
            <li>Time: ${payload.timestamp}</li>
          </ul>
          <p>Please reorder as soon as possible.</p>
        `,
      };
    }
    if (type === 'TemperatureAlert') {
      return {
        subject: `[IRMS] Temperature Alert — ${payload.sensorId}`,
        html: `
          <h2>Temperature Warning</h2>
          <p>Sensor <strong>${payload.sensorId}</strong> at ${payload.location} detected abnormal temperature.</p>
          <ul>
            <li>Temperature: <strong>${payload.temp} ${payload.unit}</strong></li>
            <li>Time: ${payload.timestamp}</li>
          </ul>
          <p>Check refrigeration units immediately.</p>
        `,
      };
    }
    return {
      subject: `[IRMS] Alert: ${type}`,
      html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
    };
  }

  async send(to, payload) {
    try {
      const transporter = await this._getTransporter();
      const { subject, html } = this._buildSubjectAndBody(payload);

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"IRMS Alerts" <alerts@irms.local>',
        to,
        subject,
        html,
      });

      console.log(`[EmailChannel] Email sent to ${to} — MessageId: ${info.messageId}`);
      if (nodemailer.getTestMessageUrl(info)) {
        console.log(`[EmailChannel] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (err) {
      console.error(`[EmailChannel] Failed to send email to ${to}:`, err.message);
    }
  }
}

module.exports = new EmailChannel();
