import { Stack } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomHeader from "@/components/CustomHeader";

export default function MeStack() {
  const navigation = useNavigation();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ header: () => <CustomHeader title="我" hasBackButton={true} backIconOnly={true}/> }} />
      <Stack.Screen name="editProfile" options={{ header: () => <CustomHeader title="意見/建議" hasBackButton={true}/> }} />
      <Stack.Screen name="acountRecord"/>
      <Stack.Screen name="datePicker" options={{ header: () => <CustomHeader title="搜尋時段" hasBackButton={true}/> }}/>
    </Stack>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: "center",
  },
  backText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 16
  }
})