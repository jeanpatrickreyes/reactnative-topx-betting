import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function EditProfileScreen() {
  const [balance, setBalance] = useState('');
  const [account, setAccount] = useState('');
  const router = useRouter();

  // Load profile data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        try {
          const balanceFromStorage = await AsyncStorage.getItem('balance');
          const accountFromStorage = await AsyncStorage.getItem('account');
          if (balanceFromStorage) {
            setBalance(balanceFromStorage);
          }
          if (accountFromStorage) {
            setAccount(accountFromStorage);
          }
        } catch (error) {
          console.error('Failed to load data', error);
        }
      };
      
      loadProfileData();
    }, [])
  );

  // Save balance and account number to AsyncStorage
  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem('balance', balance);
      await AsyncStorage.setItem('account', account);
      Alert.alert('成功', `餘額: ${balance}\n帳戶: ${account}`);
      router.back(); // 🔥 Navigate back to Profile page (which will now refresh)
    } catch (error) {
      Alert.alert('錯誤', '無法保存數據');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>我們重視您的回饋。每則評論都很重要！</Text>
      <View style={styles.form}>
        <Text style={styles.label}>$$</Text>
        <TextInput 
          style={styles.input}
          placeholder="輸入您的餘額"
          value={balance}
          onChangeText={setBalance}
          keyboardType="numeric"
        />

        <Text style={styles.label}>投注戶口號碼</Text>
        <TextInput 
          style={styles.input}
          placeholder="輸入您的帳戶"
          value={account}
          onChangeText={setAccount}
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
          <Text style={styles.buttonText}>提交</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#eee', flex: 1, padding: 20 },
  description: { fontSize: 16, color: '#333', marginBottom: 10 },
  form: { padding: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submit: {
    backgroundColor: '#888',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
