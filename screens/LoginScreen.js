import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";

export default function LoginScreen() {
  const { signInWithGoogle, registerLocal, signInLocal } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const cancelled = err?.code === "SIGN_IN_CANCELLED" || err?.message?.includes("cancel");
      if (!cancelled) Alert.alert("Couldn't sign in", err?.message || "Something went wrong signing in with Google.");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (mode === "register") {
      if (!name.trim()) {
        setError("Enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords don't match.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "register") {
        await registerLocal({ name, email, password });
      } else {
        await signInLocal({ email, password });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image source={require("../assets/icon.png")} style={styles.logo} />
          <Text style={styles.wordmark}>PocketBudget</Text>
          <Text style={styles.tagline}>Track spending, budgets, and goals — privately, on your phone.</Text>

          <View style={styles.infoBanner}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.ink} style={{ marginRight: 8 }} />
            <Text style={styles.infoBannerText}>Your data stays saved on this device.</Text>
          </View>

          <View style={styles.featureRow}>
            {['Private', 'Accounts', 'Budgets', 'Goals'].map((label) => (
              <View key={label} style={styles.featureChip}>
                <Text style={styles.featureChipText}>{label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} disabled={googleLoading}>
            {googleLoading ? (
              <ActivityIndicator color={COLORS.ink} />
            ) : (
              <>
                <Ionicons name="logo-google" size={18} color={COLORS.ink} style={{ marginRight: 10 }} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === "login" && styles.modeBtnActive]}
              onPress={() => { setMode("login"); setError(""); }}
            >
              <Text style={[styles.modeBtnText, mode === "login" && styles.modeBtnTextActive]}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === "register" && styles.modeBtnActive]}
              onPress={() => { setMode("register"); setError(""); }}
            >
              <Text style={[styles.modeBtnText, mode === "register" && styles.modeBtnTextActive]}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>

          {mode === "register" && (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor={COLORS.inkSoft}
              style={styles.input}
            />
          )}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLORS.inkSoft}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={COLORS.inkSoft}
            secureTextEntry
            style={styles.input}
          />
          {mode === "register" && (
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.inkSoft}
              secureTextEntry
              style={styles.input}
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.submitBtnText}>{mode === "register" ? "Create account" : "Log in"}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footnote}>
            {mode === "register"
              ? "This account only works on this device — there's no password recovery. Your budget data stays local either way."
              : "Your budget data stays on this device."}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.paper },
  content: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 28, paddingVertical: 40 },
  logo: { width: 68, height: 68, borderRadius: 16, marginBottom: 16 },
  wordmark: { fontSize: 24, fontWeight: "700", color: COLORS.ink, marginBottom: 6 },
  tagline: { color: COLORS.inkSoft, fontSize: 13, textAlign: "center", marginBottom: 18, lineHeight: 19, maxWidth: 280 },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "100%",
    maxWidth: 320,
    marginBottom: 14,
  },
  infoBannerText: { color: COLORS.ink, fontSize: 12, fontWeight: "600" },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    marginBottom: 16,
    gap: 8,
  },
  featureChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  featureChipText: { color: COLORS.inkSoft, fontSize: 11, fontWeight: "700" },
  stepText: { color: COLORS.inkSoft, fontSize: 12, lineHeight: 18, flex: 1 },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    maxWidth: 320,
  },
  googleBtnText: { color: COLORS.ink, fontWeight: "700", fontSize: 15 },
  dividerRow: { flexDirection: "row", alignItems: "center", width: "100%", maxWidth: 320, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.inkSoft, fontSize: 12, marginHorizontal: 10 },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 4,
    width: "100%",
    maxWidth: 320,
    marginBottom: 16,
  },
  modeBtn: { flex: 1, paddingVertical: 9, alignItems: "center", borderRadius: 7 },
  modeBtnActive: { backgroundColor: COLORS.ink },
  modeBtnText: { color: COLORS.inkSoft, fontWeight: "700", fontSize: 13 },
  modeBtnTextActive: { color: COLORS.surface },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.ink,
    backgroundColor: COLORS.surface,
    marginBottom: 10,
  },
  error: { color: COLORS.rose, fontSize: 13, marginTop: 2, marginBottom: 6, maxWidth: 320, textAlign: "center" },
  submitBtn: {
    backgroundColor: COLORS.ink,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
    marginTop: 6,
  },
  submitBtnText: { color: COLORS.surface, fontWeight: "700", fontSize: 15 },
  footnote: { color: COLORS.inkSoft, fontSize: 11, textAlign: "center", marginTop: 16, maxWidth: 280, lineHeight: 16 },
});
