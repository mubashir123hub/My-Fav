import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-provider";
import { useToast } from "@/hooks/use-toast";
import type { InsertUser, User } from "@shared/schema";

export function useLogin() {
  const { setUser } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json() as Promise<User>;
    },
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const { setUser } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json() as Promise<User>;
    },
    onSuccess: (user) => {
      setUser(user);
      toast({
        title: "Account created!",
        description: "Welcome to our platform!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return () => {
    logout();
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
}
