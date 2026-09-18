import os
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class PDFReportGenerator:
    """
    Generates professional PDF agronomic evaluation reports for farmers, research labs, and students.
    """
    @staticmethod
    def generate_pdf(analysis_data: Dict[str, Any], output_path: str) -> str:
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom Palette
        primary_color = colors.HexColor("#059669") # Emerald-600
        dark_neutral = colors.HexColor("#0f172a") # Slate-900
        muted_neutral = colors.HexColor("#475569") # Slate-600

        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=4
        )

        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            textColor=muted_neutral,
            spaceAfter=15
        )

        section_heading = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=dark_neutral,
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=dark_neutral
        )

        elements = []

        # Header Title
        elements.append(Paragraph("SmartCrop AI — Agricultural Decision Report", title_style))
        elements.append(Paragraph(f"Generated: {analysis_data.get('timestamp', 'N/A')} | Mode: {analysis_data.get('model_type', 'Production').upper()}", subtitle_style))
        elements.append(Spacer(1, 10))

        # Executive Summary Table
        disease_info = analysis_data.get("disease_analysis", {})
        yield_info = analysis_data.get("yield_analysis", {})
        risk_info = analysis_data.get("risk_analysis", {})
        inputs = analysis_data.get("farm_inputs", {})

        summary_table_data = [
            [
                Paragraph("<b>Crop Type:</b> " + str(inputs.get("crop_type", "Potato")), body_style),
                Paragraph("<b>Detected Disease:</b> " + str(disease_info.get("disease", "N/A")), body_style)
            ],
            [
                Paragraph("<b>Predicted Yield:</b> " + str(yield_info.get("predicted_yield", "N/A")) + " t/ha", body_style),
                Paragraph("<b>Confidence:</b> " + str(int((disease_info.get("confidence") or 0)*100)) + "%", body_style)
            ],
            [
                Paragraph("<b>Overall Crop Risk:</b> " + str(risk_info.get("risk_score", "N/A")) + " / 100", body_style),
                Paragraph("<b>Risk Status:</b> " + str(risk_info.get("risk_level", "N/A")), body_style)
            ]
        ]

        t_summary = Table(summary_table_data, colWidths=[260, 260])
        t_summary.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
            ('BOX', (0,0), (-1,-1), 1, primary_color),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(t_summary)
        elements.append(Spacer(1, 15))

        # Section: Disease Analysis & Grad-CAM
        elements.append(Paragraph("1. Pathogen & Disease Classification", section_heading))
        elements.append(Paragraph(f"Model: {disease_info.get('model_name', 'EfficientNet-B0')} (v{disease_info.get('model_version', '1.0.0')})", body_style))
        elements.append(Spacer(1, 6))

        symptoms = ", ".join(disease_info.get("symptoms", []))
        elements.append(Paragraph(f"<b>Symptoms Identified:</b> {symptoms}", body_style))
        elements.append(Spacer(1, 10))

        # Section: Yield Prediction & Factor Importance
        elements.append(Paragraph("2. Agronomic Crop Yield Prediction", section_heading))
        elements.append(Paragraph(f"Expected Yield Range: <b>{yield_info.get('lower_bound', 0)} – {yield_info.get('upper_bound', 0)} tons/hectare</b>", body_style))
        elements.append(Spacer(1, 10))

        # Section: Risk Assessment Components
        elements.append(Paragraph("3. Multi-Factor Risk Assessment", section_heading))
        components = risk_info.get("components", {})
        risk_table_data = [
            ["Risk Factor", "Score (0-100)"],
            ["Pathogen / Disease Risk", str(components.get("disease_risk", "N/A"))],
            ["Weather / Climate Risk", str(components.get("weather_risk", "N/A"))],
            ["Soil Chemistry Risk", str(components.get("soil_risk", "N/A"))],
            ["Environmental Stress", str(components.get("environmental_stress", "N/A"))]
        ]
        t_risk = Table(risk_table_data, colWidths=[300, 220])
        t_risk.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t_risk)
        elements.append(Spacer(1, 15))

        # Section: Actionable Recommendations
        elements.append(Paragraph("4. Recommended Action Plan", section_heading))
        recs = analysis_data.get("recommendations", [])
        for idx, rec in enumerate(recs[:4], start=1):
            rec_text = f"<b>{idx}. [{rec.get('priority', 'MEDIUM')}] {rec.get('category', 'Action')}:</b> {rec.get('action', '')}<br/><font color='#475569'><i>Reason: {rec.get('reason', '')} | Timeframe: {rec.get('timeframe', '')}</i></font>"
            elements.append(Paragraph(rec_text, body_style))
            elements.append(Spacer(1, 6))

        elements.append(Spacer(1, 15))
        # Disclaimer Footer
        disclaimer = "<font color='#64748b'><b>Legal & Agronomic Disclaimer:</b> Predictions rendered by SmartCrop AI are decision-support estimates generated by machine learning models and must be independently verified by local certified agricultural extension officers prior to field interventions.</font>"
        elements.append(Paragraph(disclaimer, body_style))

        doc.build(elements)
        return output_path
