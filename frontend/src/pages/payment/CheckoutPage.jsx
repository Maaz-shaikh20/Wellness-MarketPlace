import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  // ✅ Get selected product from navigation state
 const product = location.state?.product;
const fromCart = location.state?.fromCart === true;

const [cartItems, setCartItems] = useState([]);
const [loadingCart, setLoadingCart] = useState(false);


  // ✅ New state for delivery details
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  if (!fromCart) return;

  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const res = await api.get(`/cart?userId=${userId}`);
      setCartItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoadingCart(false);
    }
  };

  fetchCart();
}, [fromCart, userId]);



  const handleCheckout = async () => {
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 10) {
  setAddressError("Delivery address must be at least 10 characters.");
  return;
}
if (!phoneNumber || phoneNumber.length < 10) {
  setPhoneError("Phone number must be at least 10 digits.");
  return;
}

    if (!token || !userId) {
      alert("Session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    if (!deliveryAddress.trim() || !phoneNumber.trim()) {
      setError("Delivery address and phone number are required.");
      return;
    }

    try {
  // ✅ CART CHECKOUT
  if (fromCart) {
    const response = await api.post(
      `/orders/from-cart`,
      null,
      {
        params: {
          userId,
          deliveryAddress,
          phoneNumber,
        },
      }
    );

    navigate("/payment-method", {
      state: { orderId: response.data.orderId },
      replace: true,
    });
    return;
  }

  // ✅ BUY NOW (SINGLE PRODUCT)
  const response = await api.post("/orders", {
    userId,
    deliveryAddress,
    phoneNumber,
    items: [
      {
        itemType: "PRODUCT",
        itemId: product.id,
        quantity: 1,
        unitPrice: product.price,
      },
    ],
  });

  navigate("/payment-method", {
    state: { orderId: response.data.orderId },
    replace: true,
  });
} catch (error) {
  console.error(
    "❌ Order creation failed:",
    error.response?.data || error.message
  );
  alert("Order creation failed. Please try again.");
}

  };

  return (
    <div className="min-h-screen bg-white px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-black"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* HEADER */}
        <section className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold">Checkout</h1>
          <p className="text-slate-500">
            Review your order and proceed to payment
          </p>
        </section>

        {/* CHECKOUT CARD */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ORDER SUMMARY */}
          <div className="border rounded-3xl p-6 space-y-6">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <ShoppingBag size={18} />
              Order Summary
            </h2>

            {fromCart ? (
  <>
    {cartItems.map((item) => (
      <div
        key={item.cartItemId}
        className="flex justify-between text-sm"
      >
        <span className="text-slate-600">
          {item.productName} × {item.quantity}
        </span>
        <span className="font-semibold">
          ₹{item.price}
        </span>
      </div>
    ))}

    <div className="border-t pt-4 flex justify-between text-base font-bold">
      <span>Total</span>
      <span>
        ₹{cartItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        )}
      </span>
    </div>
  </>
) : (
  <>
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{product.name}</span>
      <span className="font-semibold">₹{product.price}</span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-slate-600">Quantity</span>
      <span className="font-semibold">1</span>
    </div>

    <div className="border-t pt-4 flex justify-between text-base font-bold">
      <span>Total</span>
      <span>₹{product.price}</span>
    </div>
  </>
)}


            {/* ✅ Delivery message */}
            <p className="text-xs text-slate-500 pt-2">
              🚚 Delivery will be made within 5 business days.
            </p>
          </div>

          {/* PAYMENT + DELIVERY */}
          <div className="bg-slate-50 rounded-3xl p-6 space-y-6 flex flex-col justify-between">

            <div className="space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <CreditCard size={18} />
                Delivery Details
              </h2>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Billing Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full mt-1 border rounded-xl p-3 text-sm"
                  placeholder="Enter full delivery address"
                  rows={3}
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full mt-1 border rounded-xl p-3 text-sm"
                  placeholder="Enter phone number"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-semibold">{error}</p>
              )}
            </div>
             {/* DELIVERY ADDRESS */}
<div className="space-y-1">
  <label className="text-xs font-bold uppercase text-slate-500">
    Delivery Address
  </label>

  <textarea
    value={deliveryAddress}
    onChange={(e) => {
      setDeliveryAddress(e.target.value);
      setAddressError("");
    }}
    rows={3}
    required
    className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="Enter full delivery address"
  />

  {addressError && (
    <p className="text-xs text-red-500 font-semibold">
      {addressError}
    </p>
  )}
</div>


            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-slate-900 transition"
            >
              Proceed to Pay
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
