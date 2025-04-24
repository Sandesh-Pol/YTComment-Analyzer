import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface DataPoint {
  x: string;
  y: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({ 
  data, 
  size = 250, 
  strokeWidth = 40 
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.y, 0);

  let currentAngle = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2a3441"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <G transform={`translate(${center}, ${center})`}>
          {data.map((item, index) => {
            const angle = (item.y / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            // Convert angles to radians
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            // Calculate path points
            const x1 = radius * Math.cos(startRad);
            const y1 = radius * Math.sin(startRad);
            const x2 = radius * Math.cos(endRad);
            const y2 = radius * Math.sin(endRad);
            
            // Determine if the arc should be drawn the long way around
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Create the path
            const pathData = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            `;
            
            currentAngle += angle;
            
            return (
              <Path
                key={index}
                d={pathData}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
} 