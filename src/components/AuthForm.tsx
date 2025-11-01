import React, { useState } from "react";
import { register, login } from "../services/api";

interface AuthFormProps {
  onAuth: (token: string, userId: string) => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = isLogin
        ? await login(email, password)
        : await register(email, password, name);
      console.log(res.data);
      console.log(res.data);
      onAuth(res.data.token, res.data.user.id);
    } catch (err: any) {
      console.log(err);
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">{isLogin ? "Login" : "Register"}</h2>
      {!isLogin && (
        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 w-full mb-2"
        onClick={handleSubmit}
      >
        {isLogin ? "Login" : "Register"}
      </button>
      <button
        className="text-blue-500 underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create account" : "Already have account?"}
      </button>
    </div>
  );
}
