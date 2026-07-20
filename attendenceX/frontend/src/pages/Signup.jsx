import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/useToastStore';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function Signup() {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      useToastStore.getState().showToast(
        'Account created successfully. Welcome to AttendX!',
        'success',
        'Account Registered'
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error caught in component:', err);
      const detailsMsg = Array.isArray(err.response?.data?.details) 
        ? err.response.data.details.join(', ') 
        : null;
      const msg = detailsMsg ||
                  err.response?.data?.message || 
                  err.response?.data?.error || 
                  err.message || 
                  'Registration failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-background text-foreground animate-fade-in">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md my-8 animate-slide-up"
      >
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background font-bold text-xl shadow-lg mb-4">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight gradient-text">
            Create your AttendX Account
          </h2>
          <p className="text-sm text-muted mt-1">
            Start tracking attendance & optimizing your grades
          </p>
        </div>

        {/* Card Panel */}
        <div className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {apiError && (
              <div className="p-4 bg-danger-bg border border-danger/20 text-danger rounded-xl text-xs font-semibold">
                {apiError}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-11 glass-input text-sm"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-danger font-semibold">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder="name@university.edu"
                  className="w-full pl-11 glass-input text-sm"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-danger font-semibold">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 glass-input text-sm"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <span className="text-xs text-danger font-semibold">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 glass-input text-sm"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === passwordVal || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-danger font-semibold">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background font-semibold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
