FROM python:3.11-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /code

# Copy project files
COPY pyproject.toml .
COPY README.md .
COPY uv.lock* .

# Install dependencies with uv
RUN uv sync --frozen --no-dev

# Copy application code
COPY ./app /code/app
COPY seed.py /code/
COPY entrypoint.sh /code/

# Convert line endings and make executable
RUN sed -i 's/\r$//' /code/entrypoint.sh && chmod +x /code/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/code/entrypoint.sh"]

# Default command
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
