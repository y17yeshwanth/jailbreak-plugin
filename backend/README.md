# Use the following instructions to start backend server, run from ./backend directory in a seperate shell

# Deactivate the current virtual environment if it's active
deactivate

# Remove the existing virtual environment
rm -rf venv

# Create a new virtual environment using Python 3.9
python3.9 -m venv venv

# Activate the virtual environment
# For macOS/Linux:
source venv/bin/activate

# For Windows (Command Prompt):
venv\Scripts\activate

# Set API Key as gloabl var
export OPENAI_API_KEY="" # find it from whatsappchat

# Upgrade pip to the latest version
pip install --upgrade pip

# Install the required packages
pip install transformers torch fastapi uvicorn

# Verify installation
pip list

# Run the FastAPI server
uvicorn main:app --reload --port 8000

