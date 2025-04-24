import React from 'react';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import "../global.css"
import { View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { usePathname, Link } from 'expo-router';
import Constants from 'expo-constants';
import ProfileIcon from '../assets/icons/profile.svg';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  
  const showHeader = pathname !== '/link-input';

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      {showHeader && (
        <View className="h-28 flex-row justify-between items-center px-6 pt-5 bg-[#1a1a1a] border-b border-gray-800">
          <Image
            source={require('../assets/logo/logo-dark.png')}
            className="w-28 ml-5 mt-5 scale-150 h-20"
            resizeMode="contain"
          />
          <Link className='mt-5' href="/profile" asChild>
            <TouchableOpacity>
              <ProfileIcon width={32} height={32} fill="#ffffff" />
            </TouchableOpacity>
          </Link>
        </View>
      )}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
          redirect={true}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="link-input" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
