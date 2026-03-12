from typing import Literal

from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    type: Literal["rush", "chill", "credit"]


class CheckoutResponse(BaseModel):
    url: str
