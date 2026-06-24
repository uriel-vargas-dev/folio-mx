import { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useClients } from '@/src/hooks';
import { formatCurrency } from '@/src/utils';
import { Client } from '@/src/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ClientsScreen() {
  const { clients, loading, fetchClients } = useClients();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [fetchClients]),
  );

  const renderItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.background, borderColor: colors.icon + '30' }]}
      onPress={() => router.push(`/client/${item.id}`)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.itemInfo}>
        <ThemedText type="defaultSemiBold">{item.nombre}</ThemedText>
        <ThemedText style={styles.whatsapp}>{item.whatsapp}</ThemedText>
      </ThemedView>
      <ThemedText style={[styles.balance, { color: item.saldoPendiente > 0 ? '#e74c3c' : '#27ae60' }]}>
        {formatCurrency(item.saldoPendiente)}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading && clients.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedView style={styles.center}>
            <ThemedText>No hay clientes registrados</ThemedText>
          </ThemedView>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/client/new')}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemInfo: {
    gap: 4,
  },
  whatsapp: {
    fontSize: 13,
    opacity: 0.6,
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    marginTop: -2,
  },
});
