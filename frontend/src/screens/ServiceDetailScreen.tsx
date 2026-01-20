import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { theme } from '../theme/colors';
import { globalStyles } from '../theme/styles';
import { servicesService } from '../services/api';
import BookingModal from '../components/BookingModal';

const ServiceDetailScreen = ({ route }: any) => {
    const { id } = route.params;
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await servicesService.getById(id);
                setService(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    if (loading || !service) {
        return (
            <View style={globalStyles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView>
                <Animated.View entering={FadeInUp.duration(600).springify()}>
                    <Image source={{ uri: service.image }} style={styles.image} />
                    <View style={styles.content}>
                        <Text style={styles.name}>{service.name}</Text>
                        <View style={styles.row}>
                            <Text style={styles.info}>{service.duration} mins</Text>
                            <View style={styles.dot} />
                            <Text style={styles.rating}>★ {service.rating}</Text>
                        </View>
                        <Text style={styles.price}>Rp {Number(service.price).toLocaleString()}</Text>

                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{service.description}</Text>

                        <Text style={styles.sectionTitle}>Testimonials</Text>
                        <View style={styles.testimonial}>
                            <Text style={styles.testimonialText}>"Best {service.name} I've ever had!" - Satisfied Client</Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={globalStyles.button} onPress={() => setModalVisible(true)}>
                    <Text style={globalStyles.buttonText}>BOOK NOW</Text>
                </TouchableOpacity>
            </View>

            <BookingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                serviceId={service.id}
                serviceName={service.name}
                onSuccess={() => setModalVisible(false)} // Could navigate to success screen or MyBookings
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: theme.spacing.l,
    },
    name: {
        ...theme.typography.h1,
        fontSize: 28,
        marginBottom: theme.spacing.s,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    info: {
        ...theme.typography.body,
        color: theme.colors.accent,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.accent,
        marginHorizontal: theme.spacing.s,
    },
    rating: {
        ...theme.typography.body,
        color: theme.colors.primary,
    },
    price: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginBottom: theme.spacing.l,
    },
    sectionTitle: {
        ...theme.typography.h3,
        marginTop: theme.spacing.m,
        marginBottom: theme.spacing.s,
    },
    description: {
        ...theme.typography.body,
        lineHeight: 24,
    },
    testimonial: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.s,
        marginTop: theme.spacing.s,
    },
    testimonialText: {
        ...theme.typography.body,
        fontStyle: 'italic',
    },
    footer: {
        padding: theme.spacing.m,
        backgroundColor: theme.colors.card,
        borderTopWidth: 1,
        borderTopColor: theme.colors.secondary,
    },
});

export default ServiceDetailScreen;
