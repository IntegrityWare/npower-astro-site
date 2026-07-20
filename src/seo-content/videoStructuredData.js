import { absoluteUrl, siteId } from "../lib/siteUrl.js";

const UPLOAD_DATES = {
  "yZr-buzOCGc": "2018-07-19T14:37:50-07:00",
  "F9U8-l1y3Kw": "2018-11-07T13:41:19-08:00",
  "tVl9xQwSiCE": "2017-11-13T16:08:42-08:00",
  "WI17SjGiXaE": "2018-07-30T15:22:36-07:00",
  "ombvLO6vu9c": "2018-07-30T15:20:34-07:00",
  "k-Bxe4Al_VQ": "2020-04-21T20:17:21-07:00",
  "Fjg35m5MTMI": "2020-09-06T20:32:15-07:00",
  "rP7KfmP0Mkg": "2020-10-15T17:00:08-07:00",
  "pvLbDM9f58A": "2020-06-20T18:52:53-07:00",
  "l87K8yfbEdY": "2024-09-06T08:27:39-07:00",
  "sceEZzxyvTg": "2018-07-17T14:06:30-07:00",
  "4LjOmm-u8XI": "2018-09-26T14:10:23-07:00",
  "SIX_m3N37e4": "2021-01-27T15:07:19-08:00",
  "dtXuwIIwNcY": "2018-07-30T14:04:05-07:00",
  "Cd439HkG9ow": "2018-07-20T09:32:51-07:00",
  "bUTIEH12be4": "2018-07-30T14:21:37-07:00",
  "2s9nVQPv0Ak": "2020-06-03T20:31:07-07:00",
  "IeAlGJJtXps": "2020-05-07T18:50:05-07:00",
};

function toIsoDuration(duration) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return `PT${minutes}M${seconds}S`;
}

export function getVideoStructuredData(video) {
  if (!video?.youtubeId) return null;

  const pageUrl = absoluteUrl(`/resources/videos/${video.id}`);
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: video.title,
    description: `This ${video.type.toLowerCase()} covers ${video.workflow.toLowerCase()} techniques using ${video.product}. Watch to learn key workflows and best practices for your projects.`,
    thumbnailUrl: [video.thumbnail],
    uploadDate: UPLOAD_DATES[video.youtubeId],
    duration: toIsoDuration(video.duration),
    contentUrl: youtubeUrl,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      "@id": siteId("npower-software"),
      name: "nPower Software",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/npower-branded-social.jpg"),
        width: 1200,
        height: 630,
      },
    },
    genre: video.type,
    educationalLevel: video.level,
    learningResourceType: video.type,
    about: [
      { "@type": "SoftwareApplication", name: video.product },
      { "@type": "Thing", name: video.workflow },
    ],
    potentialAction: {
      "@type": "WatchAction",
      target: youtubeUrl,
    },
  };
}
