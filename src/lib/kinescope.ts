/**
 * Kinescope — российский видеохостинг для онлайн-школ
 * Документация: https://kinescope.io/docs/api
 * Используется вместо Mux (недоступен в РФ)
 */

const BASE_URL = "https://api.kinescope.io/v1";

function headers() {
  return {
    Authorization: `Bearer ${process.env.KINESCOPE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export interface KinescopeVideo {
  id: string;
  title: string;
  status: "queue" | "processing" | "done" | "error";
  duration?: number;
  upload_url?: string;
}

/** Создать видео и получить URL для прямой загрузки */
export async function createUploadSession(title: string): Promise<{
  videoId: string;
  uploadUrl: string;
}> {
  const res = await fetch(`${BASE_URL}/videos`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      project_id: process.env.KINESCOPE_PROJECT_ID,
      title,
    }),
  });

  if (!res.ok) throw new Error(`Kinescope create: ${await res.text()}`);
  const data: KinescopeVideo = await res.json();

  return {
    videoId: data.id,
    uploadUrl: data.upload_url!,
  };
}

/** Получить статус видео после загрузки */
export async function getVideo(videoId: string): Promise<KinescopeVideo> {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`, {
    headers: headers(),
  });
  return res.json();
}

/** URL для вставки плеера в iframe */
export function getEmbedUrl(videoId: string): string {
  return `https://kinescope.io/embed/${videoId}`;
}

/** Длительность в секундах из метаданных Kinescope */
export function parseDuration(seconds?: number): number {
  return Math.floor(seconds ?? 0);
}
