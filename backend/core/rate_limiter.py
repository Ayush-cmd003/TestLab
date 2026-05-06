from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi import Request

def get_user_or_ip(request: Request):
    user = getattr(request.state, "user", None)
    if user:
        return f"user:{user.id}"
    return get_remote_address(request)

limiter = Limiter(key_func=get_user_or_ip)

RATE_LIMIT_CONFIG = {
    "login": {
        "limit": "5/minute",
        "message": "Too many login attempts. Try again later."
    },
    "register": {
        "limit": "3/minute",
        "message": "Too many registrations. Please try later."
    },
    "ai": {
        "limit": "10/minute",
        "message": "AI usage limit reached. Please wait."
    },
    "default": {
        "message": "Too many requests. Please slow down."
    }
}

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    path = request.url.path

    if "login" in path:
        message = RATE_LIMIT_CONFIG["login"]["message"]
    elif "register" in path:
        message = RATE_LIMIT_CONFIG["register"]["message"]
    elif "generate" in path:
        message = RATE_LIMIT_CONFIG["ai"]["message"]
    else:
        message = RATE_LIMIT_CONFIG["default"]["message"]

    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "message": message
        }
    )