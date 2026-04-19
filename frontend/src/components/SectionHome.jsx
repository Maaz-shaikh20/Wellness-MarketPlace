import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SectionHome({
  title,
  description,
  buttonText,
  redirectTo,
  onClick,
  image,
  bgColor = "",
  reverse = false,
  isFirst = false,
}) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleButtonClick = () => {
    if (onClick) return onClick();
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <section
      ref={sectionRef}
      className={`${bgColor} relative overflow-hidden ${
        isFirst ? "pt-28 pb-24" : "py-28"
      }`}
    >
      {/* soft ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAF9] to-white pointer-events-none" />

      <div
        className={`relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center gap-20 ${
          reverse ? "md:flex-row-reverse" : ""
        } ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-16"
        } transition-all duration-[1200ms] ease-out`}
      >
        {/* Image */}
        <div className="md:w-2/5 w-full">
          <img
            src={image}
            alt={title}
            className="w-full h-[420px] object-cover rounded-[2.8rem] shadow-xl transition-transform duration-700 hover:scale-[1.015]"
          />
        </div>

        {/* Content */}
        <div className="md:w-3/5 w-full space-y-8">
          <h2 className="text-[2.6rem] md:text-[3.8rem] font-extrabold text-[#1B3C53] leading-tight tracking-tight">
            {title}
          </h2>

          <p className="text-[#475569] text-lg leading-relaxed font-medium max-w-2xl">
            {description}
          </p>

          <button
            onClick={handleButtonClick}
            className="inline-flex items-center justify-center px-12 py-5 rounded-full
              bg-gradient-to-r from-[#1B3C53] to-[#274C77]
              text-white font-bold text-sm tracking-widest uppercase
              shadow-lg hover:shadow-xl hover:scale-[1.03]
              active:scale-95 transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
