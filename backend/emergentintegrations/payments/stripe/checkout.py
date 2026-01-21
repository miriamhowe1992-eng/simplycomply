from __future__ import annotations

import os
from typing import Optional
from pydantic import BaseModel
import stripe


class CheckoutSessionRequest(BaseModel):
    plan: str
    origin_url: str


class CheckoutSessionResponse(BaseModel):
    url: str
    session_id: str


class CheckoutStatusResponse(BaseModel):
    session_id: str
    status: str
    payment_status: Optional[str] = None


class StripeCheckout:
    def __init__(self, api_key: Optional[str] = None):
        api_key = api_key or os.environ.get("STRIPE_API_KEY")
        if not api_key:
            raise ValueError("STRIPE_API_KEY is not set")
        stripe.api_key = api_key

    def create_checkout_session(self, req: CheckoutSessionRequest) -> CheckoutSessionResponse:
        price_id = os.environ.get("STRIPE_PRICE_ID_" + req.plan.upper())
        if not price_id:
            raise ValueError(
                f"Missing Stripe price id for plan {req.plan}. "
                f"Set STRIPE_PRICE_ID_{req.plan.upper()} in your environment variables."
            )

        session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=req.origin_url.rstrip("/") + "/billing/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=req.origin_url.rstrip("/") + "/billing/cancel",
        )
        return CheckoutSessionResponse(url=session.url, session_id=session.id)

    def get_checkout_status(self, session_id: str) -> CheckoutStatusResponse:
        session = stripe.checkout.Session.retrieve(session_id)
        return CheckoutStatusResponse(
            session_id=session.id,
            status=session.status,
            payment_status=getattr(session, "payment_status", None),
        )
