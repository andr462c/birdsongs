import { BIRDS, Bird, BIRD_GROUPS } from "./birds";

// ── Types ──

interface Recording {
  id: string;
  en: string;
  gen: string;
  sp: string;
  file: string;
  type: string;
  q: string;
  cnt: string;
  rec: string;
  loc: string;
  url: string;
  lic: string;
  sono: { small: string; med: string; large: string; full: string };
}

interface XCResponse {
  numRecordings: string;
  numSpecies: string;
  page: number;
  numPages: number;
  recordings: Recording[];
}

// ── Settings ──

type SoundType = "song" | "call" | "all";
type Region = "europe" | "denmark";

interface Settings {
  soundType: SoundType;
  region: Region;
}

const settings: Settings = {
  soundType: "song",
  region: "europe",
};

function loadSettings() {
  try {
    const saved = localStorage.getItem("birdid-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (["song", "call", "all"].includes(parsed.soundType))
        settings.soundType = parsed.soundType;
      if (["europe", "denmark"].includes(parsed.region))
        settings.region = parsed.region;
    }
  } catch {
    // ignore corrupted localStorage
  }
}

function saveSettings() {
  localStorage.setItem("birdid-settings", JSON.stringify(settings));
}

// ── State ──

interface GameState {
  currentBird: Bird | null;
  currentRecording: Recording | null;
  currentRecordings: Recording[];
  score: number;
  total: number;
  recentBirds: string[];
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
}

const state: GameState = {
  currentBird: null,
  currentRecording: null,
  currentRecordings: [],
  score: 0,
  total: 0,
  recentBirds: [],
  audio: null,
  isPlaying: false,
};

// ── Enabled birds (persisted to localStorage) ──

const enabledBirds = new Set<string>(BIRDS.map((b) => b.en));

function loadBirdPrefs() {
  try {
    const saved = localStorage.getItem("birdid-enabled");
    if (saved) {
      const arr: string[] = JSON.parse(saved);
      enabledBirds.clear();
      for (const en of arr) {
        if (BIRDS.some((b) => b.en === en)) enabledBirds.add(en);
      }
    }
  } catch {
    // ignore corrupted localStorage
  }
}

function saveBirdPrefs() {
  localStorage.setItem("birdid-enabled", JSON.stringify([...enabledBirds]));
}

function getEnabledBirds(): Bird[] {
  return BIRDS.filter((b) => enabledBirds.has(b.en));
}

// ── Prefetch ──

let prefetched: { bird: Bird; recording: Recording; recordings: Recording[] } | null = null;
let prefetchPromise: Promise<void> | null = null;

// ── DOM helpers ──

function $(id: string): HTMLElement {
  return document.getElementById(id)!;
}

const playBtn = $("play-btn");
const playBtnText = playBtn.querySelector("span:last-child")!;
const guessInput = $("guess-input") as HTMLInputElement;
const submitBtn = $("submit-btn") as HTMLButtonElement;
const skipBtn = $("skip-btn") as HTMLButtonElement;
const showOptionsBtn = $("show-options-btn") as HTMLButtonElement;
const nextBtn = $("next-btn") as HTMLButtonElement;
const scoreDisplay = $("score");
const resultSection = $("result-section");
const resultMessage = $("result-message");
const birdInfo = $("bird-info");
const loadingEl = $("loading");
const guessSection = $("guess-section");
const autocompleteList = $("autocomplete-list");
const soundInfo = $("sound-info");
const optionsSection = $("options-section");
const optionsGrid = $("options-grid");
const sidebarEl = $("sidebar");
const sidebarOverlay = $("sidebar-overlay");

// ── API ──

async function fetchWithTimeout(
  url: string,
  timeout = 15_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function buildQueries(bird: Bird): string[] {
  const regionPart =
    settings.region === "denmark" ? "cnt:denmark" : "area:europe";
  const base = `gen:${bird.genus} sp:${bird.species} grp:birds`;
  const baseGenus = `gen:${bird.genus} grp:birds`; // taxonomy-mismatch fallback

  if (settings.soundType === "song") {
    return [
      `${base} q:A ${regionPart} type:song`,
      `${base} q:">C" ${regionPart} type:song`,
      `${base} q:A type:song`,
      `${base} type:song`,
      `${baseGenus} q:A ${regionPart} type:song`,
    ];
  } else if (settings.soundType === "call") {
    return [
      `${base} q:A ${regionPart} type:call`,
      `${base} q:">C" ${regionPart} type:call`,
      `${base} q:A type:call`,
      `${base} type:call`,
      `${baseGenus} q:A ${regionPart} type:call`,
    ];
  } else {
    return [
      `${base} q:A ${regionPart}`,
      `${base} q:">C" ${regionPart}`,
      `${base} q:A ${regionPart}`,
      `${baseGenus} q:A ${regionPart}`,
    ];
  }
}

function filterRecordings(recordings: Recording[], bird: Bird): Recording[] {
  return recordings.filter(
    (r) =>
      r.sp.toLowerCase() === bird.species.toLowerCase() &&
      r.file &&
      !r.file.includes("restricted")
  );
}

async function fetchRecordings(bird: Bird): Promise<Recording[]> {
  const queries = buildQueries(bird);

  for (const query of queries) {
    try {
      const res = await fetchWithTimeout(
        `/api/xc/recordings?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) continue;

      const data: XCResponse = await res.json();
      const page1 = filterRecordings(data.recordings, bird);

      // If there are multiple pages, randomly sample one for variety
      if (data.numPages > 1) {
        const maxPage = Math.min(data.numPages, 5);
        const randomPage = Math.floor(Math.random() * (maxPage - 1)) + 2;
        try {
          const pageRes = await fetchWithTimeout(
            `/api/xc/recordings?query=${encodeURIComponent(query)}&page=${randomPage}`
          );
          if (pageRes.ok) {
            const pageData: XCResponse = await pageRes.json();
            const paged = filterRecordings(pageData.recordings, bird);
            if (paged.length > 0) return paged;
          }
        } catch {
          // random page failed — fall through to page 1
        }
      }

      if (page1.length > 0) return page1;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        console.warn("Timeout for query:", query);
      } else {
        console.error("API error:", e);
      }
    }
  }

  return [];
}

// ── Game logic ──

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getWrongOptions(correct: Bird, count: number): Bird[] {
  const result: Bird[] = [];
  const correctIdx = BIRDS.indexOf(correct);
  const used = new Set<string>([correct.en]);
  const enabled = BIRDS.filter((b) => enabledBirds.has(b.en));

  // Prefer same genus (most confusing)
  const sameGenus = enabled.filter(
    (b) => b.genus === correct.genus && !used.has(b.en)
  );
  shuffleArray(sameGenus);
  for (const b of sameGenus.slice(0, 2)) {
    result.push(b);
    used.add(b.en);
  }

  // Then nearby in original array (same category)
  const nearby = enabled.filter(
    (b) =>
      !used.has(b.en) && Math.abs(BIRDS.indexOf(b) - correctIdx) <= 12
  );
  shuffleArray(nearby);
  for (const b of nearby.slice(0, count - result.length)) {
    result.push(b);
    used.add(b.en);
  }

  // Fill remaining randomly from enabled birds
  const remaining = enabled.filter((b) => !used.has(b.en));
  shuffleArray(remaining);
  for (const b of remaining.slice(0, count - result.length)) {
    result.push(b);
  }

  return result.slice(0, count);
}

async function fetchBirdImage(
  birdName: string
): Promise<string | null> {
  try {
    const title = birdName.replace(/ /g, "_");
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

function pickRandomBird(): Bird {
  const enabled = getEnabledBirds();
  const pool =
    enabled.length > 0
      ? enabled.filter((b) => !state.recentBirds.includes(b.en))
      : BIRDS;
  const finalPool =
    pool.length > 0 ? pool : enabled.length > 0 ? enabled : BIRDS;
  if (pool.length === 0) state.recentBirds = [];
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

// ── Prefetch logic ──

async function startPrefetch() {
  prefetched = null;
  prefetchPromise = (async () => {
    try {
      let bird = pickRandomBird();
      let attempts = 0;
      while (bird.en === state.currentBird?.en && attempts < 10) {
        bird = pickRandomBird();
        attempts++;
      }

      let recordings: Recording[] = [];
      let retries = 0;
      let tryBird = bird;
      while (recordings.length === 0 && retries < 3) {
        recordings = await fetchRecordings(tryBird);
        if (recordings.length === 0) {
          retries++;
          if (retries < 3) tryBird = pickRandomBird();
        }
      }

      if (recordings.length > 0) {
        const recording =
          recordings[Math.floor(Math.random() * recordings.length)];
        prefetched = { bird: tryBird, recording, recordings };
      }
    } catch (e) {
      console.warn("Prefetch failed:", e);
    }
  })();
}

function invalidatePrefetch() {
  if (prefetched && !enabledBirds.has(prefetched.bird.en)) {
    prefetched = null;
    prefetchPromise = null;
    startPrefetch();
  }
}

// ── Round management ──

async function startRound() {
  // Stop any playing audio
  if (state.audio) {
    state.audio.pause();
    state.audio.src = "";
    state.isPlaying = false;
  }

  // Check minimum enabled birds
  if (getEnabledBirds().length === 0) {
    loadingEl.classList.add("hidden");
    guessSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    resultMessage.textContent = "⚠️ No species enabled";
    resultMessage.className = "skipped";
    birdInfo.innerHTML =
      "<p>Open the species filter (☰) and enable some birds.</p>";
    return;
  }

  // Reset UI
  resultSection.classList.add("hidden");
  guessSection.classList.remove("hidden");
  guessInput.value = "";
  guessInput.disabled = false;
  submitBtn.disabled = false;
  skipBtn.disabled = false;
  showOptionsBtn.disabled = false;
  playBtn.classList.remove("playing");
  playBtn.setAttribute("disabled", "");
  soundInfo.textContent = "Finding a bird song…";
  autocompleteList.classList.add("hidden");
  optionsSection.classList.add("hidden");
  optionsGrid.innerHTML = "";
  $("autocomplete-container").classList.remove("hidden");
  submitBtn.classList.remove("hidden");

  let bird: Bird | null = null;
  let recording: Recording | null = null;

  // Wait for any ongoing prefetch
  if (prefetchPromise) {
    loadingEl.classList.remove("hidden");
    soundInfo.textContent = "Almost ready…";
    await prefetchPromise;
    prefetchPromise = null;
  }

  // Use prefetched data if valid
  if (
    prefetched &&
    enabledBirds.has(prefetched.bird.en) &&
    prefetched.bird.en !== state.currentBird?.en
  ) {
    bird = prefetched.bird;
    recording = prefetched.recording;
    state.currentRecordings = prefetched.recordings;
    prefetched = null;
    loadingEl.classList.add("hidden");
  }

  // Fall back to fresh fetch if no prefetch available
  if (!bird || !recording) {
    loadingEl.classList.remove("hidden");
    soundInfo.textContent = "Finding a bird song…";

    bird = pickRandomBird();
    let recordings: Recording[] = [];
    let attempts = 0;

    while (recordings.length === 0 && attempts < 3) {
      recordings = await fetchRecordings(bird);
      if (recordings.length === 0) {
        attempts++;
        if (attempts < 3) bird = pickRandomBird();
      }
    }

    loadingEl.classList.add("hidden");

    if (recordings.length > 0) {
      state.currentRecordings = recordings;
      recording =
        recordings[Math.floor(Math.random() * recordings.length)];
    }
  }

  state.currentBird = bird;
  state.recentBirds.push(bird.en);

  // Keep recent-bird list bounded
  const enabled = getEnabledBirds();
  const maxRecent = Math.max(1, Math.min(30, enabled.length - 5));
  while (state.recentBirds.length > maxRecent) {
    state.recentBirds.shift();
  }

  if (!recording) {
    soundInfo.textContent =
      "Could not find recordings. Click Next to try again.";
    guessSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    resultMessage.textContent = "⚠️ No recordings available";
    resultMessage.className = "skipped";
    birdInfo.innerHTML = "<p>Try again with a different bird.</p>";
    startPrefetch();
    return;
  }

  loadRecording(recording);
  guessInput.focus();

  // Start prefetching next bird in background
  startPrefetch();
}

// ── Audio ──

function loadRecording(recording: Recording) {
  state.currentRecording = recording;

  if (state.audio) {
    state.audio.pause();
    state.audio.src = "";
    state.isPlaying = false;
  }

  const audioUrl = recording.file.startsWith("//")
    ? `https:${recording.file}`
    : recording.file;

  const audio = new Audio(audioUrl);
  state.audio = audio;

  audio.addEventListener("ended", () => {
    state.isPlaying = false;
    playBtn.classList.remove("playing");
    playBtnText.textContent = "Play Again";
  });

  audio.addEventListener("error", () => {
    if (state.audio !== audio) return; // stale handler after round change
    // Remove this recording and silently try another from the pool
    state.currentRecordings = state.currentRecordings.filter(
      (r) => r.id !== recording.id
    );
    if (state.currentRecordings.length > 0) {
      const next =
        state.currentRecordings[
          Math.floor(Math.random() * state.currentRecordings.length)
        ];
      loadRecording(next);
    } else {
      soundInfo.textContent = "Audio failed to load. Try the next bird.";
      playBtn.setAttribute("disabled", "");
    }
  });

  playBtn.removeAttribute("disabled");
  playBtnText.textContent = "Play Bird Song";
  soundInfo.textContent = "Press play to hear the bird";
}

function playSound() {
  if (!state.audio) return;

  if (state.isPlaying) {
    state.audio.pause();
    state.audio.currentTime = 0;
    state.isPlaying = false;
    playBtn.classList.remove("playing");
    playBtnText.textContent = "Play Again";
    return;
  }

  state.audio.currentTime = 0;
  state.audio
    .play()
    .then(() => {
      state.isPlaying = true;
      playBtn.classList.add("playing");
      playBtnText.textContent = "⏹ Stop";
    })
    .catch((e) => {
      console.error("Playback error:", e);
      soundInfo.textContent = "Playback failed — try again.";
    });
}

function showResult(type: "correct" | "incorrect" | "skipped") {
  const bird = state.currentBird!;
  const rec = state.currentRecording;

  if (type === "correct") {
    state.score++;
    resultMessage.textContent = "✅ Correct!";
    resultMessage.className = "correct";
  } else if (type === "incorrect") {
    resultMessage.textContent = `❌ Incorrect — it was ${bird.en}`;
    resultMessage.className = "incorrect";
  } else {
    resultMessage.textContent = `⏭️ Skipped — it was ${bird.en}`;
    resultMessage.className = "skipped";
  }

  state.total++;

  const xcLink = rec?.url
    ? (rec.url.startsWith("//") ? `https:${rec.url}` : rec.url)
    : `https://xeno-canto.org`;

  const soundType = rec?.type
    ? `<span class="sound-type">${escapeHtml(rec.type)}</span>`
    : "";

  birdInfo.innerHTML = `
    <div id="bird-image-container"></div>
    <p class="bird-name"><strong>${escapeHtml(bird.en)}</strong></p>
    <p class="danish-name">${escapeHtml(bird.dk)}</p>
    <p class="scientific-name"><em>${escapeHtml(bird.genus)} ${escapeHtml(bird.species)}</em></p>
    ${rec ? `<p class="recording-info">${soundType} · by ${escapeHtml(rec.rec)} · ${escapeHtml(rec.cnt)} · Quality ${rec.q}</p>` : ""}
    ${rec?.sono?.med ? `<img src="https:${rec.sono.med}" alt="Sonogram of ${escapeHtml(bird.en)}" class="sonogram">` : ""}
    <p class="xc-link"><a href="${xcLink}" target="_blank" rel="noopener">View on xeno-canto →</a></p>
  `;

  // Fetch and display bird image from Wikipedia
  fetchBirdImage(bird.en).then((imageUrl) => {
    const container = document.getElementById("bird-image-container");
    if (imageUrl && container) {
      container.innerHTML = `<img src="${imageUrl}" alt="${escapeHtml(bird.en)}" class="bird-photo">`;
    }
  });

  scoreDisplay.textContent = `Score: ${state.score} / ${state.total}`;

  guessInput.disabled = true;
  submitBtn.disabled = true;
  skipBtn.disabled = true;
  resultSection.classList.remove("hidden");
}

function submitGuess() {
  if (!state.currentBird || guessInput.disabled) return;
  const guess = guessInput.value.trim();
  if (!guess) return;

  const matchedBird = BIRDS.find(
    (b) => b.en.toLowerCase() === guess.toLowerCase()
  );
  if (!matchedBird) {
    guessInput.classList.add("invalid");
    setTimeout(() => guessInput.classList.remove("invalid"), 600);
    return;
  }

  autocompleteList.classList.add("hidden");
  showResult(matchedBird.en === state.currentBird.en ? "correct" : "incorrect");
}

function skip() {
  if (!state.currentBird || guessInput.disabled) return;
  autocompleteList.classList.add("hidden");
  showResult("skipped");
}

function showOptions() {
  if (!state.currentBird) return;
  const correct = state.currentBird;
  const wrong = getWrongOptions(correct, 4);
  const options = shuffleArray([correct, ...wrong]);

  // Hide text input, show options
  $("autocomplete-container").classList.add("hidden");
  submitBtn.classList.add("hidden");
  showOptionsBtn.disabled = true;
  optionsGrid.innerHTML = "";

  for (const bird of options) {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `${escapeHtml(bird.en)}<span class="option-dk">${escapeHtml(bird.dk)}</span>`;
    btn.addEventListener("click", () => {
      guessInput.value = bird.en;
      // Disable all option buttons
      optionsGrid
        .querySelectorAll(".option-btn")
        .forEach((b) => ((b as HTMLButtonElement).disabled = true));
      // Highlight correct/incorrect
      if (bird.en === correct.en) {
        btn.classList.add("option-correct");
      } else {
        btn.classList.add("option-incorrect");
        // Also highlight the correct one
        const correctBtn = Array.from(
          optionsGrid.querySelectorAll(".option-btn")
        ).find((b) => b.textContent?.startsWith(correct.en));
        if (correctBtn) correctBtn.classList.add("option-correct");
      }
      setTimeout(() => {
        const isCorrect = bird.en === correct.en;
        showResult(isCorrect ? "correct" : "incorrect");
      }, 600);
    });
    optionsGrid.appendChild(btn);
  }

  optionsSection.classList.remove("hidden");
}

// ── Sidebar ──

function toggleSidebar(open?: boolean) {
  const isOpen = sidebarEl.classList.contains("open");
  const shouldOpen = open !== undefined ? open : !isOpen;
  sidebarEl.classList.toggle("open", shouldOpen);
  sidebarOverlay.classList.toggle("open", shouldOpen);
}

function initSidebar() {
  const birdList = $("bird-list");
  birdList.innerHTML = "";

  let offset = 0;
  for (const group of BIRD_GROUPS) {
    const groupBirds = BIRDS.slice(offset, offset + group.count);
    offset += group.count;

    const section = document.createElement("div");
    section.className = "bird-group";

    // Group header with checkbox
    const header = document.createElement("label");
    header.className = "group-header";
    const groupCb = document.createElement("input");
    groupCb.type = "checkbox";
    updateGroupCheckbox(groupCb, groupBirds);
    header.appendChild(groupCb);
    header.appendChild(
      document.createTextNode(` ${group.name} (${groupBirds.length})`)
    );
    section.appendChild(header);

    // Individual bird checkboxes
    const list = document.createElement("div");
    list.className = "bird-group-list";

    for (const bird of groupBirds) {
      const label = document.createElement("label");
      label.className = "bird-checkbox";
      label.dataset.birdEn = bird.en;
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = enabledBirds.has(bird.en);
      cb.addEventListener("change", () => {
        if (cb.checked) enabledBirds.add(bird.en);
        else enabledBirds.delete(bird.en);
        saveBirdPrefs();
        updateGroupCheckbox(groupCb, groupBirds);
        updateEnabledCount();
        invalidatePrefetch();
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(` ${bird.en}`));
      const dk = document.createElement("span");
      dk.className = "bird-dk";
      dk.textContent = ` (${bird.dk})`;
      label.appendChild(dk);
      list.appendChild(label);
    }

    groupCb.addEventListener("change", () => {
      const checked = groupCb.checked;
      for (const bird of groupBirds) {
        if (checked) enabledBirds.add(bird.en);
        else enabledBirds.delete(bird.en);
      }
      list
        .querySelectorAll<HTMLInputElement>("input[type=checkbox]")
        .forEach((cb) => (cb.checked = checked));
      groupCb.indeterminate = false;
      saveBirdPrefs();
      updateEnabledCount();
      invalidatePrefetch();
    });

    section.appendChild(list);
    birdList.appendChild(section);
  }

  updateEnabledCount();
}

function updateGroupCheckbox(cb: HTMLInputElement, birds: Bird[]) {
  const all = birds.every((b) => enabledBirds.has(b.en));
  const some = birds.some((b) => enabledBirds.has(b.en));
  cb.checked = all;
  cb.indeterminate = some && !all;
}

function updateEnabledCount() {
  const count = getEnabledBirds().length;
  $("enabled-count").textContent = `${count} / ${BIRDS.length} enabled`;
}

// ── Autocomplete ──

let selectedIndex = -1;

function escapeHtml(str: string): string {
  const el = document.createElement("span");
  el.textContent = str;
  return el.innerHTML;
}

function updateAutocomplete() {
  const value = guessInput.value.trim().toLowerCase();
  autocompleteList.innerHTML = "";
  selectedIndex = -1;

  if (value.length < 1) {
    autocompleteList.classList.add("hidden");
    return;
  }

  const matches = BIRDS.filter(
    (b) =>
      b.en.toLowerCase().includes(value) ||
      b.dk.toLowerCase().includes(value)
  ).slice(0, 8);

  if (matches.length === 0) {
    autocompleteList.classList.add("hidden");
    return;
  }

  for (const bird of matches) {
    const li = document.createElement("li");
    li.dataset.birdEn = bird.en;
    const enLower = bird.en.toLowerCase();
    const idx = enLower.indexOf(value);
    if (idx >= 0) {
      li.innerHTML =
        escapeHtml(bird.en.substring(0, idx)) +
        `<strong>${escapeHtml(bird.en.substring(idx, idx + value.length))}</strong>` +
        escapeHtml(bird.en.substring(idx + value.length)) +
        ` <span class="ac-danish">${escapeHtml(bird.dk)}</span>`;
    } else {
      const dkLower = bird.dk.toLowerCase();
      const dkIdx = dkLower.indexOf(value);
      li.innerHTML =
        escapeHtml(bird.en) +
        ` <span class="ac-danish">${escapeHtml(bird.dk.substring(0, dkIdx))}<strong>${escapeHtml(bird.dk.substring(dkIdx, dkIdx + value.length))}</strong>${escapeHtml(bird.dk.substring(dkIdx + value.length))}</span>`;
    }
    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      guessInput.value = bird.en;
      autocompleteList.classList.add("hidden");
    });
    autocompleteList.appendChild(li);
  }
  autocompleteList.classList.remove("hidden");
}

function updateSelection() {
  const items = autocompleteList.querySelectorAll("li");
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === selectedIndex);
    if (i === selectedIndex) item.scrollIntoView({ block: "nearest" });
  });
}

// ── Settings UI ──

function initSettings() {
  const soundToggle = $("sound-type-toggle");
  soundToggle.querySelectorAll<HTMLButtonElement>(".toggle-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === settings.soundType);
    btn.addEventListener("click", () => {
      settings.soundType = btn.dataset.value as SoundType;
      saveSettings();
      soundToggle
        .querySelectorAll<HTMLButtonElement>(".toggle-btn")
        .forEach((b) => b.classList.toggle("active", b === btn));
      prefetched = null;
      prefetchPromise = null;
      startPrefetch();
    });
  });

  const regionToggle = $("region-toggle");
  regionToggle.querySelectorAll<HTMLButtonElement>(".toggle-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === settings.region);
    btn.addEventListener("click", () => {
      settings.region = btn.dataset.value as Region;
      saveSettings();
      regionToggle
        .querySelectorAll<HTMLButtonElement>(".toggle-btn")
        .forEach((b) => b.classList.toggle("active", b === btn));
      prefetched = null;
      prefetchPromise = null;
      startPrefetch();
    });
  });

  $("validate-btn").addEventListener("click", validateBirds);
}

// ── Bird validator ──

function findBirdLabel(en: string): HTMLElement | null {
  return (
    Array.from(
      document.querySelectorAll<HTMLElement>(".bird-checkbox[data-bird-en]")
    ).find((el) => el.dataset.birdEn === en) || null
  );
}

async function validateBirds() {
  const validateBtn = $("validate-btn") as HTMLButtonElement;
  const validateStatus = $("validate-status");

  validateBtn.disabled = true;
  // Clear previous warning marks
  document
    .querySelectorAll(".bird-checkbox.no-recordings")
    .forEach((el) => el.classList.remove("no-recordings"));

  const enabled = getEnabledBirds();
  const failed: string[] = [];

  for (let i = 0; i < enabled.length; i++) {
    const bird = enabled[i];
    validateStatus.textContent = `Checking ${i + 1} / ${enabled.length}…`;

    const recordings = await fetchRecordings(bird);
    if (recordings.length === 0) {
      failed.push(bird.en);
      const label = findBirdLabel(bird.en);
      if (label) label.classList.add("no-recordings");
    }

    // Small pause to avoid hammering the API
    await new Promise((r) => setTimeout(r, 200));
  }

  validateBtn.disabled = false;

  if (failed.length === 0) {
    validateStatus.textContent = "✅ All OK";
  } else {
    const preview = failed.slice(0, 3).join(", ");
    validateStatus.textContent = `⚠️ ${failed.length} missing: ${preview}${failed.length > 3 ? "…" : ""}`;
  }
}

// ── Event listeners ──

playBtn.addEventListener("click", playSound);
submitBtn.addEventListener("click", submitGuess);
skipBtn.addEventListener("click", skip);
showOptionsBtn.addEventListener("click", showOptions);
nextBtn.addEventListener("click", startRound);

guessInput.addEventListener("input", updateAutocomplete);
guessInput.addEventListener("keydown", (e) => {
  const items = autocompleteList.querySelectorAll("li");
  const visible = !autocompleteList.classList.contains("hidden");

  if (e.key === "ArrowDown" && visible) {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelection();
  } else if (e.key === "ArrowUp" && visible) {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, -1);
    updateSelection();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (visible && items.length > 0) {
      // Auto-select top match if nothing is explicitly highlighted
      const idx = selectedIndex >= 0 ? selectedIndex : 0;
      const li = items[idx] as HTMLElement;
      guessInput.value = li.dataset.birdEn || "";
      autocompleteList.classList.add("hidden");
      selectedIndex = -1;
    } else {
      submitGuess();
    }
  } else if (e.key === "Escape") {
    autocompleteList.classList.add("hidden");
  }
});

guessInput.addEventListener("blur", () => {
  setTimeout(() => autocompleteList.classList.add("hidden"), 150);
});

// Space to play/stop when input is not focused
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement !== guessInput) {
    e.preventDefault();
    playSound();
  }
});

// Sidebar
$("sidebar-toggle").addEventListener("click", () => toggleSidebar(true));
$("sidebar-close").addEventListener("click", () => toggleSidebar(false));
sidebarOverlay.addEventListener("click", () => toggleSidebar(false));

$("select-all-btn").addEventListener("click", () => {
  BIRDS.forEach((b) => enabledBirds.add(b.en));
  saveBirdPrefs();
  initSidebar();
  invalidatePrefetch();
});

$("deselect-all-btn").addEventListener("click", () => {
  enabledBirds.clear();
  saveBirdPrefs();
  initSidebar();
  invalidatePrefetch();
});

// ── Start ──

loadSettings();
loadBirdPrefs();
initSidebar();
initSettings();
startRound();
