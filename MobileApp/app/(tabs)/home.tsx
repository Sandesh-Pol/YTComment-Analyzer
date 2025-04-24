import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';

const FeatureCard = ({ title, icon }: { title: string; icon: any }) => (
  <View className="items-center p-4 rounded-lg w-28">
    <Image source={icon} className="size-28 mb-2" resizeMode="contain" />
    <Text className="text-white text-center text-base font-bold leading-5">{title}</Text>
  </View>
);

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-[#1a1a1a]">
      <View className="flex-1 items-center justify-center py-6 px-4">
        {/* Play Icon */}
        <View className="mb-8">
          <Image
            source={require('../../assets/images/yt-icon.png')}
            className="size-32"
            resizeMode="contain"
          />
        </View>

        {/* Headings */}
        <Text className="text-white text-3xl font-bold text-center mb-1">
          EVERY COMMENT COUNTS
        </Text>
        <Text className="text-white text-3xl font-bold text-center mb-2">
          GET THE MEANING BEHIND IT
        </Text>
        <Text className="text-white text-center mb-8">
          Get instant sentiment analysis on your YouTube comments.
          Know what your audience feels — at a glance.
        </Text>

        {/* CTA Button */}
        <Link href="../link-input" asChild>
          <TouchableOpacity className="bg-red-600 rounded-full px-8 py-3 mb-12">
            <Text className="text-white font-bold text-lg">
              GET INSIGHTS NOW
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Feature Cards */}
        <View className="flex-row justify-center flex-wrap gap-3">
          <FeatureCard
            title="Sentiment Analysis"
            icon={require('../../assets/images/report.png')}
          />
          <FeatureCard
            title="Toxicity Analysis"
            icon={require('../../assets/images/comments.png')}
          />
          <FeatureCard
            title="AI      Insights"
            icon={require('../../assets/images/ai.png')}
          />
        </View>
      </View>
    </ScrollView>
  );
}