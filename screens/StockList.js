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
import { getStockItems, deleteStockItem } from '../database/database';

export default function StockListContent({ type }) {
    const [stockItems, setStockItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStock();
    }, []);

    const loadStock = () => {
        getStockItems((data) => {
            setStockItems(data);
            setRefreshing(false);
        });
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadStock();
    };

    const handleDeleteStock = (id) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteStockItem(id, (success) => {
                            if (success) handleRefresh();
                        });
                    }
                }
            ]
        );
    };

    const filteredItems = type
        ? stockItems.filter(item => item.type === type)
        : stockItems;

    const getTitle = () => {
        if (type === 'IN') return 'Stock In Records';
        if (type === 'OUT') return 'Stock Out Records';
        return 'All Stock Transactions';
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.typeBadge, item.type === 'OUT' ? styles.badgeOut : styles.badgeIn]}>
                        <Text style={[styles.typeText, item.type === 'OUT' ? styles.textOut : styles.textIn]}>
                            {item.type === 'OUT' ? 'OUT' : 'IN'}
                        </Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteStock(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>SKU: {item.sku || 'N/A'}</Text>
                <Text style={styles.infoText}>Cat: {item.category || 'General'}</Text>
            </View>
            <View style={styles.priceRow}>
                <Text style={styles.price}>Rs. {item.unit_price}</Text>
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
            </View>
            <View style={styles.dateRow}>
                <Text style={styles.desc}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{getTitle()}</Text>
                <TouchableOpacity onPress={loadStock} style={styles.refreshBtn}>
                    <Ionicons name="refresh" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No {type ? type : 'stock'} records found.</Text>}
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
        marginBottom: 10
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
        marginBottom: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginRight: 8,
    },
    badgeIn: {
        backgroundColor: '#e8f5e9',
    },
    badgeOut: {
        backgroundColor: '#ffebee',
    },
    typeText: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    textIn: {
        color: colors.success,
    },
    textOut: {
        color: colors.error,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoText: {
        fontSize: 12,
        color: colors.textLight,
        marginRight: 15,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    quantity: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    desc: {
        fontSize: 12,
        color: colors.textLight,
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLight,
        marginTop: 50,
        fontStyle: 'italic',
    }
});
