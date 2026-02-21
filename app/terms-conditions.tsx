import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../src/constants';

export default function TermsConditionsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: February 21, 2026</Text>

        <Text style={styles.paragraph}>
          Please read these Terms and Conditions ("Terms") carefully before using the KB Memorial
          Hospital mobile application ("App") operated by KB Memorial Hospital ("we", "our", or
          "us").
        </Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, or using the App, you agree to be bound by these Terms. If
          you do not agree with any part of these Terms, you must not use the App.
        </Text>

        <Text style={styles.heading}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          The KB Memorial Hospital App provides the following services:{'\n'}
          • Information about hospital services, doctors, and departments{'\n'}
          • Senior Citizen Health Card application and management{'\n'}
          • Emergency contact information{'\n'}
          • Hospital contact details and directions{'\n'}
          • Health card benefits information
        </Text>

        <Text style={styles.heading}>3. Eligibility</Text>
        <Text style={styles.paragraph}>
          The Senior Citizen Health Card is available to individuals aged 50 years and above. By
          applying for a health card, you confirm that the information provided is accurate and
          truthful.
        </Text>

        <Text style={styles.heading}>4. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          As a user of the App, you agree to:{'\n'}
          • Provide accurate and complete information{'\n'}
          • Keep your contact information updated{'\n'}
          • Use the App only for lawful purposes{'\n'}
          • Not attempt to gain unauthorized access to any part of the App{'\n'}
          • Not misuse or tamper with the health card system{'\n'}
          • Not impersonate any person or entity
        </Text>

        <Text style={styles.heading}>5. Health Card Terms</Text>
        <Text style={styles.subHeading}>a) Application</Text>
        <Text style={styles.paragraph}>
          Submission of a health card application does not guarantee approval. KB Memorial Hospital
          reserves the right to approve or reject any application at its discretion.
        </Text>
        <Text style={styles.subHeading}>b) Benefits</Text>
        <Text style={styles.paragraph}>
          Health card benefits (discounts on consultations, medicines, diagnostics, etc.) are
          subject to change without prior notice. Benefits are applicable only at KB Memorial
          Hospital, Baheri, Darbhanga.
        </Text>
        <Text style={styles.subHeading}>c) Validity</Text>
        <Text style={styles.paragraph}>
          Health cards are valid as per the validity period mentioned on the card. The hospital
          reserves the right to revoke or suspend a health card if Terms are violated.
        </Text>
        <Text style={styles.subHeading}>d) Non-Transferable</Text>
        <Text style={styles.paragraph}>
          Health cards are non-transferable and can only be used by the person whose name appears
          on the card. Misuse may result in cancellation.
        </Text>

        <Text style={styles.heading}>6. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content in the App, including but not limited to text, graphics, logos, images, and
          software, is the property of KB Memorial Hospital and is protected by applicable
          intellectual property laws.
        </Text>

        <Text style={styles.heading}>7. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The App is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties,
          expressed or implied, regarding the App's reliability, accuracy, or availability. The App
          is not a substitute for professional medical advice, diagnosis, or treatment.
        </Text>

        <Text style={styles.heading}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          KB Memorial Hospital shall not be liable for any indirect, incidental, special, or
          consequential damages arising from:{'\n'}
          • Use or inability to use the App{'\n'}
          • Errors or inaccuracies in content{'\n'}
          • Unauthorized access to your personal data{'\n'}
          • Any interruption or cessation of the App
        </Text>

        <Text style={styles.heading}>9. Medical Disclaimer</Text>
        <Text style={styles.paragraph}>
          The information provided in this App is for general informational purposes only and does
          not constitute medical advice. Always seek the advice of a qualified healthcare provider
          for any medical condition. In case of emergency, call emergency services immediately.
        </Text>

        <Text style={styles.heading}>10. Modification of Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. Changes will be effective
          immediately upon posting in the App. Continued use of the App after any modifications
          constitutes your acceptance of the revised Terms.
        </Text>

        <Text style={styles.heading}>11. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your access to the App at any time, without notice, for
          conduct that we believe violates these Terms or is harmful to other users, us, or third
          parties.
        </Text>

        <Text style={styles.heading}>12. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of India. Any
          disputes arising from these Terms shall be subject to the exclusive jurisdiction of the
          courts in Darbhanga, Bihar, India.
        </Text>

        <Text style={styles.heading}>13. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms, please contact us:{'\n'}
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
