import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  CreditCard,
  Layers,
  ShoppingCart,
  Boxes,
  Loader2,
  Save
} from "lucide-react";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { state } = useLocation(); // To check if we are editing an existing item
  const productToEdit = state?.item;

  const [name, setName] = useState(productToEdit?.name || "");
  const [description, setDescription] = useState(productToEdit?.description || "");
  const [price, setPrice] = useState(productToEdit?.price || "");
  const [stock, setStock] = useState(productToEdit?.stock || "");
  const [category, setCategory] = useState(productToEdit?.category || "");
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || "");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!productToEdit;

  const submit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!name || !price || !stock) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      imageUrl
    };

    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/products/${productToEdit.id}` 
        : "http://localhost:8080/api/products";
      
      // Use PUT for updates, POST for new items
      const method = isEditMode ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: productData,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // FIX: Sending the token to avoid 403
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert(isEditMode ? "Product Updated!" : "Product Created!");
        navigate("/practitioner/products");
      }
    } catch (error) {
      console.error("API Error:", error);
      // Detailed error message for 403
      if (error.response?.status === 403) {
        alert("Access Denied (403): You do not have permission to modify products.");
      } else {
        alert(error.response?.data?.message || "Failed to save product.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#1B3C53] font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF004D] text-white rounded-full text-xs font-bold uppercase shadow active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="flex justify-between items-end border-b border-dashed pb-12 mb-12">
          <div>
            <h1 className="text-6xl font-extrabold uppercase italic">
              {isEditMode ? "Update" : "Create"} <span className="text-[#FF004D]">Product</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {isEditMode ? `Modifying ID: ${productToEdit.id}` : "Add a new product for sale."}
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-[#FFF0F2] rounded-full border border-[#FF004D]/20">
            <ShoppingCart className="text-[#FF004D]" size={16} />
            <span className="text-xs font-bold uppercase text-[#FF004D] tracking-widest">
                {isEditMode ? "Edit Mode" : "New Entry Mode"}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <form onSubmit={submit} className="lg:col-span-7 space-y-8">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500">Product Name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PRODUCT_NAME"
                className="w-full border rounded-2xl p-4 font-bold focus:ring-2 focus:ring-[#FF004D] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the product..."
                className="w-full border rounded-2xl p-4 focus:ring-2 focus:ring-[#FF004D] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Stock</label>
                <div className="relative">
                  <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    required
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full pl-12 border rounded-2xl p-4 font-bold outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Price (INR)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-12 border rounded-2xl p-4 font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Category</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-12 border rounded-2xl p-4 font-bold outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-12 border rounded-2xl p-4 font-mono text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#FF004D]'} text-white py-4 rounded-full font-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-95`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (isEditMode ? <Save size={18}/> : <Plus size={18} />)}
              {loading ? "Processing..." : (isEditMode ? "Update Product Node" : "Deploy Product Node")}
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
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20"><ImageIcon size={48} /></div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-extrabold text-xl truncate">{name || "PRODUCT_NAME"}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{description || "Awaiting description..."}</p>
                  <div className="flex justify-between pt-4 border-t mt-4 text-xs font-bold uppercase">
                    <span>Stock: {stock || 0}</span>
                    <span className="text-[#FF004D]">Cost: ₹{price || "0.00"}</span>
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