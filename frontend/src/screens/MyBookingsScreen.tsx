import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { theme } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { bookingService } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const MyBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getMyBookings();
            setBookings(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBookings();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const renderItem = ({ item }: any) => (
        <View style={globalStyles.card}>
            <View style={styles.header}>
                <Text style={styles.serviceName}>{item.service_name}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status.toUpperCase()}</Text>
            </View>
            <Text style={styles.date}>{new Date(item.booking_date).toDateString()} at {item.booking_time}</Text>
            {item.notes ? <Text style={styles.notes}>Note: {item.notes}</Text> : null}
        </View>
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return theme.colors.success;
            case 'cancelled': return theme.colors.error;
            default: return theme.colors.accent;
        }
    };

    if (loading) {
        return (
            <View style={globalStyles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>My Bookings</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    serviceName: {
        ...theme.typography.h3,
    },
    status: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    date: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    notes: {
        ...theme.typography.caption,
        fontStyle: 'italic',
    },
    empty: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xl,
    },
});

export default MyBookingsScreen;
