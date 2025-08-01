import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  weddingDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ weddingDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const wedding = weddingDate.getTime();
      const difference = wedding - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({ days, hours, minutes });
      } else {
        // Wedding has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every minute
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="countdown">
      <div className="countdown-numbers">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">DAYS</span>
        <span className="countdown-value">{timeLeft.hours}</span>
        <span className="countdown-label">HOURS</span>
        <span className="countdown-value">{timeLeft.minutes}</span>
        <span className="countdown-label">MINS</span>
      </div>
      <div className="countdown-text">UNTIL OUR SPECIAL DAY</div>
    </div>
  );
};

export default CountdownTimer; 