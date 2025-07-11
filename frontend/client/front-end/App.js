
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import OrderLookup from './OrderLookupForm';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.type = 'module';
      script.async = true;
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      document.head.appendChild(script);

      const chatbot = document.createElement('zapier-interfaces-chatbot-embed');
      chatbot.setAttribute('is-popup', 'true');
      chatbot.setAttribute('chatbot-id', 'cm8h7wbeq001t4qsg4gbols27');
      document.body.appendChild(chatbot);
    }
  }, []);

  return (
    <OrderLookup />
  );
}

