import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const AnimatedCounter = ({ value, duration = 0.5 }) => {
  const spring = useSpring(0, {
    duration: duration * 1000,
    damping: 50,
    stiffness: 100
  });

  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};
