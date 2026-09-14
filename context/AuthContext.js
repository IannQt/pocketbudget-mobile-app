import { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

// Loaded defensively: this native module doesn't exist in Expo Go (only in a
// real built APK), so a plain top-level `import` would crash the whole app
// the moment this file loads. Wrapping it in require()+try/catch lets that
// failure be caught instead, so everything else in the app still works in
// Expo Go — only the Google button itself will show a friendly error there.
let GoogleSignin = null;
try {
  GoogleSignin = require("@react-native-google-signin/google-signin").GoogleSignin;
} catch (err) {
  console.warn("Google Sign-In native module not available in this environment.");
}

const USER_KEY = "pocketbudget:user";
const LOCAL_ACCOUNTS_KEY = "pocketbudget:local_accounts";

// Paste the Web client ID from Google Cloud Console here (see README).
const WEB_CLIENT_ID = "624811622690-4e887fqgu226v089n6144cmp2g9njg2p.apps.googleusercontent.com";

const AuthContext = createContext(null);

async function hashPassword(password) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function loadLocalAccounts() {
  const raw = await AsyncStorage.getItem(LOCAL_ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveLocalAccounts(accounts) {
  await AsyncStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      GoogleSignin?.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false,
      });
    } catch (err) {
      console.warn("Google Sign-In configure failed.", err?.message);
    }

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.warn("Failed to load saved user", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistUser = useCallback(async (profile) => {
    setUser(profile);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
  }, []);

  // ---------- Google ----------
  const signInWithGoogle = useCallback(async () => {
    if (!GoogleSignin) {
      throw new Error(
        "Google Sign-In isn't available in this preview (Expo Go). It works in the built APK. Use email/password to test here."
      );
    }
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const info = response.data ?? response;
    const profile = {
      method: "google",
      id: info.user?.id,
      name: info.user?.name || info.user?.givenName || "Friend",
      email: info.user?.email,
      photo: info.user?.photo,
    };
    await persistUser(profile);
    return profile;
  }, [persistUser]);

  // ---------- Local email/password ----------
  const registerLocal = useCallback(
    async ({ name, email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const accounts = await loadLocalAccounts();
      if (accounts.some((a) => a.email === cleanEmail)) {
        throw new Error("An account with this email already exists on this device.");
      }
      const passwordHash = await hashPassword(password);
      const account = { id: `local-${Date.now()}`, name: name.trim(), email: cleanEmail, passwordHash };
      await saveLocalAccounts([...accounts, account]);

      const profile = { method: "local", id: account.id, name: account.name, email: account.email, photo: null };
      await persistUser(profile);
      return profile;
    },
    [persistUser]
  );

  const signInLocal = useCallback(
    async ({ email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const accounts = await loadLocalAccounts();
      const account = accounts.find((a) => a.email === cleanEmail);
      if (!account) {
        throw new Error("No account found with this email on this device.");
      }
      const passwordHash = await hashPassword(password);
      if (passwordHash !== account.passwordHash) {
        throw new Error("Incorrect password.");
      }
      const profile = { method: "local", id: account.id, name: account.name, email: account.email, photo: null };
      await persistUser(profile);
      return profile;
    },
    [persistUser]
  );

  // ---------- Sign out ----------
  const signOut = useCallback(async () => {
    if (user?.method === "google" && GoogleSignin) {
      try {
        await GoogleSignin.signOut();
      } catch (err) {
        console.warn("Google sign-out warning", err);
      }
    }
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, registerLocal, signInLocal, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
