import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import ProfileIcon from "../assets/icons/profile.svg";
import { useAnalysisStore } from './store';
import axios from 'axios';
import { ENDPOINTS, API_CONFIG } from '../config/api';

export default function LinkInput() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState('');
  const [commentCount, setCommentCount] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  
  const { 
    setVideoUrl: storeVideoUrl, 
    setCommentCount: storeCommentCount,
    setSentimentData,
    setAiReportData,
    setError: setStoreError,
    reset,
    sentimentData 
  } = useAnalysisStore();

  const validateInput = () => {
    // Debug logs
    console.log('Validating URL:', videoUrl);
    
    // Basic URL validation first
    if (!videoUrl || !videoUrl.trim()) {
      setError('YouTube video URL is required');
      return false;
    }

    // Simplified YouTube URL validation
    const hasYouTubeUrl = videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/');
    if (!hasYouTubeUrl) {
      setError('Please enter a valid YouTube video URL');
      return false;
    }

    // Debug logs
    console.log('Validating comment count:', commentCount);
    
    // Validate comment count
    const count = parseInt(commentCount);
    if (!commentCount.trim() || isNaN(count) || count < 1 || count > 500) {
      setError('Please enter a valid number between 1 and 500');
      return false;
    }

    // Clear error if validation passes
    setError('');
    return true;
  };

  const handleAnalyze = async () => {
    console.log('Handle analyze called with URL:', videoUrl);
    
    if (!validateInput()) {
      console.log('Validation failed with error:', error);
      return;
    }

    setError('');
    setLoading(true);
    reset(); // Reset store state before new analysis

    try {
      // Store the input values
      storeVideoUrl(videoUrl);
      storeCommentCount(Number(commentCount));

      // First API call for sentiment analysis
      const sentimentResponse = await axios.post(ENDPOINTS.SENTIMENT, {
        video_url: videoUrl,
        comment_count: Number(commentCount)
      }, API_CONFIG);
      
      setSentimentData(sentimentResponse.data);

      // Second API call for AI report
      const aiReportResponse = await axios.post(ENDPOINTS.AI_REPORT, {
        video_url: videoUrl,
        comment_count: Number(commentCount),
        sentiment_data: sentimentResponse.data
      }, API_CONFIG);
      
      setAiReportData(aiReportResponse.data);
      
      router.push('/(tabs)/analysis');
    } catch (err) {
      let errorMessage = 'An error occurred during analysis';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      }
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#1a1a1a]">
      {/* Header */}
      <View className="flex-row justify-between items-end p-4 border-b border-gray-800 h-28">
        <Image
          source={require('../assets/logo/logo-dark.png')}
          className="w-40 h-10 ml-2 resize-contain"
        />
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <ProfileIcon width={32} height={32} fill="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Main Content */}
        <View className="py-8">
          <Text className="text-white text-3xl font-bold leading-tight">
            READY TO DECODE YOUR{'\n'}COMMENTS ?
          </Text>
          
          <Text className="text-gray-400 mt-4 mb-8">
            🔍 Paste your YouTube video link and choose how many comments you want Insightify to analyze.
          </Text>

          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          {/* Video URL Input */}
          <View className="mb-6">
            <Text className="text-white mb-2 text-base">🎥 Video URL</Text>
            <TextInput
              value={videoUrl}
              onChangeText={(text) => {
                setError(''); // Clear error when user types
                setVideoUrl(text);
              }}
              placeholder="https://www.youtube.com/watch?v=abc123"
              placeholderTextColor="#666"
              className="bg-[#2a2a2a] text-white p-4 rounded-lg mb-2"
              editable={!isLoading}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text className="text-gray-400 text-sm">ℹ️ Example: https://youtube.com/watch?v=abc123 or https://youtu.be/abc123</Text>
          </View>

          {/* Comment Count Input */}
          <View className="mb-8">
            <Text className="text-white mb-2 text-base">💬 Number of Comments</Text>
            <TextInput
              value={commentCount}
              onChangeText={setCommentCount}
              placeholder="e.g. 100"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              className="bg-[#2a2a2a] text-white p-4 rounded-lg mb-2"
              editable={!isLoading}
            />
            <Text className="text-gray-400 text-sm">📉 We'll analyze the top comments first. Max value is 500</Text>
          </View>

          {/* Analyze Button */}
          <TouchableOpacity
            onPress={handleAnalyze}
            disabled={isLoading}
            className={`bg-red-600 rounded-full py-4 mb-8 ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="#ffffff" />
                <Text className="text-white text-center font-bold text-lg ml-2">
                  {sentimentData ? 'Generating AI Report...' : 'Analyzing Comments...'}
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Analyze Comments
              </Text>
            )}
          </TouchableOpacity>

          {/* Feature Tags */}
          <View className="flex-row justify-between items-center mb-8">
            <View className="items-center">
              <Text className="text-white text-sm">🧠</Text>
              <Text className="text-gray-400 text-xs mt-1">Emotion Detection</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-sm">😊</Text>
              <Text className="text-gray-400 text-xs mt-1">Sentiment Analysis</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-sm">☠️</Text>
              <Text className="text-gray-400 text-xs mt-1">Toxicity Filtering</Text>
            </View>
          </View>

          {/* Back to Home Button */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/home')}
            className="flex-row items-center justify-center bg-[#2a2a2a] rounded-lg py-3 px-4"
          >
            <Text className="text-white font-semibold text-base mr-2">←</Text>
            <Text className="text-white font-semibold text-base">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}