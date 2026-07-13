/**
 * YouTube channel sync for the Video Library.
 * ------------------------------------------------------------------
 * ضع مفتاح YouTube Data API v3 هنا وستُعرض كل فيديوهات القناة تلقائيًا
 * بالأحدث أولًا. المفتاح مجاني من: https://console.cloud.google.com
 * (Create Project → Enable "YouTube Data API v3" → Credentials → API key)
 * لو المفتاح فاضي، الموقع يستخدم القائمة المحفوظة محليًا.
 */
export const YOUTUBE_API_KEY = "";
export const YOUTUBE_CHANNEL_ID = "UC3CHbaJCEH_SqWLNtLHJUMw";

const UPLOADS_PLAYLIST = "UU" + YOUTUBE_CHANNEL_ID.slice(2);

function parseDuration(iso) {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!m) return "";
  const h = +m[1] || 0, min = +m[2] || 0, s = +m[3] || 0;
  return h ? `${h}:${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${min}:${String(s).padStart(2, "0")}`;
}

function guessProduct(title) {
  const t = title.toLowerCase();
  if (t.includes("shell")) return "Power Shell for SOLIDWORKS";
  if (t.includes("re studio") || t.includes("meshtocad") || t.includes("cyborg")) return "Power Surfacing RE Studio";
  if (t.includes(" re ") || t.includes("reverse")) return "Power Surfacing RE for SOLIDWORKS";
  if (t.includes("studio")) return "Power Surfacing Studio";
  return "Power Surfacing for SOLIDWORKS";
}

function guessType(title) {
  const t = title.toLowerCase();
  if (t.includes("webinar") || t.includes("overview") || t.includes("presentation") || t.includes("new features")) return "Overview";
  if (t.includes("tutorial") || t.includes("how to") || t.includes("modeling")) return "Tutorial";
  return "Demo";
}

export async function fetchChannelVideos() {
  const viaApi = await fetchViaOfficialApi();
  if (viaApi && viaApi.length) return viaApi;
  return fetchViaInvidious();
}

async function fetchViaOfficialApi() {
  if (!YOUTUBE_API_KEY) return null;
  try {
    const items = [];
    let pageToken = "";
    for (let page = 0; page < 4; page++) {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${UPLOADS_PLAYLIST}&key=${YOUTUBE_API_KEY}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("playlistItems failed");
      const data = await res.json();
      items.push(...(data.items || []));
      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }

    const ids = items.map((i) => i.snippet?.resourceId?.videoId).filter(Boolean);
    const durations = {};
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50).join(",");
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${YOUTUBE_API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        for (const v of data.items || []) durations[v.id] = parseDuration(v.contentDetails?.duration);
      }
    }

    return items
      .map((i) => {
        const sn = i.snippet;
        const vid = sn?.resourceId?.videoId;
        if (!vid) return null;
        return {
          id: vid,
          youtubeId: vid,
          title: sn.title,
          product: guessProduct(sn.title),
          type: guessType(sn.title),
          level: "",
          duration: durations[vid] || "",
          thumbnail: sn.thumbnails?.high?.url || `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
          publishedAt: sn.publishedAt,
          external: true,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------
   No-key fallback: public Invidious mirrors of the same channel.
   Tries several instances; fails silently to the built-in list.
------------------------------------------------------------------ */
const INVIDIOUS_INSTANCES = [
  "https://inv.nadeko.net",
  "https://yewtu.be",
  "https://invidious.nerdvpn.de",
];

function fmtSeconds(sec) {
  if (!sec && sec !== 0) return "";
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

async function fetchViaInvidious() {
  for (const base of INVIDIOUS_INSTANCES) {
    try {
      const all = [];
      let continuation = "";
      for (let page = 0; page < 4; page++) {
        const url = `${base}/api/v1/channels/${YOUTUBE_CHANNEL_ID}/videos?sort_by=newest${continuation ? `&continuation=${continuation}` : ""}`;
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const vids = data.videos || data;
        if (!Array.isArray(vids) || !vids.length) break;
        all.push(...vids);
        continuation = data.continuation;
        if (!continuation) break;
      }
      if (!all.length) continue;
      return all
        .map((v) => ({
          id: v.videoId,
          youtubeId: v.videoId,
          title: v.title,
          product: guessProduct(v.title || ""),
          type: guessType(v.title || ""),
          level: "",
          duration: fmtSeconds(v.lengthSeconds),
          thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
          publishedAt: (v.published || 0) * 1000,
          external: true,
        }))
        .sort((a, b) => b.publishedAt - a.publishedAt);
    } catch {
      /* try the next instance */
    }
  }
  return null;
}
