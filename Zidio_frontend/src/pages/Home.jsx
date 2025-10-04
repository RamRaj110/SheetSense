import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Home() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-300"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-20 bg-gray-800/30 backdrop-blur-lg border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <span className="text-2xl font-bold text-indigo-400">SheetSense</span>
          <div className="space-x-6 text-gray-300">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#howitworks" className="hover:text-white">How It Works</a>
            {/* <a href="#testimonials" className="hover:text-white">Testimonials</a> */}
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">Login</Link>
            <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">SignUp</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          className="text-5xl font-extrabold leading-tight">
          Transform Your Data <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Into Actionable Insights
          </span>
        </motion.h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
          Upload, analyze, and visualize your Excel data with powerful analytics tools.
        </p>
        <div className="mt-8">
          <Link to="/signup" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all transform hover:scale-105">
            🚀 Get Started
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8"
        >
          {/* Left - Images */}
          <div className="space-y-4  ">
            <motion.img 
               src="/about_pic.svg"
              alt="Upload Data" 
              className="rounded-xl shadow-lg bg-white/5 p-4 h-100"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            />
           
          </div>
          
          {/* Right - Text */}
          <div>
            <h2 className="text-3xl font-bold mb-4">About SheetSense</h2>
            <p className="text-gray-300 leading-relaxed">
              SheetSense turns your raw Excel data into actionable insights in seconds.
              Whether you’re a business owner or a student, our AI-powered analytics
              make understanding your data effortless.
            </p>
            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ Upload spreadsheets securely</li>
              <li>✔ Get instant analysis</li>
              <li>✔ Visualize with interactive charts</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-800/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
          {[
            { title: "Excel Analysis", desc: "Upload Excel files and instantly analyze data." },
            { title: "Interactive Charts", desc: "Transform data into beautiful, interactive visualizations." },
            { title: "Instant Insights", desc: "Make data-driven decisions faster than ever." }
          ].map((f, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-gray-900/60 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-indigo-400">{f.title}</h3>
              <p className="text-gray-300 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howitworks" className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4 text-center">
            {[
              { step: "1", title: "Upload", desc: "Choose your Excel file to start.", img: "https://cdn-icons-png.flaticon.com/512/1828/1828919.png" },
              { step: "2", title: "Analyze", desc: "AI scans and processes your data.", img: "https://cdn-icons-png.flaticon.com/512/2098/2098401.png" },
              { step: "3", title: "Visualize", desc: "See your data in interactive charts.", img: "https://cdn-icons-png.flaticon.com/512/2331/2331956.png" },
              { step: "4", title: "Decide", desc: "Make informed, data-driven decisions.", img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }
            ].map((s, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-900/60 rounded-xl shadow-lg"
              >
                <img src={s.img} alt={s.title} className="w-16 mx-auto mb-3" />
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} SheetSense. All rights reserved.
      </footer>
    </div>
  )
}

export default Home
