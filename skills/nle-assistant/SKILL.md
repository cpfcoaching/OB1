---
name: nle-assistant
description: Operate DaVinci Resolve through its scripting API for transcript-driven editing inside real projects, including silence removal, subclip extraction, clip marking, and rough timeline building. Use for requests that explicitly require edits inside the NLE/editor, such as removing silences, extracting clips that match a transcript description, importing footage, marking clips, cutting at transcript timecodes, duplicating timelines, or assembling a Resolve timeline from a transcript-derived edit list.
---

# NLE Assistant

## Proven Connection Path

Use DaVinci Resolve internal Lua scripts as the primary transport. In this environment, external Python imports `DaVinciResolveScript` but `scriptapp("Resolve")` returns `None`; Resolve's internal console can read the project through `app:GetResolve()`.

Use this Lua connection helper:

```lua
local function getResolve()
  if app and app.GetResolve then
    local resolve = app:GetResolve()
    if resolve then return resolve end
  end
  if Resolve then
    local resolve = Resolve()
    if resolve then return resolve end
  end
  error("DaVinci Resolve scripting object is unavailable")
end
```

Failure modes:

- Resolve is not running.
- No project is open.
- No current timeline exists when the operation requires one.
- External scripting is disabled, so command-line Python cannot connect.
- The Lua script is run outside Resolve's console or Scripts menu, where `app` is unavailable.

Default Resolve workspace:

`/Volumes/Crucial X9 Pro For Mac/Library/DaVinciResolve`

## Safety Rule

Always duplicate the current timeline or create a new derived timeline before editing. Never modify an original timeline. Never delete media pool clips, source media, project files, or original timelines.

Allowed destructive-looking operation:

- `DeleteClips` may be used only on a duplicated timeline or a newly created working timeline.

Forbidden operations unless the user explicitly approves cleanup:

- `DeleteProject`
- `DeleteTimelines`
- `DeleteClips` on media pool clips
- source media deletion or replacement

## Workflow

1. Confirm the project and timeline.
2. Read or create transcript-derived edit list using the media-transcription skill if transcript data is not already supplied.
3. Import media when needed.
4. Read clips and add markers for transcript timecodes or selected moments.
5. Duplicate the current timeline with a timestamped `NLE Assistant Working` suffix.
6. Build edits on the duplicate or create a new rough-cut timeline from clip ranges.
7. Verify the output timeline exists, has expected track counts, and contains expected clips.
8. Show or tell the user exactly which Resolve timeline was created.

## Core Operations

Use `references/resolve-lua-playbook.md` for detailed Lua snippets.

- Import media with `mediaPool:ImportMedia`.
- Read clips with `folder:GetClipList`, `timeline:GetItemListInTrack`, and clip properties.
- Mark clips or timelines with `AddMarker`.
- Cut at transcript timecodes by converting time to frames and building clipInfo ranges.
- Assemble timelines with `CreateTimelineFromClips` or `AppendToTimeline`.
- Remove silences by using transcript or silence-analysis ranges and building a new no-silence timeline from the kept ranges.

## Transcript Integration

When the user gives a transcript, require timestamped segments. If the transcript is missing, invoke the user's media-transcription workflow before editing.

Expected edit-list shape:

```json
{
  "source_media": "/absolute/path/to/source.mov",
  "timeline_name": "Interview rough cut",
  "fps": 30,
  "keep_ranges": [
    {"in": "00:00:00.000", "out": "00:00:04.200", "reason": "intro"},
    {"in": "00:00:08.000", "out": "00:00:13.500", "reason": "answer"}
  ]
}
```

For silence removal, treat transcript words, pauses, or external silence detection as source data. Do not guess cuts from text alone when audio timing is absent.

## Smoke Test

Use `scripts/nle_smoke_test.lua` inside Resolve's Lua console or install it under the Resolve Scripts folder. The script uses the proven `app:GetResolve()` connection, imports a generated test clip, creates a source timeline, duplicates it, and creates a no-silence rough-cut timeline from fixed keep ranges.

The script writes a receipt in:

`/Volumes/Crucial X9 Pro For Mac/Library/DaVinciResolve/nle-assistant-smoke`
