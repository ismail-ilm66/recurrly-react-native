import { useSignUp } from "@clerk/clerk-expo";
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

export default function Verify() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      setCodeError("Verification code is required");
      return;
    }
    if (code.length !== 6) {
      setCodeError("Enter the full 6-digit code");
      return;
    }
    if (!isLoaded) return;

    setLoading(true);
    setError(null);
    setCodeError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Invalid code. Please check and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || resendLoading) return;
    setResendLoading(true);
    setResendSent(false);
    setError(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResendSent(true);
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.message ?? "Could not resend code. Try again.";
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const emailAddress = signUp?.emailAddress ?? "your email";

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
            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-6 flex-row items-center gap-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="text-base font-sans-semibold text-accent">
                ← Back
              </Text>
            </TouchableOpacity>

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
              <Text className="auth-title">Check your email</Text>
              <Text className="auth-subtitle">
                {"We sent a 6-digit code to "}
                <Text className="font-sans-bold text-primary">
                  {emailAddress}
                </Text>
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Code field */}
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    {...authTextInputProps}
                    className={clsx(
                      "auth-input text-center text-2xl font-sans-bold leading-8 tracking-widest",
                      codeError && "auth-input-error"
                    )}
                    placeholder="------"
                    placeholderTextColor="rgba(0,0,0,0.2)"
                    value={code}
                    onChangeText={(v) => {
                      const cleaned = v.replace(/[^0-9]/g, "").slice(0, 6);
                      setCode(cleaned);
                      if (codeError) setCodeError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={handleVerify}
                  />
                  {codeError ? (
                    <Text className="auth-error text-center">{codeError}</Text>
                  ) : (
                    <Text className="auth-helper text-center">
                      The code expires in 10 minutes
                    </Text>
                  )}
                </View>

                {/* General error */}
                {error ? (
                  <Text className="auth-error text-center">{error}</Text>
                ) : null}

                {/* Resend success */}
                {resendSent ? (
                  <Text className="text-center text-xs font-sans-medium text-success">
                    New code sent — check your inbox
                  </Text>
                ) : null}

                {/* Submit */}
                <TouchableOpacity
                  className={clsx(
                    "auth-button",
                    (loading || !isLoaded || code.length !== 6) &&
                      "auth-button-disabled"
                  )}
                  onPress={handleVerify}
                  disabled={loading || !isLoaded || code.length !== 6}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#081126" size="small" />
                  ) : (
                    <Text className="auth-button-text">Verify Email</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="auth-divider-row">
                  <View className="auth-divider-line" />
                  <Text className="auth-divider-text">or</Text>
                  <View className="auth-divider-line" />
                </View>

                {/* Resend */}
                <TouchableOpacity
                  className={clsx(
                    "auth-secondary-button",
                    resendLoading && "opacity-50"
                  )}
                  onPress={handleResend}
                  disabled={resendLoading}
                  activeOpacity={0.8}
                >
                  {resendLoading ? (
                    <ActivityIndicator color="#ea7a53" size="small" />
                  ) : (
                    <Text className="auth-secondary-button-text">
                      Resend code
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
