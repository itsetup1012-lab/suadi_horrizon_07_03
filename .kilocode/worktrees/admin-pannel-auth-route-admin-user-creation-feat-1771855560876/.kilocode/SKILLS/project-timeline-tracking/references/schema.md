# Timeline Database Schema

## Project Object

```json
{
    "project": {
        "name": "string",           // Project name
        "description": "string",    // One-line description
        "startDate": "YYYY-MM-DD",  // Project start date
        "targetEndDate": "YYYY-MM-DD", // Planned end date
        "status": "pending|in-progress|completed|on-hold",
        "overallProgress": 0-100,   // Calculated percentage
        "lastUpdated": "ISO-8601",   // Auto-updated timestamp
        "version": "1.0.0",         // Schema version
        "currentPhase": "Phase N: Name" // Current phase name
    }
}
```

## Sprint Object

```json
{
    "sprint": {
        "number": 1,
        "name": "Sprint Name",
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "goals": ["goal1", "goal2"],
        "completedThisSprint": ["task1", "task2"],
        "inProgress": ["task3"],
        "nextUp": ["task4"]
    }
}
```

## Activity Object

```json
{
    "activity": {
        "last7Days": [
            {
                "date": "YYYY-MM-DD",
                "action": "task_updated|task_completed|task_started|milestone_reached|phase_change",
                "taskId": 21,
                "taskName": "Task Name",
                "from": 40,        // Optional: previous value
                "to": 55,          // Optional: new value
                "note": "What changed"
            }
        ],
        "last30Days": [
            // Same structure as last7Days
        ]
    }
}
```

## History Object

```json
{
    "history": {
        "entries": [
            {
                "id": 1,
                "timestamp": "ISO-8601",
                "type": "progress_update|task_completed|phase_change|milestone_reached",
                "description": "Human readable description",
                "changes": {
                    "taskStatus": {"taskId": X, "from": "pending", "to": "in-progress"},
                    "taskProgress": {"taskId": X, "from": 40, "to": 55},
                    "overallProgress": {"from": 75, "to": 78}
                },
                "author": "agent|user"
            }
        ],
        "totalEntries": 5
    }
}
```

## Task Object

```json
{
    "id": 1,
    "name": "Task Name",
    "description": "What this task covers",
    "category": "Frontend|Backend|Database|Testing|Deployment|Analytics",
    "assignee": "Developer Name",
    "status": "pending|in-progress|completed|blocked",
    "priority": "low|medium|high|critical",
    "progress": 0-100,
    "startDate": "YYYY-MM-DD",        // Planned start
    "endDate": "YYYY-MM-DD",          // Planned end
    "actualEndDate": "YYYY-MM-DD",    // Actual completion
    "startedAt": "ISO-8601",          // When actually started
    "completedAt": "ISO-8601",        // When completed
    "lastUpdated": "ISO-8601",        // Last modification
    "color": "#hexcolor",              // For visualization
    "dependencies": [2, 5],            // Array of task IDs
    "phase": 1,                        // Phase number
    "isPhase": false,                  // True if this is a phase milestone
    "recentActivity": [
        {"date": "YYYY-MM-DD", "note": "Did X", "progress": 55}
    ],
    "blockers": [" blocker description"]
}
```

## Milestone Object

```json
{
    "id": 1,
    "date": "YYYY-MM-DD",             // Planned date
    "actualDate": "YYYY-MM-DD",       // Actual achievement
    "title": "Milestone Name",
    "description": "What this represents",
    "status": "pending|achieved|at-risk",
    "completedAt": "ISO-8601"          // When achieved
}
```

## Category Object

```json
{
    "name": "Frontend",
    "color": "#hexcolor",
    "taskCount": 10,
    "completed": 5,
    "inProgress": 3,
    "pending": 2,
    "progress": 50     // Calculated average
}
```

## Resource Object

```json
{
    "name": "John Doe",
    "role": "Development|Management|Analytics|Testing|Operations",
    "tasksAssigned": 5,
    "availability": "full-time|part-time|unavailable"
}
```

## Complete File Structure

```json
{
    "project": { ... },
    "sprint": { ... },
    "activity": { ... },
    "history": { ... },
    "tasks": [ ... ],       // Array of Task objects
    "milestones": [ ... ],  // Array of Milestone objects
    "categories": [ ... ],  // Array of Category objects
    "resources": [ ... ]   // Array of Resource objects
}
```

## Auto-Calculated Fields

These fields are automatically calculated - do not manually edit:

- `project.overallProgress`
- `category.progress`
- `category.completed`
- `category.inProgress`
- `category.pending`
- `history.totalEntries`
- `sprint.completedThisSprint` (manual update required)

## ID Rules

- Task IDs: Sequential integers starting from 1
- Milestone IDs: Sequential integers starting from 1  
- History IDs: Sequential integers, always incrementing
- Never reuse IDs, always use next available

## Timestamp Format

All timestamps MUST be in ISO-8601 format:
- `2026-02-15T09:00:00.000Z` (with timezone)
- Use `new Date().toISOString()` to generate

## Validation Checklist

Before saving, verify:
- [ ] Valid JSON (parse with JSON.parse())
- [ ] All timestamps in ISO-8601 format
- [ ] Task IDs in dependencies exist
- [ ] Progress values are 0-100
- [ ] Status values are valid enums
- [ ] History IDs are unique and incrementing
- [ ] Activity entries have required fields
