import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  score: {
    position: 'absolute',
    top: 50,
    left: '50%',
    transform: [{ translateX: -20 }],
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  planeImage: {
    position: 'absolute',
    left: 60,
    width: 110,
    height: 40,
  },
  pipeImage: {
    position: 'absolute',
    width: 60, // Same as PIPE_WIDTH
  },
  explosionImage: {
    position: 'absolute',
    width: 150,
    height: 100,
  },
});

export default styles;
