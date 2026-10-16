import { useRef, useState } from 'react';

export default function useContactForm(kind, form) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const attempt = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending.current) return;
    const website = new FormData(event.currentTarget).get('website') || '';
    const payload = JSON.stringify({ ...form, kind, website });
    if (attempt.current?.payload !== payload) {
      attempt.current = { payload, id:crypto.randomUUID() };
    }
    pending.current = true;
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, kind, website, submissionId:attempt.current.id }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || 'We could not confirm receipt. Please try again or email us directly.');
      }
      setSubmitted(true);
    } catch (failure) {
      setError(failure.message || 'We could not confirm receipt. Please try again or email us directly.');
    } finally {
      pending.current = false;
      setSending(false);
    }
  }
  return { submitted, sending, error, handleSubmit };
}
