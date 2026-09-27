import os
import sys
from dotenv import load_dotenv
import httpx

load_dotenv()

print("=" * 65)
print("SAHAYAK AI — COMPREHENSIVE API KEYS & SERVICES DIAGNOSTIC")
print("=" * 65)

# 1. Google Gemini API Key Test
print("\n[1] Google Gemini API Key Check")
gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
if not gemini_key:
    print("  Status: NOT SET")
else:
    print(f"  Key Status: CONFIGURED (length: {len(gemini_key)})")
    print(f"  Configured Model: {gemini_model}")
    try:
        from google import genai
        client = genai.Client(api_key=gemini_key)
        res = client.models.generate_content(
            model=gemini_model,
            contents="Hello! Respond with: 'Gemini is connected and working!'"
        )
        if res and res.text:
            print(f"  Result: [SUCCESS] {res.text.strip()}")
        else:
            print("  Result: [WARNING] Empty response from Gemini API.")
    except Exception as e:
        err_str = str(e)
        if "401" in err_str or "UNAUTHENTICATED" in err_str:
            print(f"  Result: [INVALID KEY / 401 UNAUTHENTICATED]")
            print(f"  Detail: Google AI Studio rejected the provided key.")
            print("  Note: Please verify the API key obtained from https://aistudio.google.com/app/apikey.")
        elif "403" in err_str or "PERMISSION_DENIED" in err_str:
            print(f"  Result: [PERMISSION DENIED / 403]")
            print(f"  Detail: {err_str}")
        else:
            print(f"  Result: [ERROR] {err_str}")

# 2. Firebase Credentials Check
print("\n[2] Firebase Web Client Credentials Check")
fb_key = os.getenv("VITE_FIREBASE_API_KEY", "").strip()
fb_proj = os.getenv("VITE_FIREBASE_PROJECT_ID", "").strip()
fb_domain = os.getenv("VITE_FIREBASE_AUTH_DOMAIN", "").strip()
if not fb_key:
    print("  Status: NOT SET")
else:
    print(f"  Project ID: {fb_proj}")
    print(f"  Auth Domain: {fb_domain}")
    print(f"  Web API Key: CONFIGURED (length: {len(fb_key)})")
    try:
        # Test Firebase Auth API key validity
        r = httpx.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={fb_key}",
            json={"returnSecureToken": True},
            timeout=10.0
        )
        data = r.json()
        if "error" in data:
            err_msg = data["error"].get("message", "")
            if "API_KEY_INVALID" in err_msg:
                print(f"  Result: [INVALID KEY] {err_msg}")
            elif "MISSING_EMAIL" in err_msg or "OPERATION_NOT_ALLOWED" in err_msg:
                print(f"  Result: [SUCCESS] Firebase API Key is VALID & ACTIVE (Code: {r.status_code}, Response: {err_msg})")
            else:
                print(f"  Result: [SUCCESS] Firebase Connected ({err_msg})")
        else:
            print("  Result: [SUCCESS] Firebase Auth API Key is active.")
    except Exception as e:
        print(f"  Result: [ERROR] Firebase Check Failed: {e}")

# 3. OTP & SMS Providers
print("\n[3] OTP & SMS Providers Check")
otp_provider = os.getenv("OTP_PROVIDER", "console")
print(f"  Active OTP Mode: {otp_provider} (Supported: console, fast2sms, twilio, msg91, smtp)")
fast2sms = os.getenv("FAST2SMS_API_KEY", "").strip()
twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", "").strip()
msg91 = os.getenv("MSG91_AUTH_KEY", "").strip()
smtp_user = os.getenv("SMTP_USER", "").strip()

print(f"  Fast2SMS API Key: {'Configured' if fast2sms else 'Not Configured (Optional for live SMS)'}")
print(f"  Twilio Account SID: {'Configured' if twilio_sid else 'Not Configured (Optional for international SMS)'}")
print(f"  MSG91 Auth Key: {'Configured' if msg91 else 'Not Configured (Optional for MSG91 SMS)'}")
print(f"  SMTP Email: {'Configured' if smtp_user else 'Not Configured (Optional for Email OTP)'}")

# 4. Backend AI Chat & Multilingual RAG
print("\n[4] Backend Live API Endpoint Health & RAG Chat Check")
try:
    health_res = httpx.get("http://127.0.0.1:8000/api/health", timeout=5.0)
    print(f"  Health Check: [STATUS {health_res.status_code}] -> {health_res.json()}")
except Exception as e:
    print(f"  Health Check: [ERROR] Could not reach backend: {e}")

try:
    chat_res = httpx.post(
        "http://127.0.0.1:8000/api/chat",
        json={"message": "What is PMFBY crop insurance?", "language": "en", "input_mode": "text"},
        timeout=20.0
    )
    if chat_res.status_code == 200:
        cdata = chat_res.json()
        print(f"  Chat API: [STATUS 200 OK]")
        print(f"  Answer: {cdata.get('answer')[:120]}...")
        print(f"  Grounded: {cdata.get('grounded')}, Sources Found: {len(cdata.get('sources', []))}")
    else:
        print(f"  Chat API: [ERROR {chat_res.status_code}] {chat_res.text[:150]}")
except Exception as e:
    print(f"  Chat API: [ERROR] {e}")

# 5. Voice Synthesis Check
print("\n[5] Voice Assistant TTS Speech Synthesis Check")
try:
    voice_res = httpx.post(
        "http://127.0.0.1:8000/api/voice/synthesize",
        json={"text": "नमस्ते, सहायक AI में आपका स्वागत है।", "language": "hi"},
        timeout=15.0
    )
    if voice_res.status_code == 200:
        vdata = voice_res.json()
        audio_b64 = vdata.get("audio_base64", "")
        print(f"  Voice TTS API: [STATUS 200 OK]")
        print(f"  Audio Bytes Generated: {len(audio_b64)} chars base64 (MIME: {vdata.get('mime_type')})")
    else:
        print(f"  Voice TTS API: [ERROR {voice_res.status_code}]")
except Exception as e:
    print(f"  Voice TTS API: [ERROR] {e}")

print("\n" + "=" * 65)
