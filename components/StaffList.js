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
import { getStaff, deleteStaff, addStaff } from '../database/database';
import StaffForm from './StaffForm';
import { Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function StaffList() {
    const [staffList, setStaffList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = () => {
        getStaff((data) => {
            setStaffList(data);
        });
    };

    const handleAddOrUpdate = (staffData) => {
        if (staffData.id) {
            // Update logic (database function not yet implemented for update)
            // For now, let's just re-add or alert. 
            // In a real app we'd have updateStaff.
            Alert.alert('Info', 'Update functionality coming soon');
            setModalVisible(false);
        } else {
            addStaff(staffData.name, staffData.role, staffData.phone, staffData.salary, staffData.joinDate, (success) => {
                if (success) {
                    loadStaff();
                    setModalVisible(false);
                }
            });
        }
    };

    const handleDelete = (id, name) => {
        Alert.alert(
            'Delete Staff',
            `Are you sure you want to delete ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteStaff(id, (success) => {
                            if (success) loadStaff();
                        });
                    }
                }
            ]
        );
    };

    const filteredStaff = staffList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                    <View style={styles.phoneRow}>
                        <Ionicons name="call-outline" size={14} color={colors.textLight} />
                        <Text style={styles.phone}>{item.phone || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.salaryInfo}>
                    <Text style={styles.salaryLabel}>Salary</Text>
                    <Text style={styles.salaryAmount}>Rs. {item.salary.toLocaleString()}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardActions}>
                <Text style={styles.joinDate}>Joined: {item.join_date}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#f0f4ff' }]}
                        onPress={() => {
                            setSelectedStaff(item);
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons name="pencil" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: '#fff0f0', marginLeft: 10 }]}
                        onPress={() => handleDelete(item.id, item.name)}
                    >
                        <Ionicons name="trash" size={18} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={colors.textLight} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search staff by name or role..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredStaff}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={60} color="#ddd" />
                        <Text style={styles.emptyText}>No staff members found</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setSelectedStaff(null);
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
                <StaffForm
                    staff={selectedStaff}
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
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    role: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    phone: {
        fontSize: 12,
        color: colors.textLight,
        marginLeft: 5,
    },
    salaryInfo: {
        alignItems: 'flex-end',
    },
    salaryLabel: {
        fontSize: 10,
        color: colors.textLight,
        textTransform: 'uppercase',
    },
    salaryAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    joinDate: {
        fontSize: 11,
        color: colors.textLight,
    },
    actionBtn: {
        padding: 8,
        borderRadius: 10,
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
