import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { getSupplierBalances } from '../database/database';
import { useFocusEffect } from '@react-navigation/native';

export default function SupplierBalanceContent() {
    const [balances, setBalances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadBalances = () => {
        setLoading(true);
        getSupplierBalances((data) => {
            setBalances(data);
            setLoading(false);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        loadBalances();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadBalances();
    };

    // Reload when screen comes into focus (if sticking to single screen, useEffect might be enough if parent triggers re-render, 
    // but better to expose a refresh mechanism or rely on parent updates. 
    // Since this is an embedded component, useFocusEffect might not work as expected if the parent Stack Screen doesn't unmount? 
    // Actually Suppliers screen is a screen, so useFocusEffect works if navigating BACK to Suppliers. 
    // But switching tabs? We might need a manual refresh on mount or prop. 
    // For now, useEffect [] is fine, and pull to refresh.)

    const renderBalanceItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.supplierName}>{item.name}</Text>
                <View style={[styles.statusBadge, item.balance > 0 ? styles.statusDue : styles.statusClear]}>
                    <Text style={[styles.statusText, item.balance > 0 ? styles.textDue : styles.textClear]}>
                        {item.balance > 0 ? 'Due' : item.balance < 0 ? 'Advance' : 'Settled'}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.label}>Total Billed</Text>
                    <Text style={styles.amount}>Rs. {item.total_receipts.toLocaleString()}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.label}>Total Paid</Text>
                    <Text style={styles.amount}>Rs. {item.total_payments.toLocaleString()}</Text>
                </View>
                <View style={[styles.col, { alignItems: 'flex-end' }]}>
                    <Text style={styles.label}>Balance</Text>
                    <Text style={[styles.balanceAmount, item.balance > 0 ? styles.textDue : styles.textClear]}>
                        Rs. {Math.abs(item.balance).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>All Supplier Balances</Text>
                <TouchableOpacity onPress={loadBalances} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={balances}
                renderItem={renderBalanceItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No supplier data found.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    refreshButton: {
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 20,
        elevation: 2,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    supplierName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDue: {
        backgroundColor: '#ffebee', // Light Red
    },
    statusClear: {
        backgroundColor: '#e8f5e9', // Light Green
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    textDue: {
        color: colors.error,
    },
    textClear: {
        color: colors.success,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: colors.textLight,
        marginBottom: 2,
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    balanceAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textLight,
        fontStyle: 'italic',
    }
});
