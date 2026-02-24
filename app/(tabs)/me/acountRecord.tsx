import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import CustomHeader from '@/components/CustomHeader';

type AccountRow = {
    key: string;
    value: string;
    showShare?: string;
};

type RouteParams = {
    currentTime: string;
    account: string;
    balance: string;
};

const TAB_BAR_HEIGHT = 80;

export default function AccountRecordScreen() {
    const router = useRouter();
    const route = useRoute<RouteProp<{ params: RouteParams }>>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const selectedDateRange = params.selectedDateRange as string | undefined;
    const routeParams = route.params ?? {};
    const currentTime = (routeParams.currentTime ?? '').toString();
    const account = (routeParams.account ?? '').toString();
    const balance = (routeParams.balance ?? '').toString();
    
    const [fontsLoaded] = useFonts({
        'NotoSansTC-Regular': require('../../../assets/fonts/NotoSansTC-Regular.ttf'),
        'NotoSansTC-Bold': require('../../../assets/fonts/NotoSansTC-Bold.ttf'),
        'NotoSansTC-Medium': require('../../../assets/fonts/NotoSansTC-Medium.ttf'),
    });

    const [selectedButton, setSelectedButton] = useState<string | null>('今日');
    const [dateRange, setDateRange] = useState('');
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);

    useEffect(() => {
        if (isCompleteScreen) {
            navigation.setOptions({
                header: () => (
                    <CustomHeader
                        title="戶口紀錄"
                        hasBackButton={false}
                        hasRightButton={true}
                        onClickRight={() => setIsCompleteScreen(false)}
                    />
                ),
            });
        } else {
            navigation.setOptions({
                header: () => (
                    <CustomHeader
                        title="戶口紀錄"
                        hasBackButton={true}
                        backIconOnly={false}
                    />
                ),
            });
        }
    }, [isCompleteScreen, navigation]);

    // Function to format date with leading zero
    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');  // Ensures 2-digit day
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Ensures 2-digit month
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Function to format current time as "DD-MM-YYYY HH:mm"
    const formatCurrentTime = (currentTime: string) => {
        const [datePart, timePart] = currentTime.split(' '); // Separate date and time
        const [day, month, year] = datePart.split('/').map(num => num.padStart(2, '0')); // Ensure 2-digit format

        return `${day}-${month}-${year} ${timePart}`;
    };

    // Function to update date range based on button selection
    const updateDateRange = (button: string) => {
        const currentDate = new Date();
        let startDate: Date;

        switch (button) {
            case '今日':
                startDate = currentDate;
                setDateRange(`${formatDate(startDate)} - ${formatDate(startDate)}`);
                break;
            case '最近2日':
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 1);
                setDateRange(`${formatDate(startDate)} - ${formatDate(currentDate)}`);
                break;
            case '最近8日':
                startDate = new Date(currentDate);
                startDate.setDate(currentDate.getDate() - 7);
                setDateRange(`${formatDate(startDate)} - ${formatDate(currentDate)}`);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        updateDateRange(selectedButton!); // Initialize date range
    }, [selectedButton]);

    useEffect(() => {
        if (selectedDateRange) {
            setDateRange(selectedDateRange); // Use the range from DatePicker as-is (e.g. "09/02/2026 - 12/02/2026")
            setSelectedButton(null); // Reset selected button to remove styling
        }
    }, [selectedDateRange]);

    const handlePress = (button: string) => {
        setSelectedButton(button);
        updateDateRange(button);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(null);
    const [isTableScrolled, setIsTableScrolled] = useState(false);
    const [showShareButton, setShowShareButton] = useState("No");
    const [newRecord, setNewRecord] = useState({
        參考編號: '',
        日期時間: '',
        投注類別: '',
        細節: '',
        支出: '',
        存入: '',
        showShare: "No",
    });

    const openEditModal = (recordIndex: number) => {
        const acountdata = acountDatas[recordIndex];
        const recordMap: Record<string, string> = {};
        acountdata.forEach((row) => {
            if (row.key === '參考編號') recordMap['參考編號'] = row.value;
            else if (row.key === '日期 / 時間') recordMap['日期時間'] = row.value;
            else if (row.key === '投注類別') recordMap['投注類別'] = row.value;
            else if (row.key === '細節') recordMap['細節'] = row.value;
            else if (row.key === '支出') recordMap['支出'] = row.value;
            else if (row.key === '存入') recordMap['存入'] = row.value;
        });
        const refRow = acountdata.find((r) => r.key === '參考編號');
        setNewRecord({
            參考編號: recordMap['參考編號'] ?? '',
            日期時間: recordMap['日期時間'] ?? '',
            投注類別: recordMap['投注類別'] ?? '',
            細節: recordMap['細節'] ?? '',
            支出: recordMap['支出'] ?? '',
            存入: recordMap['存入'] ?? '',
            showShare: (refRow as any)?.showShare === 'Yes' ? 'Yes' : 'No',
        });
        setShowShareButton((refRow as any)?.showShare === 'Yes' ? 'Yes' : 'No');
        setEditingRecordIndex(recordIndex);
        setIsModalVisible(true);
    };

    const openAddModal = () => {
        setNewRecord({ 參考編號: '', 日期時間: '', 投注類別: '', 細節: '', 支出: '', 存入: '', showShare: "No" });
        setShowShareButton("No");
        setEditingRecordIndex(null);
        setIsModalVisible(true);
    };

    const [acountDatas, setAcountDatas] = useState<AccountRow[][]>([
        [
            { key: '參考編號', value: '-' },
            { key: '日期 / 時間', value: '-' },
            { key: '投注類別', value: '-' },
            { key: '細節', value: '2026年2月19日14:40之戶口結餘: $9.40' },
            { key: '支出', value: '-' },
            { key: '存入', value: '-' },
        ],
        [
            { key: '參考編號', value: '5606' },
            { key: '日期 / 時間', value: '19-02-2026 14:40' },
            { key: '投注類別', value: '-' },
            { key: '細節', value: '現金存款(24CDC 2D3A5 EF409A5C7)' },
            { key: '支出', value: '-' },
            { key: '存入', value: '$500.00' },
        ],
        [
            { key: '參考編號', value: '5608', showShare: 'Yes' },
            { key: '日期 / 時間', value: '19-02-2026 14:40' },
            { key: '投注類別', value: '-' },
            { key: '細節', value: '現金存款' },
            { key: '支出', value: '-' },
            { key: '存入', value: '$500.00' },
        ],
    ]);

    const handleSaveRecord = () => {
        const updatedEntry: AccountRow[] = [
            { key: '參考編號', value: newRecord.參考編號 || '-', showShare: showShareButton },
            { key: '日期 / 時間', value: newRecord.日期時間 || '-' },
            { key: '投注類別', value: newRecord.投注類別 || '-' },
            { key: '細節', value: newRecord.細節 || '-' },
            { key: '支出', value: newRecord.支出 || '-' },
            { key: '存入', value: newRecord.存入 || '-' },
        ];

        if (editingRecordIndex !== null) {
            const next = [...acountDatas];
            next[editingRecordIndex] = updatedEntry;
            setAcountDatas(next);
        } else {
            setAcountDatas([...acountDatas, updatedEntry]);
        }
        setIsModalVisible(false);
        setNewRecord({ 參考編號: '', 日期時間: '', 投注類別: '', 細節: '', 支出: '', 存入: '', showShare: "No" });
        setShowShareButton("No");
        setEditingRecordIndex(null);
    };

    const handleDeleteRecord = () => {
        if (editingRecordIndex === null) return;
        const next = acountDatas.filter((_, i) => i !== editingRecordIndex);
        setAcountDatas(next);
        setIsModalVisible(false);
        setNewRecord({ 參考編號: '', 日期時間: '', 投注類別: '', 細節: '', 支出: '', 存入: '', showShare: "No" });
        setShowShareButton("No");
        setEditingRecordIndex(null);
    };

    const [isTradeTypePickerVisible, setIsTradeTypePickerVisible] = useState(false);
    const [selectedTradeType, setSelectedTradeType] = useState("所有");

    const [isTypePickerVisible, setIsTypePickerVisible] = useState(false);
    const [selectedType, setSelectedType] = useState("所有");


    return (
        <View style={styles.entireContainer}>
            <View style={styles.topContainer}>
                <Text style={styles.text}>時間: {currentTime ? formatCurrentTime(currentTime) : '-'}</Text>
                <Text style={styles.text}>投注戶口號碼: {account || '-'}</Text>
                <Text style={styles.text}>結餘: ${balance ? balance : '-'}</Text>
            </View>
            { !isCompleteScreen &&
                <LinearGradient
                    colors={["#ccc", "#eee"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.gradientBox}
                />
            }
            {!isCompleteScreen ? (
                <View style={styles.bottomContainer}>
                    <Text style={styles.destext}>每次最多可以搜尋過去30天內其中8天。 (以香港時間計算）</Text>
                    <View style={styles.dateBtns}>
                        {['今日', '最近2日', '最近8日'].map((button) => (
                            <TouchableOpacity
                                key={button}
                                style={[styles.dateBtn, selectedButton === button && styles.selectedDateBtn]}
                                onPress={() => handlePress(button)}
                            >
                                <Text style={[styles.dateBtnText, selectedButton === button && styles.selectedDateBtnText]}>
                                    {button}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.boxBtn} onPress={() => router.push("/(tabs)/me/datePicker")}>
                        <Text style={styles.boxBtnLeftText}>時段</Text>
                        <Text style={styles.boxBtnRightText}>{dateRange}</Text>
                    </TouchableOpacity>
                    <View style={styles.horizonLine}></View>
                    <TouchableOpacity style={[styles.boxBtn, { marginBottom: 14 }]} onPress={() => setIsTradeTypePickerVisible(true)}>
                        <Text style={styles.boxBtnLeftText}>交易種類</Text>
                        <Text style={styles.boxBtnRightText}>{selectedTradeType || ''}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxBtn} onPress={() => setIsTypePickerVisible(true)}>
                        <Text style={styles.boxBtnLeftText}>顯示種類</Text>
                        <Text style={styles.boxBtnRightText}>{selectedType || ''}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.send} onPress={() => setIsCompleteScreen(true)}>
                        <Text style={styles.sendText}>傳送</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={isTradeTypePickerVisible}
                        transparent
                        animationType="none"
                        onRequestClose={() => setIsTradeTypePickerVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 8, paddingBottom: 40 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth:0.8, borderBottomColor: '#C0C0C0' }}>
                                    <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', fontFamily: 'NotoSansTC-Bold', marginBottom:14, marginTop:12 }}>交易種類</Text>
                                    <TouchableOpacity onPress={() => setIsTradeTypePickerVisible(false)} style={{ position: 'absolute', right: 0, padding: 16,}}>
                                        <MaterialIcons name="close" size={24} color="black" style={{fontWeight: 'medium'}} />
                                    </TouchableOpacity>
                                </View>
                                <Picker
                                    selectedValue={selectedTradeType}
                                    onValueChange={(itemValue) => setSelectedTradeType(itemValue)}
                                    style={{ width: '100%', marginVertical:14}}
                                    itemStyle={{ fontFamily: 'NotoSansTC-Bold', fontSize: 16}}
                                >
                                    <Picker.Item label=" " value="" color='#000' />
                                    <Picker.Item label="所有" value="所有" color='#000' />
                                    <Picker.Item label="賽馬" value="賽馬" color='#000'  />
                                    <Picker.Item label="足球" value="足球" color='#000' />
                                    <Picker.Item label="六合彩" value="六合彩" color='#000' />
                                </Picker>
                                <TouchableOpacity
                                    style={{backgroundColor: "#002460", borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => setIsTradeTypePickerVisible(false)}
                                >
                                    <Text style={{ color: "white", fontSize: 16, fontFamily: 'NotoSansTC-Medium'  }}>完成</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal
                        visible={isTypePickerVisible}
                        transparent
                        animationType="none"
                        onRequestClose={() => setIsTypePickerVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 8, paddingBottom: 40 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth:0.8, borderBottomColor: '#C0C0C0' }}>
                                    <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center', fontFamily: 'NotoSansTC-Bold', marginBottom:14, marginTop:12 }}>顯示種類</Text>
                                    <TouchableOpacity onPress={() => setIsTypePickerVisible(false)} style={{ position: 'absolute', right: 0, padding: 16,}}>
                                        <MaterialIcons name="close" size={24} color="black" style={{fontWeight: 'medium'}} />
                                    </TouchableOpacity>
                                </View>
                                <Picker
                                    selectedValue={selectedType}
                                    onValueChange={(itemValue) => setSelectedType(itemValue)}
                                    style={{ width: '100%', marginVertical:14 }}
                                    itemStyle={{ fontFamily: 'NotoSansTC-Bold', fontSize: 16}}
                                >
                                    <Picker.Item label=" " value="" color='#000' />
                                    <Picker.Item label="所有" value="所有" color='#000' />
                                    <Picker.Item label="已派彩 / 已退款 / 已扣扣之交易" value="已派彩 / 已退款 / 已扣扣之交易"  color='#000'  />
                                </Picker>
                                <TouchableOpacity
                                    style={{backgroundColor: "#002460", borderRadius: 21, height: 42, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => setIsTypePickerVisible(false)}
                                >
                                    <Text style={{ color: "white", fontSize: 16, fontFamily: 'NotoSansTC-Medium'  }}>完成</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>
            ) : (
                <>
                    <View style={[styles.comDescriptionBox, isTableScrolled && styles.comDescriptionBoxScrolled]}>
                        <Text style={styles.summaryText}>搜尋時段: {dateRange.replace(' - ', ' 至 ')}</Text>
                    </View>
                    <LinearGradient
                        colors={["#ccc", "#eee"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={[styles.gradientBox, { height: isTableScrolled ? 0 : 5 }]}
                    />

                    <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
                        <MaterialIcons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.comContent}>
                        <ScrollView
                            onScroll={(e) => { const y = e.nativeEvent.contentOffset.y; setIsTableScrolled(y > 8); }}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: 0, paddingBottom: Math.max(320, TAB_BAR_HEIGHT + insets.bottom + 100) }}
                            showsVerticalScrollIndicator={false}
                        >
                            {acountDatas.map((acountdata, index) => (
                                <View key={index} style={styles.tableContainer}>
                                    {acountdata.map((row, rowIndex) => {
                                    const isRefRow = rowIndex === 0 && row.key === "參考編號";
                                    const RowWrapper = isRefRow ? TouchableOpacity : View;
                                    const rowWrapperProps = isRefRow ? {
                                        onPress: () => openEditModal(index),
                                        activeOpacity: 0.7,
                                    } : {};
                                    return (
                                    <RowWrapper key={rowIndex} style={[styles.row, rowIndex === 0 && styles.headerRow]} {...rowWrapperProps}>
                                        {rowIndex === 0 ? (
                                            <Text style={styles.headerText}>{row.key}</Text>
                                        ) : (
                                            <View style={styles.cellLabelWrapper}>
                                                <Text style={styles.cellText}>{row.key}</Text>
                                            </View>
                                        )}
                                        {rowIndex === 0 && row.key === "參考編號" && row?.showShare === "Yes" ? (
                                            <View style={styles.headerRightGroup}>
                                                <Text style={[styles.headerValueText, styles.headerValueTextAlign]}>{row.value}</Text>
                                                <View style={styles.headerRightSpacer} />
                                                <TouchableOpacity style={styles.shareButton}>
                                                    <Svg width="20" height="20" viewBox="0 0 40 40" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                        <Circle cx="30" cy="10" r="5" />
                                                        <Circle cx="10" cy="20" r="5" />
                                                        <Circle cx="30" cy="30" r="5" />
                                                        <Line x1="25" y1="10" x2="15" y2="20" />
                                                        <Line x1="25" y1="30" x2="15" y2="20" />
                                                    </Svg>
                                                    <Text style={styles.shareText}>分享注項</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <Text style={rowIndex === 0 ? styles.headerValueText : styles.cellValueText}>{row.value}</Text>
                                        )}
                                    </RowWrapper>
                                    );
                                    })}
                                </View>
                            ))}
                        </ScrollView>
                        
                        
                        <Modal visible={isModalVisible} transparent={true} animationType="none">
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled">
                                        <Text style={styles.modalTitle}>{editingRecordIndex !== null ? '編輯記錄' : '新增記錄'}</Text>
                                        {Object.keys(newRecord).map((key, index) => (
                                            key !== "showShare" && (
                                                <TextInput
                                                    key={index}
                                                    style={styles.input}
                                                    placeholder={key}
                                                    placeholderTextColor="#888"
                                                    value={newRecord[key as keyof typeof newRecord]}
                                                    onChangeText={(text) => setNewRecord({ ...newRecord, [key]: text })}
                                                    multiline={true}
                                                    numberOfLines={4}
                                                    textAlignVertical="top"
                                                    returnKeyType="default"
                                                />
                                            )
                                        ))}
                                        <View style={styles.modalShareSection}>
                                            <Text style={styles.label}>是否顯示 分享注項?</Text>
                                            <View style={styles.shareOptionRow}>
                                                <TouchableOpacity
                                                    style={[styles.shareOptionBtn, showShareButton === 'No' && styles.shareOptionBtnSelected]}
                                                    onPress={() => setShowShareButton('No')}
                                                >
                                                    <Text style={[styles.shareOptionText, showShareButton === 'No' && styles.shareOptionTextSelected]}>否</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.shareOptionBtn, showShareButton === 'Yes' && styles.shareOptionBtnSelected]}
                                                    onPress={() => setShowShareButton('Yes')}
                                                >
                                                    <Text style={[styles.shareOptionText, showShareButton === 'Yes' && styles.shareOptionTextSelected]}>是</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </ScrollView>
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity style={styles.modalButton} onPress={() => { setIsModalVisible(false); setEditingRecordIndex(null); }}>
                                            <Text style={styles.modalButtonText}>取消</Text>
                                        </TouchableOpacity>
                                        {editingRecordIndex !== null && (
                                            <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteRecord}>
                                                <Text style={styles.modalDeleteButtonText}>刪除</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity style={styles.modalButton} onPress={handleSaveRecord}>
                                            <Text style={styles.modalButtonText}>確定</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    entireContainer: {height: '100%', position: 'relative', backgroundColor: '#F2F2F2'},
    topContainer: { backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 11, paddingBottom: 11},
    text: { fontFamily: 'NotoSansTC-Medium', lineHeight: 19, fontSize: 15, color: 'black' },
    summaryText: { fontFamily: 'NotoSansTC-Medium', fontWeight: '600', lineHeight: 19, fontSize: 15, color: 'black' },
    destext: { fontFamily: 'NotoSansTC-Regular', fontSize: 15, color: 'black', marginTop:2 },
    bottomContainer: { backgroundColor: '#F2F2F2', paddingHorizontal: 12,  },
    dateBtns: { flexDirection: 'row', alignItems: 'center', marginTop: 17, marginBottom: 12, gap: 10 },
    dateBtn: { borderColor: '#002460', borderWidth: 1, borderRadius: 20, paddingHorizontal: 18, paddingTop: 4, paddingBottom:6, backgroundColor: 'white' },
    dateBtnText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 15, color: '#002460' },
    selectedDateBtn: { backgroundColor: '#002460' },
    selectedDateBtnText: { color: 'white' },
    boxBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', paddingTop: 11, paddingBottom: 11, paddingHorizontal: 15, borderColor: '#A0A0A0', borderWidth: 1.2, borderRadius: 5 },
    boxBtnLeftText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 24, fontSize: 19, color: 'black' },
    boxBtnRightText: { fontFamily: 'NotoSansTC-bold', lineHeight: 24, fontWeight: 'bold', fontSize: 19, color: 'black' },
    horizonLine: { borderBottomWidth: 0.5, borderColor: "#A0A0A0", height: 26, marginTop: 3, marginBottom: 29 },
    send: { width: '100%', backgroundColor: '#002460', borderRadius: 20, marginTop: 28, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent:'center'}, 
    sendText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 18, color: '#fff' },
    completeBtnText: { fontFamily: 'NotoSansTC-bold', fontSize: 14, color: 'white', fontWeight: 'bold', marginTop: 5 },
    backBtn: { flexDirection: 'row', alignItems: "center", },
    backText: { color: 'white', fontWeight: 'bold', marginTop: 5, fontSize: 16 },
    comDescriptionBox: { backgroundColor: '#F2F2F2', paddingHorizontal: 15, paddingTop: 8, paddingBottom: 8 },
    comDescriptionBoxScrolled: { paddingBottom: 0 },
    comContent: { backgroundColor: '#F2F2F2', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12 },
    tableContainer: { marginBottom: 10, backgroundColor: '#F2F2F2', borderRadius: 10, overflow: 'hidden', width: '100%', maxWidth: 420, alignSelf: 'center', borderWidth: 1, borderColor: '#ddd' },
    row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#aaa' },
    headerRow: { backgroundColor: '#888', minHeight: 44, paddingHorizontal: 15, alignItems: 'center' },
    headerText: { width: 130, fontFamily: 'NotoSansTC-Medium', fontWeight: '600', fontSize: 20, lineHeight: 24, color: '#fff' },
    headerValueText: { flex: 1, flexWrap: 'wrap', paddingLeft: 15, marginRight: 16, fontFamily: 'NotoSansTC-Medium', lineHeight: 24, fontSize: 20, color: '#fff' },
    headerRightGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, gap: 8 },
    headerValueTextAlign: { flex: 0, paddingLeft: 0, marginRight: 0 },
    headerRightSpacer: { flex: 1 },
    cellLabelWrapper: { width: 130, borderRightColor: '#aaa', borderRightWidth: 1, alignSelf: 'stretch', paddingVertical: 6 },
    cellText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 18, color: 'black' },
    cellValueText: { paddingVertical: 6, flex: 1, flexWrap: 'wrap', paddingLeft: 15, fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 18, color: 'black' },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700', // Gold/yellow color
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3, // For Android shadow
    },
    shareIcon: {
        marginRight: 8,
    },
    shareText: {
        fontFamily: 'NotoSansTC-Medium',
        fontSize: 16,
        color: 'black',
        fontWeight: '600',
        includeFontPadding: false,
        marginBottom: 4,
        marginLeft: 4,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: 300, maxHeight: '85%', backgroundColor: 'white', borderRadius: 10, overflow: 'hidden' },
    modalScroll: { maxHeight: '100%' },
    modalScrollContent: { padding: 20, paddingBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
    modalShareSection: { marginBottom: 8 },
    shareOptionRow: { flexDirection: 'row', marginTop: 4, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
    shareOptionBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff', alignItems: 'center' },
    shareOptionBtnSelected: { backgroundColor: '#002460' },
    shareOptionText: { fontSize: 16, color: '#333' },
    shareOptionTextSelected: { color: '#fff' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#eee' },
    modalButton: { flex: 1, padding: 10, backgroundColor: '#002460', borderRadius: 5, alignItems: 'center' },
    modalButtonText: { color: 'white' },
    modalDeleteButton: { flex: 1, padding: 10, backgroundColor: '#E53935', borderRadius: 5, alignItems: 'center' },
    modalDeleteButtonText: { color: 'white' },
    bottomTabs: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        width: '100%'
    },
    bottomTabAlign: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 32
    },
    tabContainer: {
        alignItems: 'center',
        marginVertical: 3,
        flex: 1,
    },
    icon: {
        width: 30, // Reduced to avoid overlap
        height: 30,
        resizeMode: "contain",
    },
    focusedTab: {
        backgroundColor: '#E1EBEE',
        borderRadius: 20,
    },
    tabText: {
        fontSize: 12,
        color: 'black',
        fontFamily: 'NotoSansTC-Regular',
        fontWeight: 'bold',
    },
    gradientBox: {
        height: 5,
        width: "100%",
    },
    picker: { height: 50, width: "100%", marginBottom: 10 },
    label: { fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 5 },
});
