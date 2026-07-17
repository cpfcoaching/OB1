local workspace = "/Volumes/Crucial X9 Pro For Mac/Library/DaVinciResolve/nle-assistant-smoke"
local mediaPath = workspace .. "/nle-smoke-source.mp4"
local receiptPath = workspace .. "/nle-smoke-receipt.txt"

local function shellQuote(value)
  return "'" .. tostring(value):gsub("'", "'\\''") .. "'"
end

local function ensureWorkspace()
  os.execute("mkdir -p " .. shellQuote(workspace))
end

local function writeReceipt(lines)
  local file = io.open(receiptPath, "w")
  assert(file, "Could not write receipt: " .. receiptPath)
  for _, line in ipairs(lines) do
    file:write(line .. "\n")
  end
  file:close()
end

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

local function generateMediaIfMissing()
  local check = io.open(mediaPath, "r")
  if check then
    check:close()
    return
  end
  local cmd = table.concat({
    "ffmpeg -y",
    "-f lavfi -i color=c=0x08110d:s=1280x720:r=30:d=12",
    "-f lavfi -i sine=frequency=440:duration=4",
    "-f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000:d=4",
    "-f lavfi -i sine=frequency=660:duration=4",
    "-filter_complex \"[1:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];[2:a]aformat=sample_rates=48000:channel_layouts=stereo[a1];[3:a]aformat=sample_rates=48000:channel_layouts=stereo[a2];[a0][a1][a2]concat=n=3:v=0:a=1[a]\"",
    "-map 0:v -map \"[a]\" -shortest",
    "-c:v libx264 -pix_fmt yuv420p -c:a aac",
    shellQuote(mediaPath)
  }, " ")
  local ok = os.execute(cmd)
  assert(ok == true or ok == 0, "ffmpeg failed to create smoke media")
end

local function frame(seconds, fps)
  return math.floor(seconds * fps + 0.5)
end

ensureWorkspace()
generateMediaIfMissing()

local resolve = getResolve()
local projectManager = resolve:GetProjectManager()
assert(projectManager, "Project manager unavailable")
local project = projectManager:GetCurrentProject()
assert(project, "No current project is open")
local mediaPool = project:GetMediaPool()
assert(mediaPool, "Media pool unavailable")

local imported = mediaPool:ImportMedia({mediaPath})
assert(imported and imported[1], "Import media failed: " .. mediaPath)
local clip = imported[1]

local fps = tonumber(project:GetSetting("timelineFrameRate")) or 30
clip:AddMarker(0, "Green", "NLE smoke source", "Imported by nle-assistant smoke test", 1, "nle-assistant:source")
clip:SetMarkInOut(0, frame(12, fps), "all")

local sourceName = "NLE Assistant Smoke Source"
local sourceTimeline = mediaPool:CreateTimelineFromClips(sourceName, {clip})
assert(sourceTimeline, "Source timeline creation failed")
project:SetCurrentTimeline(sourceTimeline)

local duplicateName = sourceName .. " Working Copy"
local workingTimeline = sourceTimeline:DuplicateTimeline(duplicateName)
assert(workingTimeline, "Timeline duplication failed")
project:SetCurrentTimeline(workingTimeline)
workingTimeline:AddMarker(frame(4, fps), "Red", "Silence range", "Synthetic silence from 4s to 8s", frame(4, fps), "nle-assistant:silence")

local keepRanges = {
  {label = "tone one", startSeconds = 0, endSeconds = 4},
  {label = "tone two", startSeconds = 8, endSeconds = 12}
}

local clipInfos = {}
local recordFrame = 0
for _, item in ipairs(keepRanges) do
  local startFrame = frame(item.startSeconds, fps)
  local endFrame = frame(item.endSeconds, fps)
  table.insert(clipInfos, {
    mediaPoolItem = clip,
    startFrame = startFrame,
    endFrame = endFrame,
    recordFrame = recordFrame
  })
  recordFrame = recordFrame + (endFrame - startFrame)
end

local roughName = "NLE Assistant Smoke No Silence"
local roughTimeline = mediaPool:CreateTimelineFromClips(roughName, clipInfos)
assert(roughTimeline, "No-silence rough timeline creation failed")
project:SetCurrentTimeline(roughTimeline)
roughTimeline:AddMarker(0, "Green", "Kept speech", "0s to 4s retained", frame(4, fps), "nle-assistant:keep:1")
roughTimeline:AddMarker(frame(4, fps), "Green", "Kept speech", "8s to 12s retained", frame(4, fps), "nle-assistant:keep:2")

local videoTracks = roughTimeline:GetTrackCount("video")
local audioTracks = roughTimeline:GetTrackCount("audio")

writeReceipt({
  "status=ok",
  "project=" .. project:GetName(),
  "media=" .. mediaPath,
  "source_timeline=" .. sourceName,
  "working_duplicate=" .. duplicateName,
  "rough_timeline=" .. roughName,
  "fps=" .. tostring(fps),
  "keep_ranges=2",
  "video_tracks=" .. tostring(videoTracks),
  "audio_tracks=" .. tostring(audioTracks)
})

print("NLE Assistant smoke test complete")
print("Project: " .. project:GetName())
print("Working duplicate: " .. duplicateName)
print("Rough timeline: " .. roughName)
print("Receipt: " .. receiptPath)
