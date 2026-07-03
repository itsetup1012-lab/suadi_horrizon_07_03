---
name: web_design_best_practices
description: Comprehensive guide to modern web design practices, CSS techniques, UX patterns, and website development best practices based on research from Smashing Magazine. Use when creating, evaluating, or improving websites with focus on accessibility, component selection, modern CSS techniques, and user experience optimization.
---

# Web Design Best Practices Skill

## Overview
This skill provides comprehensive guidance on modern web design practices based on research from Smashing Magazine. It covers component selection, CSS techniques, accessibility guidelines, UX patterns, and measurement frameworks to create effective, accessible, and user-friendly websites.

## Core Components

### 1. Component Selection Guidelines

#### Combobox vs. Multiselect vs. Listbox Decision Framework
- **Dropdown**: List is hidden until triggered
- **Combobox**: Type to filter + select 1 option (combines text input field with a dropdown list)
- **Multiselect**: Type to filter + select many options (options often displayed as pills or chips)
- **Listbox**: All list options visible by default (+ scroll)
- **Dual listbox**: Move items between 2 listboxes (left ↔ right), typically for bulk selection

#### Selection Guidelines
- For lists with fewer than 5 items, simple radio buttons or checkboxes work best
- For large lists (200+ items), combobox and multiselect are helpful due to faster filtering (e.g., country selection)
- Listboxes are helpful when people need to access many options at once, especially for choosing multiple options
- Dual listbox is ideal for complex tasks like bulk selection or assigning roles, tasks, and responsibilities

#### Best Practices for Component Selection
- Never hide frequently used options: If users rely on particular selections frequently, display them prominently rather than hiding them
- Consider showing popular options as chips or buttons, with the rest of the list available on interaction
- Always display popular options even if it might slightly clutter the UI
- All list types must support keyboard navigation (↑/↓ arrow keys) for accessibility
- For lists with 7+ options, consider adding "Select All" and "Clear All" functionalities
- For lengthy combobox lists, expose all options to users on click/tap, as otherwise they might never be seen
- Don't display non-interactive elements as buttons to avoid confusion
- Don't display interactive elements as static labels

### 2. Modern CSS Techniques

#### CSS Relative Color Values
- Uses OKLCH color space for more precise color manipulation
- Allows deriving colors from a "foundation" color using mathematical relationships
- Enables dynamic color theming without manual recalculation

#### OKLCH Color Space
- OKLCH stands for Lightness (L), Chroma (C), and Hue (H)
- Offers better perceptual uniformity than traditional RGB or HSL
- Widespread browser support now available

#### Color Derivation Methods
- **Absolute changes**: Using calc() functions to add/subtract fixed values
- **Proportional changes**: Using multiplication for maintaining color relationships
- "Move it, Scale it, Rotate it" rules:
  - Move lightness (add or subtract)
  - Scale chroma (multiply)
  - Rotate hue (add or subtract degrees)

#### Typed CSS Custom Properties
- Using `@property` to register custom properties with defined types
- Enables smooth interpolation during animations
- Example:
```css
@property --f-l {
  syntax: "<number>";
  inherits: true;
  initial-value: 0.40;
}
```

#### Dynamic Theming Implementation
- Single foundation color controls entire color scheme
- Colors update automatically when foundation changes
- Eliminates manual recalculation of color palettes
- Colors are treated as a system of relationships rather than fixed values
- Consistent color relationships maintained across themes
- Foundation color can be changed once to update entire site

### 3. Accessibility Guidelines for Deaf and Hard-of-Hearing Users

#### Key Insights About Deafness
- Deafness is a spectrum: ranges from slight hearing loss (16-25 dB) to profound hearing loss (91+ dB)
- Myth-busting: Most deaf people do not know sign language (only about 1% in the US)
- Sign languages are complex: They are 4-dimensional spatial languages with their own grammar and syntax, separate from spoken languages
- Only 30% of words can be understood via lip-reading

#### Communication Design
- Don't make the phone the only method of contact
- Design multiple ways to communicate in every instance (online + in-person)
- Always test products with the actual community instead of making assumptions

#### Visual Design Considerations
- Provide text alternatives for all audible alerts or notices
- Ensure good lighting to help people see facial expressions
- Circular seating arrangements work better so everyone can see each other's faces
- Add haptic feedback on mobile devices (e.g., vibration patterns)

#### Content Design for Accessibility
- Always include descriptions of non-spoken sounds (e.g., rain, laughter) in your content
- Add transcripts and closed captions for audio and video content
- Clearly identify each speaker in all audio and video content
- Invite video participants to keep cameras on to facilitate lip-reading and facial expression reading

#### Inclusive Design Philosophy
- Design with people, rather than for them
- Include people with lived experience of exclusion in the design process
- Recognize that deaf people often see themselves as a cultural linguistic minority rather than as disabled
- Understand that accessibility benefits everyone, not just the target group

#### Website Development Best Practices for Accessibility
1. Provide multiple communication channels - Don't rely solely on audio-based interactions
2. Implement proper captioning systems - Both for live and recorded content
3. Ensure visual feedback mechanisms - For notifications and alerts
4. Follow WCAG guidelines - Specifically those related to auditory content
5. Test with actual users - From the deaf and hard-of-hearing community
6. Consider sign language integration - Where appropriate for your content
7. Make sure interfaces work well visually - Since visual information becomes more critical

### 4. UX Measurement Framework (TARS)

#### The TARS Framework for Measuring Feature Impact
TARS stands for:
1. **Target Audience (%)** - Quantifying the percentage of a product's users who have the specific problem that a feature aims to solve
   - Question: "What percentage of all our product's users have that specific problem that a new feature aims to solve?"
   - Important to distinguish between target audience and feature usage

2. **Adoption (%)** - Measuring how well the target audience engages with the feature
   - Focus on meaningful engagement rather than just clicks
   - High adoption (>60%) suggests the problem was impactful
   - Low adoption (<20%) might indicate simple workarounds or UI placement issues
   - Question: "What percentage of active target users actually use the feature to solve that problem?"

3. **Retention (%)** - Studying whether a feature is used repeatedly over time
   - >50% retention indicates high strategic importance
   - 25-35% retention signals medium strategic significance
   - 10-20% retention is low strategic importance
   - Question: "Of all the users who meaningfully adopted a feature, how many came back to use it again?"

4. **Satisfaction Score (CES)** - Measuring user satisfaction with the feature
   - Uses Customer Effort Score methodology
   - Ask retained users how easy it was to solve their problem after using the feature
   - Question: "How easy was it to solve a problem after they used that feature?"

#### Feature Strategy Matrix
Using a 2×2 matrix based on S÷T scores (Satisfied Users ÷ Target Users) to categorize features:
- Overperforming features: Low retention but high satisfaction (features used infrequently but effectively)
- Liability features: High retention but low satisfaction (need improvement)
- Core features and project features for strategic planning

#### Why Conversion Rate Isn't a True UX Metric
- Conversion improvements might result from sales, marketing, or seasonal effects rather than UX
- High conversion can happen despite poor UX due to brand power, pricing, or lack of alternatives
- Low conversion can occur despite great UX due to irrelevant offers or poor business models

### 5. User Research and Virtual Personas

#### Centralized Research Repository
- Gathering scattered user research data (surveys, interviews, support tickets, analytics, social media) into one place
- Creating a single source of truth that AI can access and draw from
- Even messy inputs work well with AI's ability to make sense of disorganized data

#### Interactive Personas
- Building on functional persona approaches focused on user goals rather than demographics
- Creating personas that AI can consult on behalf of stakeholders
- Developing different "lenses" within personas for various business functions (marketing, product, support)

#### Implementation Options
**Simple Approach:**
- Using AI platforms with project/workspace features (ChatGPT Projects, Claude Workspaces, etc.)
- Uploading research documents and personas
- Providing clear instructions for AI to consult all personas when responding to questions

**Sophisticated Approach:**
- Using tools like Notion with built-in AI capabilities
- Creating databases for different research types
- Enabling AI to query across all research simultaneously for richer responses

#### Benefits for Design Teams
- UX team role shifts from gatekeepers of user knowledge to curators and maintainers
- Research communication changes from push (reports, presentations) to pull (stakeholders asking questions when needed)
- User-centered thinking becomes distributed across the organization rather than concentrated in one team

#### Getting Started Recommendations
1. Start small with one project or team
2. Use existing (even incomplete) research to create 1-2 personas
3. Pay attention to stakeholder questions to identify research gaps
4. Expand gradually to more teams and sophisticated tools

## Usage Instructions

### When to Use This Skill
- When designing new website components and need guidance on appropriate UI controls
- When implementing modern CSS techniques for theming and animations
- When ensuring accessibility compliance for diverse user needs
- When measuring the impact of website features
- When conducting user research and creating virtual personas
- When evaluating existing websites for best practices compliance

### Implementation Workflow
1. Identify the specific web design challenge (component selection, styling, accessibility, measurement)
2. Refer to the appropriate section of this skill
3. Apply the recommended practices to your specific context
4. Validate implementation with accessibility tools and user testing
5. Measure impact using the TARS framework where applicable

## Best Practices Summary
- Always prioritize user needs and accessibility in design decisions
- Use appropriate components based on the specific use case and user needs
- Implement dynamic theming with modern CSS techniques for better maintainability
- Ensure all interactive elements are accessible via keyboard navigation
- Create centralized repositories for user research data
- Measure feature impact using the TARS framework
- Design with inclusive principles to benefit all users