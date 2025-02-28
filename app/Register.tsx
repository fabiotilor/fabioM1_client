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
          console.log("Setting token and redirecting...");
          setToken(response.token);
          // Force immediate navigation
          await router.push("/users/overview");
          // Add fallback navigation
          window.location.href = "/users/overview";
        } else {
          console.error("No token received in response");
          message.error("Registration failed: No token received");
        }
      } catch (error: any) {
        console.error("Registration error details:", error);
        if (error.response?.status === 409) {
          message.error("Username is already taken. Please choose another one.");
        } else {
          message.error(`Registration failed: ${error.message || 'Please try again.'}`);
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <Form
      name="register"
      onFinish={onFinish}
      layout="vertical"
      className="register-form"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: "Please input your username!" },
          { min: 3, message: "Username must be at least 3 characters long!" }
        ]}
      >
        <Input placeholder="Enter your username" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 6, message: "Password must be at least 6 characters long!" }
        ]}
      >
        <Input.Password placeholder="Enter your password" />
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