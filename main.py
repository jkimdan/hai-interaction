from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import openai
import os
from dotenv import load_dotenv
import json
from typing import List, Dict, Any

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load OpenAI API key from environment variable
client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# Define request and response models
class QueryRequest(BaseModel):
    prompt: str
    dataset_info: List[Dict[str, Any]]

class APIResponse(BaseModel):
    spec: dict = None
    description: str
class QueryResponse(BaseModel):
    response: APIResponse

@app.post("/query", response_model=QueryResponse)
async def query_openai(request: QueryRequest):
    try:
        dataset_info = request.dataset_info
        if not dataset_info:
            return QueryResponse(response=APIResponse(description="Please upload a dataset before sending any messages."))
        dataset_info_str = "\n".join(
            f"Column: {col['column_name']}\nType: {col['data_type']}\nSample Values: {col['sample_values']}\n"
            for col in dataset_info
        )
       
        # Construct the messages
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an AI assistant that generates Vega-Lite specifications based on user queries."
                    "Answer the user's questions about the dataset with textual explanations when appropriate."
                    "Only generate a Vega-Lite chart if the user's query seems to ask for a visualization."
                    "You are provided with dataset information and should reference the dataset directly using 'data': {'name': 'data'}. "
                    "Do not include 'url' fields or hardcoded external references for the dataset."
                    "If the query is irrelevant or unanswerable based on the dataset, politely explain to the user that you cannot fulfill the request."
                    "For example: The dataset is related to cars. The user asks: How are you? You might respond: 'How are you' is not relevant to the dataset, which contains information about cars and their specifications."
                )
            },
            {
                "role": "system",
                "content": f"Dataset Information:\n{dataset_info_str}"
            },
            {
                "role": "user",
                "content": request.prompt
            }
        ]
        schema = {
            "name":"vegaschema",
            "schema": {
            "type": "object",
            "properties": {
                "spec": {
                    "type": "object",
                    "description": "The well designed Vega-Lite specification in JSON format."
                },
                "description": {
                    "type": "string",
                    "description": "A brief textual description of the generated chart, or a response to a user query"
                }
            },
            "required": ["spec", "description"]
            }
}
        print("attempting api call")
        chat_completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini", 
            messages=messages,
            response_format={"type":"json_schema", "json_schema": schema}
        )
        reply = chat_completion.choices[0].message      
        try:  
            message = json.loads(reply.content)
            description = message.get("description")
            spec = message.get("spec")
            if description and not spec:
                return QueryResponse(response=APIResponse(description=description))
            if spec and description:
                return QueryResponse(response={"spec": spec, "description":description})
        except json.JSONDecodeError:
            return QueryResponse(response=APIResponse(description=reply.content))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@app.get("/")
async def read_root():
    return FileResponse('static/index.html')
