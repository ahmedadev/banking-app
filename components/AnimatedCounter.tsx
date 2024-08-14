"use client";
import CountUp from "react-countup";
const AnimatedCounter = ({amount}: {amount: number}) => {
  return (
    <CountUp
      duration={2.75}
      decimals={2}
      decimal=","
      prefix="$"
      end={amount}
    />
  );
};
export default AnimatedCounter;
