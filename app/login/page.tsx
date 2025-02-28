"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Tabs } from "antd";
import { useEffect, useState } from "react";
//import { getApiDomain } from "@/utils/domain";




interface FormFieldProps {
  username: string;
  password: string;
  name?: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (values: FormFieldProps) => {
  try {
    const response = await apiService.post<User>("/users/login", {
      username: values.username,
      password: values.password,
    });

    if (response.token) {
      setToken(response.token);
      router.push("/users/dashboard");
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(`Something went wrong during the login:\n${error.message}`);
    } else {
      console.error("An unknown error occurred during login.");
    }
  }
};

  const handleRegister = async (values: FormFieldProps) => {
    try {
      const response = await apiService.post<User>("/users/register", values );
  
      if (response.token) {
        setToken(response.token);
        router.push("/users/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Registration failed: ${error.message}`);
        router.push("/login");
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
        const response = await apiService.get<User>("/users/me");
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
  
    fetchUserData();
  }, [apiService]); 

  return (
    <div className="login-container">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Login" key="1">
          <Form
            form={form}
            name="login"
            size="large"
            variant="outlined"
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
              <Button type="primary" htmlType="submit" className="login-button">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Register" key="2">
          <Form
            form={form}
            name="register"
            size="large"
            variant="outlined"
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
              <Button type="primary" htmlType="submit" className="login-button">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
  
      {user && (
        <div className="dashboard">
          <h1>Welcome, {user.username}!</h1>
          <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};



export default Login;