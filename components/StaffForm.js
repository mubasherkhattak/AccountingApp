import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';

export default function StaffForm({ staff, onSubmit, onClose }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [salary, setSalary] = useState('');
    const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (staff) {
            setName(staff.name || '');
            setRole(staff.role || '');
            setPhone(staff.phone || '');
            setSalary(staff.salary ? staff.salary.toString() : '');
            setJoinDate(staff.join_date || new Date().toISOString().split('T')[0]);
        }
    }, [staff]);

    const handleSubmit = () => {
        if (!name || !role || !salary) {
            Alert.alert('Validation Error', 'Name, Role and Salary are required.');
            return;
        }

        onSubmit({
            id: staff?.id,
            name,
            role,
            phone,
            salary: parseFloat(salary),
            joinDate
        });
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{staff ? 'Edit Staff member' : 'Add New Staff'}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Muhammad Ali"
                        value={name}
                        onChangeText={setName}
                    />

                    <Text style={styles.label}>Role / Designation *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Manager, Driver, Loader"
                        value={role}
                        onChangeText={setRole}
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 0300-1234567"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <Text style={styles.label}>Monthly Salary *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={salary}
                        onChangeText={setSalary}
                    />

                    <Text style={styles.label}>Joining Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={joinDate}
                        onChangeText={setJoinDate}
                    />

                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.submitButtonWrapper}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>
                                {staff ? 'Update Member' : 'Save Member'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
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
});
