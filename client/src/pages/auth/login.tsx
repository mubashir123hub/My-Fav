import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { useAuth } from "@/contexts/auth-provider";
import { cn } from "@/lib/utils";

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    loginMutation.mutate({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to VideoTube
          </Link>
          
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">VT</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
          </div>
          
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login form */}
        <Card className="glass border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn(
                      "pl-10 focus-ring",
                      errors.email && "border-destructive focus:border-destructive focus:ring-destructive/20"
                    )}
                    disabled={loginMutation.isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn(
                      "pl-10 pr-10 focus-ring",
                      errors.password && "border-destructive focus:border-destructive focus:ring-destructive/20"
                    )}
                    disabled={loginMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Login error */}
              {loginMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Invalid email or password. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>

              {/* Forgot password */}
              <div className="text-center">
                <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                  Forgot your password?
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <Separator />
              
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?
                </p>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register">
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="glass-dark border-border/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Demo Account</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>Email: tech@example.com</p>
                <p>Password: password123</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFormData({
                    email: "tech@example.com",
                    password: "password123",
                  });
                }}
                className="h-8 text-xs"
              >
                Use Demo Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
