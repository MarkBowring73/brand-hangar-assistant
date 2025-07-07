import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Linking, StyleSheet } from 'react-native';

export default function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('✅ OrderLookup component loaded');
  }, []);

  const fetchOrder = async () => {
    try {
      const trimmed = orderNumber.trim().toLowerCase();
      console.log('🔍 Searching for:', trimmed);

      const response = await fetch(`https://brand-hangar-backend.onrender.com/api/order?ordernumber=${orderNumber}`, {
        method: 'GET',
        mode: 'cors'
      });

      const data = await response.json();
      console.log('📦 API returned:', data);

      if (Array.isArray(data)) {
        const matched = data.find(o => o.OrderNumber?.toLowerCase() === trimmed);

        if (matched) {
          console.log('✅ Match found:', matched);
          setOrderData(matched);
          setError(null);
        } else {
          console.log('❌ No exact match for:', trimmed);
          setOrderData(null);
          setError("No exact match found for that order number.");
        }
      } else if (data?.OrderNumber?.toLowerCase() === trimmed) {
        setOrderData(data);
        setError(null);
      } else {
        setOrderData(null);
        setError("No order found with that number.");
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Network error: ${err.message}`);
      setOrderData(null);
    }
  };

  const getStatusDetails = (statusId) => {
    const map = {
      1: { label: 'NEW', backgroundColor: '#e5e7eb', color: '#1f2937' },
      2: { label: 'PRINTED', backgroundColor: '#bfdbfe', color: '#1e3a8a' },
      3: { label: 'CANCELLED', backgroundColor: '#fecaca', color: '#991b1b' },
      4: { label: 'DESPATCHED', backgroundColor: '#bbf7d0', color: '#065f46' },
      5: { label: 'INVOICED', backgroundColor: '#ddd6fe', color: '#5b21b6' },
      6: { label: 'INVOICE FAILED', backgroundColor: '#fca5a5', color: '#7f1d1d' },
      7: { label: 'HOLDING', backgroundColor: '#fde68a', color: '#92400e' },
      8: { label: 'FAILED', backgroundColor: '#fecaca', color: '#991b1b' },
      9: { label: 'ON BACKORDER', backgroundColor: '#fed7aa', color: '#9a3412' },
      10: { label: 'AWAITING CONFIRMATION', backgroundColor: '#fef3c7', color: '#92400e' },
    };

    return map[parseInt(statusId)] || {
      label: `Unknown (ID: ${statusId})`,
      backgroundColor: '#e5e7eb',
      color: '#6b7280'
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Order Lookup</Text>

      <TextInput
        value={orderNumber}
        onChangeText={setOrderNumber}
        placeholder="Enter order number"
        style={styles.input}
      />

      <View style={styles.buttonWrapper}>
        <Button title="Search" onPress={fetchOrder} color="#2563eb" />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {orderData && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Order: {orderData.OrderNumber}</Text>
          <Text>Name: {orderData.FirstName} {orderData.LastName}</Text>
          <Text>Email: {orderData.Email}</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusDetails(orderData.OrderStatusId).backgroundColor,
                color: getStatusDetails(orderData.OrderStatusId).color
              }
            ]}>
              {getStatusDetails(orderData.OrderStatusId).label}
            </Text>
          </View>

          <Text>Total Items: {orderData.TotalItems}</Text>
          <Text>Value: £{orderData.OrderValue}</Text>
          <Text>Shipping: {orderData.Address1}, {orderData.Town}, {orderData.PostCode}</Text>

          {orderData.TrackingURL && (
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(orderData.TrackingURL)}
            >
              Track your order
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 18,
  },
  buttonWrapper: {
    marginTop: 10,
  },
  error: {
    marginTop: 16,
    color: 'red',
    fontSize: 16,
  },
  result: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
