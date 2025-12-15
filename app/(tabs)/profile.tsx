import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/authentication/useAuth";

export default function Profile() {
  const { logout, user } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.username}</Text>
      <Text>{user?.firstName}</Text>
      <Text>{user?.lastName}</Text>
      <Text>{user?.createdAt}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
