import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils.js";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1   bg-background p-5">
      {/*Header*/}
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar"></Image>
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>
        <View className="icon-circle">
          <Image source={icons.add} className="home-add-icon" />
        </View>
      </View>
      {/*Balance Card*/}
      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.amount).format("MM/DD")}
          </Text>
        </View>

        {/*Balance Card*/}
      </View>

      <View>
        <ListHeading title="Upcoming"></ListHeading>
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard data={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No upcoming subscriptions yet.
            </Text>
          }
        ></FlatList>
      </View>
      <View>
        <ListHeading title="AllSubscription"></ListHeading>
      </View>
    </SafeAreaView>
  );
}
