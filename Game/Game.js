import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions, Alert, Image } from 'react-native';
import Svg from 'react-native-svg';
import styles from '../gameStyles/GameStyle'; // Import styles
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

// Constants
const GRAVITY_NORMAL = 3;
const GRAVITY_FAST = 4; // Slightly higher gravity to increase the speed without being too harsh
const JUMP_HEIGHT_NORMAL = -14;
const JUMP_HEIGHT_FAST = -16; // Slightly higher jump to adjust for fast taps
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const PIPE_HORIZ_GAP = 300;
const PIPE_SPEED_NORMAL = 5;
const PIPE_SPEED_FAST = 8;
const SPEED_INCREASE_THRESHOLD = 100;

export default function App() {
  const [planePosition, setPlanePosition] = useState(height / 2);
  const [pipes, setPipes] = useState([]);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [explosion, setExplosion] = useState(null);

  const [lastTapTime, setLastTapTime] = useState(0); // To track the last tap time
  const [tapSpeed, setTapSpeed] = useState(0); // To track the speed of the tap

  // Adjust gravity and pipe speed based on the score
  const gravity = score >= SPEED_INCREASE_THRESHOLD ? GRAVITY_FAST : GRAVITY_NORMAL;
  const pipeSpeed = score >= SPEED_INCREASE_THRESHOLD ? PIPE_SPEED_FAST : PIPE_SPEED_NORMAL;
  const jumpHeight = tapSpeed < 200 ? JUMP_HEIGHT_FAST : JUMP_HEIGHT_NORMAL; // Increase jump height with fast taps

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setPlanePosition((pos) => pos + velocity);
      setVelocity((v) => v + gravity); // Adjust gravity dynamically

      setPipes((prevPipes) => {
        const updatedPipes = prevPipes
          .map((pipe) => ({ x: pipe.x - pipeSpeed, height: pipe.height })) // Move pipes faster when score is high
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < width - PIPE_HORIZ_GAP) {
          const pipeHeight = Math.random() * (height - PIPE_GAP - 100) + 50;
          updatedPipes.push({ x: width, height: pipeHeight });
        }

        return updatedPipes;
      });

      pipes.forEach((pipe) => {
        if (
          (planePosition < 0 || planePosition > height) ||
          (pipe.x < 60 + 100 &&
            pipe.x + PIPE_WIDTH > 60 &&
            (planePosition < pipe.height || planePosition > pipe.height + PIPE_GAP))
        ) {
          setExplosion({ x: pipe.x + PIPE_WIDTH, y: planePosition });
          setGameOver(true);
          clearInterval(interval);
          Alert.alert('Game Over!', `Score: ${score}`, [{ text: 'OK', onPress: restartGame }]);
        }
      });

      setScore((s) => s + 1);
    }, 30);

    return () => clearInterval(interval);
  }, [velocity, pipes, planePosition, gameOver, score]);

  const restartGame = () => {
    setPlanePosition(height / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setExplosion(null);
  };

  const jump = () => {
    const currentTapTime = Date.now();
    if (lastTapTime !== 0) {
      const tapDifference = currentTapTime - lastTapTime;
      setTapSpeed(tapDifference); // Store the time difference between taps
    }
    setLastTapTime(currentTapTime);

    // Adjust the jump height dynamically based on the tap speed
    setVelocity(jumpHeight);
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <Svg height={height} width={width}>
          <Image
            source={require('../assets/images/plane.png')}
            style={[styles.planeImage, { top: planePosition - 20 }]}
          />
          {pipes.map((pipe, index) => (
            <React.Fragment key={`pipe-${index}`}>
              <Image
                source={require('../assets/images/building.png')}
                style={[styles.pipeImage, { left: pipe.x, top: 0, height: pipe.height }]}
              />
              <Image
                source={require('../assets/images/building.png')}
                style={[
                  styles.pipeImage,
                  { left: pipe.x, top: pipe.height + PIPE_GAP, height: height - pipe.height - PIPE_GAP },
                ]}
              />
            </React.Fragment>
          ))}

          {explosion && (
            <Image
              source={require('../assets/images/explosion.png')}
              style={[styles.explosionImage, { left: explosion.x - 90, top: explosion.y - 30 }]}
            />
          )}
        </Svg>
        <Text style={styles.score}>{score}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
