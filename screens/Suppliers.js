import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';

const categories = [
    { id: 'cashbook', name: 'Cashbook', icon: 'book' },
    { id: 'stock', name: 'Stock', icon: 'cube' },
    { id: 'bills', name: 'Bills', icon: 'receipt' },
    { id: 'staff', name: 'Staff', icon: 'people' },
    { id: 'expenses', name: 'Expenses', icon: 'wallet' },
];

import SupplierPaymentsContent from './SupplierPayments';
import SupplierReceiptsContent from './SupplierReceipts';
import SupplierBalanceContent from './SupplierBalance';
import AddStockContent from './AddStock';
import StockListContent from './StockList';
import NewBillContent from './NewBill';
import BillListContent from './BillList';

// New Features
import StaffListContent from '../components/StaffList';
import StaffPaymentsContent from '../components/StaffPayments';
import ExpenseFormContent from '../components/ExpenseForm'; // Though we use ExpenseList's FAB for adding
import ExpenseListContent from '../components/ExpenseList';

export default function Suppliers({ navigation }) {
    const [activeCategory, setActiveCategory] = useState('');
    const [activeSubCategory, setActiveSubCategory] = useState('');

    // Define the menus
    const cashbookMenus = [
        { id: 'payments', name: 'Payments', icon: 'cash-outline' },
        { id: 'receipts', name: 'Receipts', icon: 'receipt-outline' },
        { id: 'balance', name: 'Balance', icon: 'wallet-outline' },
    ];

    const stockMenus = [
        { id: 'add_stock', name: 'Add Stock', icon: 'add-circle-outline' },
        { id: 'stock_in', name: 'Stock In', icon: 'arrow-down-circle-outline' },
        { id: 'stock_out', name: 'Stock Out', icon: 'arrow-up-circle-outline' },
        { id: 'stock_list', name: 'Stock List', icon: 'list-outline' },
    ];

    const billsMenus = [
        { id: 'new_bill', name: 'New Bill', icon: 'document-text-outline' },
        { id: 'bill_history', name: 'Bill History', icon: 'time-outline' },
        { id: 'pending_bills', name: 'Pending Bills', icon: 'alert-circle-outline' },
        { id: 'paid_bills', name: 'Paid Bills', icon: 'checkmark-circle-outline' },
    ];

    const staffMenus = [
        { id: 'staff_list', name: 'Staff List', icon: 'people-outline' },
        { id: 'staff_payments', name: 'Staff Payments', icon: 'cash-outline' },
        { id: 'work_record', name: 'Work Record', icon: 'briefcase-outline' },
    ];

    const expensesMenus = [
        { id: 'transport_exp', name: 'Transport', icon: 'bus-outline' },
        { id: 'material_exp', name: 'Material', icon: 'cube-outline' },
        { id: 'other_exp', name: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
        { id: 'daily_exp', name: 'Daily', icon: 'calendar-outline' },
    ];

    const getActiveMenus = () => {
        switch (activeCategory) {
            case 'cashbook': return cashbookMenus;
            case 'stock': return stockMenus;
            case 'bills': return billsMenus;
            case 'staff': return staffMenus;
            case 'expenses': return expensesMenus;
            default: return [];
        }
    };

    const activeMenus = getActiveMenus();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={28} color={colors.white} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Suppliers Hub</Text>
                        <Text style={styles.headerSubtitle}>Inventory & Vendor Management</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Fixed Horizontal Menu */}
            <View style={styles.menuWrapper}>
                <View style={styles.menuContainer}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={cat.id}
                            style={styles.menuItemTouch}
                            onPress={() => {
                                setActiveCategory(cat.id);
                                setActiveSubCategory(''); // Reset sub-category on change
                            }}
                        >
                            <LinearGradient
                                colors={activeCategory === cat.id ? [colors.gradientStart, colors.gradientEnd] : [colors.white, colors.white]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                    styles.menuItem,
                                    activeCategory !== cat.id && styles.inactiveMenuItem,
                                ]}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={16}
                                    color={activeCategory === cat.id ? colors.white : colors.primary}
                                />
                                <Text
                                    style={[
                                        styles.menuText,
                                        activeCategory === cat.id ? styles.activeMenuText : styles.inactiveMenuText,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {cat.name}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Dynamic Sub-Menu */}
            {activeMenus.length > 0 && (
                <View style={styles.subMenuWrapper}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subMenuContainer}>
                        {activeMenus.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.8}
                                onPress={() => setActiveSubCategory(item.id)}
                                style={[
                                    styles.subMenuItem,
                                    activeSubCategory === item.id && styles.activeSubMenuItem
                                ]}
                            >
                                <LinearGradient
                                    colors={activeSubCategory === item.id ? [colors.primary, colors.secondary] : [colors.primaryLight, colors.primaryLight]}
                                    style={styles.subMenuGradient}
                                >
                                    <Ionicons name={item.icon} size={16} color={activeSubCategory === item.id ? colors.white : colors.primary} style={{ marginRight: 4 }} />
                                    <Text style={[styles.subMenuText, activeSubCategory !== item.id && { color: colors.primary }]}>{item.name}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Content Area */}
            {activeCategory === 'cashbook' ? (
                <View style={styles.content}>
                    {activeSubCategory === 'payments' && <SupplierPaymentsContent />}
                    {activeSubCategory === 'receipts' && <SupplierReceiptsContent />}
                    {activeSubCategory === 'balance' && <SupplierBalanceContent />}
                    {!activeSubCategory && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="apps-outline" size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>Cashbook Management</Text>
                            <Text style={styles.contentSubtitle}>Select Payments, Receipts, or Balance to proceed.</Text>
                        </View>
                    )}
                </View>
            ) : activeCategory === 'stock' ? (
                <View style={styles.content}>
                    {activeSubCategory === 'add_stock' && (
                        <AddStockContent initialType="IN" />
                    )}
                    {activeSubCategory === 'stock_in' && (
                        <StockListContent type="IN" />
                    )}
                    {activeSubCategory === 'stock_out' && (
                        <StockListContent type="OUT" />
                    )}
                    {activeSubCategory === 'stock_list' && <StockListContent />}

                    {!activeSubCategory && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="cube-outline" size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>Stock Management</Text>
                            <Text style={styles.contentSubtitle}>Select Add Stock, Stock In/Out or List to proceed.</Text>
                        </View>
                    )}
                </View>
            ) : activeCategory === 'bills' ? (
                <View style={styles.content}>
                    {activeSubCategory === 'new_bill' && <NewBillContent />}
                    {activeSubCategory === 'bill_history' && <BillListContent filter="ALL" />}
                    {activeSubCategory === 'pending_bills' && <BillListContent filter="PENDING" />}
                    {activeSubCategory === 'paid_bills' && <BillListContent filter="PAID" />}

                    {!activeSubCategory && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="receipt-outline" size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>Bills Management</Text>
                            <Text style={styles.contentSubtitle}>Enter and track your vendor bills.</Text>
                        </View>
                    )}
                </View>
            ) : activeCategory === 'staff' ? (
                <View style={styles.content}>
                    {activeSubCategory === 'staff_list' && <StaffListContent />}
                    {activeSubCategory === 'staff_payments' && <StaffPaymentsContent />}
                    {!activeSubCategory && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="people-outline" size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>Staff Management</Text>
                            <Text style={styles.contentSubtitle}>Manage records and payments for your employees.</Text>
                        </View>
                    )}
                </View>
            ) : activeCategory === 'expenses' ? (
                <View style={styles.content}>
                    {activeSubCategory === 'transport_exp' && <ExpenseListContent filter="TRANSPORT" />}
                    {activeSubCategory === 'material_exp' && <ExpenseListContent filter="MATERIAL" />}
                    {activeSubCategory === 'daily_exp' && <ExpenseListContent filter="DAILY" />}
                    {activeSubCategory === 'other_exp' && <ExpenseListContent filter="OTHER" />}
                    {!activeSubCategory && (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name="wallet-outline" size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>Expense Management</Text>
                            <Text style={styles.contentSubtitle}>Detailed tracking of transport, material, and daily expenses.</Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.content}>
                    {activeCategory && activeSubCategory ? (
                        <View style={styles.placeholderContainer}>
                            <LinearGradient
                                colors={['#f0f4ff', '#e6edff']}
                                style={styles.placeholderIcon}
                            >
                                <Ionicons
                                    name={activeMenus.find(m => m.id === activeSubCategory)?.icon || 'construct-outline'}
                                    size={60}
                                    color={colors.primary}
                                />
                            </LinearGradient>
                            <Text style={styles.contentTitle}>
                                {activeMenus.find(m => m.id === activeSubCategory)?.name}
                            </Text>
                            <Text style={styles.contentSubtitle}>
                                Module Coming Soon
                            </Text>
                        </View>
                    ) : activeCategory ? (
                        <View style={styles.placeholderContainer}>
                            <Ionicons name={categories.find(c => c.id === activeCategory)?.icon} size={60} color={colors.primary} />
                            <Text style={styles.contentTitle}>{categories.find(c => c.id === activeCategory)?.name} Hub</Text>
                            <Text style={styles.contentSubtitle}>Select a sub-menu to continue.</Text>
                        </View>
                    ) : (
                        <View style={[styles.placeholderContainer, { opacity: 0.7 }]}>
                            <Ionicons name="apps-outline" size={50} color={colors.textLight} />
                            <Text style={[styles.contentSubtitle, { marginTop: 10 }]}>Select a category to begin</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
    },
    headerSubtitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    },
    menuWrapper: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    menuItemTouch: {
        flex: 1,
        marginHorizontal: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingVertical: 10,
        borderRadius: 15,
        elevation: 2,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    inactiveMenuItem: {
        borderWidth: 1,
        borderColor: '#e0e6ff',
    },
    menuText: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 4,
    },
    activeMenuText: {
        color: colors.white,
    },
    inactiveMenuText: {
        color: colors.text,
    },
    content: {
        flex: 1,
        padding: 25,
    },
    // Grid Styles
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Slightly less than 50% for gap
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        lineHeight: 20,
    },
    // Placeholder Styles
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 30,
        padding: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },
    placeholderIcon: {
        width: 120,
        height: 120,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    contentTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    contentSubtitle: {
        fontSize: 15,
        color: colors.textLight,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
    subMenuWrapper: {
        marginBottom: 10,
        height: 45, // Reduced height
        paddingHorizontal: 15,
    },
    subMenuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    subMenuItem: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: '#fff', // Default background
    },
    activeSubMenuItem: {
        elevation: 4,
    },
    subMenuGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 5,
    },
    subMenuText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 11, // Smaller font
    },
});
