import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAnalysisStore } from '../store';

interface AnalysisScreenProps {}

const Analysis: React.FC<AnalysisScreenProps> = () => {
  const router = useRouter();
  const { sentimentData, isLoading, error } = useAnalysisStore();

  useEffect(() => {
    // Navigation guard
    if (!sentimentData) {
      router.replace('/link-input');
    }
  }, [sentimentData, router]);

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

  if (!sentimentData) {
    return null; // Will be redirected by useEffect
  }

  const totalComments = sentimentData.total_comments || 0;

  // Convert VADER sentiment data to chart format
  const vaderBreakdown = sentimentData.sentiment?.vader?.breakdown || {};
  const vaderData = [
    { value: vaderBreakdown.spositive || 0, color: '#10b981', label: `${vaderBreakdown.spositive || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.positive || 0, color: '#4ade80', label: `${vaderBreakdown.positive || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.wpositive || 0, color: '#86efac', label: `${vaderBreakdown.wpositive || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.neutral || 0, color: '#9ca3af', label: `${vaderBreakdown.neutral || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.wnegative || 0, color: '#fca5a5', label: `${vaderBreakdown.wnegative || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.negative || 0, color: '#f87171', label: `${vaderBreakdown.negative || 0}%`, focused: false, showFocus: false },
    { value: vaderBreakdown.snegative || 0, color: '#ef4444', label: `${vaderBreakdown.snegative || 0}%`, focused: false, showFocus: false },
  ];

  // Convert TextBlob sentiment data to chart format
  const textBlobBreakdown = sentimentData.sentiment?.textblob?.breakdown || {};
  const textBlobData = [
    { value: textBlobBreakdown.spositive || 0, color: '#10b981', label: `${textBlobBreakdown.spositive || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.positive || 0, color: '#4ade80', label: `${textBlobBreakdown.positive || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.wpositive || 0, color: '#86efac', label: `${textBlobBreakdown.wpositive || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.neutral || 0, color: '#9ca3af', label: `${textBlobBreakdown.neutral || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.wnegative || 0, color: '#fca5a5', label: `${textBlobBreakdown.wnegative || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.negative || 0, color: '#f87171', label: `${textBlobBreakdown.negative || 0}%`, focused: false, showFocus: false },
    { value: textBlobBreakdown.snegative || 0, color: '#ef4444', label: `${textBlobBreakdown.snegative || 0}%`, focused: false, showFocus: false },
  ];

  const sentimentLabels = {
    'Strong Positive': '#10b981',
    'Positive': '#4ade80',
    'Weak Positive': '#86efac',
    'Neutral': '#9ca3af',
    'Weak Negative': '#fca5a5',
    'Negative': '#f87171',
    'Strong Negative': '#ef4444',
  };

  const renderLegend = (text: string, color: string, value: number) => {
    return (
      <View key={text} className="flex-row items-center mx-2 mb-2">
        <View
          style={{ backgroundColor: color }}
          className="h-3 w-3 rounded-full mr-2"
        />
        <Text className="text-white text-[10px]">{`${text} (${value}%)`}</Text>
      </View>
    );
  };

  const renderCenterLabel = (score: number) => {
    let emoji = '😐';
    if (score > 0.5) emoji = '😊';
    if (score < -0.5) emoji = '😔';

    return (
      <View className="items-center">
        <Text className="text-white text-xl">{score.toFixed(2)}</Text>
        <Text className="text-2xl mt-1">{emoji}</Text>
      </View>
    );
  };

  const vaderScore = sentimentData.sentiment?.vader?.overall || 0;
  const textBlobScore = sentimentData.sentiment?.textblob?.overall || 0;

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-white text-4xl font-bold mb-2">
            Sentiment Analysis
          </Text>
          <Text className="text-gray-400 mb-6">
            Analysis of {totalComments} comments using VADER and TextBlob models
          </Text>

          <View className="bg-[#1e2633] rounded-xl p-4 mb-4 shadow-lg">
            <Text className="text-white text-lg font-semibold mb-4">
              VADER Distribution
            </Text>
            <View className="items-center">
              <PieChart
                data={vaderData}
                donut
                showText
                textColor="white"
                radius={120}
                innerCircleColor="#1e2633"
                innerRadius={80}
                innerCircleBorderWidth={0}
                showValuesAsLabels={false}
                showTextBackground={false}
                textBackgroundRadius={0}
                centerLabelComponent={() => renderCenterLabel(vaderScore)}
              />
              <View className="mt-4 flex-row flex-wrap justify-center">
                {Object.entries(sentimentLabels).map(([text, color], index) => 
                  renderLegend(text, color, vaderData[index].value)
                )}
              </View>
            </View>
          </View>

          <View className="bg-[#1e2633] rounded-xl p-4 mb-4 shadow-lg">
            <Text className="text-white text-lg font-semibold mb-4">
              TextBlob Distribution
            </Text>
            <View className="items-center">
              <PieChart
                data={textBlobData}
                donut
                showText
                textColor="white"
                radius={120}
                innerRadius={80}
                innerCircleColor="#1e2633"
                strokeColor="#1e2633"
                innerCircleBorderWidth={0}
                innerCircleBorderColor="#1e2633"
                textSize={12}
                showValuesAsLabels={false}
                textBackgroundRadius={8}
                centerLabelComponent={() => renderCenterLabel(textBlobScore)}
              />
              <View className="mt-4 flex-row flex-wrap justify-center">
                {Object.entries(sentimentLabels).map(([text, color], index) => 
                  renderLegend(text, color, textBlobData[index].value)
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Analysis;