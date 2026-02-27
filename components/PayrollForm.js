import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';

export default function PayrollForm({ employee, onSubmit, onClose }) {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setSalary(
        employee.salary !== undefined && employee.salary !== null
          ? String(employee.salary)
          : '',
      );
    } else {
      setName('');
      setSalary('');
    }
  }, [employee]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const cleanedSalary = String(salary).replace(/[^0-9.-]/g, '').trim();
    const salaryNumber = Number(cleanedSalary);

    if (!trimmedName || isNaN(salaryNumber) || salaryNumber <= 0) {
      Alert.alert('Error', 'Please enter a valid name and numeric salary.');
      return;
    }

    onSubmit({
      id: employee ? employee.id : null,
      name: trimmedName,
      salary: salaryNumber,
    });
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          {employee ? 'Update Employee' : 'New Employee'}
        </Text>
        <Text style={styles.subtitle}>Enter the details below to proceed</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. John Doe"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Monthly Salary (RS)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50000"
          placeholderTextColor="#aaa"
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>
              {employee ? 'Update' : 'Confirm'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  formContainer: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8f9ff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cancelButtonText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2575fc',
    padding: 16,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#2575fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
