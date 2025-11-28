import useAuthStore from '@/store/auth.store';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      {/* Profile Header */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: user?.avatar }}
          className="w-32 h-32 rounded-full mb-4 border-2 border-blue-500"
        />
        <Text className="text-3xl font-bold text-gray-800">{user?.name}</Text>
        <Text className="text-lg text-gray-600">{user?.email}</Text>
      </View>

      {/* Account Details */}
      <View className="bg-white rounded-lg p-4 shadow-md mb-6">
        <Text className="text-xl font-semibold mb-3 text-gray-800">Account Details</Text>
        <View className="flex-row items-center mb-2">
          <Text className="font-medium text-gray-700 w-24">Email:</Text>
          <Text className="text-gray-600">{user?.email}</Text>
        </View>
        {/* Add more details like phone, address, etc. */}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity className="bg-blue-500 py-3 rounded-lg items-center mb-4">
        <Text className="text-white text-lg font-semibold">Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 py-3 rounded-lg items-center">
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;