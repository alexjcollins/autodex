import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';

export function TabBarBlur() {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint="dark"
        intensity={80}
        style={StyleSheet.absoluteFill}
      />
    );
  }
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,10,12,0.95)' }]} />
  );
}
