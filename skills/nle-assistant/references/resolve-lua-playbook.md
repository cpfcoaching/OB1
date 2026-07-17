# Resolve Lua Playbook

## Connection

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

local resolve = getResolve()
local projectManager = resolve:GetProjectManager()
local project = projectManager:GetCurrentProject()
assert(project, "No Resolve project is open")
```

## Import Media

```lua
local mediaPool = project:GetMediaPool()
local imported = mediaPool:ImportMedia({mediaPath})
assert(imported and imported[1], "Import failed")
```

## Read Clips

```lua
local root = mediaPool:GetRootFolder()
for _, clip in ipairs(root:GetClipList()) do
  print(clip:GetClipProperty("File Name"))
end
```

## Mark Clip And Timeline

```lua
clip:AddMarker(0, "Green", "Transcript start", "source transcript marker", 1, "nle-assistant:start")
timeline:AddMarker(90, "Blue", "Keep range", "Transcript-derived keep range", 30, "nle-assistant:keep")
```

## Duplicate Timeline

```lua
local sourceTimeline = project:GetCurrentTimeline()
assert(sourceTimeline, "No current timeline")
local working = sourceTimeline:DuplicateTimeline(sourceTimeline:GetName() .. " NLE Assistant Working")
assert(working, "Timeline duplicate failed")
project:SetCurrentTimeline(working)
```

## Build Timeline From Transcript Ranges

Resolve uses frame indexes for clip ranges. Convert seconds to frames with the project timeline frame rate.

```lua
local fps = tonumber(project:GetSetting("timelineFrameRate")) or 30
local clipInfos = {
  {mediaPoolItem = clip, startFrame = 0, endFrame = math.floor(4.2 * fps), recordFrame = 0},
  {mediaPoolItem = clip, startFrame = math.floor(8.0 * fps), endFrame = math.floor(13.5 * fps), recordFrame = math.floor(4.2 * fps)}
}
local rough = mediaPool:CreateTimelineFromClips("Transcript Rough Cut", clipInfos)
assert(rough, "Timeline creation failed")
```

## Silence Removal Pattern

Do not cut the original timeline. Use transcript or silence detector data to create keep ranges, then build a new timeline from those ranges.

Safe sequence:

1. Import or identify source media.
2. Add markers for silence and keep ranges.
3. Duplicate the current timeline for safety.
4. Create `No Silence` rough cut from keep ranges.
5. Verify clip count and track count.

## Verification

After every script run, print and write:

- Project name.
- Source timeline name.
- Working duplicate timeline name.
- Output timeline name.
- Imported media path.
- Number of keep ranges.
- Track counts.
- Any failed API call.
