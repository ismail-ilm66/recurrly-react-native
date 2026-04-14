import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <SafeAreaView>
        <Text> SubscriptionDetails </Text>
        <Text className="h-7"> ID: {id} </Text>

        <Link href="/"> Go Back</Link>
      </SafeAreaView>
    </View>
  );
};

export default SubscriptionDetails;
