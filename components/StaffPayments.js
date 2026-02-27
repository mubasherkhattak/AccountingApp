import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';
import { getStaff, addStaffPayment, getStaffPayments } from '../database/database';

export default function StaffPayments() {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [payments, setPayments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [showStaffPicker, setShowStaffPicker] = useState(false);

    // Form states
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = () => {
        getStaff((data) => {
            setStaffList(data);
        });
    };

    const loadPayments = (staffId) => {
        getStaffPayments(staffId, (data) => {
            setPayments(data);
        });
    };

    const handleStaffSelect = (staff) => {
        setSelectedStaff(staff);
        setShowStaffPicker(false);
        loadPayments(staff.id);
    };

    const handleAddPayment = () => {
        if (!selectedStaff || !amount) {
            Alert.alert('Error', 'Please select a staff member and enter an amount.');
            return;
        }

        addStaffPayment(selectedStaff.id, parseFloat(amount), date, remarks, (success) => {
            if (success) {
                Alert.alert('Success', 'Payment recorded successfully');
                setAmount('');
                setRemarks('');
                setModalVisible(false);
                loadPayments(selectedStaff.id);
            }
        });
    };

    const renderPaymentItem = ({ item }) => (
        <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
                <Text style={styles.paymentDate}>{item.date}</Text>
                <Text style={styles.paymentAmount}>Rs. {item.amount.toLocaleString()}</Text>
            </View>
            {item.remarks ? <Text style={styles.paymentRemarks}>{item.remarks}</Text> : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Staff Member</Text>
            <TouchableOpacity
                style={styles.staffSelector}
                onPress={() => setShowStaffPicker(true)}
            >
                <Text style={[styles.staffName, !selectedStaff && { color: colors.textLight }]}>
                    {selectedStaff ? selectedStaff.name : 'Choose an employee...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textLight} />
            </TouchableOpacity>

            {selectedStaff && (
                <View style={styles.historyContainer}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>Payment History</Text>
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="add-circle" size={24} color={colors.primary} />
                            <Text style={styles.addBtnText}>Add Payment</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={payments}
                        renderItem={renderPaymentItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No payment records found</Text>
                            </View>
                        }
                    />
                </View>
            )}

            {/* Staff Picker Modal */}
            <Modal visible={showStaffPicker} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Staff</Text>
                            <TouchableOpacity onPress={() => setShowStaffPicker(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={staffList}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pickerItem}
                                    onPress={() => handleStaffSelect(item)}
                                >
                                    <View style={styles.pickerAvatar}>
                                        <Text style={styles.pickerAvatarText}>{item.name[0]}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.pickerName}>{item.name}</Text>
                                        <Text style={styles.pickerRole}>{item.role}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Add Payment Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentForm}>
                        <Text style={styles.formTitle}>Record Payment</Text>
                        <Text style={styles.formSubtitle}>For {selectedStaff?.name}</Text>

                        <Text style={styles.inputLabel}>Amount *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <Text style={styles.inputLabel}>Date *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={date}
                            onChangeText={setDate}
                        />

                        <Text style={styles.inputLabel}>Remarks</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. Monthly Salary, Advance"
                            multiline
                            numberOfLines={3}
                            value={remarks}
                            onChangeText={setRemarks}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.submitBtnWrapper}
                                onPress={handleAddPayment}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.secondary]}
                                    style={styles.submitBtn}
                                >
                                    <Text style={styles.submitBtnText}>Save</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 8,
        fontWeight: '500',
    },
    staffSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        elevation: 2,
        marginBottom: 25,
    },
    staffName: {
        fontSize: 16,
        color: colors.text,
        fontWeight: 'bold',
    },
    historyContainer: {
        flex: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addBtnText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    list: {
        paddingBottom: 20,
    },
    paymentCard: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        elevation: 1,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    paymentDate: {
        fontSize: 14,
        color: colors.textLight,
        fontWeight: '500',
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    paymentRemarks: {
        fontSize: 13,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: colors.textLight,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: '70%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    pickerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    pickerAvatarText: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    pickerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    pickerRole: {
        fontSize: 12,
        color: colors.textLight,
    },
    paymentForm: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        color: colors.textLight,
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        color: colors.text,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cancelBtnText: {
        color: colors.textLight,
        fontWeight: 'bold',
    },
    submitBtnWrapper: {
        flex: 2,
    },
    submitBtn: {
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    submitBtnText: {
        color: colors.white,
        fontWeight: 'bold',
    }
});
