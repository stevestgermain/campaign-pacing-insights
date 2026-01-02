import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CampaignData, PacingResult } from "../types";
import { formatCurrency, formatPercent, formatDate } from "./calculations";
import { getRecommendation, getTimelineRec, getSpendStatusMsg } from "./recommendations";

export const generatePDF = (data: CampaignData, result: PacingResult) => {
  const doc = new jsPDF();
  const themeColor = "#2563eb"; // Brand Blue

  // --- Header ---
  // Logo placeholder (Blue Box)
  doc.setFillColor(themeColor);
  doc.roundedRect(14, 15, 12, 12, 2, 2, "F");
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor("#111827");
  doc.text("Campaign Pacing Report", 32, 24);

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#6b7280");
  const todayStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  doc.text(`Generated on ${todayStr}`, 32, 29);

  // Divider
  doc.setDrawColor("#e5e7eb");
  doc.line(14, 35, 196, 35);

  let yPos = 45;

  // --- Section 1: Campaign Overview ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#111827");
  doc.text("Campaign Overview", 14, yPos);
  
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Campaign Type', 'Flight Dates', 'Total Budget', 'Spent to Date']],
    body: [[
      data.campaignType.charAt(0).toUpperCase() + data.campaignType.slice(1),
      `${formatDate(data.startDate)} - ${formatDate(data.endDate)}`,
      formatCurrency(data.budget),
      formatCurrency(data.spent)
    ]],
    theme: 'grid',
    headStyles: { fillColor: themeColor, fontStyle: 'bold' },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold' }
    }
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // --- Section 2: Pacing Health ---
  doc.text("Health Status", 14, yPos);
  yPos += 5;

  let statusText = "ON TRACK";
  let statusColor = [22, 163, 74]; // Green

  if (result.status === 'over') { statusText = "CRITICALLY OVERPACING"; statusColor = [220, 38, 38]; }
  else if (result.status === 'under') { statusText = "CRITICALLY UNDERPACING"; statusColor = [220, 38, 38]; }
  else if (result.status === 'trending_high') { statusText = "SLIGHTLY OVERPACING"; statusColor = [249, 115, 22]; } // Orange
  else if (result.status === 'trending_low') { statusText = "SLIGHTLY UNDERPACING"; statusColor = [249, 115, 22]; } // Orange

  // Status Box
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(14, yPos, 40, 20, 2, 2, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`${formatPercent(result.pacingPercent)}`, 34, yPos + 8, { align: 'center' });
  doc.setFontSize(7);
  doc.text(statusText, 34, yPos + 14, { align: 'center' });

  // Metrics to the right
  doc.setTextColor("#111827");
  doc.setFontSize(10);
  doc.text(`Timeline Progress: ${formatPercent(result.percentElapsed)}`, 60, yPos + 6);
  doc.text(`Budget Utilized: ${formatPercent(result.percentBudgetUsed)}`, 60, yPos + 14);

  yPos += 30;

  // --- Section 3: Financial Analysis ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Analysis & Projections", 14, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value', 'Notes']],
    body: [
      ['Ideal Spend (Today)', formatCurrency(result.idealSpend), 'Target spend based on straight-line delivery'],
      ['Actual Spend', formatCurrency(result.actualSpend), 'Current media spend processed'],
      ['Variance', `${result.variance > 0 ? '+' : ''}${formatCurrency(result.variance)}`, result.variance > 0 ? 'Over budget' : 'Under budget'],
      ['Remaining Budget', formatCurrency(result.remainingBudget), `Available for remaining ${result.daysRemaining} days`],
      ['Projected Total', formatCurrency(result.projectedTotal), 'Estimated spend at current burn rate'],
      ['Projected Variance', `${result.projectedVariance > 0 ? '+' : ''}${formatCurrency(result.projectedVariance)}`, result.projectedVariance > 0 ? 'Estimated overspend' : 'Estimated unspent funds']
    ],
    theme: 'striped',
    headStyles: { fillColor: "#4b5563", fontStyle: 'bold' },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { fontStyle: 'normal', cellWidth: 40 }
    }
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // --- Section 4: Burn Rate Recommendations ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Daily Burn Rate Calibration", 14, yPos);
  yPos += 5;

  autoTable(doc, {
    startY: yPos,
    head: [['Current Daily Burn', 'Required Daily Rate', 'Adjustment Needed']],
    body: [[
      `${formatCurrency(result.dailyBurnRate)}/day`,
      `${formatCurrency(result.requiredDailySpend)}/day`,
      formatCurrency(result.requiredDailySpend - result.dailyBurnRate)
    ]],
    theme: 'grid',
    headStyles: { fillColor: themeColor, fontStyle: 'bold' },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3, halign: 'center' },
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;

  // --- Section 5: Strategic Action Items ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#111827");
  doc.text("Strategic Recommendations", 14, yPos);
  yPos += 8;

  const notes = [
    { title: "Timeline Phase:", desc: getTimelineRec(data.campaignType, result.percentElapsed) },
    { title: "Spend Velocity:", desc: getSpendStatusMsg(data.campaignType, result.pacingPercent) },
    { title: "Projection:", desc: result.projectedVariance > 0 
      ? getRecommendation(data.campaignType, 'projOver')
      : getRecommendation(data.campaignType, 'projUnder') }
  ];

  doc.setFontSize(10);
  notes.forEach(note => {
    doc.setFont("helvetica", "bold");
    doc.text(note.title, 14, yPos);
    
    doc.setFont("helvetica", "normal");
    // Handle long text wrapping
    const splitText = doc.splitTextToSize(note.desc, 150);
    doc.text(splitText, 50, yPos);
    
    yPos += (splitText.length * 5) + 4;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor("#9ca3af");
  doc.text("Generated by Media Drive Budget Pacing Calculator", 14, 285);

  doc.save(`pacing-report-${data.campaignType}-${new Date().toISOString().split('T')[0]}.pdf`);
};