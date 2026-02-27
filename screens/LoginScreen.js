// screens/LoginScreen.js
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
import { getDBConnection, loginUser } from '../utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            const db = await getDBConnection();
            const result = await loginUser(db, email, password);
            setLoading(false);

            if (result.success) {
                await AsyncStorage.setItem('user', JSON.stringify({ name: result.user.name, email: result.user.email }));
                navigation.replace('Home');
            } else {
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Login Failed', error.message);
        }
    };

    const handleForgotPassword = () => {
        Alert.prompt(
            'Reset Password',
            'Enter your email address to receive reset instructions.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send',
                    onPress: async (enteredEmail) => {
                        if (!enteredEmail) return;
                        Alert.alert('Reset Simulated', `Instructions would be sent to ${enteredEmail}`);
                    },
                },
            ],
            'plain-text'
        );
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
                        <View style={styles.logoCircle}>
                            <Ionicons name="lock-closed" size={40} color={colors.white} />
                        </View>
                        <Text style={styles.title}>Login</Text>
                        <Text style={styles.subtitle}>
                            Enter your credentials to access Broadway Mall App
                        </Text>
                    </View>
                </LinearGradient>

                <View style={styles.formContainer}>
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
                            placeholder="e.g. admin@broadway.com"
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

                    <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                        <LinearGradient
                            colors={[colors.gradientStart, colors.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.signInButton}
                        >
                            <Text style={styles.signInText}>Sign In</Text>
                            <Ionicons name="arrow-forward" size={20} color={colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.signupWrapper}>
                        <Text style={styles.noAccountText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.signupText}>Create New Account</Text>
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
    headerGradient: { paddingTop: 80, paddingBottom: 40, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
    header: { alignItems: 'center', paddingHorizontal: 30 },
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
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 10, lineHeight: 20 },
    formContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
    label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground, borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.inputBorder, marginBottom: 20 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, height: 55, fontSize: 16, color: colors.text },
    forgotButton: { alignSelf: 'flex-end', marginBottom: 30 },
    forgotText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
    signInButton: { flexDirection: 'row', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    signInText: { color: colors.white, fontSize: 18, fontWeight: 'bold', marginRight: 10 },
    signupWrapper: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, paddingBottom: 40 },
    noAccountText: { color: colors.textLight, fontSize: 14 },
    signupText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
});
