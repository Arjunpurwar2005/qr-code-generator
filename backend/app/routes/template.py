from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DBSession

from app.core.database import get_db
from app.models.db_models import Teacher, FormTemplate
from app.routes.auth import get_current_user
from app.schemas.template import CreateTemplateRequest, TemplateResponse

router = APIRouter(prefix="/templates", tags=["Form Templates"])

@router.post("", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
def create_template(
    template_data: CreateTemplateRequest,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Save a new reusable attendance form template for the current teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    new_template = FormTemplate(
        teacher_id=teacher.id,
        template_name=template_data.template_name,
        fields=[field.model_dump() for field in template_data.fields]
    )
    db.add(new_template)
    db.commit()
    db.refresh(new_template)

    return new_template

@router.get("", response_model=List[TemplateResponse])
def get_my_templates(
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    List all saved form templates for the authenticated teacher.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    templates = db.query(FormTemplate).filter(FormTemplate.teacher_id == teacher.id).all()
    return templates

@router.delete("/{template_id}", status_code=status.HTTP_200_OK)
def delete_template(
    template_id: int,
    current_username: str = Depends(get_current_user),
    db: DBSession = Depends(get_db)
):
    """
    Delete a saved form template.
    """
    teacher = db.query(Teacher).filter(Teacher.username == current_username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher account not found.")

    template = db.query(FormTemplate).filter(
        FormTemplate.id == template_id,
        FormTemplate.teacher_id == teacher.id
    ).first()

    if not template:
        raise HTTPException(status_code=404, detail="Template not found.")

    db.delete(template)
    db.commit()
    return {"message": f"Template '{template.template_name}' deleted successfully."}
