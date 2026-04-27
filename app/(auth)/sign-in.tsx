import { useSignIn } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { authTextInputProps } from "@/lib/authInputProps";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function validateEmail(v: string): string | null {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
    return "Enter a valid email address";
  return null;
}

function validatePassword(v: string): string | null {
  if (!v) return "Password is required";
  if (v.length < 8) return "Must be at least 8 characters";
  return null;
}

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email.trim().toLowerCase(),
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Additional verification required. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Sign in failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            {/* Brand Block */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">
                    Subscription Tracker
                  </Text>
                </View>
              </View>
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to manage your subscriptions
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Email */}
                <View className="auth-field">
                  <Text className="auth-label">Email address</Text>
                  <TextInput
                    {...authTextInputProps}
                    className={clsx(
                      "auth-input",
                      emailError && "auth-input-error",
                    )}
                    placeholder="you@example.com"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      if (emailError) setEmailError(validateEmail(v));
                    }}
                    onBlur={() => setEmailError(validateEmail(email))}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="next"
                  />
                  {emailError ? (
                    <Text className="auth-error">{emailError}</Text>
                  ) : null}
                </View>

                {/* Password */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <View
                    className={clsx(
                      "auth-input flex-row items-stretch",
                      passwordError && "auth-input-error",
                    )}
                  >
                    <TextInput
                      {...authTextInputProps}
                      className="auth-input-inner"
                      placeholder="••••••••"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      value={password}
                      onChangeText={(v) => {
                        setPassword(v);
                        if (passwordError)
                          setPasswordError(validatePassword(v));
                      }}
                      onBlur={() =>
                        setPasswordError(validatePassword(password))
                      }
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSignIn}
                    />
                    <TouchableOpacity
                      className="self-center px-1"
                      onPress={() => setShowPassword((p) => !p)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={18}
                        color="rgba(0,0,0,0.4)"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text className="auth-error">{passwordError}</Text>
                  ) : null}
                </View>

                {/* General error */}
                {error ? (
                  <Text className="auth-error text-center">{error}</Text>
                ) : null}

                {/* Submit */}
                <TouchableOpacity
                  className={clsx(
                    "auth-button",
                    (loading || !isLoaded) && "auth-button-disabled",
                  )}
                  onPress={handleSignIn}
                  disabled={loading || !isLoaded}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#081126" size="small" />
                  ) : (
                    <Text className="auth-button-text">Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">{"Don't have an account?"}</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text className="auth-link">Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
