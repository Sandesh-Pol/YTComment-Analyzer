declare module 'react-native-gifted-charts' {
  export interface PieChartData {
    value: number;
    color?: string;
    text?: string;
    label?: string;
    focused?: boolean;
    onPress?: () => void;
  }

  export interface PieChartProps {
    data: PieChartData[];
    donut?: boolean;
    radius?: number;
    innerRadius?: number;
    innerCircleColor?: string;
    showText?: boolean;
    textColor?: string;
    textSize?: number;
    showTextBackground?: boolean;
    textBackgroundColor?: string;
    textBackgroundRadius?: number;
    strokeWidth?: number;
    strokeColor?: string;
    innerCircleBorderWidth?: number;
    innerCircleBorderColor?: string;
    showValuesAsLabels?: boolean;
    centerLabelComponent?: () => React.ReactNode;
    focusData?: PieChartData[];
    showFocus?: boolean;
  }

  export class PieChart extends React.Component<PieChartProps> {}
} 