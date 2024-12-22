import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  backgroundVideo: {
    position: 'absolute',
    width: width, // Make the video fill the screen width
    top: 0, // Position video at the top of the screen
    left: 0, // Align to the left edge
  },
  title: {
    fontSize: width * 0.1, // Responsive font size
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for elegance
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: height * 0.05, // Adjust based on screen height
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.2, // Responsive width
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startButtonText: {
    fontSize: width * 0.05, // Responsive font size
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HomeStyle;
