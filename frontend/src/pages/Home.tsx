import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
  FaBookOpen,
  FaUtensils,
  FaUsers,
  FaArrowRight,
  FaPaperPlane,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  // No longer need setRunTour
}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Ref for Mission Statement
  const missionRef = useRef<HTMLDivElement>(null);
  const isMissionInView = useInView(missionRef);

  // Parallax effect for hero section
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Smooth spring animation for scroll-driven effects
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // State for newsletter email
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() === "") {
      alert("Please enter a valid email address.");
      return;
    }
    // Here you can handle the subscription logic, e.g., API call
    console.log("Subscribed with email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(45,212,191,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.1),transparent_50%)]" />
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: smoothY, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-3xl transform -translate-y-1/2" />

            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                Welcome to{" "}
              </span>
              <div className="inline-block">
                <span className="text-white">Chef</span>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  Express
                </span>
              </div>
            </h1>

            <p className="text-2xl md:text-4xl text-gray-300 mb-8 leading-relaxed">
              Experience the future of cooking,{" "}
              <span className="text-teal-400">one recipe at a time</span>
            </p>

            {/* Reduced margin-bottom to decrease space */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full font-semibold text-xl text-gray-900 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300"
              onClick={() => {
                if (missionRef.current) {
                  missionRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label="Start Exploring Our Mission"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Exploring
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating elements background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-teal-500/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </header>

      {/* Mission Statement */}
      <motion.section
        ref={missionRef}
        className="py-16 px-6 relative" // Reduced padding
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <p className="text-2xl text-gray-300 leading-relaxed">
            To empower home cooks and professional chefs alike by providing a seamless cooking
            experience, from discovering new recipes to sharing culinary creations with the
            community.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={isMissionInView ? "visible" : "hidden"}
        className="py-24 px-6 relative" // Reduced padding
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent" // Reduced margin-bottom
            variants={itemVariants}
          >
            Explore, Learn, Create
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaBookOpen,
                title: "Learn",
                description: "Discover a world of culinary knowledge and skills",
                link: "/Learn",
              },
              {
                icon: FaUtensils,
                title: "Make & Share",
                description: "Unleash your creativity and share your culinary masterpieces",
                link: "/Make",
              },
              {
                icon: FaShoppingCart,
                title: "Order",
                description: "Easily order tools and have them delivered to your door",
                link: "/Order",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

                {/* Content Container with Higher Z-Index */}
                <div className="relative z-10 h-full backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Feature Icon and Description */}
                  <div>
                    {/* Updated Icon Styling */}
                    <feature.icon className="text-6xl mb-6 text-teal-400" />
                    <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>

                  {/* "Learn More" Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(feature.link)}
                    className="mt-6 bg-teal-500 text-gray-900 px-4 py-2 rounded-full hover:bg-teal-400 transition duration-200 flex items-center"
                    aria-label={`Learn more about ${feature.title}`}
                  >
                    Learn More
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { number: "10k+", label: "Recipes" },
              { number: "50k+", label: "Active Chefs" },
              { number: "100k+", label: "Monthly Users" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <h4 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                  {stat.number}
                </h4>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
            What Chefs Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "ChefExpress revolutionized my cooking journey!",
                author: "Alex Chen",
                role: "Home Chef",
              },
              {
                text: "The AI-powered recommendations are spot-on!",
                author: "Sarah Johnson",
                role: "Food Blogger",
              },
              {
                text: "Best cooking platform I've ever used!",
                author: "Mike Peterson",
                role: "Professional Chef",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                className="group relative flex flex-col"
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

                {/* Content Container with Higher Z-Index */}
                <div className="relative z-10 backdrop-blur-sm bg-gray-800/50 border border-gray-700/50 p-8 rounded-2xl shadow-lg flex flex-col justify-between h-full">
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Testimonial Text */}
                  <p className="text-gray-300 italic mb-6 flex-grow">
                    {testimonial.text}
                  </p>

                  {/* Author Information */}
                  <div>
                    <p className="font-semibold text-teal-400">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-gray-800/50 border border-gray-700/50 p-12 rounded-2xl text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Join Our Newsletter
              </span>
            </h2>
            <p className="text-gray-300 mb-8">
              Get weekly recipes and cooking tips delivered to your inbox
            </p>
            {!isSubscribed ? (
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-6 py-3 bg-gray-700 text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubscribe}
                  className="flex items-center justify-center px-6 py-3 bg-teal-500 text-gray-900 rounded-full hover:bg-teal-400 transition duration-200"
                  aria-label="Subscribe to Newsletter"
                >
                  Subscribe
                  <FaPaperPlane className="ml-2" />
                </motion.button>
              </div>
            ) : (
              <div className="text-green-400 text-xl font-semibold">
                Thank you for subscribing!
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
