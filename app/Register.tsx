// filepath: /Users/fabio/Sopra/fabioM1_client/app/Register.tsx
"use client";

import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Form, Input, Button, message } from "antd";
import { useState } from "react";

interface RegisterFormFields {
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { setValue: setToken } = useLocalStorage<string>("token", "");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormFields) => {
    setLoading(true);
    try {
      console.log("Attempting registration with:", values);
      const response = await apiService.post<{ token: string }>("/users/register", values);
      console.log("Registration response:", response);
      
      if (response && response.token) {
        setToken(response.token);
        console.log("Token set, now redirecting to /users/overview");
        await router.push("/users/overview");
        console.log("Redirect attempted via router.push");
        // Fallback: In case router.push does not work immediately:
        setTimeout(() => {
          console.log("Fallback redirection via window.location.href");
          window.location.href = "/users/overview";
        }, 1000);
      } else {
        message.error("Registration failed: No token returned.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        message.error("Username is already taken.");
      } else {
        message.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="register" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: "Please input your username!" },
          { min: 3, message: "Username must be at least 3 characters." }
        ]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters." }
        ]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;