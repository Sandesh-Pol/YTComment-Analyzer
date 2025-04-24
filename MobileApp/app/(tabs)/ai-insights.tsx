import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAnalysisStore } from '../store';

const InfoCard = ({ 
  title, 
  icon,
  isLoading = false,
  content
}: { 
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
  content?: string;
}) => (
  <View className="mb-8 overflow-hidden rounded-2xl shadow-lg">
    {/* Header with gradient */}
    <LinearGradient
      colors={['#3c0a0a', '#4a0e0e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="h-12 flex-row items-center px-4"
    >
      <Ionicons name={icon} size={24} color="white" />
      <Text className="text-white font-semibold text-xl ml-3">{title}</Text>
    </LinearGradient>

    {/* Content area */}
    <View className="bg-[#1e2633] p-6 min-h-[180px]">
      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      ) : content ? (
        <Text className="text-gray-300 text-base leading-6">{content}</Text>
      ) : (
        <Text className="text-gray-400 text-base italic text-center">No data available</Text>
      )}
    </View>
  </View>
);

export default function AIInsights() {
  const router = useRouter();
  const { aiReportData, isLoading, error } = useAnalysisStore();

  useEffect(() => {
    // Navigation guard
    if (!aiReportData && !isLoading) {
      router.replace('/link-input');
    }
  }, [aiReportData, isLoading, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center">
        <ActivityIndicator size="large" color="#ff0000" />
        <Text className="text-white mt-4">Analyzing comments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#1a1a1a] items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/link-input')}
          className="bg-red-600 rounded-full px-6 py-3"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const geminiData = aiReportData?.gemini_analysis || {};

  return (
    <ScrollView className="flex-1 bg-[#1a1a1a] px-4 pt-6 pb-12">
      {/* Title Section */}
      <View className="mb-8">
        <Text className="text-white text-4xl font-bold mb-3">
          AI Insights
        </Text>
        <Text className="text-gray-400 text-lg">
          Intelligent analysis powered by machine learning
        </Text>
      </View>

      <InfoCard 
        title="Summary" 
        icon="information-circle"
        content={geminiData.summary}
        isLoading={isLoading}
      />
      
      <InfoCard 
        title="Public Demands" 
        icon="megaphone"
        content={geminiData.public_demands}
        isLoading={isLoading}
      />
      
      <InfoCard 
        title="Suggestions" 
        icon="bulb"
        content={geminiData.suggestions}
        isLoading={isLoading}
      />
    </ScrollView>
  );
} 