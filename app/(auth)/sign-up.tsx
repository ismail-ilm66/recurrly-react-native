import { useSignUp } from "@clerk/clerk-expo";
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

function validateName(v: string, label: string): string | null {
  if (!v.trim()) return `${label} is required`;
  if (v.trim().length < 2) return `${label} is too short`;
  return null;
}

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

export default function SignUp() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const fnErr = validateName(firstName, "First name");
    const lnErr = validateName(lastName, "Last name");
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (fnErr || lnErr || eErr || pErr) return;
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim().toLowerCase(),
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/(auth)/verify");
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Sign up failed. Please try again.";
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
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start tracking every subscription, effortlessly
              </Text>
            </View>

            {/* Form Card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Name row */}
                <View className="flex-row gap-3">
                  {/* First name */}
                  <View className="auth-field flex-1">
                    <Text className="auth-label">First name</Text>
                    <TextInput
                      {...authTextInputProps}
                      className={clsx(
                        "auth-input",
                        firstNameError && "auth-input-error",
                      )}
                      placeholder="Jane"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      value={firstName}
                      onChangeText={(v) => {
                        setFirstName(v);
                        if (firstNameError)
                          setFirstNameError(validateName(v, "First name"));
                      }}
                      onBlur={() =>
                        setFirstNameError(validateName(firstName, "First name"))
                      }
                      autoCapitalize="words"
                      textContentType="givenName"
                      returnKeyType="next"
                    />
                    {firstNameError ? (
                      <Text className="auth-error">{firstNameError}</Text>
                    ) : null}
                  </View>

                  {/* Last name */}
                  <View className="auth-field flex-1">
                    <Text className="auth-label">Last name</Text>
                    <TextInput
                      {...authTextInputProps}
                      className={clsx(
                        "auth-input",
                        lastNameError && "auth-input-error",
                      )}
                      placeholder="Doe"
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      value={lastName}
                      onChangeText={(v) => {
                        setLastName(v);
                        if (lastNameError)
                          setLastNameError(validateName(v, "Last name"));
                      }}
                      onBlur={() =>
                        setLastNameError(validateName(lastName, "Last name"))
                      }
                      autoCapitalize="words"
                      textContentType="familyName"
                      returnKeyType="next"
                    />
                    {lastNameError ? (
                      <Text className="auth-error">{lastNameError}</Text>
                    ) : null}
                  </View>
                </View>

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
                      placeholder="Min. 8 characters"
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
                      textContentType="newPassword"
                      returnKeyType="done"
                      onSubmitEditing={handleSignUp}
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
                  onPress={handleSignUp}
                  disabled={loading || !isLoaded}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#081126" size="small" />
                  ) : (
                    <Text className="auth-button-text">Create Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text className="auth-link">Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
