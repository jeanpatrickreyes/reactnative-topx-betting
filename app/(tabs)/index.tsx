import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.page}>
      <Text>This is Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    position:'relative',
    flex: 1,
    minHeight:'100%',
    backgroundColor: '#eee',
  }
});
