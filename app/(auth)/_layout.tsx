import { images } from '@/constants';
import { Slot } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

const _Layout = () => {
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'android' ? 'height': 'padding'}
      
    >
      <ScrollView 
        className='bg-white h-full'
        keyboardShouldPersistTaps="handled"
      >
        <View className='w-full h-full' style={{ height: Dimensions.get('screen').height / 2.25}} >
          <ImageBackground 
            source={images.loginGraphic} 
            resizeMode='stretch'
            className='size-full rounded-b-lg' />
          <Image source={images.logo} className='self-center size-48 absolute -bottom-16 z-10' />

        </View>
        
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default _Layout;