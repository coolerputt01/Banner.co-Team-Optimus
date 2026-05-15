# src/squadco_service.py
import hmac
import hashlib
from squad import Squad
from config import settings

# Initialize the Squad client
squad_client = Squad(settings.SQUAD_SECRET_KEY, test=settings.SQUAD_TEST_MODE)

async def initialize_payment(amount: float, email: str, user_id: str, ad_id: str) -> dict:
    """
    Create a Squadco payment session and return the checkout URL.
    """
    # Ensure amount is in kobo (e.g., 49900 for ₦499)
    amount_in_kobo = int(amount * 100)
    response = squad_client.payments.initialize({
        "amount": amount_in_kobo,
        "email": email,
        "currency": "NGN",
        "initiate_type": "inline",
        "callback_url": f"{settings.APP_BASE_URL}/payment/callback",
        "metadata": {
            "user_id": user_id,
            "ad_id": ad_id,
            "campaign_duration_days": 1
        }
    })
    # Return the checkout URL from the response
    return response

async def verify_payment(transaction_ref: str) -> dict:
    """Verify a transaction's status using Squadco API."""
    return squad_client.payments.verify_transaction(txn_ref=transaction_ref)

async def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify the authenticity of a Squadco webhook request."""
    computed_hmac = hmac.new(secret.encode(), payload, hashlib.sha512).hexdigest()
    return hmac.compare_digest(computed_hmac, signature)