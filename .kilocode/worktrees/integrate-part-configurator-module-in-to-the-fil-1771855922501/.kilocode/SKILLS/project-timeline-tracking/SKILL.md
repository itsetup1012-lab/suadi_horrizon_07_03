---
name: project-timeline-tracking
description: Automatically update project timeline database following workflow.md rules. Use when starting a project, after completing milestones, or when asked to track progress.
---

# Project Timeline Tracking

## Overview

This skill automatically tracks project progress in the timeline database. The database is designed for **automatic updates** by the agent - see `project-timeline/workflow.md` for the complete workflow rules.

## Quick Reference

### When to Update

- **Task Started**: Log start with `startedAt` timestamp
- **Progress Made**: Update `progress` percentage in real-time  
- **Task Completed**: Set `completedAt`, `status: "completed"`, `progress: 100`
- **Milestone Reached**: Update milestone with `actualDate` and `status: "achieved"`

### Required Updates

After ANY task change, ALWAYS update:

1. **Task object**: Update `progress`, `lastUpdated`, add `recentActivity`
2. **activity.last7Days**: Add entry with action type and details
3. **history.entries**: Add audit trail entry with unique ID
4. **Recalculate**: Update `overallProgress`, category stats

## Files

- `project-timeline/timeline-db.json` - Main database
- `project-timeline/workflow.md` - Complete workflow rules
- `project-timeline/README.md` - Documentation

## Automatic Recalculation Rules

### Overall Progress
```
overallProgress = Sum(all task progress values) / Total tasks
```

### Category Progress
```
For each category:
  progress = Sum(category tasks) / count(category tasks)
  completed = count(tasks where status="completed")
  inProgress = count(tasks where status="in-progress")
  pending = count(tasks where status="pending")
```

## Step-by-Step Process

### Step 1: Read Current State
Read `timeline-db.json` to understand current project status.

### Step 2: Identify Task
Find the task being worked on by name or ID.

### Step 3: Make Updates
Follow the templates in `workflow.md`:

- **Starting**: Set `status: "in-progress"`, add `startedAt`
- **Updating**: Change `progress`, add to `recentActivity`
- **Completing**: Set `status: "completed"`, `progress: 100`, add `completedAt`

### Step 4: Log Activity
Add entry to both:
- `activity.last7Days` (recent)
- `history.entries` (complete audit trail)

### Step 5: Write Updates
Write complete updated JSON back to file.

### Step 6: Verify
- Ensure valid JSON
- Check timestamps are ISO-8601
- Verify activity format matches templates

## Important Notes

1. **ALWAYS use workflow.md** as the source of truth for update formats
2. **Keep history entries** - they provide complete audit trail
3. **Prune activity** - keep only last 7 days in `activity.last7Days`
4. **Increment IDs** - history entries must have unique incrementing IDs

## Reference

See `project-timeline/workflow.md` for:
- Complete update templates
- All action types
- Sprint tracking
- Integration examples

See `project-timeline/README.md` for:
- Current project status
- Schema documentation
- Version history
