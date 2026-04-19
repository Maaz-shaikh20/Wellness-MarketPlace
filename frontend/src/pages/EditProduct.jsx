import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon, CreditCard, Boxes, Loader2 } from "lucide-react";

// Backend base URL
const BACKEND_URL = "http://localhost:8080"; // <-- Spring Boot backend

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
  });

  // FETCH PRODUCT DATA ON MOUNT
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        // If backend requires auth, attach token here
        const token = localStorage.getItem("token"); // <-- store JWT after login
        const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });

        if (response.ok) {
          const data = await response.json();
          setForm(data);
        } else {
          console.error("Product not found or access denied", response.status);
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // <-- attach JWT for PUT request

      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Success! Product updated.");
        navigate(-1);
      } else {
        const errorText = await response.text();
        console.error("Server error details:", errorText);
        alert(`Update failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error: Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // LOADING SCREEN
  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="font-bold uppercase tracking-widest opacity-50">
          Loading Product {id}...
        </p>
      </div>
    );
  }

  // MAIN FORM JSX
  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1B3C53]">
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs uppercase opacity-50 hover:opacity-100 mb-10"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h1 className="text-6xl font-black uppercase italic mb-12">
          Edit <span className="text-blue-500">Product</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1">
              Product Name
            </label>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-2xl p-4 font-bold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-2xl p-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-40 ml-1">
                Stock Amount
              </label>
              <div className="relative">
                <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full pl-12 border rounded-2xl p-4 font-bold"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-40 ml-1">
                Price (INR)
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full pl-12 border rounded-2xl p-4 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold opacity-40 ml-1">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-12 border rounded-2xl p-4 font-mono text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3C53] disabled:bg-gray-400 text-white py-5 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4 hover:bg-[#2a5a7a] transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {loading ? "Saving Changes..." : "Save Product"}
          </button>
        </form>

        {/* Preview Section */}
        <aside className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="flex items-center gap-3 opacity-40">
              <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
              <span className="flex-grow border-t border-dashed border-gray-200" />
            </div>
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
              <div className="relative h-64 bg-gray-50">
                {form?.imageUrl ? (
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20"><ImageIcon size={48} /></div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-extrabold text-xl truncate">{form.name || "PRODUCT_NAME"}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{form.description || "Awaiting description..."}</p>
                <div className="flex justify-between pt-4 border-t mt-4 text-xs font-bold uppercase">
                  <span>Stock: {form.stock || 0}</span>
                  <span className="text-[#FF004D]">Cost: ₹{form.price || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
        </div>
      </main>
    </div>
  );
}
