'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '20px', background: 'white', color: 'red' }}>
      <h2>Something went wrong in NLYK!</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
