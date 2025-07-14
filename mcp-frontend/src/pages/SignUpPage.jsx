import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import ClipLoader from 'react-spinners/ClipLoader';

const SignUpPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const {authUser ,  signup } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      signup(data);
      navigate('/');
    } catch (err) {
      toast.error("Signup failed" , err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300"
      >
        <div className="card-body p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="avatar mb-4">
              <div className="w-16 rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center">Join Our Network</h2>
            <p className="text-sm opacity-70 mt-2 text-center">
              Start managing your collection partners today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered w-full"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                {...register("email", {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email format',
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="input input-bordered w-full"
                {...register("password", {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="label">
                <span className="label-text">Select Role</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="mcp"
                    className="radio radio-primary"
                    {...register("role", { required: true })}
                  />
                  <span>MCP</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="pickup"
                    className="radio radio-primary"
                    {...register("role", { required: true })}
                  />
                  <span>Pickup</span>
                </label>
              </div>
              {errors.role && <p className="text-sm text-red-500 mt-1">This field is required</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-2"
            >
              {isSubmitting ? <ClipLoader size={20} color="#fff" /> : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="link link-primary font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
