import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Loader2, ArrowLeft, GripVertical, 
  MapPin, Calendar, Wallet, CloudSun 
} from 'lucide-react';
import { generateTravelPlan } from '../lib/gemini';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  useSortable, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Travel Planner Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p>There was an error loading your travel plan. Please try again or refresh the page.</p>
          <button 
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded transition"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Travel Loader Component

function TravelLoader() {
  const [loadingStage, setLoadingStage] = useState(0);
  const [planePosition, setPlanePosition] = useState({
    x: -100,
    y: -50,
    rotation: 45
  });

  const loadingMessages = [
    'Preparing your travel essentials...',
    'Mapping out breathtaking destinations...',
    'Calculating optimal routes...',
    'Discovering hidden travel gems...',
    'Tailoring your perfect adventure...',
    'Fine-tuning your dream journey...',
    'Almost ready to take flight!'
  ];

  useEffect(() => {
    const stages = [0, 15, 30, 45, 60, 75, 90, 100];
    let currentStageIndex = 0;

    const loadingInterval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setLoadingStage(currentStageIndex);
        
        // Animate plane movement with more deliberate progression
        const newX = (stages[currentStageIndex] / 100) * (window.innerWidth + 200);
        const newY = Math.sin(newX / 100) * 70; // Increased wave amplitude
        
        setPlanePosition({
          x: newX,
          y: -50 + newY,
          rotation: 45 + Math.sin(newX / 100) * 20 // Increased rotation variation
        });

        currentStageIndex++;
      } else {
        clearInterval(loadingInterval);
      }
    }, 1200); // Increased interval time for slower progression

    return () => clearInterval(loadingInterval);
  }, []);

  // Enhanced Cloud Component with More Dynamic Animations
  const Cloud = ({ 
    position, 
    size = 'w-16 h-16', 
    zIndex = 'z-10', 
    animationDelay = '0s',
    direction = 'left'
  }) => (
    <div 
      className={`absolute ${position} ${size} ${zIndex} opacity-70 transform`}
      style={{ 
        animationName: 'cloudFloat',
        animationDuration: `${Math.random() * 12 + 8}s`, // Extended duration
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
        animationDelay,
        transform: `translateX(${direction === 'left' ? '-' : ''}${Math.random() * 70}px) rotate(${Math.floor(Math.random() * 45)}deg)`
      }}
    >
      ☁️
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-sky-100 to-blue-200 z-50 overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #e6f2ff, #b3d9ff, #80bfff)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 20s ease infinite' // Slower gradient flow
      }}
    >
      {/* Global Styles for Cloud and Gradient Animations */}
      <style>{`
        @keyframes cloudFloat {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-40px) scale(1.05); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Clouds with Enhanced Varied Animations */}
      <Cloud position="top-10 left-10" animationDelay="0.3s" />
      <Cloud position="top-20 right-20 w-24 h-24" zIndex="z-0" animationDelay="0.7s" direction="right" />
      <Cloud position="bottom-10 left-1/3" size="w-20 h-20" animationDelay="1s" />
      <Cloud position="bottom-20 right-1/4" size="w-12 h-12" zIndex="z-0" animationDelay="0.5s" direction="right" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        {/* Animated Plane with More Fluid Movement */}
        <div 
          className="absolute transition-all duration-700 ease-in-out"
          style={{ 
            transform: `translate(${planePosition.x}px, ${planePosition.y}px) rotate(${planePosition.rotation}deg)`,
            transition: 'transform 1.5s ease-in-out'
          }}
        >
          <Plane 
            className="w-28 h-28 text-indigo-600 animate-bounce" 
            style={{ 
              animationDuration: '2.5s',
            }} 
          />
        </div>

        <div className="mt-40">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Crafting Your Personalized Journey
          </h2>
          
          {/* Enhanced Loading Indicator */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            {loadingMessages.map((_, dot) => (
              <div 
                key={dot} 
                className={`w-4 h-4 rounded-full bg-indigo-600 transition-all duration-700 ease-in-out ${
                  loadingStage >= dot ? 'opacity-100 scale-125' : 'opacity-30'
                }`}
              />
            ))}
          </div>
          
          <div className="text-2xl font-semibold text-indigo-700 mt-6 h-12">
            {loadingMessages[loadingStage] || 'Preparing your adventure...'}
          </div>
          
          <p className="text-gray-600 mt-4 animate-pulse">
            Your personalized travel experience is being curated...
          </p>
        </div>
      </div>
    </div>
  );
}
// Sortable Item Component
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <div className="absolute top-2 left-2 cursor-grab text-gray-500 hover:text-gray-700">
        <GripVertical className="w-5 h-5" />
      </div>
      {children}
    </div>
  );
}

// Travel Plan Card Component
function TravelPlanCard({ day, date, activities, estimatedCost }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105">
      <div className="bg-gradient-to-r from-sky-200 to-blue-300 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{day}</h3>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <CloudSun className="w-6 h-6 mr-3 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-gray-700">Morning</h4>
              <p className="text-gray-600">{activities.morning}</p>
            </div>
          </div>
          <div className="flex items-start">
            <MapPin className="w-6 h-6 mr-3 text-green-500" />
            <div>
              <h4 className="font-semibold text-gray-700">Afternoon</h4>
              <p className="text-gray-600">{activities.afternoon}</p>
            </div>
          </div>
          <div className="flex items-start">
            <Wallet className="w-6 h-6 mr-3 text-purple-500" />
            <div>
              <h4 className="font-semibold text-gray-700">Evening</h4>
              <p className="text-gray-600">{activities.evening}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t pt-3 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Estimated Cost</span>
          <span className="text-lg font-bold text-green-600">₹{estimatedCost}</span>
        </div>
      </div>
    </div>
  );
}

// Cost Formatting Utility
function formatCost(cost) {
  if (cost === undefined || cost === null) return 'N/A';
  
  if (typeof cost === 'string') {
    if (cost.startsWith('₹')) return cost;
    if (cost.startsWith('$')) {
      const amount = cost.substring(1);
      const parsed = parseFloat(amount);
      return !isNaN(parsed) ? `₹${parsed}` : `₹${amount}`;
    }
    const parsed = parseFloat(cost);
    return !isNaN(parsed) ? `₹${parsed}` : cost;
  }
  
  if (typeof cost === 'number') return `₹${cost}`;
  
  return String(cost);
}

function TravelPlanner() {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  // Date Validation Effect
  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
    } else {
      setError('');
    }
  }, [startDate, endDate]);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Date Validation
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let plan = await generateTravelPlan(location, Number(budget), startDate, endDate);
      
      // JSON Parsing with Error Handling
      plan = plan.replace(/```json|```/g, '').trim();
      
      let parsedPlan;
      try {
        parsedPlan = JSON.parse(plan);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw response:', plan);
        
        // JSON Cleanup Attempts
        plan = plan.replace(/: undefined/g, ': null')
                   .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
        
        try {
          parsedPlan = JSON.parse(plan);
        } catch (secondParseError) {
          throw new Error('Failed to parse travel plan data. Please try again.');
        }
      }
      
      // Ensure Minimum Plan Structure
      if (!parsedPlan.daily_plan || !Array.isArray(parsedPlan.daily_plan)) {
        parsedPlan.daily_plan = [];
      }
      
      // Validate Daily Plan Structure
      parsedPlan.daily_plan = parsedPlan.daily_plan.map((day, index) => ({
        day: day.day || `Day ${index + 1}`,
        date: day.date || 'N/A',
        activities: {
          morning: day.activities?.morning || 'No activities planned',
          afternoon: day.activities?.afternoon || 'No activities planned',
          evening: day.activities?.evening || 'No activities planned'
        },
        estimated_cost: day.estimated_cost || 0
      }));
      
      setTravelPlan(parsedPlan);
      setItems(parsedPlan.daily_plan.map((_, index) => index));
    } catch (error) {
      console.error('Error generating travel plan:', error);
      setError(`Failed to generate travel plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop Handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Loading State
  if (loading) {
    return <TravelLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center">
            <Plane className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">AI Travel Planner</h1>
          </div>
          <div className="w-24"></div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl p-8 mb-8 grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Where would you like to go?
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Delhi, India"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                What's your budget? (INR)
              </label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="150000"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading || !!error}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 inline-block" /> Generating...
                  </>
                ) : (
                  'Plan My Trip'
                )}
              </button>
              
              {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {error}
                </div>
              )}
            </div>
          </form>

          <ErrorBoundary>
  {travelPlan && travelPlan.daily_plan && travelPlan.daily_plan.length > 0 && (
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-gray-50">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Your Travel Expedition Overview
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl transform transition hover:scale-105 hover:shadow-lg">
            <MapPin className="w-10 h-10 text-blue-600 mb-4 mx-auto" />
            <h3 className="font-bold text-gray-700 text-center mb-2">Destination</h3>
            <p className="text-gray-900 text-xl text-center font-semibold">
              {location}
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-100 p-6 rounded-xl transform transition hover:scale-105 hover:shadow-lg">
            <Wallet className="w-10 h-10 text-green-600 mb-4 mx-auto" />
            <h3 className="font-bold text-gray-700 text-center mb-2">Total Budget</h3>
            <p className="text-gray-900 text-xl text-center font-semibold">
              ₹{budget.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl transform transition hover:scale-105 hover:shadow-lg">
            <Calendar className="w-10 h-10 text-purple-600 mb-4 mx-auto" />
            <h3 className="font-bold text-gray-700 text-center mb-2">Trip Duration</h3>
            <p className="text-gray-900 text-xl text-center font-semibold">
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Daily Itinerary
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Easily customize your journey by dragging and rearranging days
      </p>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="grid md:grid-cols-2 gap-8">
            {items.map((index) => {
              const day = travelPlan.daily_plan[index];
              if (!day) return null;
              
              return (
                <SortableItem key={index} id={index}>
                  <TravelPlanCard
                    day={day.day}
                    date={day.date}
                    activities={day.activities}
                    estimatedCost={day.estimated_cost}
                  />
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )}
</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default function TravelPlannerWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <TravelPlanner />
    </ErrorBoundary>
  );
}