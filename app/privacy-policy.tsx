import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../src/constants';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: February 21, 2026</Text>

        <Text style={styles.paragraph}>
          KB Memorial Hospital ("we", "our", or "us") operates the KB Memorial Hospital mobile
          application (the "App"). This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our App.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.subHeading}>a) Personal Information</Text>
        <Text style={styles.paragraph}>
          When you apply for a Senior Citizen Health Card through our App, we collect the following
          information:{'\n'}
          • Full Name{'\n'}
          • Age{'\n'}
          • Gender{'\n'}
          • Blood Group{'\n'}
          • Mobile Number{'\n'}
          • Address{'\n'}
          • Photograph (optional)
        </Text>

        <Text style={styles.subHeading}>b) Automatically Collected Information</Text>
        <Text style={styles.paragraph}>
          We may collect certain information automatically, including:{'\n'}
          • Device type and operating system{'\n'}
          • App usage data{'\n'}
          • Crash reports and performance data
        </Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the collected information for the following purposes:{'\n'}
          • To process and issue Senior Citizen Health Cards{'\n'}
          • To provide hospital services information{'\n'}
          • To contact you regarding your health card application{'\n'}
          • To send emergency and important health notifications{'\n'}
          • To improve our App and services{'\n'}
          • To maintain records as required by healthcare regulations
        </Text>

        <Text style={styles.heading}>3. Data Storage & Security</Text>
        <Text style={styles.paragraph}>
          Your data is stored securely using Google Firebase services, which provides
          industry-standard encryption and security measures. We implement appropriate technical and
          organizational measures to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </Text>

        <Text style={styles.heading}>4. Data Sharing</Text>
        <Text style={styles.paragraph}>
          We do NOT sell, trade, or rent your personal information to third parties. Your data may
          be shared only in the following cases:{'\n'}
          • With authorized hospital staff for health card processing{'\n'}
          • When required by law or government authorities{'\n'}
          • To protect the rights and safety of our patients and staff
        </Text>

        <Text style={styles.heading}>5. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your personal information for as long as your health card is active and as
          required by applicable healthcare laws and regulations. You may request deletion of your
          data by contacting us.
        </Text>

        <Text style={styles.heading}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:{'\n'}
          • Access your personal data{'\n'}
          • Request correction of inaccurate data{'\n'}
          • Request deletion of your data{'\n'}
          • Withdraw consent for data processing{'\n'}
          • Lodge a complaint with relevant authorities
        </Text>

        <Text style={styles.heading}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our App and health card services are intended for senior citizens aged 50 years and above.
          We do not knowingly collect information from children under 13 years of age.
        </Text>

        <Text style={styles.heading}>8. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our App uses the following third-party services:{'\n'}
          • Google Firebase (data storage, authentication){'\n'}
          • Google Play Services{'\n'}
          {'\n'}
          These services have their own privacy policies governing the use of your information.
        </Text>

        <Text style={styles.heading}>9. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          updating the "Last Updated" date. You are advised to review this policy periodically.
        </Text>

        <Text style={styles.heading}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy, please contact us:{'\n'}
          {'\n'}
          KB Memorial Hospital{'\n'}
          Baheri, Darbhanga, Bihar{'\n'}
          Near SBI Bank{'\n'}
          Phone: 9262706867{'\n'}
          Email: kbmemorialhospital@gmail.com
        </Text>

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  bottomSpace: {
    height: 40,
  },
});
