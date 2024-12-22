import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Video } from 'expo-av';
import HomeStyle from '../gameStyles/HomeStyle';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const videoRef = useRef(null); // Ref for controlling video playback
  const [isPlaying, setIsPlaying] = useState(true); // Track playing state

  // Calculate video height dynamically based on screen size
  const videoHeight = height * 1.0; // 30% of the screen height, adjust as needed

  // Trim video length in milliseconds (e.g., 8 seconds = 8000ms)
  const VIDEO_LENGTH = 8000; // 8 seconds

  // Automatically play video and reset position when it ends
  useEffect(() => {
    const loopVideo = async () => {
      if (videoRef.current) {
        // Check the position and loop video
        const status = await videoRef.current.getStatusAsync();
        if (status.positionMillis >= VIDEO_LENGTH) {
          await videoRef.current.setPositionAsync(0); // Restart video
          videoRef.current.playAsync(); // Play video
        }
      }
    };

    const interval = setInterval(loopVideo, 100); // Check position every 100ms
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <View style={HomeStyle.container}>
      {/* Background Video */}
      <Video
        ref={videoRef}
        source={require('../assets/video/home.mp4')} // Replace with the correct path
        style={[HomeStyle.backgroundVideo, { height: videoHeight }]} // Set the video height dynamically
        resizeMode="cover"
        shouldPlay={isPlaying} // Play automatically
        isMuted // Mutes the video
      />

      {/* Title */}
      <Text style={HomeStyle.title}>Flappy Plane</Text>

      {/* Start Button */}
      <TouchableOpacity
        style={HomeStyle.startButton}
        onPress={() => navigation.navigate('Game')} // Navigate to Game Screen
      >
        <Text style={HomeStyle.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
