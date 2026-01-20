import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import ServiceCard from '../components/ServiceCard';
import { servicesService } from '../services/api';

const HomeScreen = ({ navigation }: any) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchServices = async () => {
        try {
            const response = await servicesService.getAll();
            setServices(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchServices();
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
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, Sir.</Text>
                <Text style={styles.subtitle}>Choose your premium service</Text>
            </View>

            <FlatList
                data={services}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                        <ServiceCard
                            service={item}
                            onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}
                        />
                    </Animated.View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: theme.spacing.l,
        paddingTop: theme.spacing.m,
    },
    welcome: {
        ...theme.typography.h1,
    },
    subtitle: {
        ...theme.typography.body,
        marginTop: theme.spacing.xs,
    },
});

export default HomeScreen;
