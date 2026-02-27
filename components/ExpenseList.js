import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { getExpenses, deleteExpense, addExpense } from '../database/database';
import ExpenseForm from './ExpenseForm';
import { Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CATEGORY_ICONS = {
    'TRANSPORT': 'bus-outline',
    'MATERIAL': 'cube-outline',
    'DAILY': 'calendar-outline',
    'RENT': 'business-outline',
    'UTILITIES': 'flash-outline',
    'REPAIR': 'construct-outline',
    'OTHER': 'ellipsis-horizontal-outline',
};

export default function ExpenseList({ filter = 'ALL' }) {
    const [expenses, setExpenses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadExpenses();
    }, [filter]);

    const loadExpenses = () => {
        getExpenses(filter, (data) => {
            setExpenses(data);
        });
    };

    const handleAddOrUpdate = (expenseData) => {
        addExpense(
            expenseData.category,
            expenseData.amount,
            expenseData.date,
            expenseData.payee,
            expenseData.remarks,
            (success) => {
                if (success) {
                    loadExpenses();
                    setModalVisible(false);
                }
            }
        );
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense record?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteExpense(id, (success) => {
                            if (success) loadExpenses();
                        });
                    }
                }
            ]
        );
    };

    const filteredExpenses = expenses.filter(item =>
        (item.payee && item.payee.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#f0f4ff' }]}>
                    <Ionicons name={CATEGORY_ICONS[item.category] || 'cash-outline'} size={24} color={colors.primary} />
                </View>
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={styles.categoryText}>{item.category.replace('_', ' ')}</Text>
                    <Text style={styles.payeeText}>{item.payee || 'Direct Expense'}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amount}>Rs. {item.amount.toLocaleString()}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            </View>
            {item.remarks ? (
                <>
                    <View style={styles.divider} />
                    <Text style={styles.remarks}>{item.remarks}</Text>
                </>
            ) : null}
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
            >
                <Ionicons name="trash-outline" size={18} color="#ff4d4d" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={colors.textLight} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredExpenses}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="wallet-outline" size={60} color="#ddd" />
                        <Text style={styles.emptyText}>No expense records found</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setSelectedExpense(null);
                    setModalVisible(true);
                }}
            >
                <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={30} color={colors.white} />
                </LinearGradient>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <ExpenseForm
                    expense={selectedExpense}
                    onSubmit={handleAddOrUpdate}
                    onClose={() => setModalVisible(false)}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },
    list: {
        paddingBottom: 100,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        textTransform: 'uppercase',
    },
    payeeText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
        marginTop: 2,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff4d4d',
    },
    date: {
        fontSize: 11,
        color: colors.textLight,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    remarks: {
        fontSize: 13,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    deleteBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textLight,
        marginTop: 10,
    }
});
