import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import authIllustration from '@/assets/images/auth_img.jpg';
import { colors } from '@/theme/tokens';

const ILLUSTRATION_HEIGHT = 168;

export const AuthenticationIllustration = memo(function AuthenticationIllustration() {
  return (
    <View style={styles.container}>
      <Image
        source={authIllustration}
        style={styles.image}
        contentFit="contain"
        accessibilityLabel="Authentication illustration"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: ILLUSTRATION_HEIGHT,
    backgroundColor: colors.neutral[900],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
