import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Loader2, ArrowLeft, GripVertical } from 'lucide-react';
import { generateTravelPlan } from '../lib/gemini';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

function formatCost(cost) {
  if (cost === undefined || cost === null) return 'N/A';
  
  // If it's already a string
  if (typeof cost === 'string') {
    // If it already has a rupee symbol, return as is
    if (cost.startsWith('₹')) {
      return cost;
    }
    // If it has a dollar symbol, replace with rupee
    if (cost.startsWith('$')) {
      const amount = cost.substring(1);
      const parsed = parseFloat(amount);
      if (!isNaN(parsed)) {
        return `₹${parsed}`;
      }
      return `₹${amount}`;
    }
    // Try to parse it as a number
    const parsed = parseFloat(cost);
    if (!isNaN(parsed)) {
      return `₹${parsed}`;
    }
    // Return as is if it can't be parsed
    return cost;
  }
  
  // If it's a number
  if (typeof cost === 'number') {
    return `₹${cost}`;
  }
  
  // Fallback
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

  // Validate dates when they change
  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
    } else {
      setError('');
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let plan = await generateTravelPlan(location, Number(budget), startDate, endDate);
      
      // Clean up the response by removing markdown code block indicators
      plan = plan.replace(/```json|```/g, '').trim();
      
      // Handle potential undefined values by creating a default structure
      let parsedPlan;
      try {
        parsedPlan = JSON.parse(plan);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw response:', plan);
        
        // Try to fix common issues with the JSON
        // Replace undefined with null
        plan = plan.replace(/: undefined/g, ': null');
        // Add quotes to unquoted keys
        plan = plan.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
        
        try {
          parsedPlan = JSON.parse(plan);
        } catch (secondParseError) {
          throw new Error('Failed to parse travel plan data. Please try again.');
        }
      }
      
      // Create default structure if missing
      if (!parsedPlan.daily_plan || !Array.isArray(parsedPlan.daily_plan)) {
        parsedPlan.daily_plan = [];
      }
      
      // Validate the structure of each day
      parsedPlan.daily_plan = parsedPlan.daily_plan.map((day, index) => {
        return {
          day: day.day || `Day ${index + 1}`,
          date: day.date || 'N/A',
          activities: {
            morning: day.activities?.morning || 'No activities planned',
            afternoon: day.activities?.afternoon || 'No activities planned',
            evening: day.activities?.evening || 'No activities planned'
          },
          estimated_cost: day.estimated_cost || 0
        };
      });
      
      setTravelPlan(parsedPlan);
      setItems(parsedPlan.daily_plan.map((_, index) => index));
    } catch (error) {
      console.error('Error generating travel plan:', error);
      setError(`Failed to generate travel plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8 grid gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Where would you like to go?</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Delhi, India"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">What's your budget? (INR)</label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="150000"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || error}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
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
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>

          <ErrorBoundary>
            {travelPlan && travelPlan.daily_plan && travelPlan.daily_plan.length > 0 && (
              <div className="mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Trip Summary</h2>
                  <p className="text-gray-700 mb-2"><strong>Destination:</strong> {location}</p>
                  <p className="text-gray-700 mb-2"><strong>Budget:</strong> ₹{budget}</p>
                  <p className="text-gray-700 mb-2"><strong>Duration:</strong> {startDate} to {endDate}</p>
                  {travelPlan.total_cost && (
                    <p className="text-gray-700 mb-2">
                      <strong>Estimated Total Cost:</strong> {formatCost(travelPlan.total_cost)}
                    </p>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Daily Itinerary</h2>
                <p className="text-gray-600 mb-4">Drag days to reorder your itinerary.</p>
                
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {items.map((index) => {
                        const day = travelPlan.daily_plan[index];
                        if (!day) return null;
                        
                        return (
                          <SortableItem key={index} id={index}>
                            <div className="bg-gradient-to-r from-purple-200 to-indigo-200 rounded-lg shadow p-4 pl-10">
                              <h2 className="text-xl font-bold mb-2">{day.day} - {day.date || 'N/A'}</h2>
                              {day.activities && (
                                <>
                                  <p><strong>Morning:</strong> {day.activities.morning || 'No activities planned'}</p>
                                  <p><strong>Afternoon:</strong> {day.activities.afternoon || 'No activities planned'}</p>
                                  <p><strong>Evening:</strong> {day.activities.evening || 'No activities planned'}</p>
                                </>
                              )}
                              <p className="mt-2">
                                <strong>Estimated Cost:</strong> {formatCost(day.estimated_cost)}
                              </p>
                            </div>
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