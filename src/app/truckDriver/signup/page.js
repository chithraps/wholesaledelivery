"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function TruckDriverSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    licenseNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  
  const validateForm = () => {
    const newErrors = {};
    const mobileRegex = /^[0-9]{10}$/;
    const licenseRegex = /^[A-Z0-9-]+$/;

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License number is required.";
    } else if (!licenseRegex.test(formData.licenseNumber)) {
      newErrors.licenseNumber = "Enter a valid license number.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/truckDriver/tdSignUp", formData);

      if (response.status === 201) {
        toast.success("Information added successfully!", {
            onClose: () => {
              router.push("/");
            },
          });
      }
    } catch (error) {
      console.error("Signup error:", error);     
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Truck Driver Signup
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Mobile
            </label>
            <input
              type="Number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              License Number
            </label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.licenseNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
            )}
          </div>

          
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
