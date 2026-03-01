import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface SubscriptionState {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionState>({
  isSubscribed: false,
  plan: null,
  expiresAt: null,
  loading: true
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    plan: null,
    expiresAt: null,
    loading: true
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ isSubscribed: false, plan: null, expiresAt: null, loading: false });
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch('https://atsfreeresume.in/api/my-plan.php', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setState({
          isSubscribed: data.active === true,
          plan: data.plan ?? null,
          expiresAt: data.expires_at ?? null,
          loading: false
        });
      } catch {
        setState({ isSubscribed: false, plan: null, expiresAt: null, loading: false });
      }
    });

    return unsub;
  }, []);

  return (
    <SubscriptionContext.Provider value={state}>
      {children}
    </SubscriptionContext.Provider>
  );
};
