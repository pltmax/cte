from pydantic import BaseModel, Field


class AddCreditsRequest(BaseModel):
    amount: int = Field(..., gt=0, le=50, description="Number of credits to add (1–50)")


class MessageResponse(BaseModel):
    message: str
