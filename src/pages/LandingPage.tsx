import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Globe, Map, Compass, Star, Calendar, Users, MessageCircle, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  
  // Initialize particle effect on component mount
  useEffect(() => {
    // Create and append canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const ctx = canvas.getContext('2d');
    
    // Create particles
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: '#ffffff',
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas && document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <Plane className="w-8 h-8 text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-800">TravelAI</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600">Testimonials</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600">FAQ</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
          </div>
          {/* <div>
            <button 
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:text-indigo-800 mr-4"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </div> */}
        </nav>
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Dream Journey with AI
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Get personalized travel itineraries, budgeting assistance, and local insights
            powered by artificial intelligence.
          </p>
          
          <button
            onClick={() => navigate('/planner')}
            className="bg-indigo-600 text-white text-lg px-8 py-4 rounded-full
                    hover:bg-indigo-700 transform hover:scale-105 transition-all
                    shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
          
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
              <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
            </div>
            <p className="text-gray-600">4.9/5 from over 10,000 happy travelers</p>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <Globe className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Global Destinations</h3>
            <p className="text-gray-600 text-center">
              Explore destinations worldwide with detailed local insights and recommendations.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <Map className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Smart Budgeting</h3>
            <p className="text-gray-600 text-center">
              Get accurate cost estimates in multiple currencies for better trip planning.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <Compass className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Custom Itineraries</h3>
            <p className="text-gray-600 text-center">
              Receive personalized travel plans tailored to your preferences and budget.
            </p>
          </div>
        </div>
        
        {/* Additional Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Intelligent Scheduling</h3>
            <p className="text-gray-600 text-center">
              Our AI optimizes your daily activities based on location, opening hours, and crowd levels.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Group Planning</h3>
            <p className="text-gray-600 text-center">
              Coordinate travel plans with friends and family using our collaborative tools.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all">
            <div className="flex justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Real-time Support</h3>
            <p className="text-gray-600 text-center">
              Get instant answers and assistance during your trip with our 24/7 AI chat support.
            </p>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tell Us Your Preferences</h3>
              <p className="text-gray-600">Share your travel style, budget, and interests with our AI.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Custom Plan</h3>
              <p className="text-gray-600">Receive a tailored itinerary optimized for your needs.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Travel With Confidence</h3>
              <p className="text-gray-600">Enjoy your journey with real-time updates and support.</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div id="testimonials" className="max-w-4xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Davis</h4>
                  <p className="text-gray-500 text-sm">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"TravelAI made planning our family vacation so simple. The budget recommendations were spot-on, and our kids loved all the activities suggested."</p>
              <div className="flex mt-4">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-700 font-bold">SL</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Lee</h4>
                  <p className="text-gray-500 text-sm">Solo Explorer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"As a solo traveler, safety is my priority. TravelAI recommended perfect neighborhoods and activities that made me feel comfortable while still having an adventure."</p>
              <div className="flex mt-4">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div id="faq" className="max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">How accurate are the budget estimates?</h3>
              <p className="text-gray-600">Our AI analyzes thousands of data points including current exchange rates, seasonal price fluctuations, and local economic factors to provide estimates typically within 10% of actual costs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Can I change my itinerary during my trip?</h3>
              <p className="text-gray-600">Absolutely! TravelAI provides real-time adjustments to your schedule. If you want to stay longer at a location or skip an activity, our AI will recalibrate the rest of your itinerary accordingly.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Does TravelAI work in remote destinations?</h3>
              <p className="text-gray-600">Yes! Our database covers over 25,000 destinations worldwide, including many off-the-beaten-path locations. For extremely remote areas, we provide general guidance with the caveat that details may be less precise.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Is there a mobile app available?</h3>
              <p className="text-gray-600">Yes, TravelAI is available on both iOS and Android platforms with offline capabilities for when you're exploring areas with limited connectivity.</p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-center max-w-5xl mx-auto mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of satisfied travelers who plan smarter, travel better.</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-indigo-600 text-lg px-8 py-4 rounded-full
                     hover:bg-indigo-50 transform hover:scale-105 transition-all
                     shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </button>
          <p className="text-indigo-200 mt-4">No credit card required. 14-day free trial.</p>
        </div>
        
        {/* Contact Section */}
        <div id="contact" className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">support@travelai.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (888) 555-TRAVEL</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Plane className="w-6 h-6 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">TravelAI</span>
              </div>
              <p className="text-gray-600 mb-4">Making travel planning smarter, faster, and more personalized.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Travel Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Destinations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Tips & Tricks</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
            <p>© {new Date().getFullYear()} TravelAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;