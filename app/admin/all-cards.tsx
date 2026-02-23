import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';
import { Alert } from '../../src/utils/alert';
import { getHealthCardsPaginated } from '../../src/firebase/firebaseService';

const CardItem = ({ card, onView, onPDF, onWhatsApp }: any) => (
  <View style={styles.cardItem}>
    {/* Mini Card Preview */}
    <View style={styles.miniCard}>
      <View style={styles.miniCardHeader}>
        <Text style={styles.miniCardTitle}>KB MEMORIAL HOSPITAL</Text>
      </View>
      <View style={styles.miniCardBody}>
        <View style={styles.photoBox}>
          {card.photo ? (
            <Image source={{ uri: card.photo }} style={styles.miniPhoto} />
          ) : (
            <MaterialCommunityIcons name="account" size={30} color={COLORS.primary} />
          )}
        </View>
        <View style={styles.miniInfo}>
          <Text style={styles.cardNumber}>{card.cardNumber || 'KBMH-SC-XXXXX'}</Text>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardMeta}>Age: {card.age} | {card.gender}</Text>
          <Text style={styles.cardMeta}>Blood: {card.bloodGroup}</Text>
        </View>
      </View>
    </View>

    {/* Action Buttons */}
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.viewBtn} onPress={() => onView(card)}>
        <MaterialCommunityIcons name="eye" size={18} color={COLORS.white} />
        <Text style={styles.actionText}>View</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pdfBtn} onPress={() => onPDF(card)}>
        <MaterialCommunityIcons name="file-pdf-box" size={18} color={COLORS.white} />
        <Text style={styles.actionText}>PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.whatsappBtn} onPress={() => onWhatsApp(card)}>
        <MaterialCommunityIcons name="whatsapp" size={18} color={COLORS.white} />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function AllCardsScreen() {
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  const PAGE_SIZE = 10;
  const [cards, setCards] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  // Load logo as base64 for PDF
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const asset = Asset.fromModule(require('../../assets/logo.png'));
        await asset.downloadAsync();
        if (asset.localUri) {
          const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: 'base64',
          });
          setLogoBase64(`data:image/png;base64,${base64}`);
        }
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  // Initial load
  useEffect(() => {
    loadFirstPage();
  }, []);

  const loadFirstPage = async () => {
    setLoading(true);
    const result = await getHealthCardsPaginated(PAGE_SIZE, null);
    setCards(result.cards);
    setLastDoc(result.lastDoc);
    setHasMore(result.cards.length === PAGE_SIZE);
    setTotalCount(result.cards.length);
    setLoading(false);
  };

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await getHealthCardsPaginated(PAGE_SIZE, null);
    setCards(result.cards);
    setLastDoc(result.lastDoc);
    setHasMore(result.cards.length === PAGE_SIZE);
    setTotalCount(result.cards.length);
    setRefreshing(false);
  }, []);

  // Load next page
  const loadMore = async () => {
    if (loadingMore || !hasMore || !lastDoc) return;
    setLoadingMore(true);
    const result = await getHealthCardsPaginated(PAGE_SIZE, lastDoc);
    if (result.cards.length > 0) {
      setCards((prev) => [...prev, ...result.cards]);
      setLastDoc(result.lastDoc);
      setTotalCount((prev) => prev + result.cards.length);
    }
    setHasMore(result.cards.length === PAGE_SIZE);
    setLoadingMore(false);
  };

  const handleView = (card: any) => {
    router.push({ pathname: '/admin/card-preview', params: { cardId: card.id } });
  };

  const generateHtmlForCard = (card: any) => {
    const emergencyNumber = hospitalInfo?.contact?.emergency || '9262706867';
    const logoHtml = logoBase64 
      ? `<img src="${logoBase64}" style="width: 50px; height: 50px; object-fit: contain;" alt="Logo" />`
      : `<span class="logo-text">KB</span>`;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .card { width: 100%; max-width: 450px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          .header { background: linear-gradient(135deg, #1E88E5, #1565C0); padding: 16px; display: flex; align-items: center; }
          .logo-circle { width: 70px; height: 70px; border-radius: 50%; background: white; border: 3px solid #FFD700; display: flex; align-items: center; justify-content: center; margin-right: 12px; overflow: hidden; }
          .logo-text { font-size: 24px; font-weight: bold; color: #1E88E5; }
          .header-text { color: white; flex: 1; }
          .hospital-name { font-size: 18px; font-weight: bold; }
          .hospital-address { font-size: 12px; opacity: 0.9; margin-top: 2px; }
          .contact { font-size: 12px; margin-top: 4px; }
          .card-type { background: #C62828; padding: 10px; text-align: center; }
          .card-type-text { color: white; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
          .card-body { background: white; padding: 16px; display: flex; }
          .photo-placeholder { width: 90px; height: 110px; border-radius: 8px; border: 2px solid #1E88E5; background: #E3F2FD; display: flex; align-items: center; justify-content: center; margin-right: 16px; color: #1E88E5; font-size: 40px; }
          .details { flex: 1; }
          .detail-row { display: flex; margin-bottom: 4px; font-size: 12px; }
          .detail-label { font-weight: bold; color: #333; width: 75px; }
          .detail-value { color: #333; flex: 1; }
          .blood-phone { display: flex; align-items: center; margin-top: 6px; }
          .blood-group { font-weight: bold; color: #D32F2F; margin-right: 16px; }
          .phone { color: #1E88E5; font-weight: 500; }
          .validity-strip { background: #8B0000; padding: 10px 16px; display: flex; justify-content: space-between; }
          .validity-left, .emergency-right { color: white; font-size: 12px; }
          .validity-value, .emergency-value { color: #FFD700; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo-circle">${logoHtml}</div>
            <div class="header-text">
              <div class="hospital-name">KB MEMORIAL HOSPITAL</div>
              <div class="hospital-address">Baheri, Darbhanga, Bihar</div>
              <div class="contact">📞 Contact: ${emergencyNumber}</div>
            </div>
          </div>
          <div class="card-type"><div class="card-type-text">SENIOR CITIZEN HEALTH CARD</div></div>
          <div class="card-body">
            ${card.photo 
              ? `<img style="width:90px;height:110px;border-radius:8px;border:2px solid #1E88E5;object-fit:cover;margin-right:16px;" src="${card.photo}" alt="Photo" />`
              : `<div class="photo-placeholder">👤</div>`
            }
            <div class="details">
              <div class="detail-row"><span class="detail-label">Card No :</span><span class="detail-value"><b>${card.cardNumber}</b></span></div>
              <div class="detail-row"><span class="detail-label">Name :</span><span class="detail-value">${card.name}</span></div>
              <div class="detail-row"><span class="detail-label">Age/Sex :</span><span class="detail-value">${card.age} / ${card.gender}</span></div>
              <div class="detail-row"><span class="detail-label">Address :</span><span class="detail-value">${card.address}</span></div>
              <div class="blood-phone"><span class="detail-label">Blood Gr :</span><span class="blood-group">${card.bloodGroup}</span><span class="phone">📞 ${card.mobile}</span></div>
            </div>
          </div>
          <div class="validity-strip">
            <div class="validity-left">Valid Till : <span class="validity-value">${card.validity || 'Lifetime'}</span></div>
            <div class="emergency-right">Emergency: <span class="emergency-value">${emergencyNumber}</span></div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Convert local file URI to base64 data URI for PDF embedding
  const getBase64FromUri = async (uri: string) => {
    try {
      if (!uri) return null;
      if (uri.startsWith('data:')) return uri;
      if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
      if (Platform.OS === 'web') return uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const handlePDF = async (card: any) => {
    try {
      let html = generateHtmlForCard(card);

      // Convert photo to base64 for PDF
      if (card.photo) {
        const photoBase64 = await getBase64FromUri(card.photo);
        if (photoBase64) {
          html = html.replace(`src="${card.photo}"`, `src="${photoBase64}"`);
        }
      }

      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Health Card - ${card.name}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('PDF Error:', error);
      Alert.alert('Error', 'Could not generate PDF');
    }
  };

  const handleWhatsApp = async (card: any) => {
    const emergencyNumber = hospitalInfo?.contact?.emergency || '9262706867';
    const message = `*KB Memorial Hospital*
*Senior Citizen Health Card*

📋 *Card Details:*
━━━━━━━━━━━━━━
Card No: ${card.cardNumber}
Name: ${card.name}
Age/Sex: ${card.age} / ${card.gender}
Blood Group: ${card.bloodGroup}
Mobile: ${card.mobile}
━━━━━━━━━━━━━━

📞 *Emergency:* ${emergencyNumber}
⏳ *Valid Till:* ${card.validity || 'Lifetime'}

_Issued by KB Memorial Hospital_`;

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Health Cards</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{totalCount}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Loading cards...</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <CardItem
              card={item}
              onView={handleView}
              onPDF={handlePDF}
              onWhatsApp={handleWhatsApp}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.footerText}>Loading more...</Text>
              </View>
            ) : !hasMore && cards.length > 0 ? (
              <Text style={styles.footerText}>All cards loaded</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="card-off" size={80} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No Cards Generated</Text>
              <Text style={styles.emptyText}>Health cards will appear here once created</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => router.push('/admin/create-card')}
              >
                <MaterialCommunityIcons name="plus" size={20} color={COLORS.white} />
                <Text style={styles.createBtnText}>Create New Card</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
  },
  cardItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  miniCard: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  miniCardHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  miniCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  miniCardBody: {
    flexDirection: 'row',
    padding: 12,
  },
  photoBox: {
    width: 50,
    height: 60,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  miniPhoto: {
    width: 50,
    height: 60,
    borderRadius: 6,
  },
  miniInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
  },
  pdfBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 10,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  createBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 12,
    marginLeft: 8,
  },
});
