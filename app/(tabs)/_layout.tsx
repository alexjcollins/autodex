import { Tabs } from 'expo-router';
import { Compass, Warehouse, Star, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { TabBarBlur } from '@/components/TabBarBlur';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F5F5F7',
        tabBarInactiveTintColor: '#6B6B75',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          position: 'absolute',
          borderTopColor: 'rgba(255,255,255,0.06)',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0A0A0C',
          elevation: 0,
        },
        tabBarBackground: () => <TabBarBlur />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          tabBarIcon: ({ color, size }) => <Warehouse color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => <Star color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
