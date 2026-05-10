import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const ownerTrustSystemPrompt = `
You are the KrishiVault Warehouse Trust Score Engine — an AI system that calculates and 
explains WAREHOUSE OWNER trust scores for a rural agricultural storage platform in India.

Farmers deposit their precious produce (rice, wheat, pulses) with warehouse owners. 
This score tells farmers HOW MUCH THEY CAN TRUST a specific warehouse owner with their livelihood.

You receive a warehouse owner's raw operational data as JSON and must:
1. Calculate their trust score (0-100) across 5 pillars
2. Calculate their activity streak (how consistently they manage their facility)
3. Determine their tier (Bronze/Silver/Gold/Platinum)
4. Generate a plain-English summary a rural farmer can understand
5. List what the owner should do to improve their score
6. Generate streak milestone rewards

SCORING RULES — follow exactly:

== PILLAR 1: PLATFORM PRESENCE (max 20 points) ==
Measures how actively the owner manages their facility on the platform.
- Count unique active days in the last 30 days (any login or dashboard action)
- 25+ days = 20 pts
- 20-24 days = 16 pts
- 15-19 days = 12 pts
- 10-14 days = 8 pts
- 5-9 days = 4 pts
- < 5 days = 0 pts
- Bonus: +2 if owner responds to booking requests within 2 hours consistently
- Cap at 20

== PILLAR 2: BOOKING FULFILLMENT (max 20 points) ==
Measures whether the owner reliably serves farmers who book their facility.
- Base = (bookings_completed / total_bookings_received) * 16
- Each booking cancelled by owner: -4 pts (farmer lost opportunity)
- Each booking dispute raised by farmer: -3 pts
- Each booking completed on time with no complaints: +1 pt (up to +4 bonus)
- If total_bookings_received = 0: assign 10 pts (new, neutral)
- Cap at 20

== PILLAR 3: FACILITY COMPLIANCE (max 20 points) ==
Measures whether the owner maintains proper certifications and facility standards.
- FSSAI license active: +6 pts
- ISO certification: +4 pts
- Fire safety compliance: +3 pts
- Pest control certification (last 6 months): +3 pts
- Cold chain certification (if applicable): +2 pts
- Insurance coverage for stored produce: +2 pts
- Cap at 20

== PILLAR 4: FARMER FEEDBACK (max 20 points) ==
Measures satisfaction of farmers who've used this warehouse.
- Average rating (1-5 stars) from verified bookings:
  - 4.5-5.0: 20 pts | 4.0-4.4: 16 pts | 3.5-3.9: 12 pts
  - 3.0-3.4: 8 pts  | 2.5-2.9: 4 pts  | < 2.5: 0 pts
- If no reviews yet (new owner): assign 12 pts (neutral)
- Each verified positive review: +1 pt (max +4, but don't exceed cap)
- Cap at 20

== PILLAR 5: CAPACITY & TRANSPARENCY (max 20 points) ==
- Accurate capacity listing (no overbooking events): +5 pts
- Price listed publicly on platform: +3 pts
- Photos of facility uploaded: +3 pts
- Location coordinates verified (GPS pin): +3 pts
- Certifications uploaded as documents: +3 pts
- Response to last 5 farmer inquiries: +1 pt each (up to +3 pts)
- Cap at 20

== TOTAL SCORE & TIER ==
- 0-39 = Bronze | 40-64 = Silver | 65-84 = Gold | 85-100 = Platinum

== STREAK CALCULATION ==
Owner streak = consecutive days with at least 1 active management action.
Qualifying: login, respond to booking, update facility info, view dashboard.

== STREAK REWARDS ==
7 days: "Active Steward" badge + platform ranking boost
14 days: "Reliable Partner" badge + featured listing for 3 days
30 days: "Elite Facility" badge + verified checkmark + reduced platform commission
60 days: "Kisan's Choice" award + dedicated relationship manager
90 days: "KrishiVault Certified" — top of all farmer search results

== OUTPUT FORMAT ==
Respond ONLY with valid JSON, no markdown, no explanation outside JSON:
{
  "owner_id": "string",
  "score": {
    "total": 0,
    "tier": "Bronze",
    "pillars": {
      "platform_presence": { "score": 0, "max": 20, "breakdown": "string" },
      "booking_fulfillment": { "score": 0, "max": 20, "breakdown": "string" },
      "facility_compliance": { "score": 0, "max": 20, "breakdown": "string" },
      "farmer_feedback": { "score": 0, "max": 20, "breakdown": "string" },
      "capacity_transparency": { "score": 0, "max": 20, "breakdown": "string" }
    }
  },
  "streak": {
    "current_streak_days": 0,
    "best_streak_days": 0,
    "active_multiplier": 1,
    "milestones_earned": [],
    "next_milestone": { "days": 7, "reward": "string", "days_remaining": 7 },
    "last_14_days": []
  },
  "owner_card": {
    "display_score": 0,
    "display_tier": "Bronze",
    "display_streak": 0,
    "badges": [],
    "farmer_recommendation": "string",
    "features_unlocked": [],
    "commission_rate_percent": 5,
    "ranking_boost": false
  },
  "improvement_tips": [
    { "action": "string", "points_gain": 0, "pillar": "string", "difficulty": "easy" }
  ],
  "plain_english_summary": "string",
  "farmer_facing_summary": "string"
}
`;

function generateFallbackScore(data: any) {
  const p = data.pillars_raw_data || {};
  
  // 1. Platform Presence
  const activeDays = p.active_days_last_30 || 0;
  let p1Score = activeDays >= 25 ? 20 : activeDays >= 20 ? 16 : activeDays >= 15 ? 12 : activeDays >= 10 ? 8 : activeDays >= 5 ? 4 : 0;
  if (p.fast_response) p1Score += 2;
  p1Score = Math.min(20, p1Score);

  // 2. Booking Fulfillment
  const b = p.bookings || { total_received: 0, completed: 0, cancelled_by_owner: 0, disputes: 0 };
  let p2Score = 10;
  if (b.total_received > 0) {
    p2Score = (b.completed / b.total_received) * 16;
    p2Score -= (b.cancelled_by_owner * 4);
    p2Score -= (b.disputes * 3);
    p2Score = Math.max(0, p2Score);
  }
  p2Score = Math.min(20, p2Score);

  // 3. Facility Compliance
  const c = p.certifications || {};
  let p3Score = 0;
  if (c.fssai) p3Score += 6;
  if (c.iso) p3Score += 4;
  if (c.fire_safety) p3Score += 3;
  if (c.pest_control) p3Score += 3;
  if (c.cold_chain) p3Score += 2;
  if (c.insurance) p3Score += 2;
  p3Score = Math.min(20, p3Score);

  // 4. Farmer Feedback
  const r = p.reviews || { count: 0, average_rating: null };
  let p4Score = 12; // Neutral start
  if (r.count > 0 && r.average_rating) {
    const avg = r.average_rating;
    p4Score = avg >= 4.5 ? 20 : avg >= 4.0 ? 16 : avg >= 3.5 ? 12 : avg >= 3.0 ? 8 : avg >= 2.5 ? 4 : 0;
  }

  // 5. Capacity & Transparency
  const t = p.transparency || {};
  let p5Score = 0;
  if (t.no_overbooking_events) p5Score += 5;
  if (t.price_listed) p5Score += 3;
  if (t.photos_uploaded) p5Score += 3;
  if (t.gps_verified) p5Score += 3;
  if (t.certifications_uploaded) p5Score += 3;
  p5Score = Math.min(20, p5Score);

  // Totals & Tier
  const totalScore = Math.round(p1Score + p2Score + p3Score + p4Score + p5Score);
  const tier = totalScore >= 85 ? "Platinum" : totalScore >= 65 ? "Gold" : totalScore >= 40 ? "Silver" : "Bronze";

  // Dynamic Tips
  const tips = [];
  if (!c.fssai) tips.push({ action: "Add FSSAI certification", points_gain: 6, pillar: "facility_compliance", difficulty: "medium" });
  if (!t.gps_verified) tips.push({ action: "Verify GPS location pin", points_gain: 3, pillar: "capacity_transparency", difficulty: "easy" });
  if (!t.photos_uploaded) tips.push({ action: "Upload facility photos", points_gain: 3, pillar: "capacity_transparency", difficulty: "easy" });
  if (activeDays < 15) tips.push({ action: "Log into dashboard more often", points_gain: 4, pillar: "platform_presence", difficulty: "easy" });

  // Streak calculation
  const activities = (data.activity_log || []).map((a: any) => new Date(a.date).toDateString());
  const uniqueDates = [...new Set(activities)].sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime());
  
  let currentStreak = 0;
  let checkDate = new Date();
  
  // Simple streak algorithm (checks if active today or yesterday, then goes back)
  const todayStr = checkDate.toDateString();
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterdayStr = checkDate.toDateString();

  if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
    let cursorDate = uniqueDates.includes(todayStr) ? new Date() : checkDate;
    while (uniqueDates.includes(cursorDate.toDateString())) {
      currentStreak++;
      cursorDate.setDate(cursorDate.getDate() - 1);
    }
  }

  return {
    owner_id: data.owner_id,
    score: {
      total: totalScore,
      tier: tier,
      pillars: {
        platform_presence: { score: p1Score, max: 20, breakdown: `Active for ${activeDays} days this month. Log in regularly to boost visibility.` },
        booking_fulfillment: { score: p2Score, max: 20, breakdown: b.total_received === 0 ? "No bookings yet. Ready to accept farmers." : `Completed ${b.completed} of ${b.total_received} bookings securely.` },
        facility_compliance: { score: p3Score, max: 20, breakdown: p3Score >= 15 ? "Excellent compliance and certifications." : "Missing some key certifications (like FSSAI or Fire Safety)." },
        farmer_feedback: { score: p4Score, max: 20, breakdown: r.count === 0 ? "Awaiting first verified farmer review." : `Maintained a ${r.average_rating} star rating across ${r.count} reviews.` },
        capacity_transparency: { score: p5Score, max: 20, breakdown: p5Score >= 14 ? "Highly transparent profile with photos and verified GPS." : "Profile is incomplete. Add photos and GPS coordinates." }
      }
    },
    streak: {
      current_streak_days: currentStreak,
      best_streak_days: Math.max(currentStreak, 2),
      active_multiplier: 1,
      milestones_earned: currentStreak >= 7 ? ["Active Steward"] : [],
      next_milestone: { days: 7, reward: "Active Steward badge", days_remaining: Math.max(1, 7 - currentStreak) },
      last_14_days: []
    },
    owner_card: {
      display_score: totalScore,
      display_tier: tier,
      display_streak: currentStreak,
      badges: currentStreak >= 7 ? ["Active Steward"] : [],
      farmer_recommendation: totalScore >= 65 ? "Highly recommended facility by KrishiVault." : "This facility is currently building its reliability profile.",
      features_unlocked: tier === "Platinum" ? ["Premium Placement", "Zero Commission"] : tier === "Gold" ? ["Premium Placement"] : [],
      commission_rate_percent: tier === "Platinum" ? 2 : tier === "Gold" ? 3.5 : 5,
      ranking_boost: totalScore >= 65
    },
    improvement_tips: tips.slice(0, 3),
    plain_english_summary: `Your facility scored ${totalScore}/100 (${tier} Tier). ${tips.length > 0 ? "Complete the actions below to increase farmer trust." : "You are doing an excellent job!"}`,
    farmer_facing_summary: totalScore >= 65 ? "A verified and highly trusted warehouse." : "A developing facility in the KrishiVault network."
  };
}

export async function calculateOwnerTrustScore(ownerData: any) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: ownerTrustSystemPrompt },
        {
          role: "user",
          content: `Calculate trust score, streak, and owner card for this warehouse owner. Return ONLY valid JSON:\n\n${JSON.stringify(ownerData, null, 2)}`
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    const text = completion.choices[0]?.message?.content || "";
    // Strip any accidental markdown code fences
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error("Groq Trust Score Error:", error?.message || error);
    // Silent local math fallback
    return generateFallbackScore(ownerData);
  }
}
