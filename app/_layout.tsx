import "@/global.css";
import { tokenCache } from "@/lib/tokenCache";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useColorScheme, View } from "react-native";

SplashScreen.preventAutoHideAsync();

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const splashLogo = require("../assets/images/logo-glow.png");

/** Same look as native splash: theme background + centered logo while fonts/auth load. */
function BootPlaceholder() {
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme === "dark" ? "#081126" : "#fff9e3";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={splashLogo}
        style={{ width: 240, height: 240 }}
        contentFit="contain"
        accessibilityLabel="Recurrly"
      />
    </View>
  );
}

function AppGate({ fontsReady }: { fontsReady: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const ready = fontsReady && isLoaded;

  useEffect(() => {
    if (!ready) return;
    void SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    const first = segments[0];
    const inAuthGroup = first === "(auth)";
    const inTabsGroup = first === "(tabs)";
    const allowedOutsideTabs =
      first === "subscriptions" || first === "onboarding";

    if (isSignedIn) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      } else if (!inTabsGroup && !allowedOutsideTabs) {
        // Root `/`, `index`, or any unknown group — send to main app
        router.replace("/(tabs)");
      }
    } else {
      const onOnboarding = first === "onboarding";
      if (!inAuthGroup && !onOnboarding) {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isSignedIn, ready, segments, router]);

  if (!ready) return <BootPlaceholder />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  const fontsReady = fontsLoaded || fontError != null;

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppGate fontsReady={fontsReady} />
    </ClerkProvider>
  );
}
