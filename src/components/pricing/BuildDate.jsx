import React from 'react';

export default function BuildDate({ date }) {
  const label = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

  return (
    <p className="mb-3 text-sm font-semibold text-slate-900">
      Build date: <time dateTime={date}>{label}</time>
    </p>
  );
}
