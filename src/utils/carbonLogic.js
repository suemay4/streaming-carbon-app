// src/utils/carbonLogic.js

// Malaysia grid emission factors (kg CO2e / kWh) from Suruhanjaya Tenaga / Energy Commission
// 2022–2024 provisional GEF (Gg CO2e/GWh) ÷ 1000 → kg CO2e/kWh
// https://myenergystats.st.gov.my/documents/d/guest/grid-emission-factor-gef-in-malaysia-2022-2024-provisional-

export const REGION_FACTORS = {
  'Peninsular Malaysia': 0.740,
  'Sabah': 0.539,
  'Sarawak': 0.199
};

export const DEVICE_PROFILES = [
  { name: 'Smartphone', power: 5 },
  { name: 'Tablet', power: 15 },
  { name: 'Laptop', power: 32.5 },
  { name: 'Desktop PC', power: 110 },
  { name: 'Smart TV', power: 200 }
];

// Dynamic Resolution configuration
export const RESOLUTION_PROFILES = [
  { label: '360p (SD)', value: '360p', rate: 0.3 },
  { label: '720p (HD)', value: '720p', rate: 1.2 },
  { label: '1080p (FHD)', value: '1080p', rate: 2.25 },
  { label: '4K (UHD)', value: '4K', rate: 8.0 }
];

// Empirical: kWh/GB for data centers + networks (global average band, not Malaysia‑specific)
// Common range in literature: ~0.01–0.1 kWh/GB

const ENERGY_INTENSITY_DC = 0.015;  // kWh/GB
const ENERGY_INTENSITY_NET = 0.06; // kWh/GB before 0.015


const DATA_RATES = { 
  '360p': 0.3, 
  '720p': 1.2, 
  '1080p': 2.25, 
  '4K': 8.0 
};

export const projectEmissions = (sessionGrams, frequency, period) => {
  // frequency is how many times per period (e.g., 5 times a week)
  const multiplier = period === 'Weekly' ? frequency : frequency * 30; // Monthly estimate
  const total = sessionGrams * multiplier;
  
  return {
    periodTotal: parseFloat(total.toFixed(2)),
    annualTotal: parseFloat((total * (period === 'Weekly' ? 52 : 12) / 1000).toFixed(2)) // in kg
  };
};

export const calculateFootprint = (durationMinutes, resolution, device, region, customBitrate = null) => {
  const hours = durationMinutes / 60;
  const deviceProfile = DEVICE_PROFILES.find(d => d.name === device) || { power: 32.5 }; 
  const devicePower = deviceProfile.power;

  const resProfile = RESOLUTION_PROFILES.find(r => r.value === resolution) || { rate: 0.3 };
  const dataRateGBh = resProfile.rate;

  let dataGB;
  if (customBitrate) {
    // 1. Convert minutes to seconds
    const durationSeconds = durationMinutes * 60;

    // 2. Calculate GB
    // Formula: (kbps * seconds) / (8 bits * 1024 KB * 1024 MB)
    dataGB = (customBitrate * durationSeconds) / (8 * 1024 * 1024);
  } else {
    // Fallback remains the same as it is already in GB/hour
    dataGB = (RESOLUTION_PROFILES.find(r => r.value === resolution)?.rate || 0.3) * hours;
  }

  const gridFactor = REGION_FACTORS[region] || 0.740;

  const eDc = dataGB * ENERGY_INTENSITY_DC;
  const eNet = dataGB * ENERGY_INTENSITY_NET;
  const eDevice = (devicePower / 1000) * hours;
  
  const totalKWh = eDc + eNet + eDevice;
  const carbonGrams = totalKWh * gridFactor * 1000;
  
  return {
    total: parseFloat(carbonGrams.toFixed(2)),
    dataUsedGB: parseFloat(dataGB.toFixed(3)),
    breakdown: {
      dc: parseFloat((eDc * gridFactor * 1000).toFixed(2)),
      net: parseFloat((eNet * gridFactor * 1000).toFixed(2)),
      device: parseFloat((eDevice * gridFactor * 1000).toFixed(2))
    }
  };
};