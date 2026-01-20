import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../theme/colors';
import CustomInput from './CustomInput';
import { bookingService } from '../services/api';

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    serviceId: number | null;
    serviceName: string;
    onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onClose, serviceId, serviceName, onSuccess }) => {
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleBooking = async () => {
        setLoading(true);
        try {
            // Format date as YYYY-MM-DD
            const formattedDate = date.toISOString().split('T')[0];
            // Format time as HH:MM
            const formattedTime = date.toTimeString().split(' ')[0].substring(0, 5);

            await bookingService.create({
                service_id: serviceId,
                booking_date: formattedDate,
                booking_time: formattedTime,
                notes
            });
            Alert.alert('Success', 'Booking created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to create booking.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            // Preserve the time, only change the date
            const newDate = new Date(date);
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            setDate(newDate);
        }
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(false);
        if (selectedDate) {
            // Preserve the date, only change the time
            const newDate = new Date(date);
            newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            setDate(newDate);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Book {serviceName}</Text>

                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>Time</Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onTimeChange}
                        />
                    )}

                    <CustomInput
                        label="Notes"
                        placeholder="Any special requests?"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBooking} style={[styles.button, styles.confirmButton]} disabled={loading}>
                            {loading ? <ActivityIndicator color={theme.colors.secondary} /> : <Text style={styles.confirmText}>Confirm</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        padding: theme.spacing.m,
    },
    modalContent: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.l,
    },
    title: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.l,
        textAlign: 'center',
    },
    label: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        marginTop: theme.spacing.s,
    },
    dateButton: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.s,
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
        marginBottom: theme.spacing.m,
    },
    dateText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.m,
    },
    button: {
        flex: 1,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.s,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.error,
        marginRight: theme.spacing.s,
    },
    confirmButton: {
        backgroundColor: theme.colors.primary,
        marginLeft: theme.spacing.s,
    },
    cancelText: {
        color: theme.colors.error,
        fontWeight: 'bold',
    },
    confirmText: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
});

export default BookingModal;
