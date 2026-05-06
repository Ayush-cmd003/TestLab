import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from groq import Groq
from backend.core.prompt_service import testcase_generation_prompt, script_generation_prompt

load_dotenv()

GROQ_BASE_URL = os.getenv("groq_base_url")
GROQ_MODEL = os.getenv("groq_model")

def initialize_model(api_key: str, prompt: str):
    client = Groq(api_key=api_key, base_url=GROQ_BASE_URL)
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an advanced, highly specialized Test Case Generation Engine"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    finish_reason = response.choices[0].finish_reason
    if finish_reason == "length":
        raise HTTPException(status_code=413, detail="Response exceeded token/output limit. Please reduce testcase count or shorten input.")
    return response.choices[0].message.content

def create_testcase(api_key: str, project_name: str, project_description: str, feature_name: str, feature_description: str, uploaded_document: str = None, user_instructions: str = None):
    prompt = testcase_generation_prompt(project_name, project_description, feature_name, feature_description, uploaded_document, user_instructions)
    testcase_generation = initialize_model(api_key, prompt)
    return testcase_generation

def create_script(api_key: str, testcase_name, testcase_type, preconditions, steps, expected_tc_result, programming_language, tool):
    prompt = script_generation_prompt(testcase_name, testcase_type, preconditions, steps, expected_tc_result, programming_language, tool)
    script_generation = initialize_model(api_key, prompt)
    return script_generation
