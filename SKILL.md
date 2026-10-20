---
name: design-system-free-ai-startup-website-kit
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Free AI Startup Website Kit

## Mission
Deliver implementation-ready design-system guidance for Free AI Startup Website Kit that can be applied consistently across marketing site interfaces.

## Brand
- Product/brand: Free AI Startup Website Kit
- URL: https://ai-kit-preview.framer.website/
- Audience: developers and technical teams
- Product surface: marketing site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Inter`, `font.family.stack=Inter, sans-serif`, `font.size.base=13px`, `font.weight.base=400`, `font.lineHeight.base=15.6px`
- Typography scale: `font.size.xs=8px`, `font.size.sm=12px`, `font.size.md=13px`, `font.size.lg=14px`, `font.size.xl=16px`, `font.size.2xl=17px`, `font.size.3xl=20px`, `font.size.4xl=23px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#0000ee`, `color.surface.base=#000000`, `color.surface.raised=#8c45ff`, `color.surface.strong=#3d3d3d`
- Spacing scale: `space.1=8px`, `space.2=10px`, `space.3=12px`, `space.4=13px`, `space.5=14px`, `space.6=15px`, `space.7=16px`
- Radius/shadow/motion tokens: `radius.xs=7px`, `radius.sm=8px`, `radius.md=10px`, `radius.lg=50px`, `radius.xl=100px` | `shadow.1=rgba(255, 255, 255, 0.15) 0px 0px 6px 3px inset`, `shadow.2=rgba(0, 0, 0, 0.2) 0px 10px 20px 0px`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
