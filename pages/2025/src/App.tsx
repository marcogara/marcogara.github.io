import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown } from 'lucide-react';

function App() {
  const projects = [
    {
      title: "E-Commerce Dashboard",
      description: "A full-stack dashboard for managing online store inventory and sales analytics. Built with React, Node.js, and MongoDB.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3",
      github: "#",
      live: "#"
    },
    {
      title: "Weather App",
      description: "Real-time weather application using OpenWeather API. Features include 5-day forecast and location-based weather data.",
      image: "https://images.unsplash.com/photo-1601134467661-3d775b999c8b?auto=format&fit=crop&q=80&w=2575&ixlib=rb-4.0.3",
      github: "#",
      live: "#"
    },
    {
      title: "Task Management System",
      description: "A collaborative task management tool with real-time updates. Built using React, Firebase, and Material-UI.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2572&ixlib=rb-4.0.3",
      github: "#",
      live: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="min-h-screen relative">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3" 
            alt="Modern workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-800/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">Super Mario</h1>
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-8">Junior Full Stack Developer</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto backdrop-blur-sm bg-slate-900/30 p-6 rounded-lg">
              Passionate about creating efficient, user-friendly web applications. 
              Specialized in React, Node.js, and modern web technologies.
            </p>
            <div className="flex gap-6 justify-center mb-12">
              <a href="#" className="hover:text-blue-400 transition-colors"><Github size={24} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Linkedin size={24} /></a>
              <a href="mailto:mario@example.com" className="hover:text-blue-400 transition-colors"><Mail size={24} /></a>
            </div>
          </div>
          <a href="#about" className="absolute bottom-8 animate-bounce text-white">
            <ChevronDown size={32} />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">About Me</h2>
          <div className="bg-slate-700 rounded-lg shadow-xl p-8 text-white">
            <p className="text-lg text-gray-200 mb-6">
              I'm a junior developer with a strong foundation in web development and a passion for learning new technologies. 
              Recently graduated from [Your University] with a degree in Computer Science, I've spent the last year building 
              projects that solve real-world problems.
            </p>
            <p className="text-lg text-gray-200 mb-6">
              My technical skills include:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Git', 'MongoDB', 'SQL'].map((skill) => (
                <span key={skill} className="bg-slate-600 text-gray-100 px-4 py-2 rounded-full text-center">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-slate-800 rounded-lg shadow-xl overflow-hidden transition-transform hover:-translate-y-2">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex gap-4">
                    <a href={project.github} className="flex items-center gap-2 text-gray-300 hover:text-white">
                      <Github size={20} /> Code
                    </a>
                    <a href={project.live} className="flex items-center gap-2 text-gray-300 hover:text-white">
                      <ExternalLink size={20} /> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Get In Touch</h2>
          <p className="text-xl text-gray-300 mb-8">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
            I'll try my best to get back to you!
          </p>
          <div className="flex flex-col gap-4 items-center">
            <a href="mailto:mario@example.com" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Mail size={20} /> mario@example.com
            </a>
            <div className="flex gap-6">
              <a href="#" className="text-gray-300 hover:text-white"><Github size={24} /></a>
              <a href="#" className="text-gray-300 hover:text-white"><Linkedin size={24} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p>© 2024 Super Mario. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;