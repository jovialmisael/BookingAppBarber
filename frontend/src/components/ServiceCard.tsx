import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/colors';
import { globalStyles } from '../theme/styles';

interface ServiceCardProps {
    service: {
        id: number;
        name: string;
        duration: number;
        price: string;
        image: string;
    };
    onPress: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={globalStyles.card}>
                <Image source={{ uri: service.image }} style={styles.image} />
                <View style={styles.content}>
                    <Text style={styles.name}>{service.name}</Text>
                    <View style={styles.row}>
                        <Text style={styles.details}>{service.duration} mins</Text>
                        <Text style={styles.price}>Rp {Number(service.price).toLocaleString()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: theme.borderRadius.m,
        borderTopRightRadius: theme.borderRadius.m,
    },
    content: {
        padding: theme.spacing.m,
    },
    name: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.s,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    details: {
        ...theme.typography.body,
        fontSize: 14,
    },
    price: {
        ...theme.typography.h3,
        color: theme.colors.primary,
    },
});

export default ServiceCard;
