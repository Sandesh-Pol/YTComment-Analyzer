import { Tabs } from 'expo-router';
import { usePathname } from 'expo-router';
import { View } from 'react-native';
import HomeIcon from '../../assets/icons/home.svg';
import AnalysisIcon from '../../assets/icons/report.svg';
import ToxicityIcon from '../../assets/icons/toxic.svg';
import AIIcon from '../../assets/icons/ai.svg';

export default function TabLayout() {
  const pathname = usePathname();
  const showTabs = pathname !== '/link-input';

  if (!showTabs) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#1f2937',
          borderTopWidth: 0.2,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#ff0000',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'opacity-100' : 'opacity-50'}>
              <HomeIcon width={24} height={24} fill={color} stroke={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'opacity-100' : 'opacity-50'}>
              <AnalysisIcon width={24} height={24} fill={color} stroke={color} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="toxicity"
        options={{
          title: 'Toxicity',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'opacity-100' : 'opacity-50'}>
              <ToxicityIcon width={24} height={24} fill={color} stroke={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ai-insights"
        options={{
          title: 'AI Insights',
          tabBarIcon: ({ focused, color }) => (
            <View className={focused ? 'opacity-100' : 'opacity-50'}>
              <AIIcon width={24} height={24} fill={color} stroke={color} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
