from fastapi import HTTPException
import httpx

async def verify_groq_key(api_key, base_url, model):
    if not api_key:
        raise HTTPException(status_code=400,detail="API key required")

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.post(
                base_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "user",
                            "content": "hi"
                        }
                    ],
                    "max_tokens": 1
                }
            )

        status_map = {
            200: ("Valid API key", True),
            401: ("Invalid API key", False),
            403: ("Invalid API key", False),
            429: ("Rate limited", False)
        }

        message, success = status_map.get(response.status_code,(f"Failed ({response.status_code})", False))
        return {"success": success,"message": message}

    except httpx.TimeoutException:
        raise HTTPException(status_code=408,detail="Validation timed out")

    except Exception:
        raise HTTPException(status_code=500,detail="Unable to validate API key")