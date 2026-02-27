import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Standard base dimensions
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const scale = (size) => (screenWidth / BASE_WIDTH) * size;
export const verticalScale = (size) => (screenHeight / BASE_HEIGHT) * size;

const isSmallScreen = screenWidth < 380 || screenHeight < 700;

export const responsive = {
    width: screenWidth,
    height: screenHeight,
    fontScale: isSmallScreen ? 0.85 : 1,
    iconScale: isSmallScreen ? 0.8 : 1,

    // Responsive column widths as percentages of screen width (Total 98% to allow for small margins)
    colUnits: screenWidth * 0.11,
    colArea: screenWidth * 0.10,
    colDate: screenWidth * 0.21,
    colDown: screenWidth * 0.15,
    colTotal: screenWidth * 0.18,
    colAct: screenWidth * 0.23,
};

export default responsive;
