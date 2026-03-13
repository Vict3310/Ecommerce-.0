import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className='countdown flex gap-4 items-center font-bold'>
      <div className='time-unit flex flex-col items-center'>
        <span className='label text-[12px] font-medium text-black'>Days</span>
        <span className='value text-[32px] tracking-widest'>{formatNumber(timeLeft.days)}</span>
      </div>
      <span className='colon text-[32px] text-[#E07575] mt-4'>:</span>
      <div className='time-unit flex flex-col items-center'>
        <span className='label text-[12px] font-medium text-black'>Hours</span>
        <span className='value text-[32px] tracking-widest'>{formatNumber(timeLeft.hours)}</span>
      </div>
      <span className='colon text-[32px] text-[#E07575] mt-4'>:</span>
      <div className='time-unit flex flex-col items-center'>
        <span className='label text-[12px] font-medium text-black'>Minutes</span>
        <span className='value text-[32px] tracking-widest'>{formatNumber(timeLeft.minutes)}</span>
      </div>
      <span className='colon text-[32px] text-[#E07575] mt-4'>:</span>
      <div className='time-unit flex flex-col items-center'>
        <span className='label text-[12px] font-medium text-black'>Seconds</span>
        <span className='value text-[32px] tracking-widest'>{formatNumber(timeLeft.seconds)}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
