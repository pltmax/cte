from pydantic import BaseModel, Field


class AddCreditsRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Number of credits to add (must be > 0)")


class MessageResponse(BaseModel):
    message: str
