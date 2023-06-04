import React from 'react';
import { View } from 'react-native';
import Navigation from './Navigation';

export default function App() {
  return (
    <View style={{ flex: 1, left:'30%', width:'450px', borderLeftWidth: '5px', borderTopWidth:'5px', 
          borderRightWidth:'5px', borderBottomWidth:'5px', height:'auto', minHeight: '100%', overflow:'auto' }}>
      <Navigation />
    </View>
  );
}
