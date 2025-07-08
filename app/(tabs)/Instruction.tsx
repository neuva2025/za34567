import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Instruction = () => {
  const router = useRouter();

  const sections = [
    {
      title: 'Getting Started',
      icon: 'rocket',
      items: [
        'Download the ZAPP app and create your account',
        'Verify your phone number and email',
        'Browse restaurants and cuisines in your area'
      ]
    },
    {
      title: 'How to Order',
      icon: 'restaurant',
      items: [
        'Search for your favorite restaurant or cuisine',
        'Browse the menu and add any number of items to your — all from a single food outlet.',
        'At checkout, make sure all selected items belong to the same restaurant for a smoother ordering experience',
        'Review your order in the cart and proceed to checkout',
        'Tap the “Pay” button to confirm your order — payment is done only upon delivery by handing over cash or Paytm to the Zapper (our delivery partner)',
        'When you tap the pay button, a popup will appear — make sure to enter your exact delivery location within SRM (e.g., hostel block, classroom number, gate, etc.)',
        'Once the order is placed, the back button leads to the home screen — to place another order or try a different outlet, simply use the search bar to jump right into the next restaurant!'
      ]
    },
    {
      title: 'Tracking Your Order',
      icon: 'bicycle',
      items: [
        'After placing an order, track it in real-time',
        'Receive notifications for order confirmation',
        'Get updates when food is being prepared',
        'Receive notification upon delivery',
        'Dont worry about the ordered food and items we have the zapper all information and we can track them down if any indiciplined actions occured '
      ]
    },
    {
      title: 'ZAPP Points',
      icon: 'gift',
      items: [
        'Earn points with every order',
        '1 ZAPP Point for every ₹10 spent',
        'Redeem points for discounts on future orders',
        '100 points = ₹50 discount',
        'Points expire after 6 months',
        'This feature is coming Soon ! '
      ]
    },
    {
      title: 'Payment Methods',
      icon: 'card',
      items: [
        'Credit/Debit Cards',
        'Digital Wallets (Paytm, GPay, PhonePe)',
        'Net Banking',
        'Cash on Delivery',
        'ZAPP Wallet (pre-paid credits)'
      ]
    },
    {
      title: 'Delivery Information',
      icon: 'location',
      items: [
        'Standard delivery time: 20-45 minutes',
        'Track your order in real-time',
        'Contact delivery partner directly',
        'Leave delivery instructions for partner',
        'Contactless delivery available'
      ]
    },
    {
      title: 'Customer Support',
      icon: 'help-circle',
      items: [
        'In-app chat support available 24/7',
        'Call support: 7305634497',
        'Email: zappentrega@gmail.com',
        'Report issues with orders instantly',
        'Get refunds for cancelled orders'
      ]
    },
    {
      title: 'Safety & Hygiene',
      icon: 'shield-checkmark',
      items: [
        'All restaurants follow safety protocols',
        'Delivery partners undergo health checks',
        'Contactless delivery options available',
        'Sealed packaging for all orders',
        'Regular sanitization of delivery bags'
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>How to Use ZAPP</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Welcome to ZAPP!</Text>
          <Text style={styles.introText}>
            Your favorite food, delivered fast. Here's everything you need to know to get started.
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={24} color="#000" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemContainer}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Need More Help?</Text>
          <Text style={styles.footerText}>
            Contact our support team at{'\n'}
            <Text style={styles.footerHighlight}>zappentrega@gmail.com</Text>
            {'\n'}or call us at{'\n'}
            <Text style={styles.footerHighlight}>7305634497</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introSection: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginTop: 8,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 32,
    borderRadius: 12,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  footerHighlight: {
    color: '#000',
    fontWeight: '600',
  },
});

export default Instruction;