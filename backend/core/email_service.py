from fastapi import HTTPException, status
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import ssl
import os

load_dotenv()

def send_otp_email(receiver_email: str, otp: str):
    sender_email = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    sender_email = sender_email.strip() if sender_email else None
    password = password.strip() if password else None

    if not sender_email or not password:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="MAIL_USERNAME or MAIL_PASSWORD not configured in .env")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = "Verify Your TestLab Account"

    body = f"""
Hi there,

Your verification code for TestLab is:

{otp}

This code will expire in 3 minutes.

If you didn’t request this code, you can safely ignore this email.

See you inside TestLab.

—
TestLab Team
Smarter testing starts here.

"""

    msg.attach(MIMEText(body, "plain"))

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500,detail="Email authentication failed. Check Gmail App Password.")

    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Failed to send email: {str(e)}")