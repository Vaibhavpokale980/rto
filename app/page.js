"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/verify-token");
      if (!res.ok) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
    </div>
  );
};

export default Dashboard;
