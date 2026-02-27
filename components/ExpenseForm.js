import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';

const EXPENSE_CATEGORIES = [
    { id: 'TRANSPORT', name: 'Transport', icon: 'bus-outline' },
    { id: 'MATERIAL', name: 'Material', icon: 'cube-outline' },
    { id: 'DAILY', name: 'Daily / General', icon: 'calendar-outline' },
    { id: 'RENT', name: 'Rent', icon: 'business-outline' },
    { id: 'UTILITIES', name: 'Utilities (Elec/Water)', icon: 'flash-outline' },
    { id: 'REPAIR', name: 'Maintenance & Repair', icon: 'construct-outline' },
    { id: 'OTHER', name: 'Other Expenses', icon: 'ellipsis-horizontal-outline' },
];

export default function ExpenseForm({ expense, onSubmit, onClose }) {
    const [category, setCategory] = useState(null);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [payee, setPayee] = useState('');
    const [remarks, setRemarks] = useState('');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    useEffect(() => {
        if (expense) {
            setCategory(EXPENSE_CATEGORIES.find(c => c.id === expense.category) || null);
            setAmount(expense.amount.toString());
            setDate(expense.date);
            setPayee(expense.payee || '');
            setRemarks(expense.remarks || '');
        }
    }, [expense]);

    const handleSubmit = () => {
        if (!category || !amount) {
            Alert.alert('Validation Error', 'Category and Amount are required.');
            return;
        }

        onSubmit({
            id: expense?.id,
            category: category.id,
            amount: parseFloat(amount),
            date,
            payee,
            remarks
        });
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{expense ? 'Edit Expense' : 'New Expense'}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.label}>Category *</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setShowCategoryPicker(true)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {category && <Ionicons name={category.icon} size={20} color={colors.primary} style={{ marginRight: 10 }} />}
                            <Text style={[styles.dropdownText, !category && { color: colors.textLight }]}>
                                {category ? category.name : 'Select Category'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={colors.textLight} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Amount Paid *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <Text style={styles.label}>Date *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={date}
                        onChangeText={setDate}
                    />

                    <Text style={styles.label}>Paid To / Payee</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Electric Company, Vendor Name"
                        value={payee}
                        onChangeText={setPayee}
                    />

                    <Text style={styles.label}>Description / Remarks</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Details about this expense..."
                        multiline
                        numberOfLines={3}
                        value={remarks}
                        onChangeText={setRemarks}
                    />

                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.submitButtonWrapper}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>
                                {expense ? 'Update Expense' : 'Save Expense'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Category Picker Modal */}
            <Modal visible={showCategoryPicker} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>Select Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={EXPENSE_CATEGORIES}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.pickerItem}
                                    onPress={() => {
                                        setCategory(item);
                                        setShowCategoryPicker(false);
                                    }}
                                >
                                    <Ionicons name={item.icon} size={24} color={colors.primary} style={{ marginRight: 15 }} />
                                    <Text style={styles.pickerItemText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: colors.white,
        borderRadius: 25,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    scrollContent: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 8,
        fontWeight: '500',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: colors.text,
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
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButtonWrapper: {
        marginTop: 10,
    },
    submitButton: {
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    submitButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    pickerContainer: {
        width: '100%',
        backgroundColor: colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: '60%',
        padding: 20,
        marginTop: 'auto',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    pickerItemText: {
        fontSize: 16,
        color: colors.text,
    }
});
