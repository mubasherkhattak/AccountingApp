import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { getBills, deleteBill } from '../database/database';

export default function BillListContent({ filter = 'ALL' }) {
    const [bills, setBills] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadBills();
    }, [filter]);

    const loadBills = () => {
        getBills(filter, (data) => {
            setBills(data);
            setRefreshing(false);
        });
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadBills();
    };

    const handleDeleteBill = (id) => {
        Alert.alert(
            'Delete Bill',
            'Are you sure you want to delete this bill?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteBill(id, (success) => {
                            if (success) handleRefresh();
                        });
                    }
                }
            ]
        );
    };

    const getTitle = () => {
        if (filter === 'PENDING') return 'Pending Bills';
        if (filter === 'PAID') return 'Paid Bills';
        return 'Bill History';
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={styles.iconBox}>
                        <Ionicons name="receipt-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={styles.billNo}>{item.bill_no}</Text>
                        <Text style={styles.supplierName}>{item.supplier_name}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amount}>Rs. {item.amount.toLocaleString()}</Text>
                    <View style={[styles.statusBadge, item.status === 'PAID' ? styles.statusPaid : styles.statusPending]}>
                        <Text style={[styles.statusText, item.status === 'PAID' ? styles.textPaid : styles.textPending]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.footer}>
                <View>
                    <Text style={styles.dateLabel}>Date: <Text style={styles.dateValue}>{item.date}</Text></Text>
                    {item.due_date && <Text style={styles.dateLabel}>Due: <Text style={styles.dateValue}>{item.due_date}</Text></Text>}
                </View>
                <TouchableOpacity onPress={() => handleDeleteBill(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.textLight} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{getTitle()}</Text>
                <TouchableOpacity onPress={loadBills} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={bills}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="documents-outline" size={50} color={colors.disabled} />
                        <Text style={styles.emptyText}>No {filter === 'ALL' ? '' : filter.toLowerCase()} bills found.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    refreshBtn: {
        padding: 5
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    billNo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    supplierName: {
        fontSize: 14,
        color: colors.textLight,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusPending: {
        backgroundColor: '#fff3e0',
    },
    statusPaid: {
        backgroundColor: '#e8f5e9',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    textPending: {
        color: '#ff9800',
    },
    textPaid: {
        color: colors.success,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    dateValue: {
        color: colors.text,
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
        opacity: 0.6
    },
    emptyText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.textLight,
    }
});
