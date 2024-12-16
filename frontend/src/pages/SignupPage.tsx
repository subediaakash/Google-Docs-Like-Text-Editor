import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { useForm } from "../hooks/useForm";

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit } = useForm({
    name: "",
    email: "",
    password: "",
  });

  const onSubmit = async (data: typeof formData) => {
    try {
      const response = await AuthService.signUp(
        data.name,
        data.email,
        data.password
      );
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 transform transition-all hover:scale-105 duration-300 ease-in-out">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-blue-300 mb-2">Sign Up</h2>
          <p className="text-blue-200 text-sm">Join our community today!</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300 peer placeholder-transparent"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-3 -top-5 text-blue-300 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-blue-300 peer-focus:text-sm"
            >
              Name
            </label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300 peer placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-3 -top-5 text-blue-300 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-blue-300 peer-focus:text-sm"
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors duration-300 peer placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-3 -top-5 text-blue-300 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-blue-300 peer-focus:text-sm"
            >
              Password
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
