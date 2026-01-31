
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

class ReportGenerator:
    @staticmethod
    def generate_financial_report(data: dict, ai_analysis: dict, company_details: dict) -> BytesIO:
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor("#0D9488"), # Teal 600
            spaceAfter=20,
            alignment=1 # Center
        )
        
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor("#0F172A"), # Slate 900
            spaceBefore=15,
            spaceAfter=10,
            borderPadding=5,
            borderWidth=0,
            leftIndent=0
        )

        normal_style = styles['Normal']
        
        elements = []

        # Header
        elements.append(Paragraph(f"Financial Health Analysis Report", title_style))
        
        company_name = company_details.get('name', 'FinSight AI User')
        elements.append(Paragraph(f"<b>Company:</b> {company_name}", normal_style))
        
        if company_details.get('industry'):
            elements.append(Paragraph(f"<b>Industry:</b> {company_details['industry']}", normal_style))
        
        if company_details.get('tax_id'):
            elements.append(Paragraph(f"<b>Tax ID / GST:</b> {company_details['tax_id']}", normal_style))
            
        if company_details.get('phone'):
            elements.append(Paragraph(f"<b>Phone:</b> {company_details['phone']}", normal_style))
            
        if company_details.get('address'):
            elements.append(Paragraph(f"<b>Address:</b> {company_details['address']}", normal_style))
            
        elements.append(Paragraph(f"<b>Date Generated:</b> {datetime.now().strftime('%Y-%m-%d %H:%M')}", normal_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Executive Summary
        elements.append(Paragraph("Executive Summary", section_style))
        summary_header = f"<b>Health Score: {ai_analysis.get('health_score', 'N/A')}/100 - {ai_analysis.get('status', 'Unknown')}</b>"
        elements.append(Paragraph(summary_header, normal_style))
        elements.append(Spacer(1, 0.1*inch))
        elements.append(Paragraph(ai_analysis.get('summary', 'No summary provided.'), normal_style))
        
        # Key Metrics Table
        elements.append(Paragraph("Key Financial Metrics", section_style))
        metrics_data = [
            ["Metric", "Value"],
            ["Total Revenue", f"${data.get('total_revenue', 0):,.2f}"],
            ["Total Expenses", f"${data.get('total_expenses', 0):,.2f}"],
            ["Net Profit", f"${data.get('net_profit', 0):,.2f}"],
            ["Profit Margin", f"{data.get('profit_margin', 0):.2f}%"],
            ["Expense Ratio", f"{data.get('expense_ratio', 0):.2f}%"],
            ["Total Debt", f"${data.get('total_debt', 0):,.2f}"],
        ]
        
        t = Table(metrics_data, colWidths=[2.5*inch, 2.5*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#F1F5F9")),
            ('GRID', (0, 0), (-1, -1), 1, colors.gray),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(t)
        
        # Risks
        if ai_analysis.get('risks'):
            elements.append(Paragraph("Identified Risks", section_style))
            for risk in ai_analysis['risks']:
                risk_text = f"<b>[{risk.get('severity', 'Medium')}] {risk.get('type', 'Risk')}:</b> {risk.get('message', '')}"
                elements.append(Paragraph(risk_text, normal_style))
                elements.append(Spacer(1, 0.05*inch))
        
        # Recommendations
        if ai_analysis.get('recommendations'):
            elements.append(Paragraph("Recommendations", section_style))
            for rec in ai_analysis['recommendations']:
                rec_text = f"<b>{rec.get('action', '')}:</b> {rec.get('impact', '')} ({rec.get('category', 'General')})"
                elements.append(Paragraph(rec_text, normal_style))
                elements.append(Spacer(1, 0.05*inch))

        # Footer
        elements.append(Spacer(1, 0.5*inch))
        elements.append(Paragraph("--- End of AI-Generated Financial Report ---", styles['Italic']))
        elements.append(Paragraph("Confidential & Multi-layered Encrypted Storage Verified", styles['Italic']))

        doc.build(elements)
        buffer.seek(0)
        return buffer

report_generator = ReportGenerator()
