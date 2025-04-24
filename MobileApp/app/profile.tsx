import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#1a1a1a] p-6">
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl font-bold mb-8">
          Profile
        </Text>
        
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-red-600 rounded-full py-3 px-8"
        >
          <Text className="text-white text-center font-bold">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 