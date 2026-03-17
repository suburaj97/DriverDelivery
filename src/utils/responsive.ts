import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
const screenWidth = window.width;
const screenHeight = window.height;
const minDim = Math.min(screenWidth, screenHeight);

type Percentage = string | number;

const toNumber = (percentage: Percentage) => {
  if (typeof percentage === 'number') return percentage;
  return parseFloat(percentage.replace('%', ''));
};

// As requested: simple window-based helpers.
export const wp = (percentage: Percentage) =>
  (screenWidth * toNumber(percentage)) / 100;
export const hp = (percentage: Percentage) =>
  (screenHeight * toNumber(percentage)) / 100;

// Useful for rounding corners consistently across devices.
export const rp = (percentage: Percentage) =>
  (minDim * toNumber(percentage)) / 100;

export const isTablet = () => minDim >= 768;

// Optional: try to use react-native-responsive-screen if installed.
// This keeps the project working even when the dependency is not yet installed.
export const responsiveScreen = (() => {
  try {
    const mod = require('react-native-responsive-screen');
    return mod as {
      widthPercentageToDP: (p: string | number) => number;
      heightPercentageToDP: (p: string | number) => number;
    };
  } catch {
    return null;
  }
})();

export const widthPercentageToDP = (p: Percentage) =>
  responsiveScreen?.widthPercentageToDP?.(p as any) ?? wp(p);
export const heightPercentageToDP = (p: Percentage) =>
  responsiveScreen?.heightPercentageToDP?.(p as any) ?? hp(p);
