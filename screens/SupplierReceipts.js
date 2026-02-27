import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { getSuppliers, addSupplierReceipt, getSupplierReceipts, deleteSupplierReceipt } from '../database/database';

export default function SupplierReceiptsContent() {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [amount, setAmount] = useState('');
    const [receiptNo, setReceiptNo] = useState('');
    const [remarks, setRemarks] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = () => {
        getSuppliers((data) => {
            setSuppliers(data);
        });
    };

    const loadReceipts = (supplierId) => {
        setLoading(true);
        getSupplierReceipts(supplierId, (data) => {
            setReceipts(data);
            setLoading(false);
        });
    };

    const handleSelectSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        loadReceipts(supplier.id);
    };

    const handleSaveReceipt = () => {
        if (!selectedSupplier) {
            Alert.alert('Error', 'Please select a supplier first.');
            return;
        }
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }
        if (!receiptNo) {
            Alert.alert('Error', 'Please enter a Receipt / Invoice No.');
            return;
        }
        if (!remarks) {
            Alert.alert('Error', 'Please enter remarks.');
            return;
        }

        const newAmount = parseFloat(amount);
        const currentTotal = receipts.reduce((sum, item) => sum + item.amount, 0);

        if (currentTotal + newAmount > selectedSupplier.salary) {
            Alert.alert(
                'Limit Exceeded',
                `Your Bill amount is more than your total amount. Please check the amount allocated to ${selectedSupplier.name}.`
            );
            return;
        }

        const date = new Date().toISOString();

        addSupplierReceipt(selectedSupplier.id, newAmount, date, remarks, receiptNo, (success) => {
            if (success) {
                Alert.alert('Success', 'Receipt recorded successfully!');
                setAmount('');
                setReceiptNo('');
                setRemarks('');
                loadReceipts(selectedSupplier.id);
            } else {
                Alert.alert('Error', 'Failed to record receipt.');
            }
        });
    };

    const handleDeleteReceipt = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this receipt?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteSupplierReceipt(id, (success) => {
                            if (success && selectedSupplier) {
                                loadReceipts(selectedSupplier.id);
                            }
                        });
                    }
                }
            ]
        );
    };

    const renderSupplierItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.supplierChip,
                selectedSupplier?.id === item.id && styles.selectedSupplierChip
            ]}
            onPress={() => handleSelectSupplier(item)}
        >
            <Text
                style={[
                    styles.supplierChipText,
                    selectedSupplier?.id === item.id && styles.selectedSupplierChipText
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Supplier Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Supplier</Text>
                <FlatList
                    horizontal
                    data={suppliers}
                    renderItem={renderSupplierItem}
                    keyExtractor={item => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.supplierList}
                    ListEmptyComponent={<Text style={styles.emptyText}>No suppliers found.</Text>}
                />
            </View>

            {selectedSupplier ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Receipt Form */}
                        <View style={styles.formCard}>
                            <Text style={styles.cardTitle}>New Receipt from {selectedSupplier.name}</Text>

                            <Text style={styles.label}>Bill Amount (Rs)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Amount"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            <Text style={styles.label}>Receipt / Invoice No.</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Receipt No"
                                value={receiptNo}
                                onChangeText={setReceiptNo}
                            />

                            <Text style={styles.label}>Remarks</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Item details, etc."
                                value={remarks}
                                onChangeText={setRemarks}
                            />

                            <TouchableOpacity onPress={handleSaveReceipt}>
                                <LinearGradient
                                    colors={[colors.primary, colors.secondary]}
                                    style={styles.saveButton}
                                >
                                    <Text style={styles.saveButtonText}>Save Receipt</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Receipt History */}
                        <View style={styles.historySection}>
                            <Text style={styles.sectionTitle}>Receipt History</Text>
                            {receipts.length === 0 ? (
                                <Text style={styles.emptyText}>No receipts recorded.</Text>
                            ) : (
                                receipts.map(item => (
                                    <View key={item.id} style={styles.paymentCard}>
                                        <View style={styles.paymentInfo}>
                                            <Text style={styles.paymentAmount}>Rs. {item.amount.toLocaleString()}</Text>
                                            <Text style={styles.paymentDate}>{new Date(item.date).toDateString()}</Text>
                                            {item.receipt_no ? <Text style={styles.receiptNo}>Inv: {item.receipt_no}</Text> : null}
                                            {item.remarks ? <Text style={styles.paymentRemarks}>{item.remarks}</Text> : null}
                                        </View>
                                        <TouchableOpacity onPress={() => handleDeleteReceipt(item.id)} style={styles.deleteButton}>
                                            <Ionicons name="trash-outline" size={20} color={colors.error} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Ionicons name="receipt-outline" size={60} color={colors.textLight} />
                    <Text style={styles.placeholderText}>Select a supplier to manage receipts</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
    },
    supplierList: {
        paddingRight: 20,
    },
    supplierChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    selectedSupplierChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    supplierChipText: {
        color: colors.text,
        fontWeight: '600',
    },
    selectedSupplierChipText: {
        color: colors.white,
    },
    emptyText: {
        color: colors.textLight,
        fontStyle: 'italic',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
        marginTop: 50,
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textLight,
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        marginBottom: 25,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
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
        fontSize: 16,
        marginBottom: 15,
        color: colors.text,
    },
    saveButton: {
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    historySection: {
        marginBottom: 30,
    },
    paymentCard: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.success, // Green for receipts? Or Primary? Let's use Success for Money IN (Receipts usually mean money out for me? No, Supplier Receipts means I received goods/bill. So it's a LIABILITY increase. Supplier PAYMENT is Money OUT. Supplier RECEIPT (Bill) is Debt IN.)
        // Actually, normally:
        // Supplier Payment = I pay money (Asset decrease, Liability decrease).
        // Supplier Receipt/Bill = I receive goods (Asset increase, Liability increase).
        // Let's color amounts: Payments = Red (Money Out), Receipts/Bills = Black or Blue (Debt In).
        // Let's stick to Primary for now, or maybe default black.
        color: colors.text,
    },
    paymentDate: {
        fontSize: 12,
        color: colors.textLight,
        marginTop: 2,
    },
    receiptNo: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    paymentRemarks: {
        fontSize: 13,
        color: colors.text,
        marginTop: 4,
        fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8,
    }
});
