from fpdf import FPDF
import os

class ReportService:
    def generate_pdf(self, scan_data: dict, filename: str):
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_fill_color(10, 11, 16)
        pdf.rect(0, 0, 210, 40, 'F')
        
        pdf.set_font("Arial", 'B', 24)
        pdf.set_text_color(0, 255, 157) # Neon Green
        pdf.text(20, 25, "PHISHGUARD AI")
        
        pdf.set_font("Arial", '', 12)
        pdf.set_text_color(200, 200, 200)
        pdf.text(20, 32, "Cybersecurity Intelligence Report")
        
        # Content
        pdf.set_y(50)
        pdf.set_font("Arial", 'B', 16)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 10, "Intelligence Summary", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
        
        pdf.set_font("Arial", '', 12)
        pdf.cell(0, 10, f"Analysis Type: {scan_data['type'].upper()}", ln=True)
        pdf.cell(0, 10, f"Target Identification: {scan_data['target'][:100]}...", ln=True)
        
        # Verdict Box
        result_color = (218, 54, 51) if scan_data['result'] == 'phishing' else (35, 134, 54)
        pdf.set_fill_color(*result_color)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(50, 12, f"VERDICT: {scan_data['result'].upper()}", ln=True, fill=True)
        
        pdf.set_text_color(0, 0, 0)
        pdf.ln(5)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(0, 10, "Security Explanation:", ln=True)
        pdf.set_font("Arial", '', 11)
        pdf.multi_cell(0, 8, scan_data['explanation'])
        
        pdf.ln(10)
        pdf.set_font("Arial", 'I', 10)
        pdf.cell(0, 10, f"Report generated on: {scan_data['created_at']}", ln=True)
        pdf.cell(0, 10, "CONFIDENTIAL - PhishGuard AI Security System", ln=True)
        
        output_path = os.path.join("backend", "data", filename)
        pdf.output(output_path)
        return output_path

report_service = ReportService()
