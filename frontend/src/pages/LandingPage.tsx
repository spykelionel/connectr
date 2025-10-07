import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  MessageCircle,
  Play,
  Shield,
  Sparkles,
  Stars,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME, COPYRIGHT_TEXT } from "../utils/constants";

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Unsplash images for hero section
  const heroImages = [
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop&crop=center",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Globally",
      description:
        "Build meaningful relationships with people from around the world",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Engage in instant conversations with your network",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Networks & Communities",
      description: "Join or create communities based on your interests",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance and smooth interactions",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Engagement Tools",
      description: "Express yourself with reactions, comments, and sharing",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Entrepreneur",
      content: `${APP_NAME} has revolutionized how I connect with my professional network. The interface is beautiful and intuitive.`,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      content:
        "The cosmic theme and smooth animations make every interaction feel premium. It's like social media from the future.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      content:
        "Managing communities has never been easier. The tools are powerful yet simple to use.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen cosmic-bg overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Parallax background images */}
        <motion.div style={{ y }} className="absolute inset-0">
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url(${image})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                transition={{ duration: 1 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-950/80 via-cosmic-900/60 to-space-900/80" />
          </div>
        </motion.div>

        {/* Floating stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-starlight-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-600 to-starlight-500 flex items-center justify-center">
            <Stars className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold cosmic-text">{APP_NAME}</span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-space-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-space-300 hover:text-white transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            className="text-space-300 hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/auth/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button className="cosmic">Get Started</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl md:text-8xl font-bold cosmic-text"
              >
                Connect with
                <br />
                <span className="gradient-text">Cosmic Peers</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl md:text-2xl text-space-300 max-w-3xl mx-auto"
              >
                Experience the future of social networking with our premium
                platform designed for meaningful connections and seamless
                interactions.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/auth/register">
                <Button size="xl" className="cosmic text-lg px-8 py-4">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="xl"
                className="glass-card text-white border-white/30 text-lg px-8 py-4"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
            >
              <div className="text-center">
                <div className="text-3xl font-bold cosmic-text">10K+</div>
                <div className="text-space-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold cosmic-text">50K+</div>
                <div className="text-space-400">Connections Made</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold cosmic-text">99.9%</div>
                <div className="text-space-400">Uptime</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold cosmic-text mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-space-300 max-w-2xl mx-auto">
              Everything you need to build and maintain meaningful connections
              in one beautiful platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="glass-card hover-lift border-white/20 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cosmic-600 to-starlight-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-space-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold cosmic-text mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-space-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their
              social networking experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card border-white/20 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonial.name}
                        </h4>
                        <p className="text-space-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-space-300 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles
                          key={i}
                          className="w-4 h-4 text-starlight-400 fill-current"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold cosmic-text">
              Ready to Transform Your Social Experience?
            </h2>
            <p className="text-xl text-space-300 max-w-2xl mx-auto">
              Join {APP_NAME} today and discover a new way to connect with the
              world around you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/auth/register">
                <Button size="xl" className="cosmic text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <div className="flex items-center space-x-2 text-space-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-600 to-starlight-500 flex items-center justify-center">
                  <Stars className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold cosmic-text">
                  {APP_NAME}
                </span>
              </div>
              <p className="text-space-400">
                The future of social networking is here. Connect, engage, and
                grow with cosmic peers.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Product</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  API
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Company</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Careers
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold">Support</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-space-400 hover:text-white transition-colors block"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-space-400">
              {COPYRIGHT_TEXT} Made with ❤️ for cosmic connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
