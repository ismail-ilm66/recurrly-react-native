import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils.js";
import { useUser } from "@clerk/clerk-expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "You"
    : "";
  return (
    <SafeAreaView className="flex-1   bg-background p-5">
      <ListHeading title="AllSubscription"></ListHeading>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/*Header*/}
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar"></Image>
                <Text className="home-user-name">{displayName}</Text>
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

            <View className="mb-5">
              <ListHeading title="Upcoming"></ListHeading>
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard data={item} />
                )}
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
            <ListHeading title="All Subscriptions"></ListHeading>
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedCardId === item.id}
            onPress={() =>
              setExpandedCardId(expandedCardId === item.id ? null : item.id)
            }
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions.</Text>
        }
        extraData={expandedCardId}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={<View className="h-4"></View>}
        contentContainerClassName="pb-20"
      ></FlatList>
    </SafeAreaView>
  );
}
