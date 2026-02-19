import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  hasBackButton?: boolean;
  backIconOnly?: boolean;
  hasRightButton?: boolean;
  onClickRight?: () => void;
};

export default function CustomHeader({ title, hasBackButton = false, backIconOnly = false, hasRightButton = false, onClickRight, }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {hasBackButton && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="white"
            style={{ marginTop: 2 }}
          />
          {!backIconOnly && <Text style={styles.backText}>返回</Text>}
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {hasRightButton && onClickRight && (
        <TouchableOpacity onPress={onClickRight} style={styles.rightBtn}>
          <Text style={styles.backText}>完成</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    backgroundColor: "#01326D",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 14,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontFamily: "NotoSansTC-Bold",
  },
  backBtn: {
    position: "absolute",
    left: 8,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 0,
    fontSize: 16,
  },

  rightBtn: {
    position: "absolute",
    right: 16,
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});