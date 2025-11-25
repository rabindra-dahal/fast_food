import { Text, View } from "react-native";
import "./globals.css";
 
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl text-center font-quicksand-bold text-blue-500">
        Welcome to My React Native App!
      </Text>
    </View>
  );
}