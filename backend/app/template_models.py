from typing import List, Optional
from pydantic import BaseModel, Field

class FormFieldSchema(BaseModel):
    """
    Schema defining a single custom form field.
    Examples:
    - {"label": "Roll Number", "type": "text", "required": true, "is_unique_id": true}
    - {"label": "Branch", "type": "dropdown", "options": ["CSE", "ECE", "ME"], "required": true}
    """
    label: str = Field(..., example="Roll Number")
    type: str = Field(..., example="text")  # "text", "number", "dropdown"
    options: Optional[List[str]] = Field(default=None, example=["CSE", "ECE", "ME"])
    required: bool = Field(default=True, example=True)
    is_unique_id: bool = Field(default=False, example=True)

class CreateTemplateRequest(BaseModel):
    """
    Request payload for saving a reusable attendance form template.
    """
    template_name: str = Field(..., example="CS 3rd Year Attendance")
    fields: List[FormFieldSchema]

class TemplateResponse(BaseModel):
    """
    Response model for saved form template.
    """
    id: int
    teacher_id: int
    template_name: str
    fields: List[FormFieldSchema]

    class Config:
        from_attributes = True
