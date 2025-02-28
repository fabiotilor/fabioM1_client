"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Tabs } from "antd";
import { useEffect, useState } from "react";

interface FormFieldProps {
  username: string;
  password: string;
  name?: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { setValue: setToken, getValue: getToken } = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (values: FormFieldProps) => {
    try {
      console.log("Sending login request with values:", values);
      const response = await apiService.post<{ token: string }>("/users/login", {
        username: values.username,
        password: values.password,
      });
      console.log("Login response:", response);

      if (response.token) {
        setToken(response.token);
        router.push("/users/overview");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        alert(`Login failed: ${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  const handleRegister = async (values: FormFieldProps) => {
    try {
      console.log("Sending registration request with values:", values);
      const response = await apiService.post<{ token: string }>("/users/register", values);
      console.log("Registration response:", response);

      if (response.token) {
        setToken(response.token);
        router.push("/users/overview");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
        alert(`Registration failed: ${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) {
          return;
        }
        const response = await apiService.get<User>("/users/me");
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [apiService, getToken]);

  const items = [
    {
      key: "1",
      label: "Login",
      children: (
        <Form
          name="login"
          size="large"
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Register",
      children: (
        <Form
          name="register"
          size="large"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: false, message: "Please input your name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  if (user) {
    return (
      <div className="dashboard">
        <h1>Welcome, {user.username}!</h1>
        <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default Page;