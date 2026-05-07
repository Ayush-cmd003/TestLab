from fastapi import HTTPException
import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

def send_otp_email(receiver_email: str, otp: str):
    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": receiver_email,
            "subject": "Verify Your TestLab Account",
            "text": f"""
Hi there,

Your verification code for TestLab is:

{otp}

This code will expire in 3 minutes.

If you didn’t request this code, you can safely ignore this email.

—
TestLab Team
"""
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )
