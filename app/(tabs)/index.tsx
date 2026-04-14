import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <SafeAreaView>
        <Text className="text-xl font-bold text-success ">
          Welcome to Nativewind!
        </Text>
        <Link href="/sign-up" className="text-success h-7">
          Sign Up
        </Link>

        <Link href="/subscriptions/claude" className="text-success">
          Go To Subscription
        </Link>
      </SafeAreaView>
    </View>
  );
}
