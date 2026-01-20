import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import CustomInput from '../components/CustomInput';
import { authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await authService.register({ name, email, password });
            // Auto login after register or redirect to login
            Alert.alert('Success', 'Account created! Please login.');
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.center}>
                <Text style={globalStyles.title}>JOIN US</Text>

                <View style={{ width: '100%' }}>
                    <CustomInput
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                    />
                    <CustomInput
                        label="Email"
                        placeholder="john@example.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <CustomInput
                        label="Password"
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={globalStyles.button} onPress={handleRegister} disabled={loading}>
                        {loading ? <ActivityIndicator color={theme.colors.secondary} /> : <Text style={globalStyles.buttonText}>REGISTER</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: theme.spacing.l, alignSelf: 'center' }}>
                        <Text style={{ color: theme.colors.primary }}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default RegisterScreen;
