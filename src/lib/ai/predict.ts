export type PredictionRequest = {
  crop: string;
  currentPrice: number;
  quantityTons: number;
};

export type ChartDataPoint = {
  date: string;
  historicalPrice?: number;
  predictedPrice?: number;
};

export type PredictionResult = {
  crop: string;
  currentValue: number;
  predictedValue: number;
  expectedProfit: number;
  recommendation: "SELL NOW" | "HOLD INVENTORY";
  reason: string;
  peakDays: number;
  trajectory: ChartDataPoint[];
};

/**
 * Calculates a simple moving average (SMA).
 */
function calculateSMA(data: number[], windowSize: number): number[] {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      sma.push(data[i]); // Not enough data for a full window
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j];
      }
      sma.push(sum / windowSize);
    }
  }
  return sma;
}

/**
 * Formats a date to "MMM D" (e.g., "May 15")
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generatePrediction({
  crop,
  currentPrice,
  quantityTons,
}: PredictionRequest): PredictionResult {
  const trajectory: ChartDataPoint[] = [];
  const today = new Date();
  
  // 1. Simulate 30 days of historical data
  const historicalPrices: number[] = [];
  let simulatedPrice = currentPrice * 0.92; // Start slightly lower

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some random volatility (±2%)
    const volatility = 1 + (Math.random() * 0.04 - 0.02);
    simulatedPrice = simulatedPrice * volatility;
    
    // Ensure the last point matches exactly the current price
    if (i === 0) {
      simulatedPrice = currentPrice;
    }
    
    historicalPrices.push(simulatedPrice);
    
    // Every 5 days add to the visible trajectory
    if (i % 5 === 0) {
      trajectory.push({
        date: formatDate(date),
        historicalPrice: Math.round(simulatedPrice),
        ...(i === 0 ? { predictedPrice: Math.round(simulatedPrice) } : {}) // Hook for prediction
      });
    }
  }

  // 2. Calculate Moving Averages for momentum
  const sma7 = calculateSMA(historicalPrices, 7);
  const sma14 = calculateSMA(historicalPrices, 14);
  const currentSma7 = sma7[sma7.length - 1];
  const currentSma14 = sma14[sma14.length - 1];
  
  // Determine trend momentum
  const momentum = currentSma7 / currentSma14;

  // 3. Extrapolate future prices over 30 days
  let predictedPrice = currentPrice;
  let peakPrice = currentPrice;
  let peakDays = 0;
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Base trend + slight mean reversion + random noise
    const trendFactor = momentum > 1 ? 1.002 : 0.998;
    const noise = 1 + (Math.random() * 0.02 - 0.01);
    
    predictedPrice = predictedPrice * trendFactor * noise;
    
    if (predictedPrice > peakPrice) {
      peakPrice = predictedPrice;
      peakDays = i;
    }

    if (i % 5 === 0) {
      trajectory.push({
        date: formatDate(date),
        predictedPrice: Math.round(predictedPrice),
      });
    }
  }

  peakPrice = Math.round(peakPrice);

  // 4. Calculate Financials
  const currentValue = currentPrice * quantityTons;
  const predictedValue = peakPrice * quantityTons;
  const expectedProfit = predictedValue - currentValue;
  
  // Assume a warehouse storage cost of ~1% of crop value per month
  const storageCost = currentValue * 0.01;
  const netExpectedProfit = expectedProfit - storageCost;

  // 5. Generate Recommendation
  let recommendation: "SELL NOW" | "HOLD INVENTORY" = "SELL NOW";
  let reason = "";

  // If net profit increase is > 2%, recommend holding
  if (netExpectedProfit > currentValue * 0.02 && peakDays > 3) {
    recommendation = "HOLD INVENTORY";
    reason = `Positive market momentum detected. Prices are projected to peak in approximately ${peakDays} days.`;
  } else if (momentum < 1) {
    recommendation = "SELL NOW";
    reason = "Market is in a downtrend. Recommend liquidating inventory to prevent further losses.";
  } else {
    recommendation = "SELL NOW";
    reason = "Expected price increase does not offset warehouse storage costs. Immediate sale recommended.";
  }

  return {
    crop,
    currentValue: Math.round(currentValue),
    predictedValue: Math.round(predictedValue),
    expectedProfit: Math.round(expectedProfit),
    recommendation,
    reason,
    peakDays,
    trajectory
  };
}
