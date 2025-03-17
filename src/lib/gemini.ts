import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyB9oQ2ibthHs30PLjqopWkRasjMiqhmN1Q");

const USD_TO_INR = 83; // Average conversion rate (you might want to use a real-time API in production)

export async function generateTravelPlan(location: string, budget: number, startDate: string, endDate: string, travelDays: number) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const budgetInINR = Math.round(budget * USD_TO_INR);

  const prompt = `Generate a detailed travel plan for ${location} within a budget of $${budget} (₹${budgetInINR}) from ${startDate} to ${endDate} for ${travelDays} days. The response **must be in JSON format** as per the structure below:

{
  "location": "${location}",
  "budget": ${budgetInINR},
  "total_days": ${travelDays},
  "start_date": "${startDate}",
  "end_date": "${endDate}",
  "daily_plan": [
    {
      "day": "Day 1",
      "date": "${startDate}",
      "activities": {
        "morning": "Visit [Place] and have breakfast at [Local Eatery]",
        "afternoon": "Explore [Market] and enjoy local lunch",
        "evening": "Street food tour at [Location] and local shopping"
      },
      "estimated_cost": 3000
    },
    {
      "day": "Day 2",
      "date": "YYYY-MM-DD",
      "activities": {
        "morning": "Visit [Historical Site]",
        "afternoon": "Explore [Museum/Art Gallery]",
        "evening": "Enjoy dinner at [Local Restaurant]"
      },
      "estimated_cost": 3500
    },
    {
      "day": "Day 3",
      "date": "YYYY-MM-DD",
      "activities": {
        "morning": "Local sightseeing at [Place]",
        "afternoon": "Relax at [Park/Cafe]",
        "evening": "Visit [Famous Local Spot] before departure"
      },
      "estimated_cost": 3500
    }
  ],
  "accommodation": {
    "type": "Budget Hotel",
    "estimated_cost": 4000
  },
  "total_estimated_cost": ${budgetInINR}
}

- Replace placeholders like [Place], [Market], [Local Eatery] with actual popular spots in ${location}.
- Ensure the estimated cost is realistic and within the ₹${budgetInINR} budget.
- Format all amounts in INR.
- Respond **only with the JSON object** without any additional text or explanations.
- Ensure the output is well-formatted JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
