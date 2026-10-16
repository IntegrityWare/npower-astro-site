import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createTrialMailer} from '../trials/email.mjs';

const configuration = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
const env = {...configuration.vars, TRIAL_PUBLIC_SIGNUP: 'false', TRIAL_SMTP_PASSWORD: 'mock-smtp-password-not-a-real-secret'};
const recipient = 'gcrocker61@gmail.com';
function fixture(sendMail) {
  const f = {options: [], messages: [], closed: 0};
  f.factory = options => {
    f.options.push(options);
    return {
      sendMail: async message => {
        f.messages.push(message);
        return sendMail ? sendMail(message) : {accepted: [message.to], rejected: []};
      },
      close: () => { f.closed++; },
    };
  };
  return f;
}

test('SMTP authenticates separately from support sender and always validates implicit TLS', async () => {
  const f = fixture();
  await createTrialMailer(env, f.factory)(recipient, '12345678');
  assert.equal(f.options.length, 1);
  const options = f.options[0], message = f.messages[0];
  assert.equal(options.host, 'mail.npowersoftware.com');
  assert.equal(options.port, 465);
  assert.equal(options.secure, true);
  assert.equal(options.forceAuth, true);
  assert.equal(typeof options.getSocket, 'function');
  assert.equal(options.auth.user, 'dgill@npowersoftware.com');
  assert.equal(options.auth.pass, env.TRIAL_SMTP_PASSWORD);
  assert.deepEqual(options.tls, {servername: options.host, rejectUnauthorized: true, minVersion: 'TLSv1.2'});
  assert.equal(options.logger, false); assert.equal(options.debug, false); assert.equal(options.pool, false);
  assert.equal(options.disableFileAccess, true); assert.equal(options.disableUrlAccess, true);
  assert.equal(options.maxRecipients, 1);
  assert.equal(options.name, 'www.npowersoftware.com');
  assert.deepEqual(message.envelope, {from: 'support@npowersoftware.com', to: [recipient]});
  assert.equal(message.from.address, 'support@npowersoftware.com');
  assert.equal(message.replyTo, 'support@npowersoftware.com');
  assert.ok(message.text.includes('12345678')); assert.ok(message.html.includes('12345678'));
  assert.equal(JSON.stringify(message).includes(env.TRIAL_SMTP_PASSWORD), false);
  assert.equal(JSON.stringify(message).includes(env.TRIAL_SMTP_USER), false);
  assert.equal(f.closed, 1);
});

test('Missing settings, invalid sender and insecure SMTP ports fail before connecting', () => {
  for (const override of [
    {TRIAL_SMTP_PASSWORD: ''}, {TRIAL_SMTP_USER: ''}, {TRIAL_SMTP_HOST: ''},
    {TRIAL_SMTP_PORT: '25'}, {TRIAL_SMTP_PORT: '587'}, {TRIAL_SMTP_PORT: ''},
    {TRIAL_EMAIL_FROM: ''}, {TRIAL_EMAIL_FROM: 'support@example.test\r\nBcc: x@example.test'},
    {TRIAL_TEST_EMAIL: ''}, {TRIAL_SMTP_HOST: 'mail.example.test/other'},
    {TRIAL_ORIGIN: ''}, {TRIAL_ORIGIN: 'http://example.test'}, {TRIAL_ORIGIN: 'https://example.test/path'},
  ]) {
    const f = fixture();
    assert.throws(() => createTrialMailer({...env, ...override}, f.factory), {code: 'trial_setup_pending'});
    assert.equal(f.options.length, 0);
  }
});

test('Recipient allowlist and code validation prevent mail/header injection', async () => {
  const f = fixture(), send = createTrialMailer(env, f.factory);
  for (const address of ['other@example.test', recipient+',other@example.test', recipient+'\r\nBcc: x@example.test'])
    await assert.rejects(send(address, '12345678'), {code: 'trial_setup_pending'});
  for (const code of ['', '<script>', '12345678\r\n', '123456789'])
    await assert.rejects(send(recipient, code), {code: 'invalid_request'});
  assert.equal(f.options.length, 0);
});

test('Only an explicit public flag enables previously unknown recipients without a test address', async () => {
  const f = fixture(), publicEnv = {...env, TRIAL_PUBLIC_SIGNUP: 'true'};
  delete publicEnv.TRIAL_TEST_EMAIL;
  const send = createTrialMailer(publicEnv, f.factory);
  for (const email of ['first@example.test', 'second+pilot@example.test']) await send(email, '12345678');
  assert.deepEqual(f.messages.map(message => message.to), ['first@example.test', 'second+pilot@example.test']);
  assert.ok(f.messages.every(message => message.from.address === 'support@npowersoftware.com'));
  for (const email of ['', 'not-an-email', 'one@example.test,two@example.test', 'a@example.test\r\nBcc: b@example.test'])
    await assert.rejects(send(email, '12345678'), {code: 'trial_setup_pending'});
  assert.equal(f.messages.length, 2);
});

test('Missing, false or malformed public flags preserve the restricted mode', async () => {
  for (const flag of [undefined, 'false', '', 'TRUE', 'yes', true]) {
    const f = fixture(), restricted = {...env, TRIAL_PUBLIC_SIGNUP: flag};
    await assert.rejects(createTrialMailer(restricted, f.factory)('other@example.test', '12345678'),
      {code: 'trial_setup_pending'});
    delete restricted.TRIAL_TEST_EMAIL;
    assert.throws(() => createTrialMailer(restricted, f.factory), {code: 'trial_setup_pending'});
    assert.equal(f.options.length, 0);
  }
});

test('SMTP greeting follows the configured site origin for a later domain migration', async () => {
  const f = fixture();
  await createTrialMailer({...env, TRIAL_ORIGIN: 'https://www.npowersoftware.com'}, f.factory)(recipient, '12345678');
  assert.equal(f.options[0].name, 'www.npowersoftware.com');
  assert.equal(f.messages[0].from.address, 'support@npowersoftware.com');
});

test('Authentication, sender rejection and uncertain delivery errors close once without retry or leaking values', async () => {
  for (const code of ['EAUTH', 'EENVELOPE', 'ETIMEDOUT']) {
    const f = fixture(async () => { throw Object.assign(new Error(env.TRIAL_SMTP_PASSWORD+' 12345678 '+recipient), {code}); });
    await assert.rejects(createTrialMailer(env, f.factory)(recipient, '12345678'), error => {
      assert.equal(error.code, 'trial_email_unavailable');
      for (const value of [env.TRIAL_SMTP_PASSWORD, recipient, '12345678']) assert.equal(String(error).includes(value), false);
      return true;
    });
    assert.equal(f.options.length, 1); assert.equal(f.messages.length, 1); assert.equal(f.closed, 1);
  }
});

test('SMTP success requires recipient acceptance, not merely a resolved send call', async () => {
  for (const result of [{accepted: [], rejected: [recipient]}, {accepted: ['other@example.test'], rejected: []}]) {
    const f = fixture(async () => result);
    await assert.rejects(createTrialMailer(env, f.factory)(recipient, '12345678'), {code: 'trial_email_unavailable'});
    assert.equal(f.closed, 1);
  }
});

test('Total SMTP deadline closes the transport and never retries a stalled send', async t => {
  t.mock.timers.enable({apis: ['setTimeout']});
  const f = fixture(() => new Promise(() => {}));
  const pending = assert.rejects(createTrialMailer(env, f.factory)(recipient, '12345678'), {code: 'trial_email_unavailable'});
  t.mock.timers.tick(25000);
  await pending;
  assert.equal(f.closed, 1); assert.equal(f.messages.length, 1);
});
