# Project Timeline Workflow

This file defines the workflow rules for automatically tracking project progress in `timeline-db.json`.

---

## Overview

The timeline database (`timeline-db.json`) serves as the single source of truth for project progress. Every significant development action should update this file automatically.

**Location**: `project-timeline/timeline-db.json`

---

## Workflow Rules

### Rule 1: Update on Every Task Change

When working on ANY task, you MUST update the timeline database with:

| Action | Required Fields |
|--------|----------------|
| Start new task | `startedAt`, `status: "in-progress"`, add to `activity.last7Days` |
| Update progress | `progress`, `lastUpdated`, add to `activity` and `history` |
| Complete task | `completedAt`, `status: "completed"`, `progress: 100` |
| Blocked task | Add to task's `blockers` array |

### Rule 2: Activity Logging

Every change must be logged in BOTH places:

```json
// 1. activity.last7Days - recent activity (last 7 days only)
{
    "date": "YYYY-MM-DD",
    "action": "task_updated|task_completed|task_started|milestone_reached|phase_change",
    "taskId": 21,
    "taskName": "Task Name",
    "from": 40,
    "to": 55,
    "note": "What changed"
}

// 2. history.entries - complete audit trail
{
    "id": 1,
    "timestamp": "ISO-8601",
    "type": "progress_update|task_completed|phase_change",
    "description": "Human readable description",
    "changes": {
        "taskStatus": {"taskId": X, "from": "old", "to": "new"},
        "overallProgress": {"from": 75, "to": 78}
    },
    "author": "agent|user"
}
```

### Rule 3: Sprint Tracking

Update sprint info at the start of each sprint:

```json
"sprint": {
    "number": 13,
    "name": "Payment Integration",
    "startDate": "2026-02-15",
    "endDate": "2026-02-28",
    "goals": [
        "Complete Stripe integration",
        "Write unit tests"
    ],
    "completedThisSprint": [],
    "inProgress": [],
    "nextUp": []
}
```

### Rule 4: Automatic Progress Calculation

After ANY update, recalculate:

1. **overallProgress**: Weighted average of all task progress
2. **Category progress**: Average of tasks in each category
3. **Phase progress**: Average of tasks in each phase

### Rule 5: Milestone Tracking

When a milestone is achieved:
```json
{
    "date": "YYYY-MM-DD",
    "actualDate": "YYYY-MM-DD",
    "title": "Milestone Name",
    "status": "achieved",
    "completedAt": "ISO-8601 timestamp"
}
```

---

## Update Templates

### Template 1: Starting a New Task
```json
// Find task by ID and update:
{
    "id": 21,
    "status": "in-progress",
    "startedAt": "2026-02-15T09:00:00.000Z",
    "lastUpdated": "2026-02-15T09:00:00.000Z"
}

// Add to activity:
{
    "date": "2026-02-15",
    "action": "task_started",
    "taskId": 21,
    "taskName": "Task Name",
    "note": "Started development"
}

// Add to history:
{
    "id": 6,
    "timestamp": "2026-02-15T09:00:00.000Z",
    "type": "task_started",
    "description": "Started development on Task Name",
    "changes": {"taskStatus": {"taskId": 21, "from": "pending", "to": "in-progress"}},
    "author": "agent"
}
```

### Template 2: Updating Progress
```json
// Update task:
{
    "id": 21,
    "progress": 55,
    "lastUpdated": "2026-02-15T14:30:00.000Z",
    "recentActivity": [
        {"date": "2026-02-15", "note": "Added search functionality", "progress": 55}
    ]
}

// Add to activity:
{
    "date": "2026-02-15",
    "action": "task_updated",
    "taskId": 21,
    "taskName": "Inventory Tracking",
    "from": 40,
    "to": 55,
    "note": "Added search functionality"
}

// Add to history:
{
    "id": 7,
    "timestamp": "2026-02-15T14:30:00.000Z",
    "type": "progress_update",
    "description": "Updated Inventory Tracking progress to 55%",
    "changes": {
        "taskProgress": {"taskId": 21, "from": 40, "to": 55}
    },
    "author": "agent"
}
```

### Template 3: Completing a Task
```json
// Update task:
{
    "id": 24,
    "status": "completed",
    "progress": 100,
    "completedAt": "2026-02-15T16:30:00.000Z",
    "actualEndDate": "2026-02-15",
    "lastUpdated": "2026-02-15T16:30:00.000Z"
}

// Add to activity:
{
    "date": "2026-02-15",
    "action": "task_completed",
    "taskId": 24,
    "taskName": "News & Content Management",
    "note": "Full CRUD implemented"
}

// Check if milestone achieved, if so update:
{
    "id": 5,
    "actualDate": "2026-02-15",
    "status": "achieved",
    "completedAt": "2026-02-15T16:30:00.000Z"
}
```

---

## Automatic Recalculation Rules

After ANY task update, ALWAYS recalculate:

### 1. Overall Progress
```
overallProgress = Sum(task.progress) / Total tasks
```

### 2. Category Progress
```javascript
for each category:
    category.progress = Sum(tasks with this category) / count(tasks)
    category.completed = count(tasks where status="completed")
    category.inProgress = count(tasks where status="in-progress")
    category.pending = count(tasks where status="pending")
```

### 3. Phase Progress
```javascript
for each phase:
    phase.progress = Sum(phase tasks) / count(phase tasks)
```

### 4. Activity Pruning
- Keep only last 7 days in `activity.last7Days`
- Keep ALL entries in `history.entries` (increment ID)

---

## Integration with Agent Workflow

### Step 1: Read Current State
At the start of ANY task, read `project-timeline/timeline-db.json` to:
- Find the task
- Check its current status
- Verify dependencies are met

### Step 2: Make Changes
During development:
- Update task progress as work completes
- Add notes to `recentActivity` array

### Step 3: Write Updates
After ANY change, write the complete updated JSON back to file.

### Step 4: Verify
Ensure:
- JSON is valid
- All timestamps are ISO-8601
- Activity entries follow the template
- History entries have unique incrementing IDs

---

## Example Workflow Sequence

```
User: "Add user profile page"

Agent:
1. Read project-timeline/timeline-db.json
2. Find task "User Management API" (id: 15)
3. Update: status → "in-progress", startedAt → now
4. Add activity entry
5. Write updated JSON
6. Start development

[Development in progress...]

Agent:
1. Complete development
2. Update task: status → "completed", progress → 100, completedAt → now
3. Check milestone - none triggered
4. Add activity entry
5. Add history entry
6. Recalculate overallProgress: 73 → 74
7. Write updated JSON
```

---

## Quick Reference

| When | Do This |
|------|---------|
| Start task | Set `status: "in-progress"`, add `startedAt`, log to activity |
| Progress update | Change `progress`, add to `recentActivity`, log to activity |
| Complete task | Set `status: "completed"`, `progress: 100`, add `completedAt`, log to activity |
| Milestone reached | Update milestone with `actualDate`, `status: "achieved"`, `completedAt` |
| Phase complete | Update phase task, add to activity, recalculate progress |

---

## File Structure Reminder

```
project-timeline/
├── timeline-db.json   ← Main database (update this)
└── workflow.md       ← This file
```

---

**Last Updated**: 2026-02-15
**Version**: 1.0.0
