import { Image } from "expo-image";
import { useColorScheme, View } from "react-native";

const splashLogo = require("../assets/images/logo-glow.png");

/**
 * Landing route for `/` while root `_layout` redirects by auth state.
 * Matches splash styling so the transition feels continuous.
 */
export default function Index() {
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
