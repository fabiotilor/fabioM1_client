"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button } from "antd";
import { useEffect, useState } from "react";

const UserOverview: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { getValue: getToken, removeValue: removeToken } = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await apiService.get<User>("/users/me");
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [apiService, getToken, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-overview-container">
      <h1>Welcome, {user.username}!</h1>
      <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default UserOverview;