import { useAuth, useUser } from "@clerk/clerk-expo";
import { clsx } from "clsx";
import { styled } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Settings() {
  const { signOut, isLoaded } = useAuth();
  const { user } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!isLoaded || loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
    } catch {
      setLoggingOut(false);
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-5 pb-10 pt-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="list-title mb-2">Settings</Text>
        <Text className="auth-helper mb-6">
          Manage your account and preferences.
        </Text>

        {email ? (
          <View className="auth-card mb-6">
            <Text className="auth-label">Signed in as</Text>
            <Text className="mt-1 text-base font-sans-semibold text-primary">
              {email}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          className={clsx(
            "items-center rounded-2xl border border-destructive/35 bg-destructive/8 py-4",
            (loggingOut || !isLoaded) && "opacity-45"
          )}
          onPress={handleLogout}
          disabled={loggingOut || !isLoaded}
          activeOpacity={0.8}
        >
          {loggingOut ? (
            <ActivityIndicator color="#dc2626" size="small" />
          ) : (
            <Text className="text-base font-sans-bold text-destructive">
              Log out
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
