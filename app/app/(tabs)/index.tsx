import { View, StyleSheet, Platform, UIManager } from "react-native"
import { Navbar } from "@/components/navbar";
import { Header } from "@/components/header";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Header />
      <Navbar />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201A2C",
    paddingTop: 64,
    justifyContent: "center",
    alignItems: "center",
  }
});



