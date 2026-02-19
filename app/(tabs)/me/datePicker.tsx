import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// Set RTL to false for Chinese layout
I18nManager.forceRTL(false);

export default function DatePickerScreen() {
    const router = useRouter();
    const today = new Date();
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const [formattedDateRange, setFormattedDateRange] = useState(""); 
    const [calendarKey, setCalendarKey] = useState(0);

    // Format the date as DD/MM/YYYY
    const formatDate = (date: Date | null) =>
        date
            ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}/${date.getFullYear()}`
            : '';
    
    // Get today's date formatted
    const todayDate = formatDate(today);

    // Effect to update formattedDateRange when selected dates change
    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            setFormattedDateRange(`${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`);
        } else if (selectedStartDate) {
            setFormattedDateRange(formatDate(selectedStartDate)); // Show selected single date
        } else {
            setFormattedDateRange(todayDate); // Show today's date if nothing is selected
        }
    }, [selectedStartDate, selectedEndDate]);


    return (
        <>
            <View style={styles.headerTop}></View>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <View style={styles.topText}>
                    <Text style={styles.dateText}>{formattedDateRange}</Text>
                    <Text style={styles.introText}>每次最多可以搜尋過去30天內其中8天。(以香港時間計算)</Text>
                </View>
                <View style={styles.calendarWrapper}>
                <CalendarPicker
                    key={calendarKey}
                    allowRangeSelection={true}
                    allowBackwardRangeSelect={true}
                    showDayStragglers={true}
                    todayBackgroundColor="transparent"
                    todayTextStyle={styles.todayTextDark}
                    todayStyle={styles.todayOutline}
                    selectedDayColor="#01326D"
                    selectedDayTextColor="#01326D"
                    selectedDayStyle={styles.selectedDayOutline}
                    selectedDayTextStyle={styles.selectedDayTextDark}
                    selectedRangeStartStyle={styles.selectedRangeStartEnd}
                    selectedRangeEndStyle={styles.selectedRangeStartEnd}
                    selectedRangeStartTextStyle={styles.selectedRangeStartEndText}
                    selectedRangeEndTextStyle={styles.selectedRangeStartEndText}
                    selectedRangeMiddleTextStyle={styles.selectedRangeMiddleText}
                    selectedRangeStyle={styles.selectedRangeMiddle}
                    minDate={new Date(2000, 0, 1)}
                    maxDate={today}
                    previousComponent={<Ionicons name="chevron-back" size={16} style={styles.previousIcon} />}
                    nextComponent={<Ionicons name="chevron-forward" size={16} style={styles.nextIcon} />}
                    maxRangeDuration={8}
                    textStyle={{
                        color: '#000',
                        fontSize: 20,
                        fontWeight: '400',
                    }}
                    disabledDatesTextStyle={{
                        color: '#bbb',
                        fontSize: 20,
                        fontWeight: '400',
                    }}
                    weekdays={['日', '一', '二', '三', '四', '五', '六']}
                    months={[
                        '1月', '2月', '3月', '4月', '5月', '6月',
                        '7月', '8月', '9月', '10月', '11月', '12月'
                    ]}
                    dayLabelsWrapper={styles.dayLabelsWrapper}
                    onDateChange={(date: Date, type: string) => {
                        if (type === 'START_DATE') {
                            setSelectedStartDate(date);
                            setSelectedEndDate(null); // Reset end date for single date selection
                        } else if (type === 'END_DATE') {
                            setSelectedEndDate(date);
                        }
                    }}
                />
                </View>
                <View style={styles.horizonLine}></View>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setSelectedStartDate(null); // Reset start date
                            setSelectedEndDate(null); // Reset end date
                            setFormattedDateRange(todayDate); // Reset the displayed date range to today's date
                            setCalendarKey(prevKey => prevKey + 1);
                        }}
                    >
                        <Text style={styles.resetButtonText}>重置</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.okButton}
                        onPress={() => {
                            router.back(); // Navigate back to the previous screen
                            router.setParams({ selectedDateRange: formattedDateRange }); // Pass the selected date range
                        }}
                    >
                        <Text style={styles.okButtonText}>確定</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    headerTop: { height: 8, backgroundColor: '#01326D' },
    container: { padding: 15, backgroundColor: 'white', height: '100%' },
    topText: { marginBottom: 40 },
    dateText: {
        fontFamily: 'NotoSansTC-Medium',
        lineHeight: 24,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#01326D',
    },
    introText: { fontFamily: 'NotoSansTC-Regular', lineHeight: 20, fontSize: 14, color: '#666', marginTop: 5 },
    todayTextDark: { color: '#01326D' },
    todayOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#01326D',
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDayOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#01326D',
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedDayTextDark: { color: '#01326D' },
    selectedRangeStartEnd: {
        backgroundColor: '#01326D',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRangeStartEndText: { color: '#fff' },
    selectedRangeMiddle: {
        backgroundColor: '#B8D4E8',
        // alignSelf: 'stretch',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRangeMiddleText: { color: '#5B8FB9' },
    calendarWrapper: { marginTop: 8 },
    dayLabelsWrapper: {
        width: '100%',
        paddingHorizontal: 0,
        alignSelf: 'center',
        justifyContent: 'space-around',
    },
    horizonLine: { marginTop: 24, borderTopWidth: 1, borderTopColor: '#bbb' },
    buttons: { marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    resetButton: { width: '30%', borderColor: '#01326D', borderWidth: 1, borderRadius: 21, marginTop: 32, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 42 },
    okButton: { width: '66%', backgroundColor: '#01326D', borderRadius: 20, marginTop: 32, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    resetButtonText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 16, color: '#01326D', },
    okButtonText: { fontFamily: 'NotoSansTC-Medium', lineHeight: 20, fontSize: 16, color: '#fff', },
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
        paddingHorizontal: 0,
        paddingBottom: 32
    },
    tabContainer: {
        alignItems: 'center',
        marginVertical: 3,
        flex: 1,
    },
    icon: {
        width: 60,
        height: 28,
        resizeMode: 'contain',
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
    previousIcon: {
        fontWeight: 'bold'
    },
    nextIcon: {
        fontWeight: 'bold'
    }
});
