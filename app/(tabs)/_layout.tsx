import { Redirect, Slot } from 'expo-router';
import React from 'react';

const _Layout = () => {
  const isAuthenticated = true;
  if(!isAuthenticated) return <Redirect href='/sign-in' />
  return <Slot />
};


export default _Layout;