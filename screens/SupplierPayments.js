import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
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
import { getSuppliers, addSupplierPayment, getSupplierPayments, deleteSupplierPayment } from '../database/database';

export default function SupplierPaymentsContent() {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = () => {
        getSuppliers((data) => {
            setSuppliers(data);
        });
    };

    const loadPayments = (supplierId) => {
        setLoading(true);
        getSupplierPayments(supplierId, (data) => {
            setPayments(data);
            setLoading(false);
        });
    };

    const handleSelectSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        loadPayments(supplier.id);
    };

    const handleSavePayment = () => {
        if (!selectedSupplier) {
            Alert.alert('Error', 'Please select a supplier first.');
            return;
        }
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }
        if (!remarks) {
            Alert.alert('Error', 'Please enter remarks.');
            return;
        }

        const date = new Date().toISOString(); // Simple ISO string for now

        addSupplierPayment(selectedSupplier.id, parseFloat(amount), date, remarks, (success) => {
            if (success) {
                Alert.alert('Success', 'Payment recorded successfully!');
                setAmount('');
                setRemarks('');
                loadPayments(selectedSupplier.id);
            } else {
                Alert.alert('Error', 'Failed to record payment.');
            }
        });
    };

    const handleDeletePayment = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this payment record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteSupplierPayment(id, (success) => {
                            if (success && selectedSupplier) {
                                loadPayments(selectedSupplier.id);
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

    const renderPaymentItem = ({ item }) => (
        <View style={styles.paymentCard}>
            <View style={styles.paymentInfo}>
                <Text style={styles.paymentAmount}>Rs. {item.amount.toLocaleString()}</Text>
                <Text style={styles.paymentDate}>{new Date(item.date).toLocaleDateString()}</Text>
                {item.remarks ? <Text style={styles.paymentRemarks}>{item.remarks}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => handleDeletePayment(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.content}>
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
                    ListEmptyComponent={<Text style={styles.emptyText}>No suppliers found. Add one in management.</Text>}
                />
            </View>

            {selectedSupplier ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Payment Form */}
                        <View style={styles.formCard}>
                            <Text style={styles.cardTitle}>New Payment for {selectedSupplier.name}</Text>

                            <Text style={styles.label}>Amount (Rs)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Amount"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            <Text style={styles.label}>Remarks</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Check No, Transaction ID, etc."
                                value={remarks}
                                onChangeText={setRemarks}
                            />

                            <TouchableOpacity onPress={handleSavePayment}>
                                <LinearGradient
                                    colors={[colors.primary, colors.secondary]}
                                    style={styles.saveButton}
                                >
                                    <Text style={styles.saveButtonText}>Save Payment</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Payment History */}
                        <View style={styles.historySection}>
                            <Text style={styles.sectionTitle}>Payment History</Text>
                            {payments.length === 0 ? (
                                <Text style={styles.emptyText}>No payment history.</Text>
                            ) : (
                                payments.map(item => (
                                    <View key={item.id} style={styles.paymentCard}>
                                        <View style={styles.paymentInfo}>
                                            <Text style={styles.paymentAmount}>Rs. {item.amount.toLocaleString()}</Text>
                                            <Text style={styles.paymentDate}>{new Date(item.date).toDateString()}</Text>
                                            {item.remarks ? <Text style={styles.paymentRemarks}>{item.remarks}</Text> : null}
                                        </View>
                                        <TouchableOpacity onPress={() => handleDeletePayment(item.id)} style={styles.deleteButton}>
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
                    <Ionicons name="people-outline" size={60} color={colors.textLight} />
                    <Text style={styles.placeholderText}>Select a supplier to manage payments</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.background, // Inherit from parent
    },
    // Header styles removed
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    // ... rest of styles
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
        color: colors.primary,
    },
    paymentDate: {
        fontSize: 12,
        color: colors.textLight,
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
