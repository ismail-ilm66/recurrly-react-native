import { Image, Text, View } from "react-native";
import { formatCurrency } from "../lib/utils.js";

const UpcomingSubscriptionCard = ({
  data: { id, icon, name, price, currency, daysLeft },
}: any) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon"></Image>
        <View>
          <Text className="upcoming-price">{formatCurrency(price)}</Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : `${daysLeft} day left`}
          </Text>
        </View>
      </View>
      <View>
        <Text className="upcoming-name">{name}</Text>
      </View>
    </View>
  );
};

export default UpcomingSubscriptionCard;
