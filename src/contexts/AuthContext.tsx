import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { useAuth as useClerkAuth, useClerk } from '@clerk/react';
import { setAuthSession, syncUserProfile, type UserProfileData } from '../lib/api';

interface AuthContextValue {
  userProfile: UserProfileData | null;
  setUserProfile: Dispatch<SetStateAction<UserProfileData | null>>;
  rewardPoints: (points: number) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>(null!);
export const useAuth = () => useContext(AuthContext);

function ProfileProvider({ children, userId, getToken, signOut }: { children: ReactNode; userId: string | null; getToken: () => Promise<string | null>; signOut: () => Promise<void> }) {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    if (!userId) {
      setAuthSession(null);
      setUserProfile(null);
      return;
    }
    let active = true;
    setAuthSession({ userId, getToken });
    setUserProfile(null);
    void syncUserProfile().then(profile => {
      if (active) setUserProfile(profile);
    }).catch(error => {
      if (active) console.error('Profile sync failed:', error);
    });
    return () => { active = false; setAuthSession(null); };
  }, [userId, getToken]);

  const rewardPoints = (points: number) => {
    setUserProfile(prev => prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + points } : null);
  };

  return (
    <AuthContext.Provider value={{ userProfile, setUserProfile, rewardPoints, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, userId, getToken } = useClerkAuth();
  const clerk = useClerk();
  return <ProfileProvider userId={isLoaded ? userId : null} getToken={getToken} signOut={() => clerk.signOut()}>{children}</ProfileProvider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  return <ProfileProvider userId={null} getToken={async () => null} signOut={async () => {}}>{children}</ProfileProvider>;
}
