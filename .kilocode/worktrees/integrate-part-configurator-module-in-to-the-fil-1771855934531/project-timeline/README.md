# Project Timeline Database

This directory contains the project timeline database for the Saudi Horizon Fresh B2B industrial spare parts e-commerce platform.

## Files

| File | Description |
|------|-------------|
| [`timeline-db.json`](timeline-db.json) | Main database with tasks, milestones, history, and activity tracking |
| [`workflow.md`](workflow.md) | Automated workflow rules for updating the timeline |

## Quick Start

### For Developers

When working on any task, you MUST follow the rules in [`workflow.md`](workflow.md):

1. **Before starting**: Read `timeline-db.json` to find the task
2. **During work**: Update progress in real-time
3. **After completing**: Log the completion with timestamps

### For Automated Updates

The timeline is designed for automatic updates by the agent. See [`workflow.md`](workflow.md) for:
- Update templates
- Activity logging rules
- Automatic progress recalculation

## Current Project Status

- **Overall Progress**: 78% complete
- **Status**: In-progress
- **Current Phase**: Phase 4: Advanced Features
- **Current Sprint**: #12 - Inventory & Analytics
- **Last Updated**: 2026-02-15

### Completed Milestones

| # | Milestone | Date Achieved |
|---|-----------|----------------|
| 1 | Foundation Complete | 2023-01-28 |
| 2 | Product Discovery Ready | 2023-04-27 |
| 3 | Revenue Ready | 2023-06-10 |
| 4 | Admin Panel Complete | 2023-09-28 |
| 5 | Content Launch | 2026-02-13 |

### Pending Milestones

| # | Milestone | Target Date |
|---|-----------|--------------|
| 6 | Payment Ready | 2024-02-28 |
| 7 | Testing Complete | 2024-04-30 |
| 8 | Production Launch | 2024-05-15 |

## Data Schema

### Top Level Structure

```json
{
  "project": { ... },        // Project metadata
  "sprint": { ... },         // Current sprint info
  "activity": { ... },       // Recent activity (7 & 30 days)
  "history": { ... },        // Complete audit trail
  "tasks": [ ... ],          // All project tasks
  "milestones": [ ... ],     // Project milestones
  "categories": [ ... ],     // Task categories with stats
  "resources": [ ... ]       // Team resources
}
```

### Key Objects

#### Project
- `name`, `description`, `startDate`, `targetEndDate`
- `status`, `overallProgress`, `lastUpdated`
- `version`, `currentPhase`

#### Sprint
- `number`, `name`, `startDate`, `endDate`
- `goals`, `completedThisSprint`, `inProgress`, `nextUp`

#### Activity
- `last7Days`: Array of recent daily actions
- `last30Days`: Monthly summary

#### History
- `entries`: Complete chronological audit trail
- `totalEntries`: Count of all entries

#### Task
- `id`, `name`, `description`, `category`, `assignee`
- `status`: `pending` | `in-progress` | `completed`
- `priority`: `low` | `medium` | `high` | `critical`
- `progress`: 0-100
- `startDate`, `endDate`, `actualEndDate`
- `startedAt`, `completedAt`, `lastUpdated`
- `dependencies`: Array of task IDs
- `phase`: Phase number (1-5)
- `isPhase`: Boolean for phase milestone tasks
- `recentActivity`: Array of recent changes
- `blockers`: Array of blocking issues

## How Updates Work

### Automatic Tracking

Every time the agent works on the project:

1. **Task Started**: Log start time and status change
2. **Progress Made**: Update progress percentage
3. **Task Completed**: Log completion with timestamp
4. **Milestone Reached**: Update milestone status

### Activity Format

Each activity entry includes:
```json
{
    "date": "YYYY-MM-DD",
    "action": "task_updated|task_completed|task_started|milestone_reached|phase_change",
    "taskId": 21,
    "taskName": "Task Name",
    "from": 40,
    "to": 55,
    "note": "What changed"
}
```

## Integration

### For New Features

When adding new features:
1. Add new task to `tasks` array with next available ID
2. Set appropriate dependencies
3. Update `sprint.nextUp` if in current sprint

### For Milestones

When a milestone is achieved:
1. Update milestone with `actualDate`
2. Set `status: "achieved"`
3. Add `completedAt` timestamp

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-02-15 | Added sprint tracking, activity logs, history |
| 1.0.0 | 2023-01-01 | Initial version |

## File Location

The timeline database is located at:

```
project-timeline/timeline-db.json
```

This directory is separate from the main project source code to avoid interference with the application's functionality.
