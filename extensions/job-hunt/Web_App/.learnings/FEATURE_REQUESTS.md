# Feature Requests

User-requested capabilities that may require product/design follow-up.

---

## [FEAT-20260428-001] linkedin-native-full-export-mapping

**Logged**: 2026-04-28T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: frontend

### Requested Capability
Native support for full LinkedIn export schema mapping (not only the simplified profile JSON shape).

### User Context
Users can obtain large LinkedIn JSON extracts with nested/variable schemas and expect direct import into resume and recommendation flows.

### Complexity Estimate
medium

### Suggested Implementation
- Add schema adapters for common LinkedIn full-export structures.
- Support nested arrays/objects for experience, education, licenses, publications, and skills.
- Add import diagnostics to show which fields were mapped, skipped, or normalized.

### Metadata
- Frequency: recurring
- Related Features: linkedin import, resume parsing, recommendations

---

## [FEAT-20260428-002] recommendation-learning-dashboard

**Logged**: 2026-04-28T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: frontend

### Requested Capability
A small dashboard showing optimizer history, top learned tweak templates, and recommendation improvement over time.

### User Context
Users want visibility that personalization and optimization are learning from their behavior.

### Complexity Estimate
medium

### Suggested Implementation
- Display latest optimizer run summary and interaction count.
- Show top resume tweak templates per role family.
- Add trend chart for strong-match rate and apply/interview outcomes.

### Metadata
- Frequency: recurring
- Related Features: recommendations, ranking optimizer, tweak feedback

---
