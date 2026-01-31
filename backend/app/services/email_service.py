
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str):
        if not settings.SMTP_HOST:
            print(f"--- EMAIL SIMULATION (NO SMTP_HOST) ---")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print(f"Content: {body}")
            print(f"----------------------------------------")
            return

        try:
            msg = MIMEMultipart()
            msg['From'] = settings.EMAIL_FROM
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'plain'))

            print(f"Connecting to SMTP: {settings.SMTP_HOST}:{settings.SMTP_PORT} as {settings.SMTP_USERNAME}")
            
            if settings.SMTP_PORT == 465:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
                # No starttls needed for SSL
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
                server.starttls()
            
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            text = msg.as_string()
            server.sendmail(settings.EMAIL_FROM, to_email, text)
            server.quit()
            print("Email sent successfully")
        except Exception as e:
            print(f"Failed to send email: {e}")
            raise Exception(f"Failed to send email: {e}")

email_service = EmailService()
