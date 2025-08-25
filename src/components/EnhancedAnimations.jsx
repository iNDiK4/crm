import React from 'react';
import './EnhancedAnimations.css';

// Компонент для улучшенных анимаций и переходов
const EnhancedAnimations = ({ children, type = 'fadeIn', delay = 0, duration = 0.3 }) => {
  const animationClass = `animate-${type}`;
  const style = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };

  return (
    <div className={animationClass} style={style}>
      {children}
    </div>
  );
};

export default EnhancedAnimations;
