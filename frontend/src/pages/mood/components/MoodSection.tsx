import React from 'react';
import { motion } from 'framer-motion';

/**
 * MoodSection
 * 通用心情模块容器：统一高度、内边距、滚动样式
 */
const MoodSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="mood-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
};

export default MoodSection;
