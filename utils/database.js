import * as SQLite from 'expo-sqlite';

const database_name = "BroadwayMall.db";

// Open database (Expo SQLite uses sync open, but we wrap in promise for compatibility)
export const getDBConnection = async () => {
    return SQLite.openDatabase(database_name);
};

// Helper function to execute SQL with promises
const executeQuery = (db, sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                sql,
                params,
                (_, result) => resolve(result),
                (_, error) => {
                    reject(error);
                    return false; // Rollback on error
                }
            );
        });
    });
};

export const createTables = async (db) => {
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `;
    await executeQuery(db, query);
};

export const registerUser = async (db, name, email, password) => {
    const insertQuery = `INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`;
    try {
        const result = await executeQuery(db, insertQuery, [name, email, password]);
        if (result.rowsAffected > 0) {
            return { success: true, userId: result.insertId, name, email };
        }
        return { success: false, error: 'Registration failed' };
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return { success: false, error: 'Email already exists' };
        }
        return { success: false, error: error.message };
    }
};

export const loginUser = async (db, email, password) => {
    const selectQuery = `SELECT * FROM Users WHERE email = ? AND password = ?`;
    try {
        const result = await executeQuery(db, selectQuery, [email, password]);
        if (result.rows.length > 0) {
            // Expo SQLite returns rows._array instead of rows.item()
            const user = result.rows._array[0];
            return { success: true, user: user };
        }
        return { success: false, error: 'Invalid email or password' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};