import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
