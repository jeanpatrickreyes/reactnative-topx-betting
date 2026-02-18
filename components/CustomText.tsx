import React, { ReactNode } from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <Text style={[{ fontFamily: 'NotoSansTC-Medium', includeFontPadding: false }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default CustomText;
