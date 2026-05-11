import React, { useContext, useEffect, useRef, useState } from "react";
import { SongContext } from "../song.context";
import { useSong } from "../hooks/useSong";

const SKIP_SECONDS = 5;
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const Player = () => {
  const { song } = useSong();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const url = song?.url;
  const title = song?.title ?? "Unknown track";
  const posterUrl = song?.posterUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    audio.load();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    if (playing) audio.pause();
    else void audio.play().catch(() => setPlaying(false));
  };

  const skipBy = (delta) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    audio.currentTime = Math.max(0, Math.min(max, audio.currentTime + delta));
  };

  const onSeekBarClick = (event) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0)
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration, ratio * audio.duration),
    );
  };

  const progressPct =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  if (!url) {
    return (
      <section className="w-full max-w-lg rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-6 text-center text-zinc-400 shadow-xl backdrop-blur-sm">
        <p className="text-sm">No track loaded yet.</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/80 bg-linear-to-b from-zinc-900 to-zinc-950 shadow-xl backdrop-blur-sm">
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a) setCurrentTime(a.currentTime);
        }}
        onLoadedMetadata={() => {
          const a = audioRef.current;
          if (a) setDuration(a.duration || 0);
        }}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10 sm:h-28 sm:w-28">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-zinc-500">
              ♪
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-zinc-100 sm:text-base">
            {title}
          </h2>
          <p className="mt-1 text-left text-xs text-zinc-500">Now playing</p>
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <button
          type="button"
          onClick={onSeekBarClick}
          className="group relative h-2 w-full cursor-pointer rounded-full bg-zinc-800"
          aria-label="Seek position"
        >
          <span
            className="absolute left-0 top-0 h-full rounded-full bg-emerald-500 transition-[width] duration-150 ease-out group-hover:bg-emerald-400"
            style={{ width: `${progressPct}%` }}
          />
          <span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-emerald-500/30 opacity-0 transition-opacity group-hover:opacity-100"
            style={{ left: `calc(${progressPct}% - 6px)` }}
          />
        </button>
        <div className="mt-1.5 flex justify-between font-mono text-xs text-zinc-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 px-4 pb-2 sm:gap-4">
        <button
          type="button"
          onClick={() => skipBy(-SKIP_SECONDS)}
          className="flex h-12 min-w-18 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-zinc-600 bg-zinc-800/80 px-2 text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
          aria-label={`Rewind ${SKIP_SECONDS} seconds`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
          <span className="text-[10px] font-semibold leading-none text-zinc-400">
            −{SKIP_SECONDS}s
          </span>
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-400 active:scale-95"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg
              className="ml-0.5 h-7 w-7"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => skipBy(SKIP_SECONDS)}
          className="flex h-12 min-w-18 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-zinc-600 bg-zinc-800/80 px-2 text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
          aria-label={`Forward ${SKIP_SECONDS} seconds`}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
          <span className="text-[10px] font-semibold leading-none text-zinc-400">
            +{SKIP_SECONDS}s
          </span>
        </button>
      </div>

      <div className="border-t border-zinc-800/80 px-4 py-4 sm:px-5">
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
          Speed
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {PLAYBACK_SPEEDS.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setPlaybackRate(speed)}
              className={`min-w-12 rounded-lg px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${
                playbackRate === speed
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/30"
                  : "border border-zinc-600 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {speed === 1 ? "1×" : `${speed}×`}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Player;
