import { useNavigate } from "react-router-dom";

export default function PractitionerSection({
  title,
  description,
  buttonText,
  redirectTo,
  image,
  reverse,
  isFirst,
}) {
  const navigate = useNavigate();

  return (
    <section
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-10 px-8 py-20 bg-white`}
    >
      {/* Text Content */}
      <div className="lg:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B3C53] tracking-tight uppercase">
          {title}
        </h2>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
          {description}
        </p>
        <button
          onClick={() => redirectTo && navigate(redirectTo)}
          className="px-8 py-4 bg-[#FF004D] text-white rounded-full font-bold uppercase tracking-wide shadow-md hover:shadow-lg hover:bg-[#e60040] transition-all active:scale-95"
        >
          {buttonText}
        </button>
      </div>

      {/* Image */}
      <div className="lg:w-1/2">
        <img
          src={image}
          alt="section"
          className="rounded-3xl shadow-xl border border-gray-200"
        />
      </div>
    </section>
  );
}
