import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={28}
    height={43}
    fill="#FFFFFF"
    {...props}
  >
    <Path
      stroke="#FFDDD2"
      d="M8.638.248C3.956 8.433-.52 26.993 19.028 35.76M18.15 40.737h8.282l-4.215-7.301"
    />
  </Svg>
);

export default SvgComponent;