import nodemailer from 'nodemailer';
import {connect as connectTls} from 'node:tls';
import {requireTrial} from './service.mjs';

const mailbox = value => typeof value === 'string' && value.length <= 254 &&
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(value);

// Only server configuration controls the SMTP endpoint, credentials and sender.
// The existing support forwarder and paid-checkout email binding are not changed.
export function createTrialMailer(env, createTransport = nodemailer.createTransport) {
  // A missing/cleared test address must never implicitly open public signup.
  const publicSignup = env.TRIAL_PUBLIC_SIGNUP === 'true';
  let origin;
  try { origin = new URL(env.TRIAL_ORIGIN); } catch { /* Validated below. */ }
  requireTrial(typeof env.TRIAL_SMTP_HOST === 'string' &&
    /^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(env.TRIAL_SMTP_HOST) &&
    Number(env.TRIAL_SMTP_PORT) === 465 && mailbox(env.TRIAL_SMTP_USER) &&
    typeof env.TRIAL_SMTP_PASSWORD === 'string' && env.TRIAL_SMTP_PASSWORD.length > 0 &&
    mailbox(env.TRIAL_EMAIL_FROM) && (publicSignup || mailbox(env.TRIAL_TEST_EMAIL)) &&
    origin?.protocol === 'https:' && origin.origin === env.TRIAL_ORIGIN, 'trial_setup_pending', 503);

  return async (email, code) => {
    // Keep the recipient restriction at the transport as well as the HTTP boundary.
    // Public mode still validates one recipient; the request service rate-limits sends.
    requireTrial(mailbox(email) && (publicSignup || email.toLowerCase() === env.TRIAL_TEST_EMAIL.toLowerCase()),
      'trial_setup_pending', 503);
    requireTrial(typeof code === 'string' && /^\d{8}$/.test(code), 'invalid_request');
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
        from: {address: env.TRIAL_EMAIL_FROM, name: 'nPower Software'},
        replyTo: env.TRIAL_EMAIL_FROM,
        to: email,
        envelope: {from: env.TRIAL_EMAIL_FROM, to: [email]},
        subject: 'Verify your Power Surfacing evaluation',
        text: 'Your Power Surfacing verification code is '+code+'.\r\n\r\nEnter it in the application within 15 minutes. Never share this code.\r\nIf you did not request an evaluation, ignore this email. No license has been created yet.',
        html: '<p>Your Power Surfacing verification code:</p><p><strong>'+code+'</strong></p><p>Enter it in the application within 15 minutes. Never share this code.</p><p>If you did not request an evaluation, ignore this email. No license has been created yet.</p>',
      };
      const result = await Promise.race([
        transport.sendMail(message),
        new Promise((_, reject) => {
          deadline = setTimeout(() => reject(new Error('SMTP deadline exceeded')), 25000);
        }),
      ]);
      requireTrial(result.accepted?.some(address => typeof address === 'string' &&
        address.toLowerCase() === email.toLowerCase()) && !result.rejected?.length,
        'trial_email_unavailable', 503);
    } catch {
      // SMTP responses can echo usernames, recipients, or other sensitive values.
      // Do not return/log the provider response, code, password or MIME message.
      // In particular, never retry an ambiguous timeout after DATA was accepted.
      requireTrial(false, 'trial_email_unavailable', 503);
    } finally {
      clearTimeout(deadline);
      closed = true;
      socket?.destroy();
      transport.close();
    }
  };
}
