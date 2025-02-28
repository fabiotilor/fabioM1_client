"use client";

import "@ant-design/v5-patch-for-react-19";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input } from "antd";
import { User } from "@/types/user";

interface FormFieldProps {
  username: string;
  password: string;
  name?: string;
}

const Register: React.FC = () => {
  const apiService = useApi();

  const handleRegister = async (values: FormFieldProps) => {
    console.log("Attempting to register with:", values); // This should log when form is submitted
    try {
      const response = await apiService.post<User>("/users/register", values);
      console.log("Registration successful:", response);
      // Handle successful registration
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="register-container">
      <Form onFinish={handleRegister} layout="vertical">
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
    </div>
  );
};

export default Register;