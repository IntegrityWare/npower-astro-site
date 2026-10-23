import nodemailer from 'nodemailer';
import {connect as connectTls} from 'node:tls';
import {required} from './errors.mjs';

const mailbox = value => typeof value === 'string' && value.length <= 254 &&
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value);

// Only server configuration controls the SMTP endpoint, credentials and sender.
// Reuse the verified SMTP service; preserve the trial transport and sandbox email binding.
export function createStoreMailer(env, createTransport = nodemailer.createTransport) {
  let origin;
  try { origin = new URL(env.LIVE_STORE_ORIGIN); } catch { /* Validated below. */ }
  required(typeof env.TRIAL_SMTP_HOST === 'string' &&
    /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(env.TRIAL_SMTP_HOST) &&
    Number(env.TRIAL_SMTP_PORT) === 465 && mailbox(env.TRIAL_SMTP_USER) &&
    typeof env.TRIAL_SMTP_PASSWORD === 'string' && env.TRIAL_SMTP_PASSWORD.length > 0 &&
    mailbox(env.STORE_LIVE_EMAIL_FROM) &&
    origin?.protocol === 'https:' && origin.origin === env.LIVE_STORE_ORIGIN, 'store_setup_pending', 503);

  return async saved => {
    const email=saved.recipient;
    // This message comes from the durable outbox after verified payment, not a browser form.
    required(mailbox(email),
      'store_setup_pending', 503);
    required(typeof saved.subject==='string' && !/[\r\n]/.test(saved.subject) && typeof saved.text==='string' && typeof saved.html==='string', 'invalid_email');
    let socket, closed = false;
    const tlsOptions = {servername: env.TRIAL_SMTP_HOST, rejectUnauthorized: true, minVersion: 'TLSv1.2'};
    const transport = createTransport({
      host: env.TRIAL_SMTP_HOST,
      port: 465,
      secure: true,
      name: origin.hostname,
      auth: {user: env.TRIAL_SMTP_USER, pass: env.TRIAL_SMTP_PASSWORD},
      forceAuth: true,
      tls: tlsOptions,
      // Own the socket so a total deadline really cancels it. Nodemailer's
      // non-pooled transport.close() alone does not close an in-flight socket.
      getSocket(_options, callback) {
        if (closed) { callback(new Error('SMTP operation ended')); return; }
        socket = connectTls({host: env.TRIAL_SMTP_HOST, port: 465, ...tlsOptions});
        const failed = error => callback(error);
        socket.once('error', failed);
        socket.once('secureConnect', () => {
          socket.removeListener('error', failed);
          if (closed) { socket.destroy(); callback(new Error('SMTP operation ended')); return; }
          callback(null, {connection: socket, secured: true});
        });
      },
      pool: false,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      dnsTimeout: 10000,
      logger: false,
      debug: false,
      disableFileAccess: true,
      disableUrlAccess: true,
      maxRecipients: 1,
    });
    let deadline;
    try {
      const message = {
        from: {address: env.STORE_LIVE_EMAIL_FROM, name: 'nPower Software'},
        replyTo: env.STORE_LIVE_EMAIL_FROM,
        to: email,
        envelope: {from: env.STORE_LIVE_EMAIL_FROM, to: [email]},
        subject:saved.subject, text:saved.text, html:saved.html,
      };
      const result = await Promise.race([
        transport.sendMail(message),
        new Promise((_, reject) => {
          deadline = setTimeout(() => reject(new Error('SMTP deadline exceeded')), 25000);
        }),
      ]);
      required(result.accepted?.some(address => typeof address === 'string' &&
        address.toLowerCase() === email.toLowerCase()) && !result.rejected?.length,
        'store_email_unavailable', 503);
      required(typeof result.messageId==='string' && result.messageId.length>0,'email_result_uncertain',503);
      return {messageId:result.messageId};
    } catch {
      // SMTP responses can echo usernames, recipients, or other sensitive values.
      // Do not return/log the provider response, password or MIME message.
      // In particular, never retry an ambiguous timeout after DATA was accepted.
      required(false, 'store_email_unavailable', 503);
    } finally {
      clearTimeout(deadline);
      closed = true;
      socket?.destroy();
      transport.close();
    }
  };
}
