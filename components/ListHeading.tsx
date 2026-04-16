import { Text, TouchableOpacity, View } from "react-native";

const ListHeading = ({ title }: ListHeadingProps) => {
  return (
    <View>
      <View className="list-head">
        <Text className="list-title">{title}</Text>
        <TouchableOpacity className="list-action">
          <Text>View All</Text>
        </TouchableOpacity>
      </View>
      {/* {UPCOMING_SUBSCRIPTIONS.map((sub) => {
        return (
          <UpcomingSubscriptionCard
            key={sub.id}
            data={sub}
          ></UpcomingSubscriptionCard>
        );
      })} */}
    </View>
  );
};

export default ListHeading;
