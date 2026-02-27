import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { addStockItem, getStockItems, deleteStockItem, ensureStockSchema } from '../database/database';

export default function AddStockContent({ initialType = 'IN' }) {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(initialType); // 'IN' or 'OUT'
    const [stockItems, setStockItems] = useState([]);

    useEffect(() => {
        setType(initialType);
    }, [initialType]);

    useEffect(() => {
        ensureStockSchema();
        loadStock();
    }, []);

    const loadStock = () => {
        getStockItems((data) => {
            setStockItems(data);
        });
    };

    const handleSaveStock = () => {
        // Validation: All fields required
        if (!name.trim() || !sku.trim() || !category.trim() || !price || !quantity || !description.trim()) {
            Alert.alert('Validation Error', 'All fields are required. Please fill in all details.');
            return;
        }

        const unitPrice = parseFloat(price);
        const qty = parseInt(quantity, 10);

        if (isNaN(unitPrice) || unitPrice < 0) {
            Alert.alert('Validation Error', 'Please enter a valid Unit Price.');
            return;
        }

        if (isNaN(qty) || qty < 0) {
            Alert.alert('Validation Error', 'Please enter a valid Quantity.');
            return;
        }

        addStockItem(
            name.trim(),
            sku.trim(),
            category.trim(),
            unitPrice,
            qty,
            description.trim(),
            type,
            (success, errorMsg) => {
                if (success) {
                    Alert.alert('Success', 'Stock Item Added!');
                    setName('');
                    setSku('');
                    setCategory('');
                    setPrice('');
                    setQuantity('');
                    setDescription('');
                    loadStock();
                } else {
                    Alert.alert('Error', 'Failed to add item: ' + errorMsg);
                }
            });
    };

    // ... (handleDeleteStock remains same)

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
            {/* ... infoRow ... */}
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>SKU: {item.sku || 'N/A'}</Text>
                <Text style={styles.infoText}>Cat: {item.category || 'General'}</Text>
            </View>
            <View style={styles.priceRow}>
                <Text style={styles.price}>Rs. {item.unit_price}</Text>
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
            </View>
            {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Form Section */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Add New Stock Item</Text>

                    {/* Type Selector */}
                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'IN' && styles.typeButtonIn]}
                            onPress={() => setType('IN')}
                        >
                            <Ionicons name="arrow-down-circle" size={20} color={type === 'IN' ? colors.white : colors.success} />
                            <Text style={[styles.typeButtonText, type === 'IN' && styles.typeButtonTextActive]}>Stock In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'OUT' && styles.typeButtonOut]}
                            onPress={() => setType('OUT')}
                        >
                            <Ionicons name="arrow-up-circle" size={20} color={type === 'OUT' ? colors.white : colors.error} />
                            <Text style={[styles.typeButtonText, type === 'OUT' && styles.typeButtonTextActive]}>Stock Out</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Item Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Cement Bag, Steel Rod"
                        value={name}
                        onChangeText={setName}
                    />

                    {/* ... (rest of Inputs) */}
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>SKU / Code *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. SKU-101"
                                value={sku}
                                onChangeText={setSku}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Category *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Hardware"
                                value={category}
                                onChangeText={setCategory}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Unit Price (Rs) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Qty *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Details about the item..."
                        multiline
                        numberOfLines={3}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TouchableOpacity onPress={handleSaveStock}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>Save Transaction</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* List Section Removed as per request */}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
    },
    typeSelector: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 4,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    typeButtonIn: {
        backgroundColor: colors.success,
    },
    typeButtonOut: {
        backgroundColor: colors.error,
    },
    typeButtonText: {
        fontWeight: 'bold',
        marginLeft: 8,
        color: colors.textLight,
    },
    typeButtonTextActive: {
        color: colors.white,
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
        marginTop: 5,
    },
    saveButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    listSection: {
        marginBottom: 20,
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
    // ... rest of styles
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
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLight,
        marginTop: 20,
        fontStyle: 'italic',
    }
});
