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

const EightFLOORPAYMENT = () => {
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
    { id: 1, unitNo: "801", area: 357 },
    { id: 2, unitNo: "802", area: 1067 },
    { id: 3, unitNo: "803", area: 1066 },
    { id: 4, unitNo: "804", area: 1042 },
    { id: 5, unitNo: "805", area: 607 },
    { id: 6, unitNo: "806", area: 652 },
    { id: 7, unitNo: "807", area: 500 },
    { id: 8, unitNo: "808", area: 500 },
    { id: 9, unitNo: "809", area: 500 },
    { id: 10, unitNo: "810", area: 500 },
    { id: 11, unitNo: "811", area: 698 },
    { id: 12, unitNo: "812", area: 891 },
    { id: 13, unitNo: "813", area: 799 },
    { id: 14, unitNo: "814", area: 787 },
    { id: 15, unitNo: "815", area: 770 },
    { id: 16, unitNo: "816", area: 781 },
    { id: 17, unitNo: "817", area: 789 },
    { id: 18, unitNo: "818", area: 943 },
    { id: 19, unitNo: "819", area: 428 },
    { id: 20, unitNo: "820", area: 469 },
    { id: 21, unitNo: "821", area: 375 },
    { id: 22, unitNo: "822", area: 301 },
    { id: 23, unitNo: "823", area: 915 },
    { id: 24, unitNo: "824", area: 1027 },
    { id: 25, unitNo: "825", area: 846 },
    { id: 26, unitNo: "826", area: 846 },
    { id: 27, unitNo: "827", area: 1187 },
    { id: 28, unitNo: "828", area: 1187 },
  ];

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = () => {
    getFloorUnits("EighthFloor", (data) => {
      if (data.length > 0) {
        const recalculated = data.map(u => ({
          ...u,
          total: (u.downPayment > 0) ? (parseFloat(u.area || 0) + parseFloat(u.downPayment || 0)) : 0
        }));
        setUnits(recalculated);
      } else {
        // Initialize
        defaultUnits.forEach((u, index) => {
          const unitData = { unitNo: u.unitNo, area: u.area, date: '', downPayment: 0, total: 0 };
          addFloorUnit("EighthFloor", unitData, () => {
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

        updateFloorUnit("EighthFloor", id, { [field]: value, total }, () => { });

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
        updateFloorUnit("EighthFloor", unit.id, { date: "", downPayment: 0, total: 0 }, () => {
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
    deleteFloorUnit("EighthFloor", id, () => {
      setUnits(units.filter((u) => u.id !== id));
    });
  };

  const addNewUnit = () => {
    const lastUnit = units[units.length - 1];
    const lastNumber = lastUnit ? parseInt(lastUnit.unitNo) || 0 : 800;
    const nextUnitNo = (lastNumber + 1).toString();

    const newUnitData = {
      unitNo: nextUnitNo,
      area: 0,
      date: "",
      downPayment: 0,
      total: 0,
    };

    addFloorUnit("EighthFloor", newUnitData, (newId) => {
      if (newId) {
        setUnits([...units, { id: newId, ...newUnitData }]);
      }
    });
  };

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
        editable={parseInt(item.unitNo) > 828}
      />

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
      <Text style={styles.title}>Eighth Floor Units</Text>

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

export default EightFLOORPAYMENT;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 1, paddingTop: 15 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginTop: 20, marginBottom: 10, color: "#333" },
  headerRow: { flexDirection: "row", backgroundColor: colors.primary, paddingVertical: 6, paddingHorizontal: 1, marginBottom: 4 },
  headerCell: { color: "#fff", fontSize: 9, fontWeight: "700", textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 4, paddingHorizontal: 1 },
  unit: { fontWeight: "bold", color: colors.primary, fontSize: 10, textAlign: "center" },
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
