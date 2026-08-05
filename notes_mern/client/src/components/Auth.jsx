import React, { useState } from "react";
import { registerUser, loginUser } from "../utils/api";
import { Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setUsernameError("");
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const validateEmail = (val) => {
    if (!val) {
      setEmailError("Email is required");
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin && !regex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (val) => {
    if (!val) {
      setPasswordError("Password is required");
      return false;
    }
    if (val.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateUsername = (val) => {
    if (!isLogin) {
      if (!val) {
        setUsernameError("Username is required");
        return false;
      }
      if (val.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        return false;
      }
      setUsernameError("");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validations
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isUsernameValid = isLogin ? true : validateUsername(username);

    if (!isEmailValid || !isPasswordValid || !isUsernameValid) {
      toast.error("Please correct the validation errors.");
      return;
    }

    setLoading(true);
    const loadToastId = toast.loading(isLogin ? "Signing in..." : "Creating account...");
    
    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        toast.success(data.msg || "Login successful! Welcome back.", { id: loadToastId });
        
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 800);
      } else {
        await registerUser(username, email, password);
        toast.success("Account created successfully! Switching to login.", { id: loadToastId });
        
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.msg ||
        err.response?.data?.Msg ||
        "Authentication failed. Please verify your credentials.";
      
      toast.error(errMsg, { id: loadToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center flex-1 min-h-screen px-4 py-12 bg-app-bg overflow-hidden transition-colors duration-300">
      {/* Decorative ambient glowing lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-app-accent/5 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Auth Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] p-8 glass-panel border border-app-border rounded-2xl shadow-xl z-10 transition-all duration-300"
      >
        {/* Branding & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-app-accent shadow-lg shadow-indigo-500/20 text-white font-bold text-xl mb-4">
            S
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-app-text">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-xs text-app-text-secondary font-medium">
            {isLogin
              ? "Access your dashboard and manage synchronized notes"
              : "Register today for modern note management"}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 mb-6 bg-app-bg-secondary border border-app-border rounded-xl">
          <button
            type="button"
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? "bg-app-card text-app-accent shadow-xs"
                : "text-app-text-secondary hover:text-app-text"
            }`}
            onClick={() => {
              setIsLogin(true);
              resetForm();
            }}
            disabled={loading}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? "bg-app-card text-app-accent shadow-xs"
                : "text-app-text-secondary hover:text-app-text"
            }`}
            onClick={() => {
              setIsLogin(false);
              resetForm();
            }}
            disabled={loading}
          >
            Register
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                key="username-input"
              >
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
                  htmlFor="username"
                >
                  Username
                </label>
                <div className="relative flex items-center">
                  <User
                    size={16}
                    className="absolute left-3.5 text-app-text-secondary pointer-events-none"
                  />
                  <input
                    id="username"
                    type="text"
                    required
                    className={`custom-input ${
                      usernameError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                    }`}
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) validateUsername(e.target.value);
                    }}
                    onBlur={(e) => validateUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {usernameError && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-app-danger font-medium animate-fade-in">
                    <Info size={12} />
                    {usernameError}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
              htmlFor="email"
            >
              {isLogin ? "Email or Username" : "Email Address"}
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-3.5 text-app-text-secondary pointer-events-none"
              />
              <input
                id="email"
                type="text"
                required
                className={`custom-input ${
                  emailError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                }`}
                placeholder={isLogin ? "name@example.com or user1" : "name@example.com"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {emailError && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-app-danger font-medium animate-fade-in">
                <Info size={12} />
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-wider text-app-text-secondary mb-1.5"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute left-3.5 text-app-text-secondary pointer-events-none"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className={`custom-input ${
                  passwordError ? "border-app-danger/50 focus:ring-app-danger/10" : ""
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 text-app-text-secondary hover:text-app-text focus:outline-hidden cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-app-danger font-medium animate-fade-in">
                <Info size={12} />
                {passwordError}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-app-accent text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isLogin ? (
              <>
                <LogIn size={15} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={15} /> Register Account
              </>
            )}
          </button>
        </form>

        {/* Footer toggler */}
        <div className="mt-6 text-center text-xs text-app-text-secondary font-medium">
          {isLogin ? (
            <p>
              New to SyncNotes?{" "}
              <button
                type="button"
                className="text-app-accent hover:underline font-bold cursor-pointer transition-all bg-transparent border-0 p-0"
                onClick={handleToggleMode}
                disabled={loading}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-app-accent hover:underline font-bold cursor-pointer transition-all bg-transparent border-0 p-0"
                onClick={handleToggleMode}
                disabled={loading}
              >
                Sign in instead
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
