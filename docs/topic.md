# Topic Module (Operator)

Management of topics and their lesson associations within a workspace.

---

## 1. List Topics
Retrieve a list of topics for the current workspace, ordered by `sort_order`.

- **Endpoint**: `GET operator/topic`
- **Parameters**: 
    - `order_by` (string, optional): Sorting direction (`asc` or `desc`). Defaults to `asc`.
- **Response**: `200 OK`
```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Introduction to AI",
      "sort_order": 1
    }
  ]
}
```

---

## 2. Topic Detail
Get specific details for a topic, including its associated lessons.

- **Endpoint**: `GET operator/topic/{id}`
- **Response**: `200 OK`
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Introduction to AI",
    "sort_order": 1,
    "lessons": [
      {
        "id": 10,
        "title": "What is Machine Learning?",
        "workspace_id": 1,
        "lesson_no": 1
      }
    ]
  }
}
```

---

## 3. Create Topic
Add a new topic and associate it with existing lessons.

- **Endpoint**: `POST operator/topic`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | The name of the topic. |
| `lesson_ids` | array | Yes | List of lesson IDs to attach (must belong to the workspace). |

- **Response**: `201 Created`
```json
{
  "message": "Created successfully",
  "data": {
    "id": 5,
    "name": "Advanced Neural Networks",
    "sort_order": 2
  }
}
```

---

## 4. Update Topic
Modify an existing topic's name and its lesson associations.

- **Endpoint**: `POST operator/topic/{id}`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Updated topic name. |
| `lesson_ids` | array | Yes | Updated list of lesson IDs (replaces existing associations). |

- **Response**: `200 OK`
> [!NOTE]

---

## 5. Delete Topic
Soft delete a topic from the workspace.

- **Endpoint**: `POST operator/topic/{id}/delete`
- **Response**: `200 OK`
```json
{
  "message": "Deleted successfully",
  "data": true
}
```

---

## 6. Reorder Topics
Update the sequence of all topics in the workspace.

- **Endpoint**: `POST operator/topic/reorder`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `ids` | array | Yes | A complete list of topic IDs in the new desired order. |

- **Response**: `200 OK`
> [!IMPORTANT]
> The `ids` array must contain all topic IDs belonging to the workspace. A mismatch in count will result in a validation error.

