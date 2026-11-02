import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';
import { MedicineShipment, getTrackingUrl } from './trackingHelper';

interface Props {
  shipment: MedicineShipment;
}

export const MedicineTrackingCard: React.FC<Props> = ({ shipment }) => {
  const trackingUrl = getTrackingUrl(shipment.provider, shipment.trackingNumber, shipment.customTrackingUrl);

  const handleOpenTracking = async () => {
    try {
      const supported = await Linking.canOpenURL(trackingUrl);
      if (supported) {
        await Linking.openURL(trackingUrl);
      } else {
        Alert.alert('Unable to open link', `Please visit: ${trackingUrl}`);
      }
    } catch (err) {
      console.error('Error opening tracking URL', err);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.providerLabel}>{shipment.providerName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{shipment.status.replace('_', ' ')}</Text>
        </View>
      </View>

      <Text style={styles.title}>Homeopathic Remedy Package</Text>
      <Text style={styles.subtext}>{shipment.remedySummary}</Text>

      <View style={styles.trackingBox}>
        <View>
          <Text style={styles.caption}>AWB / TRACKING NUMBER</Text>
          <Text style={styles.awbText}>{shipment.trackingNumber}</Text>
        </View>
      </View>

      {shipment.estimatedDeliveryDate && (
        <Text style={styles.estDate}>
          📅 Est. Arrival: <Text style={{ fontWeight: '600' }}>{shipment.estimatedDeliveryDate}</Text>
        </Text>
      )}

      <TouchableOpacity style={styles.trackButton} onPress={handleOpenTracking} activeOpacity={0.85}>
        <Text style={styles.trackButtonText}>Track on {shipment.providerName} ↗</Text>
      </TouchableOpacity>

      <Text style={styles.careNote}>
        🌱 Care Note: Keep remedies away from strong sunlight, coffee, and camphor.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E4DC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#2D5A43',
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: '#EBF4EF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#2D5A43',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B3B2B',
  },
  subtext: {
    fontSize: 14,
    color: '#5A685F',
    marginTop: 2,
  },
  trackingBox: {
    backgroundColor: '#FBF9F5',
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  caption: {
    fontSize: 11,
    color: '#8A968E',
    fontWeight: '600',
  },
  awbText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B3B2B',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  estDate: {
    fontSize: 13,
    color: '#2D5A43',
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#2D5A43',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  careNote: {
    fontSize: 12,
    color: '#8A968E',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

