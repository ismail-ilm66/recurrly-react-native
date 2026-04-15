import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1   bg-background p-5">
      <Text className="text-5xl font-sans-bold  ">Home!</Text>
      <Link href="/sign-up" className="text-success h-7">
        Sign Up
      </Link>

      <Link href="/subscriptions/claude" className="text-success">
        Go To Subscription
      </Link>
    </SafeAreaView>
  );
}
