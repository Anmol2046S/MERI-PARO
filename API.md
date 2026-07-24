# API Documentation - MERI-PARO

## Base URL

```
http://localhost:5000/api
```

## Authentication

Not currently required (planned for v1.1.0)

## Endpoints

### 1. Analyze Resume

**POST** `/analyze`

Analyze a resume file.

**Request:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis-123",
    "filename": "resume.pdf",
    "summary": "Experienced software developer with 5 years...",
    "score": 8.5,
    "skills": [
      {"name": "Python", "level": "Advanced"},
      {"name": "JavaScript", "level": "Intermediate"}
    ],
    "experience": [
      {
        "title": "Senior Developer",
        "company": "Tech Corp",
        "duration": "2020-Present"
      }
    ],
    "education": [
      {
        "degree": "BS Computer Science",
        "university": "State University",
        "year": 2018
      }
    ],
    "recommendations": [
      "Add more project details",
      "Highlight leadership experience"
    ]
  }
}
```

### 2. Get Analysis

**GET** `/analysis/{id}`

Retrieve previous analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "analysis-123",
    "created_at": "2026-07-21T10:00:00Z",
    "updated_at": "2026-07-21T10:05:00Z",
    "analysis": { ... }
  }
}
```

### 3. List Analyses

**GET** `/analyses?limit=10&offset=0`

List all analyses.

**Query Parameters:**
- `limit` (integer): Results per page (default: 10)
- `offset` (integer): Pagination offset (default: 0)
- `sort` (string): Sort field (created_at, score)
- `order` (string): asc or desc

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "analysis-123", ... },
    { "id": "analysis-124", ... }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

### 4. Delete Analysis

**DELETE** `/analysis/{id}`

Delete an analysis.

**Response:**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
}
```

### 5. Export Report

**GET** `/analysis/{id}/export?format=pdf`

Export analysis as PDF or JSON.

**Query Parameters:**
- `format` (string): pdf or json

**Response:** File download

## Error Responses

| Code | Error | Description |
|------|-------|-------------|
| 200 | OK | Success |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing authentication |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File too large |
| 500 | Server Error | Internal error |
| 503 | Service Unavailable | Service down |

**Error Response Format:**
```json
{
  "success": false,
  "error": "Invalid file format",
  "statusCode": 400
}
```

## File Upload

### Supported Formats
- PDF (.pdf)
- Word Document (.docx)
- Text File (.txt)
- RTF (.rtf)

### Size Limits
- Max file size: 10MB
- Max files per request: 1

## Rate Limiting

Currently unlimited. Planned limits:
- 100 requests per minute for free tier
- 1000 requests per minute for premium

## Response Format

All endpoints return JSON with standard format:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## Example Requests

### Python
```python
import requests

with open('resume.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:5000/api/analyze',
        files=files
    )
    print(response.json())
```

### JavaScript
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/api/analyze', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### cURL
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@resume.pdf" \
  -H "Accept: application/json"
```

---

**Last Updated**: 2026-07-21