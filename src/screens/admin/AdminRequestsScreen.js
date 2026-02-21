import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAppStore } from '../../store';

const LogoHeader = () => (
  <View style={styles.logoHeader}>
    <Image
      source={require('../../../assets/logo.png')}
      style={styles.headerLogo}
      resizeMode="contain"
    />
    <Text style={styles.headerTitle}>Card Requests</Text>
  </View>
);

const RequestCard = ({ request, onApprove, onReject }) => {
  const statusColors = {
    pending: COLORS.warning,
    approved: COLORS.success,
    rejected: COLORS.error,
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.nameRow}>
          <MaterialCommunityIcons name="account" size={20} color={COLORS.primary} />
          <Text style={styles.name}>{request.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[request.status] + '20' }]}>
          <Text style={[styles.statusText, { color: statusColors[request.status] }]}>
            {request.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>{request.age} years</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Mobile:</Text>
          <Text style={styles.detailValue}>{request.mobile}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue} numberOfLines={2}>{request.address}</Text>
        </View>
      </View>

      {request.status === 'pending' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => onApprove(request)}
          >
            <MaterialCommunityIcons name="check" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => onReject(request.id)}
          >
            <MaterialCommunityIcons name="close" size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AdminRequestsScreen = ({ navigation }) => {
  const { cardRequests, updateRequestStatus } = useAppStore();

  const handleApprove = (request) => {
    Alert.alert(
      'Approve Request',
      `Approve health card for ${request.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & Create Card',
          onPress: () => {
            updateRequestStatus(request.id, 'approved');
            navigation.navigate('AdminCreateCard', { request });
          },
        },
      ]
    );
  };

  const handleReject = (id) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => updateRequestStatus(id, 'rejected'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo Header */}
      <View style={styles.logoHeaderContainer}>
        <LogoHeader />
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {cardRequests.filter((r) => r.status === 'pending').length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {cardRequests.filter((r) => r.status === 'approved').length}
          </Text>
          <Text style={styles.summaryLabel}>Approved</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {cardRequests.filter((r) => r.status === 'rejected').length}
          </Text>
          <Text style={styles.summaryLabel}>Rejected</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={cardRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No requests yet</Text>
            <Text style={styles.emptySubtext}>
              Health card requests will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoHeaderContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
  },
  headerLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.tiny,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    width: 70,
  },
  detailValue: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyText: {
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default AdminRequestsScreen;
