import { motion } from 'framer-motion';
import React, { type PropsWithChildren } from 'react';

const PageTransition = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      // initial={{ x: 300, opacity: 0 }}
      // animate={{ x: 0, opacity: 1 }}
      // exit={{ x: 300, opacity: 0 }}
      // transition={{
      //   type: 'spring',
      //   stiffness: 260,
      //   damping: 20,
      // }}
    >
      {children}
    </motion.div>
  );
};

export { PageTransition };
