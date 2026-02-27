from typing import Literal

from pydantic import BaseModel, Field


class CheckoutRequest(BaseModel):
    type: Literal["subscription", "credits"]
    quantity: int = Field(default=1, ge=1, le=10)


class CheckoutResponse(BaseModel):
    url: str


class PortalResponse(BaseModel):
    url: str
