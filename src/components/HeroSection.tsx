import React from 'react';
import { useData } from '@/context/DataContext';

const HeroSection: React.FC = () => {
  const { settings } = useData();
  return (
    <section className="bg-[#0A1E3C] py-10 flex items-center justify-center">
      <img
        src={settings.logo}
        alt="FFK Futsall"
        className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
        style={{ animation: 'fadeInScale 0.8s ease-out' }}
      />
      <style>{`@keyframes fadeInScale{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}`}</style>
    </section>
  );
};
export default HeroSection;
