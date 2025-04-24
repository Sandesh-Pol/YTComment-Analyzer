import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAnalysisStore } from '../store';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface ToxicComment {
  text: string;  // Comment text (index 0 from backend array)
  score: number; // Toxicity score between 0 and 1 (index 1 from backend array)
}

// Raw comment type from backend
type RawToxicComment = [string, number];

const DonutChart = ({ score, size = 54 }: { score: number; size?: number }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(score, 0), 1); // Ensure value is between 0 and 1
  const progressStroke = circumference * (1 - progressValue);
  
  const getToxicityColor = (score: number) => {
    if (score < 0.3) return "#22c55e"; // Low
    if (score < 0.7) return "#fbbf24"; // Medium
    return "#ef4444"; // High
  };

  const scoreText = Math.round(score * 100).toString();
  const fontSize = scoreText.length > 2 ? 12 : 14; // Adjust font size for 100%

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getToxicityColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressStroke}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
        {/* Score text */}
        <SvgText
          x={size / 2}
          y={size / 2}
          fontSize={fontSize}
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          {scoreText}
        </SvgText>
        {/* Percentage symbol */}
        <SvgText
          x={size / 2 + (fontSize * 1.2)}
          y={size / 2 - (fontSize * 0.2)}
          fontSize={fontSize * 0.7}
          fill="white"
          textAnchor="start"
          alignmentBaseline="central"
        >
        </SvgText>
      </Svg>
    </View>
  );
};

const CommentCard = ({ comment }: { comment: ToxicComment }) => {
  const getToxicityColor = (score: number) => {
    // Ensure score is a valid number
    const validScore = typeof score === 'number' && !isNaN(score) ? score : 0;
    
    if (validScore < 0.3) return "#22c55e"; // Low
    if (validScore < 0.7) return "#fbbf24"; // Medium
    return "#ef4444"; // High
  };

  // Ensure we have valid data
  const score = typeof comment.score === 'number' && !isNaN(comment.score) ? comment.score : 0;
  const text = comment.text || 'No comment text available';

  return (
    <View className="bg-[#1e2633] rounded-lg p-4 mb-4">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center mr-3">
            <Text className="text-white">US</Text>
          </View>
          <Text className="text-white flex-1 text-justify">{text}</Text>
        </View>
        <DonutChart score={score} />
      </View>
    </View>
  );
};

export default function Toxicity() {
  const router = useRouter();
  const { sentimentData, isLoading, error } = useAnalysisStore();

  useEffect(() => {
    console.log('Sentiment Data:', JSON.stringify(sentimentData, null, 2));
    // Navigation guard
    if (!sentimentData && !isLoading) {
      router.replace('/link-input');
    }
  }, [sentimentData, isLoading, router]);

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

  // Transform the array data into the expected format
  const toxicComments = sentimentData?.toxicity?.bert || [];
  console.log('Raw Toxic Comments:', toxicComments);

  // Convert array format to object format
  const formattedComments = toxicComments.map((comment: [string, number]) => ({
    text: comment[0] || 'No comment text available',
    score: typeof comment[1] === 'number' ? comment[1] : 0
  }));

  console.log('Formatted Comments:', formattedComments);

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      <ScrollView className="flex-1 px-4">
        <View className="py-6">
          <Text className="text-white text-4xl font-bold mb-2">
            Toxicity Review
          </Text>
          <Text className="text-gray-300 mb-6">
            Monitor and analyze toxic comments from your YouTube videos
          </Text>

          {/* Legend */}
          <View className="flex-row justify-center items-center space-x-4 mb-6">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              <Text className="text-gray-300 mr-3">High</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
              <Text className="text-gray-300 mr-3">Medium</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-400 mr-2" />
              <Text className="text-gray-300">Low</Text>
            </View>
          </View>

          {/* Comments List or Empty State */}
          {formattedComments.length > 0 ? (
            formattedComments.map((comment: ToxicComment, index: number) => (
              <CommentCard key={index} comment={comment} />
            ))
          ) : (
            <View className="bg-[#1e2633] rounded-lg p-8 items-center justify-center">
              <Text className="text-2xl mb-4">🎉</Text>
              <Text className="text-white text-lg font-semibold text-center mb-2">
                No Toxic Comments Found
              </Text>
              <Text className="text-gray-400 text-center">
                Great news! We didn't detect any significantly toxic comments in the analysis.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}