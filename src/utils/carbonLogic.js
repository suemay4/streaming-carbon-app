export const REGION_FACTORS = {
  'Peninsular Malaysia': 0.740,
  'Sabah': 0.539,
  'Sarawak': 0.199
};

export const DEVICE_PROFILES = [
  { name: 'Smartphone', power: 4.5 },
  { name: 'Tablet', power: 6 },
  { name: 'Laptop', power: 42.5 },
  { name: 'Desktop PC', power: 125 },
  { name: 'Smart TV', power: 51 }
];

export const RESOLUTION_PROFILES = [
  { label: '360p (SD)', value: '360p', rate: 1.8 },
  { label: '720p (HD)', value: '720p', rate: 2.7 },
  { label: '1080p (FHD)', value: '1080p', rate: 5.40 },
  { label: '4K (UHD)', value: '4K', rate: 15.75 }
];

const ENERGY_INTENSITY_DC = 0.0015;  // kWh/GB
const ENERGY_INTENSITY_NET = 0.0185; // kwh/hr

export const projectEmissions = (sessionGrams, frequency, period) => {
  const multiplier = period === 'Weekly' ? frequency : frequency * 30; // Monthly estimate
  const total = sessionGrams * multiplier;
  
  return {
    periodTotal: parseFloat(total.toFixed(2)),
    annualTotal: parseFloat((total * (period === 'Weekly' ? 52 : 12) / 1000).toFixed(2)) // in kg
  };
};

export const calculateFootprint = (durationMinutes, resolution, device, region, customBitrate = null) => {
  const hours = durationMinutes / 60;

  let dataGB;
  if (customBitrate) {
    const durationSeconds = durationMinutes * 60;
    dataGB = (customBitrate * durationSeconds) / (8 * 1024 * 1024);
  } else {
    const resProfile = RESOLUTION_PROFILES.find(r => r.value === resolution) || { rate: 1.8 };
    dataGB = resProfile.rate * hours;
  }

  const deviceProfile = DEVICE_PROFILES.find(d => d.name === device) || { power: 4.5 };

  const eDc = dataGB * ENERGY_INTENSITY_DC;                     // Data-based (GB * kWh/GB)
  const eNet = hours * ENERGY_INTENSITY_NET;           // Time-based (Hours * kWh/Hour)
  const eDevice = (deviceProfile.power / 1000) * hours;         // Time-based (Hours * kW)

  const gridFactor = REGION_FACTORS[region] || 0.740;
  
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
