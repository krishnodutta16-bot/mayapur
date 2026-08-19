"use client";

import { Music, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; oscs: OscillatorNode[] } | null>(null);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
    };
  }, []);

  const start = () => {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    void ctx.resume();

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);

    const oscs = [220, 277.18, 329.63, 440].map((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.06 + i * 0.03;
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start();
      osc.connect(gain);
      osc.start();
      return osc;
    });

    nodesRef.current = { gain, oscs };
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    nodes.gain.gain.cancelScheduledValues(ctx.currentTime);
    nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    nodes.oscs.forEach((o) => o.stop(ctx.currentTime + 1));
    nodesRef.current = null;
  };

  const toggle = () => {
    if (on) stop();
    else start();
    setOn(!on);
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "মিউজিক বন্ধ করুন" : "মিউজিক চালু করুন"}
      className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground transition-transform hover:scale-105"
    >
      {on ? <Music className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
      <span>{on ? "মিউজিক চলছে" : "মিউজিক"}</span>
    </button>
  );
}
