import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    Modal,
    FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { addBill, getSuppliers } from '../database/database';

export default function NewBillContent() {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    // Form States
    const [billNo, setBillNo] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = () => {
        getSuppliers((data) => {
            setSuppliers(data);
        });
    };

    const handleSaveBill = () => {
        if (!selectedSupplier || !amount || !billNo || !date) {
            Alert.alert('Validation Error', 'Supplier, Bill No, Amount and Date are required.');
            return;
        }

        const billData = {
            billNo,
            supplierId: selectedSupplier.id,
            amount,
            date,
            dueDate,
            description,
            status: 'PENDING'
        };

        addBill(billData, (success, errorMsg) => {
            if (success) {
                Alert.alert('Success', 'Bill Saved Successfully!');
                // Reset Form
                setBillNo('');
                setAmount('');
                setDueDate('');
                setDescription('');
                setSelectedSupplier(null);
            } else {
                Alert.alert('Error', 'Failed to save bill: ' + errorMsg);
            }
        });
    };

    const renderSupplierItem = ({ item }) => (
        <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
                setSelectedSupplier(item);
                setShowSupplierModal(false);
            }}
        >
            <Ionicons name="person-circle-outline" size={30} color={colors.primary} />
            <Text style={styles.modalItemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.title}>Enter New Bill</Text>

                    {/* Supplier Selection */}
                    <Text style={styles.label}>Vendor / Supplier *</Text>
                    <TouchableOpacity
                        style={styles.dropdownSelector}
                        onPress={() => setShowSupplierModal(true)}
                    >
                        <Text style={[styles.dropdownText, !selectedSupplier && { color: colors.textLight }]}>
                            {selectedSupplier ? selectedSupplier.name : 'Select Supplier'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={colors.textLight} />
                    </TouchableOpacity>

                    {/* Bill Details */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Bill No. *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. INV-001"
                                value={billNo}
                                onChangeText={setBillNo}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Date *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Due Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={dueDate}
                                onChangeText={setDueDate}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Amount Due *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Memo / Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="What is this bill for?"
                        multiline
                        numberOfLines={3}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TouchableOpacity onPress={handleSaveBill} activeOpacity={0.8}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save Bill</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Supplier Modal */}
            <Modal
                visible={showSupplierModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowSupplierModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Supplier</Text>
                            <TouchableOpacity onPress={() => setShowSupplierModal(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={suppliers}
                            renderItem={renderSupplierItem}
                            keyExtractor={item => item.id.toString()}
                            ListEmptyComponent={<Text style={styles.emptyText}>No suppliers found. Add one in Staff/Suppliers first.</Text>}
                        />
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
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
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
    dropdownSelector: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: colors.text,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    modalItemText: {
        fontSize: 16,
        color: colors.text,
        marginLeft: 15,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLight,
        marginTop: 20,
        paddingBottom: 20
    }
});
