import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions, Alert, Image } from 'react-native';
import Svg from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Constants
const GRAVITY = 3; // Gravity effect
const JUMP_HEIGHT = -14; // Height of plane jump
const PIPE_WIDTH = 60; // Width of pipes
const PIPE_GAP = 200; // Gap between top and bottom pipes (vertical gap)
const PIPE_HORIZ_GAP = 300; // Horizontal gap between consecutive pipe sets

export default function App() {
  const [planePosition, setPlanePosition] = useState(height / 2); // Plane's position
  const [pipes, setPipes] = useState([]); // Pipes
  const [velocity, setVelocity] = useState(0); // Plane's velocity
  const [score, setScore] = useState(0); // Score
  const [gameOver, setGameOver] = useState(false); // Game over flag
  const [explosion, setExplosion] = useState(null); // Explosion position

  // Start game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Update plane position
      setPlanePosition((pos) => pos + velocity);
      setVelocity((v) => v + GRAVITY);

      // Move pipes
      setPipes((prevPipes) => {
        const updatedPipes = prevPipes.map((pipe) => ({
          x: pipe.x - 5,
          height: pipe.height,
        })).filter((pipe) => pipe.x > -PIPE_WIDTH);

        // Add new pipes
        if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < width - PIPE_HORIZ_GAP) {
          const pipeHeight = Math.random() * (height - PIPE_GAP - 100) + 50;
          updatedPipes.push({ x: width, height: pipeHeight });
        }

        return updatedPipes;
      });

      // Check collisions
      pipes.forEach((pipe) => {
        if (
          (planePosition < 0 || planePosition > height) || // Hits ground or sky
          (pipe.x < 60 + 100 && pipe.x + PIPE_WIDTH > 60 && // Check if the plane's image collides with pipes
            (planePosition < pipe.height || planePosition > pipe.height + PIPE_GAP))
        ) {
          // Set explosion position at the collision point
          setExplosion({ x: pipe.x + PIPE_WIDTH, y: planePosition });
          setGameOver(true);
          clearInterval(interval);
          Alert.alert('Game Over!', `Score: ${score}`, [{ text: 'OK', onPress: restartGame }]);
        }
      });

      // Update score
      setScore((s) => s + 1);
    }, 30);

    return () => clearInterval(interval);
  }, [velocity, pipes, planePosition, gameOver]);

  // Restart Game
  const restartGame = () => {
    setPlanePosition(height / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setExplosion(null); // Reset explosion
  };

  // Handle jump
  const jump = () => {
    setVelocity(JUMP_HEIGHT); // Negative velocity makes the plane go up
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        {/* Plane */}
        <Svg height={height} width={width}>
          <Image
            source={require('./assets/images/plane.png')} // Ensure this is the correct path to your plane image
            style={{
              position: 'absolute',
              left: 60,
              top: planePosition - 20, // Adjust for plane's size
              width: 110, // Adjust the width of the plane image
              height: 40, // Adjust the height of the plane image
            }}
          />
          {pipes.map((pipe, index) => (
            <React.Fragment key={`pipe-${index}`}>
              {/* Top Building */}
              <Image
                source={require('./assets/images/building.png')} // Replace with your building image path
                style={{
                  position: 'absolute',
                  left: pipe.x,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.height,
                }}
              />
              {/* Bottom Building */}
              <Image
                source={require('./assets/images/building.png')} // Replace with your building image path
                style={{
                  position: 'absolute',
                  left: pipe.x,
                  top: pipe.height + PIPE_GAP,
                  width: PIPE_WIDTH,
                  height: height - pipe.height - PIPE_GAP,
                }}
              />
            </React.Fragment>
          ))}

          {/* Explosion Image */}
          {explosion && (
            <Image
              source={require('./assets/images/explosion.png')} // Ensure this is the correct path to your explosion image
              style={{
                position: 'absolute',
                left: explosion.x - 95, // Center explosion image around collision point
                top: explosion.y - 50, // Adjust explosion image size
                width: 150, // Adjust the width of the explosion image
                height: 100, // Adjust the height of the explosion image
              }}
            />
          )}
        </Svg>
        {/* Score */}
        <Text style={styles.score}>{score}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
});
