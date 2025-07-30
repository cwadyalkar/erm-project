"use client";

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAuth } from "./hooks/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSubmitting(true);

      const success = login(email.trim(), password.trim());
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }

      setSubmitting(false);
    },
    [email, password, login, navigate]
  );

  return (
    <div className="min-h-screen tracking-wide flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Engineering Resource Management
          </CardTitle>
          <CardDescription className="text-sm font-medium text-gray-500">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 font-medium tracking-wide">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2 font-medium tracking-wide">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full text-white bg-blue-600 mt-2" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 tracking-wide rounded-lg  border">
            <p className="text-sm font-semibold mb-2 text-gray-700">Demo Accounts:</p>
            <div className="text-sm tracking-wide font-medium space-y-1 text-gray-600">
              <p><strong>Manager:</strong> manager@demo.com / manager123</p>
              <p><strong>Engineer:</strong> alice@demo.com / alice123</p>
              <p><strong>Engineer:</strong> bob@demo.com / bob123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
