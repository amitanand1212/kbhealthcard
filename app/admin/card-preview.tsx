import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';
import { Alert } from '../../src/utils/alert';

const { width } = Dimensions.get('window');

export default function CardPreviewScreen() {
  const { cardId } = useLocalSearchParams();
  const { healthCards } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);
  const healthCardBenefits = useAppStore((state) => state.healthCardBenefits);

  // Find the card from store
  const card: any = cardId
    ? healthCards.find((c: any) => c.id === cardId)
    : healthCards.length > 0
    ? healthCards[healthCards.length - 1]
    : {
        cardNumber: 'KBMH-SC-00125',
        name: 'Sample Name',
        age: '68',
        gender: 'Male',
        address: 'Village Chhotipatti, Post+PS Baheri, Darbhanga, Bihar',
        bloodGroup: 'B+',
        mobile: '8765432109',
        validity: 'Lifetime',
        photo: null,
      };

  if (!card) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={60} color={COLORS.error} />
        <Text style={styles.errorText}>Card not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const generateHtmlContent = (photoUri?: string | null) => {
    const emergencyNumber = hospitalInfo?.contact?.emergency || '9262706867';
    const photoSrc = photoUri || card.photo;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .card { width: 100%; max-width: 450px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          .header { background: linear-gradient(135deg, #1E88E5, #1565C0); padding: 16px; display: flex; align-items: center; }
          .logo-circle { width: 70px; height: 70px; border-radius: 50%; background: white; border: 3px solid #FFD700; display: flex; align-items: center; justify-content: center; margin-right: 12px; }
          .logo-text { font-size: 24px; font-weight: bold; color: #1E88E5; }
          .header-text { color: white; flex: 1; }
          .hospital-name { font-size: 18px; font-weight: bold; letter-spacing: 0.5px; }
          .hospital-address { font-size: 12px; opacity: 0.9; margin-top: 2px; }
          .contact { font-size: 12px; margin-top: 4px; }
          .card-type { background: #C62828; padding: 10px; text-align: center; }
          .card-type-text { color: white; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
          .card-body { background: white; padding: 16px; display: flex; }
          .photo { width: 90px; height: 110px; border-radius: 8px; border: 2px solid #1E88E5; background: #E3F2FD; display: flex; align-items: center; justify-content: center; margin-right: 16px; object-fit: cover; }
          .photo-placeholder { width: 90px; height: 110px; border-radius: 8px; border: 2px solid #1E88E5; background: #E3F2FD; display: flex; align-items: center; justify-content: center; margin-right: 16px; color: #1E88E5; font-size: 40px; }
          .details { flex: 1; }
          .detail-row { display: flex; margin-bottom: 4px; font-size: 12px; }
          .detail-label { font-weight: bold; color: #333; width: 75px; }
          .detail-value { color: #333; flex: 1; }
          .blood-phone { display: flex; align-items: center; margin-top: 6px; }
          .blood-group { font-weight: bold; color: #D32F2F; margin-right: 16px; font-size: 12px; }
          .phone { color: #1E88E5; font-weight: 500; font-size: 12px; }
          .validity-strip { background: #8B0000; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; }
          .validity-left { color: white; font-size: 12px; }
          .validity-value { color: #FFD700; font-weight: bold; }
          .emergency-right { color: white; font-size: 11px; }
          .emergency-value { color: #FFD700; font-weight: bold; }
          .info-section { display: flex; gap: 8px; margin-top: 16px; }
          .info-box { flex: 1; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .info-header { background: #1E88E5; padding: 10px; text-align: center; }
          .info-title { color: white; font-size: 12px; font-weight: bold; }
          .info-content { padding: 12px; font-size: 11px; }
          .bullet-row { display: flex; align-items: flex-start; margin-bottom: 5px; }
          .bullet { width: 5px; height: 5px; border-radius: 50%; background: #1E88E5; margin-top: 4px; margin-right: 8px; }
          .issued-by { margin-top: 12px; text-align: right; font-size: 10px; }
          .issued-hospital { font-weight: bold; color: #1E88E5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="logo-circle">
              <span class="logo-text">KB</span>
            </div>
            <div class="header-text">
              <div class="hospital-name">KB MEMORIAL HOSPITAL</div>
              <div class="hospital-address">Baheri, Darbhanga, Bihar</div>
              <div class="contact">📞 Contact: ${emergencyNumber}</div>
            </div>
          </div>
          <div class="card-type">
            <div class="card-type-text">SENIOR CITIZEN HEALTH CARD</div>
          </div>
          <div class="card-body">
            ${photoSrc 
              ? `<img class="photo" src="${photoSrc}" alt="Photo" />`
              : `<div class="photo-placeholder">👤</div>`
            }
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Card No :</span>
                <span class="detail-value"><b>${card.cardNumber || 'KBMH-SC-00125'}</b></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Name :</span>
                <span class="detail-value">${card.name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Age/Sex :</span>
                <span class="detail-value">${card.age} / ${card.gender}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address :</span>
                <span class="detail-value">${card.address}</span>
              </div>
              <div class="blood-phone">
                <span class="detail-label">Blood Gr :</span>
                <span class="blood-group">${card.bloodGroup}</span>
                <span class="phone">📞 ${card.mobile}</span>
              </div>
            </div>
          </div>
          <div class="validity-strip">
            <div class="validity-left">
              Valid Till : <span class="validity-value">${card.validity || 'Lifetime'}</span>
            </div>
            <div class="emergency-right">
              Emergency Helpline: <span class="emergency-value">${emergencyNumber}</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-box">
            <div class="info-header">
              <div class="info-title">Card Holder Benefits</div>
            </div>
            <div class="info-content">
              <div class="bullet-row"><span class="bullet"></span>Priority OPD Registration</div>
              <div class="bullet-row"><span class="bullet"></span>Discount on Consultation</div>
              <div class="bullet-row"><span class="bullet"></span>Discount on Lab Tests</div>
              <div class="bullet-row"><span class="bullet"></span>Emergency Assistance Support</div>
              <div class="bullet-row"><span class="bullet"></span>Health Checkup Offers</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-header">
              <div class="info-title">Important Notes</div>
            </div>
            <div class="info-content">
              <div class="bullet-row"><span class="bullet"></span>Card is non-transferable</div>
              <div class="bullet-row"><span class="bullet"></span>Must carry card during visit</div>
              <div class="bullet-row"><span class="bullet"></span>Hospital decision will be final</div>
              <div class="issued-by">
                <div style="font-style: italic; color: #666;">Issued by</div>
                <div class="issued-hospital">KB Memorial Hospital</div>
                <div style="color: #666;">Baheri, Darbhanga, Bihar</div>
              </div>
            </div>
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
      // If already a data URI or http URL, return as-is
      if (uri.startsWith('data:')) return uri;
      if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
      // Convert local file to base64
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

  const handleDownloadPDF = async () => {
    try {
      // Convert photo to base64 for PDF embedding
      let photoForPdf: string | null = null;
      if (card.photo) {
        // Try base64 conversion first (works for local file URIs)
        const base64 = await getBase64FromUri(card.photo);
        if (base64) {
          photoForPdf = base64;
        } else if (card.photo.startsWith('http')) {
          // For remote URLs, fetch and convert to base64
          try {
            const response = await fetch(card.photo);
            const blob = await response.blob();
            const reader = new FileReader();
            photoForPdf = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          } catch (fetchErr) {
            console.warn('Could not fetch remote image for PDF:', fetchErr);
            photoForPdf = card.photo; // fallback to URL
          }
        }
      }

      // Generate HTML with the resolved photo URI directly
      const htmlContent = generateHtmlContent(photoForPdf);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Health Card PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('PDF Error:', error);
      Alert.alert('Error', 'Could not generate PDF. Please try again.');
    }
  };

  const handleWhatsAppShare = async () => {
    const emergencyNumber = hospitalInfo?.contact?.emergency || '9262706867';
    const message = `*KB Memorial Hospital*
*Senior Citizen Health Card*

📋 *Card Details:*
━━━━━━━━━━━━━━
Card No: ${card.cardNumber || 'KBMH-SC-00125'}
Name: ${card.name}
Age/Sex: ${card.age} / ${card.gender}
Blood Group: ${card.bloodGroup}
Mobile: ${card.mobile}
Address: ${card.address}
━━━━━━━━━━━━━━

✅ *Benefits:*
• Priority OPD Registration
• Discount on Consultation
• Discount on Lab Tests
• Emergency Assistance Support
• Health Checkup Offers

📍 *Hospital:* Baheri, Darbhanga, Bihar
📞 *Emergency:* ${emergencyNumber}
⏳ *Valid Till:* ${card.validity || 'Lifetime'}

_Issued by KB Memorial Hospital_`;

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp');
    }
  };

  const benefits = healthCardBenefits?.benefits || [
    { id: 1, title: 'Priority OPD Registration' },
    { id: 2, title: 'Discount on Consultation' },
    { id: 3, title: 'Discount on Lab Tests' },
    { id: 4, title: 'Emergency Assistance Support' },
    { id: 5, title: 'Health Checkup Offers' },
  ];

  const importantNotes = [
    'Card is non-transferable',
    'Must carry card during visit',
    'Hospital decision will be final',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Health Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Health Card */}
        <View style={styles.cardContainer}>
          {/* Card Header - Blue with Golden Logo Border */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.logoCircle}>
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.hospitalName}>KB MEMORIAL HOSPITAL</Text>
              <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
              <View style={styles.contactRow}>
                <MaterialCommunityIcons name="phone" size={12} color={COLORS.white} />
                <Text style={styles.contactText}>Contact: {hospitalInfo?.contact?.emergency || '9262706867'}</Text>
              </View>
            </View>
          </View>

          {/* Red Strip - Card Type */}
          <View style={styles.cardTypeStrip}>
            <Text style={styles.cardTypeText}>SENIOR CITIZEN HEALTH CARD</Text>
          </View>

          {/* Card Body - White */}
          <View style={styles.cardBody}>
            {/* Photo */}
            <View style={styles.photoContainer}>
              {card.photo ? (
                <Image source={{ uri: card.photo }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialCommunityIcons name="account" size={50} color={COLORS.primary} />
                </View>
              )}
            </View>

            {/* Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card No :</Text>
                <Text style={styles.detailValueBold}>{card.cardNumber || 'KBMH-SC-00125'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailColon}>:</Text>
                <Text style={styles.detailValue}>{card.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age/Sex :</Text>
                <Text style={styles.detailValue}>{card.age} / {card.gender}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Address :</Text>
                <Text style={[styles.detailValue, styles.addressText]}>{card.address}</Text>
              </View>
              <View style={styles.bloodPhoneRow}>
                <Text style={styles.detailLabel}>Blood Gr :</Text>
                <Text style={styles.bloodGroupValue}>{card.bloodGroup}</Text>
                <View style={styles.phoneInline}>
                  <MaterialCommunityIcons name="phone" size={12} color={COLORS.primary} />
                  <Text style={styles.phoneText}>{card.mobile}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Validity Strip - Dark Red */}
          <View style={styles.validityStrip}>
            <View style={styles.validityLeft}>
              <Text style={styles.validityLabel}>Valid Till :</Text>
              <Text style={styles.validityValue}>{card.validity || 'Lifetime'}</Text>
            </View>
            <View style={styles.validityDivider} />
            <View style={styles.validityRight}>
              <Text style={styles.emergencyLabel}>Emergency Helpline:</Text>
              <Text style={styles.emergencyValue}>{hospitalInfo?.contact?.emergency || '9262706867'}</Text>
            </View>
          </View>
        </View>

        {/* Benefits and Notes Section */}
        <View style={styles.infoSection}>
          {/* Card Holder Benefits */}
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <Text style={styles.infoBoxTitle}>Card Holder Benefits</Text>
            </View>
            <View style={styles.infoBoxContent}>
              {benefits.map((benefit: any, index: number) => (
                <View key={benefit.id || index} style={styles.bulletRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{benefit.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <Text style={styles.infoBoxTitle}>Important Notes</Text>
            </View>
            <View style={styles.infoBoxContent}>
              {importantNotes.map((note, index) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>{note}</Text>
                </View>
              ))}
              <View style={styles.issuedBy}>
                <Text style={styles.issuedByLabel}>Issued by</Text>
                <Text style={styles.issuedByHospital}>KB Memorial Hospital</Text>
                <Text style={styles.issuedByAddress}>Baheri, Darbhanga, Bihar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.pdfButton} onPress={handleDownloadPDF} activeOpacity={0.8}>
            <MaterialCommunityIcons name="file-pdf-box" size={22} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppShare} activeOpacity={0.8}>
            <MaterialCommunityIcons name="whatsapp" size={22} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Share WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/admin/dashboard')} activeOpacity={0.8}>
          <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.white} />
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // Card Container
  cardContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  // Card Header
  cardHeader: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  headerLeft: {
    marginRight: 12,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  logoImage: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  headerRight: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  hospitalAddress: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: {
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 4,
  },

  // Card Type Strip
  cardTypeStrip: {
    backgroundColor: '#C62828',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardTypeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },

  // Card Body
  cardBody: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: COLORS.white,
  },
  photoContainer: {
    marginRight: 14,
  },
  photo: {
    width: 85,
    height: 105,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  photoPlaceholder: {
    width: 85,
    height: 105,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    width: 68,
  },
  detailColon: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
  },
  detailValueBold: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
    fontWeight: 'bold',
  },
  addressText: {
    lineHeight: 17,
  },
  bloodPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bloodGroupValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.error,
    marginRight: 10,
  },
  phoneInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 11,
    color: COLORS.primary,
    marginLeft: 3,
    fontWeight: '500',
  },

  // Validity Strip
  validityStrip: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  validityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityLabel: {
    fontSize: 12,
    color: COLORS.white,
  },
  validityValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  validityDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  validityRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyLabel: {
    fontSize: 11,
    color: COLORS.white,
    marginRight: 4,
  },
  emergencyValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
  },
  infoBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoBoxHeader: {
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  infoBoxContent: {
    padding: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 10,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 14,
  },
  issuedBy: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  issuedByLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  issuedByHospital: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  issuedByAddress: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 16,
    gap: 12,
  },
  pdfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 10,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 10,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
