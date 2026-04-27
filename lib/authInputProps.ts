import { Platform } from "react-native";

/**
 * Android adds extra font padding that clips custom fonts (e.g. Plus Jakarta)
 * inside TextInput. iOS can also look tight if line-height is too small.
 */
export const authTextInputProps =
  Platform.OS === "android"
    ? ({ includeFontPadding: false, textAlignVertical: "center" } as const)
    : ({} as const);
