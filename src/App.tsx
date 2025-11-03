import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronDown, Mail, MapPin, Code, User, Calendar, Star, Quote, 
  Github, Facebook, ExternalLink, Moon, Sun, 
  Zap, Coffee, Heart, Eye, Download, Send, ChevronUp, 
  Clock, Globe, 
  Search, Filter, Brain, Sparkles, Menu, X, Minimize2, Loader
} from 'lucide-react';

// Define proper types for the application
interface MousePosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
  trail: Array<{ x: number; y: number }>;
  maxTrailLength: number;
}

interface Project {
  id: number;
  title: string;
  tech: string;
  image: string;
  color: string;
  description: string;
  features: string[];
  github: string;
  live: string;
  status: string;
  category: string;
}

interface FormData {
  name: string;
  email: string;
  project: string;
  message: string;
}

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface SkillProgress {
  [key: string]: number;
}

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgress>({});
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', project: '', message: '' });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  
  // Enhanced states for advanced features
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: 'Hi! I\'m John Daryl\'s AI assistant. I have comprehensive knowledge about his work, skills, and experience. How can I help you today?', timestamp: Date.now() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [filterTech, setFilterTech] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineStatus] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const sectionsRef = useRef<HTMLElement[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const textToType = "Full-Stack Developer & Innovation Architect";

  // Professional profile data
  const profileData = {
    name: "John Daryl Lucero",
    title: "Full-Stack Developer",
    location: "Ilocos Sur, PH",
    email: "dv2dsr@gmail.com",
    phone: "+639362482388",
    bio: "Passionate full-stack developer with 3+ years of experience crafting innovative web solutions. Specialized in React, Tailwind CSS, and Supabase with a proven track record of delivering scalable applications that drive business growth.",
    image: "https://scontent.fcrk2-3.fna.fbcdn.net/v/t39.30808-6/502579897_2945522685621001_1262536881292075170_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFSGUJfLqyBJS5cm6ieUzWdY14aC-WBALdjXhoL5YEAt0BemM15joUyKgcChjnRXOMI9OGz0UAzDf19V-ja_MHj&_nc_ohc=cNVnhVj5PhsQ7kNvwFx9Lgc&_nc_oc=AdnGx2YpGrLju-YuEjZyrC34_t_FcCmWukLbEesONAHyBu9Z_zWqbZ0Wm8Zg3VDqAdE&_nc_zt=23&_nc_ht=scontent.fcrk2-3.fna&_nc_gid=WSxsdDfBKgt7ey1bo5VLhA&oh=00_Afh75bKGbg0CxZ0P4Qveo6q9upWkzoUsGpqkF3JMQeEt9g&oe=690E7D56,
    availability: "Full Stack Developer",
    responseTime: "Within 24 hours",
    languages: ["English", "Tagalog", "Filipino"],
    timezone: "PST (UTC-8)"
  };

  // Enhanced AI Response System
  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Context keywords mapping
    const contexts: { [key: string]: string[] } = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      about: ['about', 'who are you', 'tell me about john', 'background', 'bio', 'story'],
      experience: ['experience', 'work', 'career', 'professional', 'years', 'background'],
      skills: ['skills', 'technology', 'tech stack', 'programming', 'languages', 'frameworks'],
      projects: ['projects', 'portfolio', 'work samples', 'examples', 'case studies'],
      services: ['services', 'what do you do', 'help', 'offer', 'consulting'],
      pricing: ['price', 'cost', 'rate', 'budget', 'payment', 'fee', 'expensive'],
      contact: ['contact', 'hire', 'email', 'phone', 'reach out', 'get in touch'],
      availability: ['available', 'free', 'schedule', 'timeline', 'when', 'booking'],
      process: ['process', 'how do you work', 'methodology', 'approach', 'workflow'],
      healthcare: ['healthcare', 'medical', 'clinic', 'hospital', 'patient'],
      education: ['education', 'school', 'student', 'grading', 'attendance'],
      react: ['react', 'reactjs', 'frontend', 'ui', 'user interface'],
      backend: ['backend', 'server', 'api', 'database', 'supabase'],
      mobile: ['mobile', 'responsive', 'phone', 'tablet'],
      consulting: ['consulting', 'advice', 'consultation', 'guidance', 'help'],
      timeline: ['timeline', 'how long', 'duration', 'when', 'deadline'],
      maintenance: ['maintenance', 'support', 'updates', 'ongoing', 'after launch']
    };

    // Find matching context
    let matchedContext = 'general';
    let highestScore = 0;
    
    Object.entries(contexts).forEach(([context, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (input.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > highestScore) {
        highestScore = score;
        matchedContext = context;
      }
    });

    // Generate contextual responses
    switch (matchedContext) {
      case 'greeting':
        return `Hello! Great to meet you! I'm John Daryl's AI assistant with comprehensive knowledge about his work and expertise. I can help you with:

• **Technical Skills & Experience** - Learn about his 3+ years in full-stack development
• **Project Portfolio** - Explore detailed case studies with real results
• **Services & Consulting** - Understand how John Daryl can help your project
• **Pricing & Availability** - Get transparent information about rates and timelines
• **Technical Questions** - Ask about specific technologies or approaches

What would you like to know about John Daryl's work?`;

      case 'about':
        return `John Daryl Lucero is a Full-Stack Developer based in Ilocos Sur, PH with 3+ years of professional experience. Here's what makes him unique:

**Background:**
• Started with a passion for creating digital solutions
• Focused on modern web development technologies
• Specialized in React, Tailwind CSS, and Supabase
• Delivered 19+ real-world solutions for healthcare, education, and business

**Personality & Approach:**
• Creative problem-solver who loves tackling real-world challenges
• Detail-oriented with a focus on clean, maintainable code
• Collaborative developer who values clear communication
• Results-driven with a focus on practical business solutions

**Current Focus:**
• Building scalable web applications with modern technologies
• Helping businesses digitize their operations
• Creating user-friendly interfaces with excellent UX
• Specializing in healthcare and education management systems

Want to know more about his technical expertise or recent projects?`;

      case 'skills':
        return `John Daryl has expertise in modern web development technologies:

**Frontend Expertise (Expert Level):**
• **Frameworks:** React, JavaScript ES6+, HTML5, CSS3
• **Styling:** Tailwind CSS, Bootstrap, Responsive Design
• **Tools:** VS Code, Git, Chrome DevTools
• **UI/UX:** Mobile-first design, User experience optimization

**Backend & Database (Advanced Level):**
• **Database:** Supabase, PostgreSQL
• **Real-time:** Supabase real-time subscriptions
• **Authentication:** User management and security
• **APIs:** RESTful services, data management

**Deployment & Tools (Proficient Level):**
• **Hosting:** Vercel deployment and optimization
• **Version Control:** Git, GitHub
• **Development:** NPM, Modern build tools
• **Performance:** Web optimization, SEO basics

**Specializations:**
• Healthcare management systems
• Educational platforms
• Business booking systems
• Mobile-responsive web applications
• Real-time data synchronization

John Daryl's focus is on creating practical, user-friendly solutions using modern web technologies. Want to see examples of his work or discuss a specific technology?`;

      case 'projects':
        return `John Daryl has delivered 4+ successful projects focusing on real-world business solutions:

**💇‍♂️ R&R Barber Booking System**
• **Client:** Local Barber Shop | **Duration:** 3 months
• **Challenge:** Traditional appointment management causing conflicts and inefficiencies
• **Solution:** Modern web-based booking system with real-time scheduling
• **Results:** 80% faster booking process, 60% reduction in conflicts, 90% customer satisfaction
• **Tech Stack:** React, Bootstrap, Supabase, JavaScript, Vercel
• **Live:** https://r-r-barber-booking-system.vercel.app/

**🏥 Healthcare Management Systems**
• **Clients:** MS Gorospe Center & Silario Clinic
• **Challenge:** Paper-based patient management causing delays
• **Solution:** Digital patient management with appointment scheduling
• **Results:** 70% improvement in efficiency, 100% digital records
• **Tech Stack:** React, Tailwind CSS, Supabase, PostgreSQL

**🎓 Iskwela Education System**
• **Client:** Educational Institution
• **Challenge:** Manual grade and attendance tracking inefficiencies
• **Solution:** Automated academic management system
• **Results:** 99% tracking accuracy, 85% faster processing
• **Tech Stack:** React, Tailwind CSS, Supabase, Real-time Updates

All projects feature responsive design, modern UI/UX, and are deployed on Vercel. I have 15+ additional projects in development and planning phases. Would you like to explore any specific project in detail?`;

      case 'contact':
        return `Ready to start your project? Here's how to reach John Daryl:

**📧 Direct Contact:**
• **Email:** dv2dsr@gmail.com
• **Response Time:** Within 24 hours (usually much faster!)
• **Phone:** +639362482388 (business hours)

**📅 Quick Scheduling:**
• Use the contact form on this site for fastest response
• Include project details for better initial assessment
• Free 30-60 minute consultation available

**💡 What to Include in Your Message:**
• Project overview and goals
• Preferred timeline
• Budget range (if you have one)
• Any specific technical requirements
• Preferred communication method

Ready to start your project? Click the contact form below or send an email directly!`;

      default:
        return `I'm here to help! I have comprehensive knowledge about John Daryl's work and can assist with:

**🎯 Popular Questions:**
• **"Tell me about John Daryl's experience"** - 3+ years full-stack development
• **"What technologies does he use?"** - React, Tailwind CSS, Supabase, and more
• **"Show me recent projects"** - 19+ completed projects with real results and metrics
• **"What are his rates?"** - Transparent pricing from $25/hour
• **"How can I hire him?"** - Contact process and availability

**💡 Try asking about:**
• Specific technologies (React, Supabase, Tailwind CSS)
• Project types (healthcare, education, business systems)
• Services (development, consulting, maintenance)
• Process and timelines
• Pricing and availability

What would you like to know more about John Daryl's work?`;
    }
  };

  // Enhanced particle system with physics
  const initializeParticles = useCallback(() => {
    const particleCount = 60;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      trail: [],
      maxTrailLength: 3
    }));
    setParticles(newParticles);
  }, []);

  // Smooth particle animation with physics
  const animateParticles = useCallback(() => {
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        if (newX <= 0 || newX >= window.innerWidth) {
          particle.vx *= -0.7;
          newX = Math.max(0, Math.min(window.innerWidth, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          particle.vy *= -0.7;
          newY = Math.max(0, Math.min(window.innerHeight, newY));
        }

        const mouseDistance = Math.sqrt(
          Math.pow(mousePosition.x - newX, 2) + Math.pow(mousePosition.y - newY, 2)
        );
        
        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100 * 0.02;
          const angle = Math.atan2(newY - mousePosition.y, newX - mousePosition.x);
          particle.vx += Math.cos(angle) * force;
          particle.vy += Math.sin(angle) * force;
        }

        particle.vx *= 0.99;
        particle.vy *= 0.99;

        const newPulse = particle.pulse + particle.pulseSpeed;
        const pulsedOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(newPulse));

        const newTrail = [{ x: particle.x, y: particle.y }, ...particle.trail].slice(0, particle.maxTrailLength);

        return {
          ...particle,
          x: newX,
          y: newY,
          pulse: newPulse,
          opacity: pulsedOpacity,
          trail: newTrail
        };
      })
    );

    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, [mousePosition]);

  // Initialize particles on mount
  useEffect(() => {
    initializeParticles();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles]);

  // Start particle animation
  useEffect(() => {
    if (particles.length > 0) {
      animateParticles();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length, animateParticles]);

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= textToType.length) {
        setTypedText(textToType.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [textToType]);

  // Skills rotation - removed since skills sidebar was removed
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSkill(prev => (prev + 1) % skills.length);
  //   }, 1500);
  //   return () => clearInterval(interval);
  // }, [skills.length]);

  // Testimonials rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced scroll effects
  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      setShowBackToTop(scrollPosition > 1000);
      
      const sections = sectionsRef.current;
      const scrollPos = scrollPosition + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });

      // Animate skill progress on scroll
      sections.forEach((section, index) => {
        if (section && index === 2) {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            setTimeout(() => {
              setSkillProgress({
                react: 95, tailwind: 90, supabase: 88, javascript: 85,
                bootstrap: 82, css: 80, html: 88, responsive: 85
              });
            }, 500);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Enhanced chatbot with advanced AI
  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = { 
      type: 'user', 
      content: chatInput, 
      timestamp: Date.now() 
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatTyping(true);
    setAiThinking(true);
    
    // Simulate AI processing time with realistic delay
    const processingTime = 800 + (chatInput.length * 20) + Math.random() * 1000;
    
    setTimeout(() => {
      const botResponse = generateAIResponse(chatInput);
      
      setChatMessages(prev => [...prev, { 
        type: 'bot', 
        content: botResponse, 
        timestamp: Date.now() 
      }]);
      setChatTyping(false);
      setAiThinking(false);
    }, processingTime);
    
    setChatInput('');
  };

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 5000);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Data - Real Projects with Images and Matching Colors
  const projects: Project[] = [
    {
      id: 1,
      title: "R&R Barber Booking System",
      tech: "React, Bootstrap, Supabase",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&fit=crop&crop=center",
      color: "from-amber-600 to-orange-700",
      description: "A comprehensive barber shop booking system with real-time appointment scheduling, customer management, and service tracking.",
      features: ["Real-time Booking", "Customer Management", "Service Scheduling", "Payment Integration", "Admin Dashboard", "Mobile Responsive"],
      github: "https://github.com/darylcommits/r-r_barber_booking_system",
      live: "https://r-r-barber-booking-system.vercel.app/",
      status: "Completed",
      category: "Business Management"
    },
    {
      id: 2,
      title: "MS Gorospe Center System",
      tech: "React, Tailwind CSS, Supabase",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop&crop=center",
      color: "from-blue-600 to-teal-700",
      description: "A medical center management system for patient records, appointments, and healthcare service management.",
      features: ["Patient Management", "Appointment Scheduling", "Medical Records", "Staff Management", "Reports & Analytics", "Secure Database"],
      github: "https://github.com/darylcommits/ms-gorospe-center",
      live: "https://ms-gorospe-center.vercel.app/",
      status: "Completed",
      category: "Healthcare"
    },
    {
      id: 3,
      title: "Silario Clinic System",
      tech: "React, Tailwind CSS, Supabase",
      image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-emerald-600 to-green-700",
      description: "A clinic management system designed for efficient patient care, appointment scheduling, and medical record keeping.",
      features: ["Patient Records", "Appointment System", "Medical History", "Prescription Management", "Billing System", "User Authentication"],
      github: "https://github.com/darylcommits/Silario_Clinic_System",
      live: "https://silario-clinic-system.vercel.app/",
      status: "Completed",
      category: "Healthcare"
    },
    {
      id: 4,
      title: "Iskwela Grading & Attendance System",
      tech: "React, Tailwind CSS, Supabase",
      image: "https://images.unsplash.com/photo-1638828229405-8db92ff35af6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      color: "from-indigo-600 to-purple-700",
      description: "A comprehensive school management system for tracking student grades, attendance, and academic performance.",
      features: ["Grade Management", "Attendance Tracking", "Student Records", "Teacher Dashboard", "Parent Portal", "Academic Reports"],
      github: "https://github.com/darylcommits/iskwela-grading-attendance-system",
      live: "https://iskwela-grading-attendance-system20.vercel.app/",
      status: "Completed",
      category: "Education"
    }
  ];

  const experiences = [
    {
      year: "2024 - Present",
      company: "Freelance Developer",
      position: "Full-Stack Developer",
      description: "Building modern web applications for healthcare, education, and business management using React, Tailwind CSS, and Supabase.",
      achievements: ["Delivered 19+ major projects", "Specialized in React & Supabase", "100% client satisfaction rate", "Mobile-responsive designs"]
    },
    {
      year: "2022 - 2024",
      company: "Independent Projects",
      position: "Frontend Developer",
      description: "Focused on learning and mastering modern web technologies including React, JavaScript ES6+, and responsive design principles.",
      achievements: ["Mastered React framework", "Built responsive web applications", "Learned database integration", "Developed problem-solving skills"]
    }
  ];

  const testimonials = [
    {
      name: "R&R Barber Shop",
      position: "Business Owner",
      content: "John created an amazing booking system for our barber shop. The online scheduling has made our operations so much smoother and our customers love the convenience.",
      rating: 5,
      avatar: "💇‍♂️"
    },
    {
      name: "Healthcare Clinic",
      position: "Medical Administrator",
      content: "The clinic management system John developed has transformed how we handle patient records and appointments. It's user-friendly and very reliable.",
      rating: 5,
      avatar: "🏥"
    }
  ];

  const socialLinks = [
    { icon: Github, url: "https://github.com/darylcommits", label: "GitHub" },
    { icon: Facebook, url: "https://www.facebook.com/johndaryl.lucero.1", label: "Facebook" },
    { icon: Mail, url: "mailto:dv2dsr@gmail.com", label: "Email" }
  ];

  const techCategories = ['All', 'Business Management', 'Healthcare', 'Education', 'Web Development', 'Database Systems'];

  const filteredProjects = projects.filter(project => {
    const matchesTech = filterTech === 'All' || project.category === filterTech;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTech && matchesSearch;
  });

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen overflow-x-hidden transition-colors duration-500`}>
      {/* Enhanced Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-difference bg-white transition-all duration-200 ${
          cursorVariant === 'hover' ? 'scale-150 bg-blue-400' : 'scale-100'
        }`}
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Enhanced Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(particle => (
          <div key={particle.id}>
            {particle.trail.map((trailPoint, index) => (
              <div
                key={`trail-${particle.id}-${index}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: trailPoint.x,
                  top: trailPoint.y,
                  backgroundColor: particle.color,
                  opacity: particle.opacity * (1 - index / particle.maxTrailLength) * 0.3,
                  transform: `scale(${particle.size * (1 - index / particle.maxTrailLength)})`,
                  transition: 'all 0.1s ease-out'
                }}
              />
            ))}
            
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size * 2,
                height: particle.size * 2,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
                transform: `scale(${1 + 0.3 * Math.sin(particle.pulse)})`,
                transition: 'all 0.05s ease-out'
              }}
            />
          </div>
        ))}
      </div>

      {/* Enhanced AI Chatbot - Mobile Responsive */}
      <div className="fixed bottom-4 right-4 z-40">
        {chatOpen ? (
          <div className={`w-full max-w-sm sm:w-96 h-[500px] sm:h-[600px] ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 mx-4 sm:mx-0`}>
            {/* Enhanced Chat Header */}
            <div className={`p-3 sm:p-4 border-b ${darkMode ? 'border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'} rounded-t-xl flex items-center justify-between`}>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${onlineStatus ? 'bg-green-400' : 'bg-gray-400'} rounded-full animate-pulse border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                  {aiThinking && (
                    <div className="absolute -bottom-1 -right-1">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="font-semibold text-sm sm:text-base">AI Assistant</span>
                    <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-500/20 rounded-full">
                      <span className="text-xs text-blue-400 font-medium">Advanced AI</span>
                    </div>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center space-x-1`}>
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${aiThinking ? 'bg-yellow-400 animate-pulse' : onlineStatus ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-xs">
                      {aiThinking ? 'Thinking...' : onlineStatus ? 'Online • Expert Knowledge' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200 group`}
              >
                <Minimize2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Enhanced Chat Messages */}
            <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[240px] sm:max-w-[280px] p-3 sm:p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-6 sm:ml-8' 
                      : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                  } animate-in slide-in-from-bottom-2 duration-200 shadow-lg`}>
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 opacity-60 flex items-center justify-between`}>
                      <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.type === 'bot' && (
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>AI</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {chatTyping && (
                <div className="flex justify-start items-start space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className={`p-3 sm:p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} shadow-lg`}>
                    <div className="flex space-x-2 items-center">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Chat Input */}
            <div className={`p-3 sm:p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'} rounded-b-xl`}>
              <div className="flex space-x-2 mb-2 sm:mb-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSubmit()}
                  placeholder="Ask me anything about John Daryl's work..."
                  disabled={chatTyping}
                  className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm rounded-xl ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-400' : 'bg-white border-gray-300 focus:border-blue-500'} border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50`}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={chatTyping || !chatInput.trim()}
                  className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {chatTyping ? (
                    <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
              
              {/* Smart Quick Actions */}
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {['Skills', 'Projects', 'Pricing', 'Contact'].map((action) => (
                  <button
                    key={action}
                    onClick={() => setChatInput(action.toLowerCase().includes('contact') ? 'How can I contact John Daryl?' : `Tell me about ${action.toLowerCase()}`)}
                    className={`text-xs px-2 py-1 sm:px-3 sm:py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors duration-200 hover:scale-105 transform`}
                  >
                    {action}
                  </button>
                ))}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                Powered by advanced AI • Press Enter to send
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="group relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <Brain className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">AI</span>
            </div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className={`px-3 py-1 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg text-sm whitespace-nowrap border`}>
                Ask AI anything!
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Enhanced Control Panel */}
      <div className="fixed top-4 right-4 z-30">
        {/* Smooth Dark Mode Toggle */}
        <div className="relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-16 h-8 rounded-full p-1 transition-all duration-300 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-300'
            } shadow-lg hover:scale-105`}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 transform flex items-center justify-center ${
                darkMode 
                  ? 'translate-x-8 bg-gray-800 text-yellow-400' 
                  : 'translate-x-0 bg-white text-gray-600'
              }`}
            >
              {darkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Enhanced Header - Mobile Responsive */}
      <header className={`fixed top-0 left-0 right-0 z-20 p-4 sm:p-6 transition-all duration-700 ${
        scrollY > 50 ? `${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-lg` : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h1 className={`text-xs sm:text-sm tracking-[0.3em] ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
              {profileData.name.toUpperCase()}
            </h1>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{profileData.availability}</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['Home', 'Projects', 'About', 'Experience', 'Contact'].map((item, index) => (
              <button
                key={item}
                onClick={() => scrollToSection(index)}
                className={`text-sm tracking-wider transition-all duration-300 hover:text-blue-400 hover:scale-105 ${
                  activeSection === index ? 'text-blue-400' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg transition-all duration-300`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-xl animate-in slide-in-from-top-2 duration-300`}>
            <nav className="flex flex-col space-y-4">
              {['Home', 'Projects', 'About', 'Experience', 'Contact'].map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(index);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left p-3 rounded-lg transition-all duration-300 ${
                    activeSection === index 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {item}
                </button>
              ))}
              
              {/* Mobile Quick Actions */}
              <div className="pt-4 border-t border-gray-600 space-y-2">
                <button
                  onClick={() => {
                    setChatOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>Chat with AI</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Enhanced Vertical Navigation - Hidden on Mobile */}
      <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 z-20 space-y-6">
        {[
          { index: 0, label: 'Home' },
          { index: 1, label: 'Projects' },
          { index: 2, label: 'About' },
          { index: 3, label: 'Experience' },
          { index: 4, label: 'Contact' }
        ].map(({ index, label }) => (
          <div key={index} className="relative group">
            <button
              onClick={() => scrollToSection(index)}
              className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-blue-400 border-blue-400 scale-125 shadow-lg shadow-blue-400/50' 
                  : `bg-transparent ${darkMode ? 'border-gray-400 hover:border-white' : 'border-gray-600 hover:border-gray-900'} hover:scale-110`
              }`}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              {activeSection === index && (
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>
              )}
            </button>
            
            <div className={`absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } px-3 py-1 rounded-lg shadow-lg text-sm whitespace-nowrap border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => scrollToSection(0)}
          className="fixed bottom-20 right-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-20 animate-bounce"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Section 01 - Enhanced Hero with Profile - Mobile Responsive */}
      <section 
        ref={el => {
          if (el) sectionsRef.current[0] = el;
        }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-8"
        style={{
          background: darkMode 
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
            : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08) 0%, transparent 50%)`
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
          {/* Profile Section */}
          <div className={`order-2 xl:order-1 text-center xl:text-left transition-all duration-1500 ${
            isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <div className="relative mb-4 sm:mb-6">
              {/* Profile Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto xl:mx-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                    <img 
                      src={profileData.image}
                      alt={profileData.name}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = target.nextSibling as HTMLElement;
                        target.style.display = 'none';
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold hidden">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="mt-4 sm:mt-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {profileData.name}
                </h1>
                <h2 className="text-base sm:text-lg md:text-xl mb-2 text-blue-400 font-semibold">
                  {profileData.title}
                </h2>
                <div className={`flex flex-wrap justify-center xl:justify-start gap-2 sm:gap-3 mb-3 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs sm:text-sm`}>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{profileData.responseTime}</span>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>{profileData.languages.join(', ')}</span>
                  </div>
                </div>

                <p className={`text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto xl:mx-0`}>
                  {profileData.bio}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3 sm:mb-4">
                  {[
                    { number: "15+", label: "Projects", color: "text-blue-400" },
                    { number: "3+", label: "Years", color: "text-green-400" },
                    { number: "17+", label: "Clients", color: "text-purple-400" },
                    { number: "99.8%", label: "Uptime", color: "text-orange-400" }
                  ].map((stat, index) => (
                    <div key={index} className={`text-center p-2 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm hover:scale-105 transition-transform duration-200`}>
                      <div className={`text-sm sm:text-base md:text-lg font-bold ${stat.color} mb-1`}>{stat.number}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Text Section */}
          <div className={`order-1 xl:order-2 text-center xl:text-left transition-all duration-2000 delay-500 ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <div className="mb-4 sm:mb-6">
              <span className={`text-xs sm:text-sm tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-pulse`}>I AM</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-wider mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              FULL-STACK
              <br />
              DEVELOPER
            </h2>
            
            <div className="h-6 sm:h-8 md:h-10 flex items-center justify-center xl:justify-start mb-4 sm:mb-6">
              <span className="text-sm sm:text-base md:text-lg border-r-2 border-blue-400 animate-pulse pr-1">
                {typedText}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center xl:justify-start space-y-2 sm:space-y-0 sm:space-x-3 mb-4 sm:mb-6">
              <button 
                onClick={() => scrollToSection(4)}
                className="px-4 py-2 sm:px-5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <span>Get In Touch</span>
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              <button 
                onClick={() => scrollToSection(1)}
                className={`px-4 py-2 sm:px-5 sm:py-3 ${darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-gray-100/80'} backdrop-blur-sm rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm`}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <span>View Work</span>
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="flex justify-center xl:justify-start space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    className={`p-2 rounded-full ${darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-gray-100/80'} backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 group`}
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`absolute bottom-8 left-4 sm:left-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono`}>.01</div>
        
        <div className={`absolute bottom-8 right-4 sm:right-8 transition-all duration-2000 delay-1500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </section>

      {/* Section 02 - Enhanced Projects with Real Images - Mobile Responsive */}
      <section 
        ref={el => {
          if (el) sectionsRef.current[1] = el;
        }}
        className="min-h-screen py-16 sm:py-20 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 text-center">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PROJECTS
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto text-base sm:text-lg mb-6 sm:mb-8 px-4`}>
              Showcasing innovative solutions that drive business results. Each project represents a unique challenge solved with modern technology.
            </p>

            {/* Project Filters - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 sm:w-auto px-3 sm:px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm`}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <select
                  value={filterTech}
                  onChange={(e) => setFilterTech(e.target.value)}
                  className={`flex-1 sm:w-auto px-3 sm:px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm`}
                >
                  {techCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`group relative h-96 sm:h-[450px] rounded-3xl overflow-hidden transition-all duration-700 hover:scale-105 hover:-rotate-1 ${
                  activeSection >= 1 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {/* Project Image Background */}
                <div className="absolute inset-0">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = target.nextSibling as HTMLElement;
                      target.style.display = 'none';
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback gradient background */}
                  <div className={`w-full h-full bg-gradient-to-br ${project.color} hidden`}></div>
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-75 group-hover:opacity-90 transition-all duration-300`}></div>
                
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm ${
                        project.status === 'Completed' ? 'bg-green-400/30 text-green-200' : 'bg-yellow-400/30 text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="mb-3">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{project.category}</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-3 text-white">{project.title}</h4>
                    <p className="text-sm opacity-90 mb-4 text-white">{project.tech}</p>
                    <p className="text-sm opacity-80 mb-6 text-white leading-relaxed">{project.description}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 mb-4">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 bg-white/90 text-gray-900 rounded-lg font-semibold hover:bg-white transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg no-underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                      
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-3 bg-black/60 text-white rounded-lg font-semibold hover:bg-black/80 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg no-underline"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>

               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`absolute bottom-8 left-4 sm:left-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono`}>.02</div>
      </section>

      {/* Continue with remaining sections... */}
      {/* Section 03 - About & Skills */}
      <section 
        ref={el => {
          if (el) sectionsRef.current[2] = el;
        }}
        className="min-h-screen py-16 sm:py-20 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* About Section */}
          <div className={`transition-all duration-1000 ${
            activeSection >= 2 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
              <User className="mr-3 sm:mr-4 text-blue-500" />
              ABOUT ME
            </h3>
            
            <div className={`space-y-4 sm:space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-base sm:text-lg leading-relaxed">
                I'm a passionate full-stack developer with 3+ years of experience creating 
                innovative web solutions. I specialize in React, Tailwind CSS, and Supabase,
                with a keen eye for design and user experience that drives business results.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed">
                My journey in web development started with a curiosity about how things work
                on the internet. Today, I help businesses transform their digital presence
                through modern, scalable, and user-friendly applications that deliver real value.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                {[
                  { number: "12+", label: "Projects Completed", color: "text-blue-400" },
                  { number: "2+", label: "Years Experience", color: "text-green-400" },
                  { number: "12+", label: "Happy Clients", color: "text-purple-400" },
                  { number: "24/7", label: "Support", color: "text-orange-400" }
                ].map((stat, index) => (
                  <div key={index} className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group`}>
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-200`}>{stat.number}</div>
                    <div className="text-xs sm:text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className={`transition-all duration-1000 delay-300 ${
            activeSection >= 2 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center">
              <Code className="mr-3 sm:mr-4 text-purple-500" />
              SKILLS & EXPERTISE
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {[
                { name: 'React & JSX', level: skillProgress.react || 0, color: 'bg-blue-500', icon: '⚛️' },
                { name: 'Tailwind CSS', level: skillProgress.tailwind || 0, color: 'bg-cyan-500', icon: '🎨' },
                { name: 'Supabase', level: skillProgress.supabase || 0, color: 'bg-green-500', icon: '🗄️' },
                { name: 'JavaScript ES6+', level: skillProgress.javascript || 0, color: 'bg-yellow-500', icon: '🟨' },
                { name: 'Bootstrap', level: skillProgress.bootstrap || 0, color: 'bg-purple-500', icon: '🅱️' },
                { name: 'CSS3', level: skillProgress.css || 0, color: 'bg-blue-600', icon: '🎯' },
                { name: 'HTML5', level: skillProgress.html || 0, color: 'bg-orange-500', icon: '🏗️' },
                { name: 'Responsive Design', level: skillProgress.responsive || 0, color: 'bg-pink-500', icon: '📱' }
              ].map((skill, index) => (
                <div key={skill.name} className="space-y-2 sm:space-y-3 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="text-lg sm:text-xl">{skill.icon}</span>
                      <span className="text-sm sm:text-base font-semibold group-hover:text-blue-400 transition-colors duration-200">{skill.name}</span>
                    </div>
                    <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className={`h-2 sm:h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden group-hover:shadow-lg transition-all duration-300`}>
                    <div 
                      className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                      style={{ 
                        width: `${skill.level}%`,
                        transitionDelay: `${index * 200}ms`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`absolute bottom-8 left-4 sm:left-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono`}>.03</div>
      </section>

      {/* Section 04 - Experience & Testimonials */}
      <section 
        ref={el => {
          if (el) sectionsRef.current[3] = el;
        }}
        className="min-h-screen py-16 sm:py-20 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Experience Timeline */}
            <div className={`transition-all duration-1000 ${
              activeSection >= 3 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 flex items-center">
                <Calendar className="mr-3 sm:mr-4 text-green-500" />
                PROFESSIONAL JOURNEY
              </h3>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
                
                <div className="space-y-8 sm:space-y-12">
                  {experiences.map((exp, index) => (
                    <div 
                      key={index}
                      className={`relative pl-8 sm:pl-12 transition-all duration-700 group ${
                        activeSection >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 300}ms` }}
                    >
                      <div className="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                      </div>
                      
                      <div className={`p-4 sm:p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' : 'bg-white hover:shadow-xl border border-gray-200'} transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                          <div>
                            <h4 className="text-lg sm:text-xl font-bold group-hover:text-blue-400 transition-colors duration-200">{exp.position}</h4>
                            <p className="text-blue-400 font-semibold">{exp.company}</p>
                          </div>
                          <span className={`text-sm px-2 sm:px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} font-mono mt-2 sm:mt-0`}>
                            {exp.year}
                          </span>
                        </div>
                        
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}>
                          {exp.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                              <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {achievement}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className={`transition-all duration-1000 delay-300 ${
              activeSection >= 3 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 flex items-center">
                <Quote className="mr-3 sm:mr-4 text-pink-500" />
                CLIENT TESTIMONIALS
              </h3>
              
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`p-4 sm:p-6 rounded-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'} transition-all duration-500 transform ${
                      index === currentTestimonial 
                        ? 'scale-105 ring-2 ring-blue-400 shadow-xl' 
                        : 'scale-100 opacity-70 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">{testimonial.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 italic leading-relaxed`}>
                          "{testimonial.content}"
                        </p>
                        <div>
                          <p className="font-semibold text-lg">{testimonial.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {testimonial.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`absolute bottom-8 left-4 sm:left-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono`}>.04</div>
      </section>

      {/* Section 05 - Contact */}
      <section 
        ref={el => {
          if (el) sectionsRef.current[4] = el;
        }}
        className="min-h-screen py-16 sm:py-20 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 ${
            activeSection >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
          }`}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              LET'S BUILD SOMETHING AMAZING
            </h3>
            
            <div className={`space-y-4 sm:space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-8 sm:mb-12`}>
              <p className="text-base sm:text-lg leading-relaxed">
                Ready to transform your digital presence? I'd love to hear about your project and discuss how we can bring your vision to life with cutting-edge technology and proven results.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: profileData.location, color: "text-red-400" },
                  { icon: Mail, text: profileData.email, color: "text-blue-400" },
                  { icon: Coffee, text: "Available for coffee chats", color: "text-yellow-400" },
                  { icon: Clock, text: profileData.responseTime, color: "text-green-400" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                    <span className="group-hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-1000 delay-300 ${
            activeSection >= 4 ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
          }`}>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">CONTACT FORM</h3>
            
            {emailSent ? (
              <div className={`p-6 sm:p-8 rounded-xl ${darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-100 border border-green-300'} text-center animate-in slide-in-from-bottom-4 duration-500`}>
                <div className="text-4xl sm:text-6xl mb-4 animate-bounce">✅</div>
                <h4 className="text-xl sm:text-2xl font-bold mb-2">Message Sent Successfully!</h4>
                <p className={`${darkMode ? 'text-green-300' : 'text-green-700'} mb-4`}>
                  Thanks for reaching out! I'll get back to you within 24 hours with a detailed response.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Chat with AI
                  </button>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                  >
                    Send Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {[
                  { field: 'name', label: 'Your Name', type: 'text', placeholder: 'Enter your full name', required: true },
                  { field: 'email', label: 'Your Email', type: 'email', placeholder: 'your@email.com', required: true },
                  { field: 'project', label: 'Project Type', type: 'text', placeholder: 'Web app, mobile app, clinic system...', required: true },
                ].map((input) => (
                  <div key={input.field} className="relative">
                    <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {input.label} {input.required && <span className="text-red-400">*</span>}
                    </label>
                    <input 
                      type={input.type}
                      value={formData[input.field as keyof FormData]}
                      onChange={(e) => handleInputChange(input.field as keyof FormData, e.target.value)}
                      className={`w-full ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-400' : 'bg-gray-100 border-gray-300 focus:border-blue-500'} border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                      placeholder={input.placeholder}
                    />
                  </div>
                ))}

                <div className="relative">
                  <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Project Details <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-blue-400' : 'bg-gray-100 border-gray-300 focus:border-blue-500'} border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none`}
                    placeholder="Tell me about your project goals, timeline, and any specific requirements..."
                  ></textarea>
                </div>

                <button 
                  onClick={handleFormSubmit}
                  disabled={!formData.name || !formData.email || !formData.message}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <span>SEND MESSAGE</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button className={`inline-flex items-center space-x-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300 group`}>
                      <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Download Resume</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    By submitting this form, you agree to receive project-related communications.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={`absolute bottom-8 left-4 sm:left-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono`}>.05</div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`py-12 sm:py-16 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        
        <div className={`relative z-10 transition-all duration-1000 ${
          activeSection >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 tracking-wider`}>THE END</p>
          <h4 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            THANKS FOR VISITING
          </h4>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 text-base sm:text-lg`}>
            LET'S BUILD SOMETHING AMAZING TOGETHER
          </p>
          
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-8">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  className={`p-3 sm:p-4 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 transform hover:scale-110 hover:rotate-12 group`}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
                </a>
              );
            })}
          </div>
          
          <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} space-y-3`}>
            <div className="flex items-center justify-center space-x-2">
              <span>© 2025 {profileData.name}. Made with</span>
              <Heart className="w-4 h-4 inline text-red-400 animate-pulse" />
              <span>and lots of coffee.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
