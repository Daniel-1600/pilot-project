import { useEffect, useRef } from 'react';
import { useClerk } from '@clerk/react';

interface AuthModalProps {
  isOpen: boolean;
  mode?: 'signIn' | 'signUp';
  onClose: () => void;
}

function ClerkAuthModal({ isOpen, mode = 'signIn', onClose }: AuthModalProps) {
  const clerk = useClerk();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'signUp') clerk.openSignUp();
    else clerk.openSignIn();
    closeRef.current();
  }, [isOpen, mode, clerk]);

  return null;
}

export function AuthModal(props: AuthModalProps) {
  if (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) return <ClerkAuthModal {...props} />;
  if (!props.isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={props.onClose}>
    <div role="dialog" aria-modal="true" aria-label="Sign-in setup" className="w-full max-w-sm rounded-2xl border border-[#2b2e2c] bg-[#1d1f1e] p-6 text-[#f1f3f2]" onClick={event => event.stopPropagation()}>
      <h2 className="text-xl font-medium">Sign-in is being set up</h2>
      <p className="mt-3 text-sm leading-6 text-[#9a9e9b]">Browsing firms is available now. Account features will be available when Clerk is configured.</p>
      <button onClick={props.onClose} className="mt-6 rounded-lg bg-[#3ecf8e] px-4 py-2 text-sm font-medium text-[#171918]">Continue browsing</button>
    </div>
  </div>;
}
