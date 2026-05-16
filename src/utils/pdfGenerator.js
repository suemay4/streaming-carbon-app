import { jsPDF } from "jspdf";
import { REGION_FACTORS } from "./carbonLogic";

export const generateCarbonReport = (result, projection, metadata, benchmarkData = [], deviceComparisonData = []) => {
  if (!result || !projection) {
    alert("No data available to generate report.");
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const colors = {
    green: [16, 185, 129], // BitLeaf Emerald
    dark: [15, 23, 42],    // Slate 900
    slate: [100, 116, 139], // Slate 500
    border: [226, 232, 240]
  };

  const drawText = (text, x, y, size, color = colors.dark, isBold = false) => {
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    pdf.text(String(text), x, y);
  };

  // --- HEADER ---
  pdf.setFillColor(...colors.green);
  pdf.rect(0, 0, 210, 35, 'F');
  drawText("YOUR VIDEO STREAMING CARBON FOOTPRINT", 20, 18, 20, [255, 255, 255], true);
  drawText(`BitLeaf | Generated: ${new Date().toLocaleDateString()}`, 20, 28, 9, [255, 255, 255]);

  // --- 1. ANALYSIS INPUTS ---
  drawText("1. YOUR STREAMING INPUTS", 20, 48, 11, colors.green, true);
  pdf.setDrawColor(...colors.border);
  pdf.line(20, 50, 190, 50);

  const metaItems = [
    ["Video Resource:", metadata.videoTitle || "N/A"],
    ["Geographic Region:", metadata.region],
    ["Video Quality:", metadata.resolution],
    ["Primary Device:", metadata.device]
  ];

  metaItems.forEach((item, i) => {
    drawText(item[0], 25, 58 + (i * 6), 9, colors.slate, true);
    drawText(item[1], 70, 58 + (i * 6), 9, colors.dark);
  });

  // --- 2. IMPACT BREAKDOWN ---
  drawText("2. WHERE YOUR IMPACT COMES FROM", 20, 85, 11, colors.green, true);
  pdf.line(20, 87, 190, 87);

  const breakdown = [
    { label: "End-User Device Layer:", val: result.breakdown.device },
    { label: "Network Transmission Layer:", val: result.breakdown.net },
    { label: "Data Center Infrastructure:", val: result.breakdown.dc }
  ];

  breakdown.forEach((item, i) => {
    const y = 95 + (i * 7);
    drawText(item.label, 25, y, 9, colors.dark);
    drawText(`${item.val.toFixed(2)} g`, 150, y, 9, colors.dark, true);
  });

  // Total Highlight
  pdf.setFillColor(...colors.green);
  pdf.rect(20, 118, 170, 10, 'F');
  drawText("TOTAL ESTIMATED SESSION IMPACT:", 25, 124.5, 9, [255, 255, 255], true);
  drawText(`${result.total.toFixed(2)} g CO2e`, 150, 124.5, 10, [255, 255, 255], true);

  // --- 3. ANNUAL SUSTAINABILITY PROJECTION ---
  drawText("3. YEARLY REAL-WORLD COMPARISONS", 20, 140, 11, colors.green, true);
  pdf.line(20, 142, 190, 142);

  drawText(`Total Yearly CO2 Mass: ${projection.yearly} kg / Year`, 25, 150, 10, colors.dark, true);
  drawText(`Mobility Equivalent: ~${projection.km} km Driven`, 25, 157, 9, colors.slate);
  drawText(`Carbon Sequestration: ~${projection.trees} trees required to offset`, 25, 164, 9, colors.slate);

  // --- 4. RESOLUTION IMPACT ANALYSIS ---
  drawText("4. RESOLUTION IMPACT FORECAST", 20, 185, 11, colors.green, true);
  pdf.line(20, 187, 190, 187);

  if (benchmarkData && benchmarkData.length > 0) {
    benchmarkData.forEach((item, i) => {
      const y = 195 + (i * 7);
      const isCurrent = item.name === metadata.resolution;
      drawText(`• ${item.name} Quality:`, 25, y, 9, isCurrent ? colors.green : colors.dark, isCurrent);
      drawText(`${item.yearly.toFixed(1)} kg / year`, 150, y, 9, isCurrent ? colors.green : colors.dark, isCurrent);
    });
  }

  // --- 5. DEVICE COMPARISON ---
  drawText("5. DEVICE COMPARISON", 20, 230, 11, colors.green, true);
  pdf.line(20, 232, 190, 232);

  if (deviceComparisonData && deviceComparisonData.length > 0) {
    deviceComparisonData.forEach((d, i) => {
      const y = 240 + (i * 7);
      const isCurrent = d.name === metadata.device;
      drawText(`• ${d.name}`, 25, y, 9, isCurrent ? colors.green : colors.dark, isCurrent);
      drawText(`${d.total.toFixed(2)} g CO2e`, 150, y, 9, isCurrent ? colors.green : colors.dark, isCurrent);
      if (isCurrent) drawText("(Current Selection)", 110, y, 8, colors.green);
    });
  }

  // --- BITLEAF ACADEMIC FOOTER ---
  pdf.setDrawColor(...colors.green);
  pdf.setLineWidth(0.5);
  pdf.line(20, 272, 190, 272);
  
  pdf.setFontSize(8);
  pdf.setTextColor(...colors.slate);
  
  pdf.setFont(undefined, 'bold');
  pdf.text("BitLeaf: Video Carbon Footprint Calculator", 105, 277, { align: "center" });
  
  pdf.save(`CarbonFootprint_Result_${new Date().getTime()}.pdf`);
};