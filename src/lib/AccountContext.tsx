import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearAccount,
  generateAccount,
  importFromNsec,
  loadAccount,
  saveAccount,
  type WispAccount,
} from "@/lib/keys";

interface AccountContextValue {
  account: WispAccount | null;
  login: (nsec: string) => boolean;
  generate: () => void;
  logout: () => void;
}

const AccountContext = createContext<AccountContextValue>({
  account: null,
  login: () => false,
  generate: () => {},
  logout: () => {},
});

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<WispAccount | null>(null);

  useEffect(() => {
    const saved = loadAccount();
    if (saved) setAccount(saved);
  }, []);

  const login = useCallback((nsec: string): boolean => {
    const acc = importFromNsec(nsec.trim());
    if (!acc) return false;
    saveAccount(acc);
    setAccount(acc);
    return true;
  }, []);

  const generate = useCallback(() => {
    const acc = generateAccount();
    saveAccount(acc);
    setAccount(acc);
  }, []);

  const logout = useCallback(() => {
    clearAccount();
    setAccount(null);
  }, []);

  return (
    <AccountContext.Provider value={{ account, login, generate, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
