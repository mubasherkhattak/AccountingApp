import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import EmployeeCard from '../components/EmployeeCard';
import SupplierCard from '../components/SupplierCard';
import PayrollForm from '../components/PayrollForm';
import SupplierForm from '../components/SupplierForm';
import PayrollSummary from '../components/PayrollSummary';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from '../database/database';
import colors from '../constants/colors';

export default function PayrollScreen() {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Supplier State
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' | 'suppliers'

  useEffect(() => {
    loadEmployees();
    loadSuppliers();
  }, []);

  const loadEmployees = () => {
    getEmployees((data) => {
      setEmployees(data);
    });
  };

  const loadSuppliers = () => {
    getSuppliers((data) => {
      setSuppliers(data);
    });
  };

  const handleAddPayroll = employeeData => {
    const name = employeeData?.name?.trim() || '';
    const salary = Number(String(employeeData.salary).replace(/[^0-9.-]/g, ''));

    if (!name || isNaN(salary) || salary <= 0) {
      Alert.alert('Error', 'Please enter a valid name and numeric salary.');
      return;
    }

    if (employeeData.id) {
      updateEmployee(employeeData.id, name, salary, () => {
        loadEmployees();
        setModalVisible(false);
      });
    } else {
      addEmployee(name, salary, () => {
        loadEmployees();
        setModalVisible(false);
      });
    }
  };

  const handleAddSupplier = supplierData => {
    const name = supplierData?.name?.trim() || '';
    const salary = Number(String(supplierData.salary).replace(/[^0-9.-]/g, ''));

    if (!name || isNaN(salary) || salary <= 0) {
      Alert.alert('Error', 'Please enter a valid name and numeric amount.');
      return;
    }

    if (supplierData.id) {
      updateSupplier(supplierData.id, name, salary, () => {
        loadSuppliers();
        setSupplierModalVisible(false);
      });
    } else {
      addSupplier(name, salary, () => {
        loadSuppliers();
        setSupplierModalVisible(false);
      });
    }
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEmployee(id, loadEmployees),
        },
      ],
      { cancelable: true },
    );
  };

  const confirmDeleteSupplier = (id, name) => {
    Alert.alert(
      'Delete Supplier',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSupplier(id, loadSuppliers),
        },
      ],
      { cancelable: true },
    );
  };

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
            <Text style={styles.headerTitle}>Payroll System</Text>
            <Text style={styles.headerSubtitle}>Manage staff salaries & records</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'employees' && styles.activeTabEmployee]}
            onPress={() => setActiveTab('employees')}
          >
            <Ionicons
              name="people"
              size={18}
              color={activeTab === 'employees' ? colors.primary : 'rgba(255,255,255,0.7)'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, activeTab === 'employees' && styles.activeTabTextEmployee]}>Employees</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'suppliers' && styles.activeTabSupplier]}
            onPress={() => setActiveTab('suppliers')}
          >
            <Ionicons
              name="briefcase"
              size={18}
              color={activeTab === 'suppliers' ? '#00b894' : 'rgba(255,255,255,0.7)'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, activeTab === 'suppliers' && styles.activeTabTextSupplier]}>Suppliers</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main List */}
      {activeTab === 'employees' ? (
        <FlatList
          data={employees}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <EmployeeCard
              employee={item}
              onEdit={() => {
                setSelectedEmployee(item);
                setModalVisible(true);
              }}
              onDelete={() => confirmDelete(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#ddd" />
              <Text style={styles.emptyText}>No employees found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={suppliers}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <SupplierCard
              supplier={item}
              onEdit={() => {
                setSelectedSupplier(item);
                setSupplierModalVisible(true);
              }}
              onDelete={() => confirmDeleteSupplier(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={60} color="#ddd" />
              <Text style={styles.emptyText}>No suppliers found</Text>
            </View>
          }
        />
      )}

      {/* Bottom Summary & Button */}
      <View style={styles.footerContainer}>
        <PayrollSummary employees={activeTab === 'employees' ? employees : suppliers} />

        <View style={styles.buttonsWrapper}>
          {activeTab === 'employees' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedEmployee(null);
                setModalVisible(true);
              }}
              style={styles.fullWidthButton}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButton}
              >
                <Ionicons name="person-add" size={20} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.actionButtonText}>Add New Employee</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setSelectedSupplier(null);
                setSupplierModalVisible(true);
              }}
              style={styles.fullWidthButton}
            >
              <LinearGradient
                colors={['#00b894', '#00cec9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButton}
              >
                <Ionicons name="briefcase" size={20} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.actionButtonText}>Add New Supplier</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Employee Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <PayrollForm
          employee={selectedEmployee}
          onSubmit={handleAddPayroll}
          onClose={() => setModalVisible(false)}
        />
      </Modal>

      {/* Supplier Modal */}
      <Modal visible={supplierModalVisible} animationType="fade" transparent={true}>
        <SupplierForm
          supplier={selectedSupplier}
          onSubmit={handleAddSupplier}
          onClose={() => setSupplierModalVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 15,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTabEmployee: {
    backgroundColor: '#fff',
  },
  activeTabSupplier: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabTextEmployee: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeTabTextSupplier: {
    color: '#00b894',
    fontWeight: '700',
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 220,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 15,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 249, 255, 0.95)',
    paddingBottom: 20,
  },
  buttonsWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  fullWidthButton: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
