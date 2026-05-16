import hmac
import hashlib
from typing import Optional

import httpx
from config import settings

# Squadco sandbox and live base URLs
_BASE_URL = (
    "https://sandbox-api-d.squadco.com"
    if getattr(settings, "squad_test_mode", True)
    else "https://api-d.squadco.com"
)


async def initialize_payment(
    amount: float,
    email: str,
    user_id: str,
    payment_ref: str,
    ad_id: Optional[str] = None,
) -> dict:
    """
    Create a Squadco payment session.
    Returns the full response dict — caller reads response["data"]["checkout_url"].
    """
    amount_in_kobo = int(amount * 100)
    payload = {
        "amount": amount_in_kobo,
        "email": email,
        "currency": "NGN",
        "initiate_type": "inline",
        "transaction_ref": payment_ref,
        "callback_url": f"{settings.app_base_url}/payment/callback",
        "metadata": {
            "user_id": user_id,
            "ad_id": ad_id or "",
        },
    }
    headers = {
        "Authorization": f"Bearer {settings.squad_secret_key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{_BASE_URL}/transaction/initiate",
            json=payload,
            headers=headers,
        )
    resp.raise_for_status()
    return resp.json()


async def verify_payment(transaction_ref: str) -> dict:
    """Verify a transaction's status using the Squadco API."""
    headers = {"Authorization": f"Bearer {settings.squad_secret_key}"}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(
            f"{_BASE_URL}/transaction/verify/{transaction_ref}",
            headers=headers,
        )
    resp.raise_for_status()
    return resp.json()


async def verify_webhook_signature(
    payload: bytes, signature: str, secret: str
) -> bool:
    """Verify the HMAC-SHA512 signature of a Squadco webhook."""
    computed = hmac.new(
        secret.encode("utf-8"), payload, hashlib.sha512
    ).hexdigest()
    return hmac.compare_digest(computed, signature)
