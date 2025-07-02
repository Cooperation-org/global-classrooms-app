'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('./LoginPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function SignInPage() {
  return <LoginPage />;
}