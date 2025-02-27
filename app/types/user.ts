export interface User {
  id: number;
  username: string;
  password?: string; // Optional, as you might not want to expose this in all responses
  name?: string; 
  token?: string; // Optional, as it might not always be included
  status?: string; 
  createdAt: string; // Add this property
}