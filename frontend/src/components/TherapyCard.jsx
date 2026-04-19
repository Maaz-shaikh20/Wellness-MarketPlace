import { useNavigate } from "react-router-dom";

export default function TherapyCard({ therapy, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <img
        src={therapy.imageUrl}
        alt={therapy.name}
        className="rounded-xl h-48 w-full object-cover mb-4"
      />

      <h2 className="text-xl font-bold text-[#1B3C53]">
        {therapy.name}
      </h2>
      <p className="text-gray-600">{therapy.description}</p>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() =>
            navigate(`/practitioner/therapy/edit/${therapy.id}`)
          }
          className="text-blue-600 font-semibold"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(therapy.id)}
          className="text-red-600 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
