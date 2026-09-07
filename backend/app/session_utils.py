import os
import hmac
import hashlib
import time
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey_change_me_in_production")
TOKEN_TIME_STEP = 30  # QR token rotates every 30 seconds

def generate_qr_token(session_id: int, time_step: int = TOKEN_TIME_STEP) -> tuple[str, int]:
    """
    Generates a dynamic HMAC-based rotating QR token for an active session.

    WHY HMAC ROTATING TOKEN?
    ------------------------
    If a QR code were static, a student sitting in class could take a photo of the QR code
    and send it on WhatsApp to absent friends at home to scan and fake attendance.
    
    By hashing the session_id + a 30-second time window with HMAC-SHA256, the token changes
    every 30 seconds. A photo sent over WhatsApp will expire almost immediately (within 30s),
    forcing students to be physically present in front of the live screen to scan.

    Returns:
        (qr_token_string, seconds_until_next_rotation)
    """
    current_time = int(time.time())
    
    # Calculate current 30-second time window (e.g. 1700000000 // 30)
    current_window = current_time // time_step
    
    # Seconds remaining before token rotates
    seconds_remaining = time_step - (current_time % time_step)
    
    # Payload message combines session_id and current time window
    message = f"session:{session_id}:window:{current_window}"
    
    # Compute HMAC-SHA256 signature (first 16 characters for clean QR generation)
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()[:16]
    
    qr_token = f"sess_{session_id}_{current_window}_{signature}"
    
    return qr_token, seconds_remaining

def verify_qr_token(session_id: int, token_to_verify: str, time_step: int = TOKEN_TIME_STEP) -> bool:
    """
    Verifies if a given token_to_verify matches either the CURRENT time window token
    or the IMMEDIATELY PREVIOUS time window token (providing a rolling ~30-60s grace period).
    """
    current_time = int(time.time())
    current_window = current_time // time_step
    previous_window = current_window - 1

    for window in (current_window, previous_window):
        message = f"session:{session_id}:window:{window}"
        signature = hmac.new(
            SECRET_KEY.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()[:16]
        expected_token = f"sess_{session_id}_{window}_{signature}"
        if hmac.compare_digest(token_to_verify, expected_token):
            return True

    return False

