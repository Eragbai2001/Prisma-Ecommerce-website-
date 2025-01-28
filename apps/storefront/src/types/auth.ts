export interface User {
    id: string;
    email: string | null;
    name?: string;
    // Add other user fields from your schema as needed
  }
  
  export interface AuthState {
    authenticated: boolean;
    user: User | null;
  }