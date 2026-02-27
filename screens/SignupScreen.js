// screens/SignupScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { getDBConnection, registerUser } from '../utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const db = await getDBConnection();
            const result = await registerUser(db, name, email, password);

            setLoading(false);

            if (result.success) {
                // Auto login user
                await AsyncStorage.setItem('user', JSON.stringify({ name: result.name, email: result.email }));
                Alert.alert('Account Created', 'Your account has been created successfully.', [
                    { text: 'OK', onPress: () => navigation.replace('Home') },
                ]);
            } else {
                Alert.alert('Signup Failed', result.error);
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.white} />
                        </TouchableOpacity>

                        <View style={styles.logoCircle}>
                            <Ionicons name="person-add" size={40} color={colors.white} />
                        </View>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join Broadway Mall App to manage your accounts
                        </Text>
                    </View>
                </LinearGradient>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color={colors.iconDefault}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Mubasher Khattak"
                            placeholderTextColor="#aaa"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color={colors.iconDefault}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. mubasher@example.com"
                            placeholderTextColor="#aaa"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color={colors.iconDefault}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#aaa"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.iconDefault}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={20}
                            color={colors.iconDefault}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#aaa"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSignup}
                        style={styles.signupButtonContainer}
                    >
                        <LinearGradient
                            colors={[colors.gradientStart, colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.signupButton}
                        >
                            <Text style={styles.signupButtonText}>Create Account</Text>
                            <Ionicons name="checkmark-circle" size={22} color={colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.loginWrapper}>
                        <Text style={styles.alreadyText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    scrollContent: { flexGrow: 1 },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    header: { alignItems: 'center', paddingHorizontal: 30 },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 12,
        marginBottom: 10,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.white },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    formContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 30 },
    label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderRadius: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        marginBottom: 15,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 50, fontSize: 16, color: colors.text },
    signupButtonContainer: { marginTop: 20 },
    signupButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    signupButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold', marginRight: 10 },
    loginWrapper: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, paddingBottom: 40 },
    alreadyText: { color: colors.textLight, fontSize: 14 },
    loginText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
});
