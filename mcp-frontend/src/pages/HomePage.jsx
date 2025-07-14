import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const { authUser  , checkAuth} = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-24 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            <span className="text-primary">Empower</span> Your Micro Collection Operations
          </h1>
          <p className="text-lg mb-10 text-base-content/80">
            From managing partners to tracking every order — streamline your entire process using our powerful dashboard.
          </p>

          <div className="flex justify-center space-x-4">
            <Link to="/features" className="btn btn-outline btn-lg">
              Explore Features
            </Link>
            <Link to={authUser ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
              {authUser ? "Go to Dashboard" : "Login Now"}
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: '👥',
              title: 'Partner Management',
              desc: 'Add, remove, and track performance of pickup partners',
            },
            {
              icon: '💰',
              title: 'Wallet System',
              desc: 'Real-time fund transfers between MCPs and partners',
            },
            {
              icon: '📦',
              title: 'Order Tracking',
              desc: 'Live status updates from pickup to delivery',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body items-center text-center">
                <span className="text-4xl mb-4">{feature.icon}</span>
                <h3 className="card-title">{feature.title}</h3>
                <p className="opacity-80">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-content py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Managing Smarter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Discover how the MCP System can make your collection workflow smoother and more efficient.
          </p>
          <Link
            to={authUser ? "/dashboard" : "/login"}
            className="btn btn-accent btn-lg"
          >
            {authUser ? 'Go to Dashboard' : 'Login to Continue'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p>© 2025 MCP System. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="link hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="link hover:text-primary">Terms of Service</Link>
            <Link to="/contact" className="link hover:text-primary">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
