import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import colors from "../constants/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import responsive from "../utils/responsive";
import {
  getFloorUnits,
  updateFloorUnit,
  addFloorUnit,
  deleteFloorUnit,
  addUnitRecord,
  getUnitRecords,
  deleteUnitRecord
} from "../database/database";

const LowerGroundFloor = () => {
  const [units, setUnits] = useState([]);
  const { fontScale, iconScale, colUnits, colArea, colDate, colDown, colTotal, colAct } = responsive;

  // Calendar + Modal States
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [recordsForDate, setRecordsForDate] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisibleId, setPickerVisibleId] = useState(null);

  // ✅ Default units
  const defaultUnits = [
    { unitNo: "LG01", area: 275 },
    { unitNo: "LG02", area: 329 },
    { unitNo: "LG03", area: 329 },
    { unitNo: "LG04", area: 199 },
    { unitNo: "LG05", area: 273 },
    { unitNo: "LG06", area: 612 },
    { unitNo: "LG07", area: 474 },
    { unitNo: "LG08", area: 752 },
    { unitNo: "LG09", area: 505 },
    { unitNo: "LG10", area: 485 },
    { unitNo: "LG11", area: 479 },
    { unitNo: "LG12", area: 497 },
    { unitNo: "LG13", area: 470 },
    { unitNo: "LG14", area: 453 },
    { unitNo: "LG15", area: 453 },
    { unitNo: "LG16", area: 470 },
    { unitNo: "LG17", area: 270 },
    { unitNo: "LG18", area: 617 },
    { unitNo: "LG19", area: 506 },
    { unitNo: "LG20", area: 385 },
    { unitNo: "LG21", area: 385 },
    { unitNo: "LG22", area: 407 },
    { unitNo: "LG23", area: 401 },
    { unitNo: "LG24", area: 302 },
    { unitNo: "LG25", area: 461 },
    { unitNo: "LG26", area: 296 },
    { unitNo: "LG27", area: 292 },
    { unitNo: "LG28", area: 292 },
    { unitNo: "LG29", area: 327 },
    { unitNo: "LG30", area: 773 },
    { unitNo: "LG31", area: 615 },
  ];

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = () => {
    getFloorUnits("lower_ground_floor", (data) => {
      if (data.length > 0) {
        const recalculated = data.map(u => ({
          ...u,
          total: (u.downPayment > 0) ? (parseFloat(u.area || 0) + parseFloat(u.downPayment || 0)) : 0
        }));
        setUnits(recalculated);
      } else {
        // Initialize with default units
        defaultUnits.forEach((u, index) => {
          const unitData = { ...u, date: '', downPayment: 0, total: 0 };
          addFloorUnit("lower_ground_floor", unitData, () => {
            if (index === defaultUnits.length - 1) {
              loadUnits();
            }
          });
        });
      }
    });
  };

  const saveDateImmediately = (unitId, dateValue) => {
    const formattedDate = dateValue.toISOString().split("T")[0];
    updateUnit(unitId, "date", formattedDate);
  };

  const updateUnit = (id, field, value) => {
    const updated = units.map((u) => {
      if (u.id === id) {
        const newData = { ...u, [field]: value };
        const areaVal = parseFloat(field === "area" ? value : u.area) || 0;
        const downVal = parseFloat(field === "downPayment" ? value : u.downPayment) || 0;
        const total = downVal > 0 ? (areaVal + downVal) : 0;
        newData.total = total;

        updateFloorUnit("lower_ground_floor", id, { [field]: value, total }, () => { });

        return newData;
      }
      return u;
    });
    setUnits(updated);
  };

  const saveUnitRecord = (unit) => {
    if (!unit.date || unit.date === "") {
      Alert.alert("Notice", "Please select a date first.");
      return;
    }
    const areaVal = parseFloat(unit.area) || 0;
    const downVal = parseFloat(unit.downPayment) || 0;
    const totalVal = areaVal + downVal;

    const recordData = {
      unitNo: unit.unitNo,
      date: unit.date,
      area: unit.area,
      downPayment: downVal,
      total: totalVal
    };

    addUnitRecord(recordData, (success) => {
      if (success) {
        updateFloorUnit("lower_ground_floor", unit.id, { date: "", downPayment: 0, total: 0 }, () => {
          setUnits((prevUnits) =>
            prevUnits.map((u) =>
              u.id === unit.id ? { ...u, date: "", downPayment: 0, total: 0 } : u
            )
          );
          Alert.alert("Success", `Data for Unit ${unit.unitNo} on ${unit.date} has been saved.`);
        });
      } else {
        Alert.alert("Error", "Failed to save record.");
      }
    });
  };

  const deleteRecordFromModal = (recordId) => {
    deleteUnitRecord(recordId, () => {
      setRecordsForDate((prev) => prev.filter((r) => r.id !== recordId));
    });
  };

  const deleteUnit = (id) => {
    deleteFloorUnit("lower_ground_floor", id, () => {
      setUnits(units.filter((u) => u.id !== id));
    });
  };

  const addNewUnit = () => {
    const lastUnit = units[units.length - 1];
    const lastNumber = lastUnit ? parseInt(lastUnit.unitNo.replace(/[^0-9]/g, "")) || 0 : 0;
    const nextNumber = lastNumber + 1;
    const nextUnitNo = `LG${nextNumber.toString().padStart(2, "0")}`;

    const newUnitData = {
      unitNo: nextUnitNo,
      area: 0,
      date: "",
      downPayment: 0,
      total: 0,
    };

    addFloorUnit("lower_ground_floor", newUnitData, (newId) => {
      if (newId) {
        setUnits([...units, { id: newId, ...newUnitData }]);
      }
    });
  };

  // Calendar
  const openCalendar = (unit) => {
    setSelectedUnit(unit);
    setShowCalendar(true);
  };

  const onDateChange = (event, date) => {
    setShowCalendar(false);
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      getUnitRecords(selectedUnit.unitNo, formattedDate, (records) => {
        setRecordsForDate(records);
        setModalVisible(true);
      });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => openCalendar(item)} style={{ width: colUnits }}>
        <Text style={[styles.unit, { fontSize: 10 * fontScale }]}>{item.unitNo}</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.compactInput, { width: colArea, backgroundColor: "#fff", fontSize: 9 * fontScale }]}
        keyboardType="numeric"
        value={item.area?.toString() || ""}
        onChangeText={(text) => updateUnit(item.id, "area", text)}
        editable={parseInt(item.unitNo.replace("LG", "")) > 31}
      />

      {/* Date */}
      <TouchableOpacity
        style={[styles.compactInput, { width: colDate }]}
        onPress={() => setPickerVisibleId(pickerVisibleId === item.id ? null : item.id)}
      >
        <Text style={{ fontSize: 10 * fontScale }}>{item.date || "YYYY-MM-DD"}</Text>
      </TouchableOpacity>

      {pickerVisibleId === item.id && (
        <DateTimePicker
          value={item.date ? new Date(item.date) : new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setPickerVisibleId(null);
            if (selectedDate) saveDateImmediately(item.id, selectedDate);
          }}
        />
      )}

      <TextInput
        style={[styles.compactInput, { width: colDown, fontSize: 9 * fontScale }]}
        keyboardType="numeric"
        value={item.downPayment?.toString() || ""}
        onChangeText={(text) => updateUnit(item.id, "downPayment", parseFloat(text) || 0)}
      />

      <Text style={[styles.totalCell, { width: colTotal, fontSize: 10 * fontScale }]}>{item.total?.toFixed(0)}</Text>

      <View style={{ flexDirection: "row", width: colAct, justifyContent: "space-around" }}>
        <TouchableOpacity onPress={() => saveUnitRecord(item)}>
          <Text style={[styles.actionIcon, { fontSize: 15 * iconScale }]}>💾</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteUnit(item.id)}>
          <Text style={[styles.actionIcon, { color: "#e74c3c", fontSize: 15 * iconScale }]}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lower Ground Floor Units</Text>

      <TouchableOpacity style={styles.addButton} onPress={addNewUnit}>
        <Text style={styles.addText}>➕ Add New Unit</Text>
      </TouchableOpacity>

      <FlatList
        data={units}
        keyExtractor={(item) => item.id?.toString() || item.unitNo}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { width: colUnits, fontSize: 9 * fontScale }]}>Unit</Text>
            <Text style={[styles.headerCell, { width: colArea, fontSize: 9 * fontScale }]}>Area</Text>
            <Text style={[styles.headerCell, { width: colDate, fontSize: 9 * fontScale }]}>Date</Text>
            <Text style={[styles.headerCell, { width: colDown, fontSize: 9 * fontScale }]}>Down</Text>
            <Text style={[styles.headerCell, { width: colTotal, fontSize: 9 * fontScale }]}>Total</Text>
            <Text style={[styles.headerCell, { width: colAct, fontSize: 9 * fontScale }]}>Act</Text>
          </View>
        )}
        stickyHeaderIndices={[0]}
      />

      {showCalendar && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>
              {selectedUnit ? `Unit ${selectedUnit.unitNo} History` : ""}
            </Text>
            <Text style={modalStyles.modalDateSub}>Date: {selectedDate.toISOString().split("T")[0]}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {recordsForDate.length > 0
                ? recordsForDate.map((r, idx) => (
                  <View key={r.id} style={modalStyles.recordRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={modalStyles.recordLabel}>Record {idx + 1}</Text>
                      <Text style={modalStyles.recordValue}>Area: {r.area} | Down: {r.downPayment} | Total: {r.total}</Text>
                    </View>
                    <TouchableOpacity
                      style={modalStyles.deleteBtn}
                      onPress={() => deleteRecordFromModal(r.id)}
                    >
                      <Text style={{ color: "white", fontSize: 10 }}>Del</Text>
                    </TouchableOpacity>
                  </View>
                ))
                : <Text style={modalStyles.emptyText}>No records for this date</Text>}
            </ScrollView>


            <TouchableOpacity
              style={[modalStyles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LowerGroundFloor;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 1, paddingTop: 15 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 20, marginBottom: 10, color: "#333" },
  headerRow: { flexDirection: "row", backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 1, marginBottom: 4 },
  headerCell: { color: "#fff", fontSize: 9, fontWeight: "700", textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 4, paddingHorizontal: 1 },
  unit: { fontWeight: "bold", color: colors.primary, fontSize: 10, textAlign: "center" },
  cellText: { fontSize: 10, textAlign: "center", color: "#444" },
  compactInput: { borderWidth: 1, borderColor: "#ccc", paddingVertical: 1, paddingHorizontal: 1, borderRadius: 3, fontSize: 9, marginHorizontal: 0.5, backgroundColor: "#fff", textAlign: "center" },
  totalCell: { fontWeight: "700", color: colors.primary, textAlign: "center", fontSize: 10 },
  actionIcon: { fontSize: 15, color: colors.primary },
  addButton: { alignSelf: "center", backgroundColor: colors.primary, paddingVertical: 4, paddingHorizontal: 15, borderRadius: 6, marginBottom: 10 },
  addText: { color: "#fff", fontWeight: "600", fontSize: 11 },
});

const modalStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: 300, backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", color: "#333" },
  modalDateSub: { fontSize: 14, textAlign: "center", color: "#666", marginBottom: 10 },
  recordRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 8 },
  recordLabel: { fontWeight: "bold", fontSize: 13, color: "#333" },
  recordValue: { fontSize: 12, color: "#666" },
  deleteBtn: { backgroundColor: "#e74c3c", padding: 6, borderRadius: 4 },
  modalBtn: { paddingVertical: 10, borderRadius: 6, alignItems: "center", marginTop: 15 },
  emptyText: { textAlign: "center", color: "#999", marginVertical: 20 },
});
