import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/Card";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email || !username || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    try {
      await handleRegister({ email, username, password });
      navigate("/");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-sm bg-primary text-white font-bold flex items-center justify-center text-base">
              R
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              RoleFit<span className="text-primary">.AI</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            Personal job & internship strategy platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Start preparing for software engineering roles with personalized AI insights.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-sm text-xs text-danger font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                id="reg-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Username"
                type="text"
                id="reg-username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                id="reg-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-muted">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline ml-1">
              Log in here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
