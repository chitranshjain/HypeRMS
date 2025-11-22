# API Documentation

Base URL: `http://localhost:3000` (or as configured)

## Products

### Create Product
Creates a new product.

- **URL**: `/products`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string" // Required
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "string",
    "name": "string",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Name is required"
  }
  ```

### Get Products
Retrieves a list of all products.

- **URL**: `/products`
- **Method**: `GET`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "created_at": "string"
    }
  ]
  ```

---

## Releases

### Create Release
Creates a new release for a specific product.

- **URL**: `/products/:productId/releases`
- **Method**: `POST`
- **URL Params**:
  - `productId`: ID of the product
- **Request Body**:
  ```json
  {
    "targetDate": "string", // Required, ISO 8601 date string (e.g., "2023-12-31")
    "name": "string", // Required
    "description": "string" // Optional
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "string",
    "product_id": "string",
    "target_date": "string",
    "status": "PLANNED",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Target date is required"
  }
  ```

### Get Releases
Retrieves upcoming and historical releases for a specific product.

- **URL**: `/products/:productId/releases`
- **Method**: `GET`
- **URL Params**:
  - `productId`: ID of the product
- **Success Response (200 OK)**:
  ```json
  {
    "upcoming": [
      {
        "id": "string",
        "product_id": "string",
        "target_date": "string",
        "status": "string",
        "created_at": "string"
      }
    ],
    "historical": [
      {
        "id": "string",
        "product_id": "string",
        "target_date": "string",
        "status": "string",
        "created_at": "string"
      }
    ]
  }
  ```

### Update Release Status
Updates the status of a release.

- **URL**: `/releases/:id/status`
- **Method**: `PATCH`
- **URL Params**:
  - `id`: ID of the release
- **Request Body**:
  ```json
  {
    "status": "string" // Required, one of: "PLANNED", "RELEASED"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "string",
    "product_id": "string",
    "target_date": "string",
    "status": "string",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Invalid status"
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Release not found"
  }
  ```

---

## Release Items

### Create Release Item
Creates a new item within a release, optionally with prerequisites.

- **URL**: `/releases/:releaseId/items`
- **Method**: `POST`
- **URL Params**:
  - `releaseId`: ID of the release
- **Request Body**:
  ```json
  {
    "title": "string", // Required
    "description": "string",
    "type": "string", // Required
    "jiraLink": "string",
    "docLink": "string",
    "prerequisites": [ // Optional
      {
        "title": "string",
        "category": "string"
      }
    ]
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "string",
    "release_id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "jira_link": "string",
    "doc_link": "string",
    "status": "DEV",
    "created_at": "string",
    "prerequisites": [
      {
        "id": "string",
        "release_item_id": "string",
        "title": "string",
        "category": "string",
        "status": "PENDING",
        "created_at": "string"
      }
    ]
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Title and type are required"
  }
  ```

### Get Release Items
Retrieves all items for a specific release.

- **URL**: `/releases/:releaseId/items`
- **Method**: `GET`
- **URL Params**:
  - `releaseId`: ID of the release
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "string",
      "release_id": "string",
      "title": "string",
      "description": "string",
      "type": "string",
      "jira_link": "string",
      "doc_link": "string",
      "status": "string",
      "created_at": "string"
    }
  ]
  ```

### Get Release Item
Retrieves details of a specific release item, including prerequisites.

- **URL**: `/items/:id`
- **Method**: `GET`
- **URL Params**:
  - `id`: ID of the release item
- **Success Response (200 OK)**:
  ```json
  {
    "id": "string",
    "release_id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "jira_link": "string",
    "doc_link": "string",
    "status": "string",
    "created_at": "string",
    "prerequisites": [
      {
        "id": "string",
        "release_item_id": "string",
        "title": "string",
        "category": "string",
        "status": "string",
        "created_at": "string"
      }
    ]
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Item not found"
  }
  ```

### Update Release Item
Updates details of a release item.

- **URL**: `/items/:id`
- **Method**: `PATCH`
- **URL Params**:
  - `id`: ID of the release item
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "type": "string",
    "jiraLink": "string",
    "docLink": "string"
    // Any subset of these fields
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "string",
    "release_id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "jira_link": "string",
    "doc_link": "string",
    "status": "string",
    "created_at": "string"
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Item not found"
  }
  ```

### Update Release Item Status
Updates the status of a release item. Checks for pending prerequisites before allowing 'RELEASED' status. If all items in a release are 'RELEASED', the release itself is marked 'RELEASED' and a Slack notification is sent.

- **URL**: `/items/:id/status`
- **Method**: `PATCH`
- **URL Params**:
  - `id`: ID of the release item
- **Request Body**:
  ```json
  {
    "status": "string" // Required, one of: "DEV", "PRE_PROD", "RELEASED"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "string",
    "release_id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "jira_link": "string",
    "doc_link": "string",
    "status": "string",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Invalid status"
  }
  ```
  OR
  ```json
  {
    "error": "Cannot release item with pending prerequisites"
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Item not found"
  }
  ```

---

## Prerequisites

### Add Prerequisite
Adds a prerequisite to a release item.

- **URL**: `/items/:itemId/prerequisites`
- **Method**: `POST`
- **URL Params**:
  - `itemId`: ID of the release item
- **Request Body**:
  ```json
  {
    "title": "string", // Required
    "category": "string" // Required
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "id": "string",
    "release_item_id": "string",
    "title": "string",
    "category": "string",
    "status": "PENDING",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Title and category are required"
  }
  ```

### Update Prerequisite Status
Updates the status of a prerequisite.

- **URL**: `/prerequisites/:id/status`
- **Method**: `PATCH`
- **URL Params**:
  - `id`: ID of the prerequisite
- **Request Body**:
  ```json
  {
    "status": "string" // Required, one of: "PENDING", "DONE"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "string",
    "release_item_id": "string",
    "title": "string",
    "category": "string",
    "status": "string",
    "created_at": "string"
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Invalid status"
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "error": "Prerequisite not found"
  }
  ```

---


