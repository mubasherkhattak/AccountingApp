import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.iconContainer}
      >
        <Ionicons name="person" size={24} color={colors.white} />
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.salaryLabel}>Monthly Salary</Text>
        <Text style={styles.salary}>RS {parseFloat(employee.salary || 0).toLocaleString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={[styles.actionBtn, styles.editBtn]}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={[styles.actionBtn, styles.deleteBtn]}>
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  salaryLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  salary: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  editBtn: {
    backgroundColor: '#3498db',
    shadowColor: '#3498db',
    shadowOpacity: 0.3,
  },
  deleteBtn: {
    backgroundColor: '#ff4757',
    shadowColor: '#ff4757',
    shadowOpacity: 0.3,
  },
});
