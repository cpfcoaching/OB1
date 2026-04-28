# Errors

Command failures and runtime/integration errors. Keep entries redacted; never include secrets or full personal data.

---

## [ERR-20260428-001] linkedin-import-runtime-not-iterable

**Logged**: 2026-04-28T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
LinkedIn import failed at runtime with `t is not iterable` when full-profile JSON shapes did not match expected arrays.

### Error
```
TypeError: t is not iterable
```

### Context
- Operation: Import LinkedIn profile JSON in Resume Builder.
- Root cause: Merge and stats paths assumed iterable arrays (`skills`, `experience`, `education`, bullets/tags) from external payloads.
- Impact: Import blocked for valid but differently shaped LinkedIn payloads.

### Suggested Fix
- Coerce external data shapes before spread/loop operations.
- Guard all merge paths with safe array coercion helpers.
- Keep parser tolerant for alternative field names and nested object forms.

### Metadata
- Reproducible: yes
- Related Files: src/utils/linkedinParser.ts
- Pattern-Key: harden.input_shape_validation
- Recurrence-Count: 1
- First-Seen: 2026-04-28
- Last-Seen: 2026-04-28

---
