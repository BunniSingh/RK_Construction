'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      company: String(data.get('company') || ''),
      projectType: String(data.get('projectType') || ''),
      message: String(data.get('message') || ''),
      email: String(data.get('email') || ''),
    };

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (res.ok && body.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(body.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (status === 'sent') {
    return <div id="okmsg">Thanks — your inquiry has been sent. We&apos;ll get back to you shortly.</div>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="two-col">
        <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
        <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" /></div>
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="projectType">Project type</label>
        <select id="projectType" name="projectType">
          <option>Industrial construction</option>
          <option>Infrastructure development</option>
          <option>Water / effluent treatment</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field"><label htmlFor="message">Project details</label><textarea id="message" name="message" required /></div>
      <button className="btn btn-solid" type="submit" disabled={status === 'sending'} style={{ alignSelf: 'flex-start' }}>
        {status === 'sending' ? 'Sending…' : <>Submit Inquiry &rarr;</>}
      </button>
      {status === 'error' && <div id="okmsg" role="alert">{error}</div>}
    </form>
  );
}
