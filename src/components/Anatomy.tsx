"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import React, { Suspense, useMemo, useState } from "react";
import * as THREE from "three";
import { groupNames, type Group, type Lang } from "../lib/exercises";

// All muscle meshes use the same sphere surface; per-mesh geometry allocation
// is unnecessary for this fixed procedural figure.
const muscleGeometry = new THREE.SphereGeometry(1, 32, 24);

type Props = {
  scores: Partial<Record<Group, number>>;
  selected: Group | null;
  onSelect: (g: Group) => void;
  lang: Lang;
};

type Part = { group?: Group; at: [number, number, number]; size: [number, number, number]; rot?: [number, number, number]; color?: string };

const parts: Part[] = [
  // Neck, skull, ears and jaw
  { group: "neck" as Group, at: [0, 1.59, 0], size: [.17, .3, .16] },
  { at: [0, 2.04, 0], size: [.255, .35, .235], color: "#c4c0b8" },
  { at: [0, 1.84, .025], size: [.19, .1, .19], color: "#bcb8b0" },
  { at: [-.25, 2.03, 0], size: [.045, .09, .045], color: "#bbb7af" },
  { at: [.25, 2.03, 0], size: [.045, .09, .045], color: "#bbb7af" },
  // torso core and paired pectorals
  { at: [0, 1.03, 0], size: [.48, .69, .28], color: "#c1bdb5" },
  { group: "chest" as Group, at: [-.245, 1.27, .205], size: [.29, .205, .105], rot: [0, 0, -.06] },
  { group: "chest" as Group, at: [.245, 1.27, .205], size: [.29, .205, .105], rot: [0, 0, .06] },
  // back latissimus, trapezius and lumbar muscle
  { group: "back" as Group, at: [-.25, .99, -.205], size: [.24, .48, .14], rot: [0, 0, -.08] },
  { group: "back" as Group, at: [.25, .99, -.205], size: [.24, .48, .14], rot: [0, 0, .08] },
  { group: "back" as Group, at: [0, 1.48, -.17], size: [.32, .3, .12] },
  { group: "back" as Group, at: [-.12, .43, -.17], size: [.1, .34, .09], rot: [0, 0, -.08] },
  { group: "back" as Group, at: [.12, .43, -.17], size: [.1, .34, .09], rot: [0, 0, .08] },
  // abdominal segments and obliques
  ...[-.135, .135].flatMap(x => [1.01, .79, .57].map((y, row) => ({
    group: "back" as Group,
    at: [x, y, .255] as [number, number, number],
    size: [row === 0 ? .125 : .115, row === 1 ? .115 : .13, .064] as [number, number, number],
    rot: [0, 0, x < 0 ? -.035 : .035] as [number, number, number],
  }))),
  { group: "back" as Group, at: [-.37, .81, .15], size: [.12, .32, .11], rot: [0, 0, -.2] },
  { group: "back" as Group, at: [.37, .81, .15], size: [.12, .32, .11], rot: [0, 0, .2] },
  // shoulder caps, arms, forearms and hands
  { group: "shoulders" as Group, at: [-.54, 1.46, 0], size: [.24, .24, .23] },
  { group: "shoulders" as Group, at: [.54, 1.46, 0], size: [.24, .24, .23] },
  { group: "shoulders" as Group, at: [-.68, 1.08, .075], size: [.16, .36, .15], rot: [0, 0, -.12] },
  { group: "shoulders" as Group, at: [.68, 1.08, .075], size: [.16, .36, .15], rot: [0, 0, .12] },
  { group: "shoulders" as Group, at: [-.69, 1.08, -.09], size: [.145, .34, .14], rot: [0, 0, -.12] },
  { group: "shoulders" as Group, at: [.69, 1.08, -.09], size: [.145, .34, .14], rot: [0, 0, .12] },
  { group: "forearms" as Group, at: [-.78, .61, .015], size: [.13, .36, .12], rot: [0, 0, -.1] },
  { group: "forearms" as Group, at: [.78, .61, .015], size: [.13, .36, .12], rot: [0, 0, .1] },
  { at: [-.82, .27, .02], size: [.12, .17, .075], color: "#c4c0b8" },
  { at: [.82, .27, .02], size: [.12, .17, .075], color: "#c4c0b8" },
  // pelvis and gluteal muscles
  { at: [0, .29, 0], size: [.4, .27, .25], color: "#b9b5ad" },
  { group: "hips" as Group, at: [-.2, .2, -.16], size: [.22, .27, .18] },
  { group: "hips" as Group, at: [.2, .2, -.16], size: [.22, .27, .18] },
  // thighs: distinct quadriceps on front, hamstrings behind
  { group: "quads" as Group, at: [-.21, -.34, .105], size: [.19, .52, .18], rot: [0, 0, -.025] },
  { group: "quads" as Group, at: [.21, -.34, .105], size: [.19, .52, .18], rot: [0, 0, .025] },
  { group: "hamstrings" as Group, at: [-.21, -.35, -.12], size: [.17, .5, .15], rot: [0, 0, -.025] },
  { group: "hamstrings" as Group, at: [.21, -.35, -.12], size: [.17, .5, .15], rot: [0, 0, .025] },
  // calves and neutral feet
  { group: "calves" as Group, at: [-.22, -.91, -.025], size: [.145, .38, .16] },
  { group: "calves" as Group, at: [.22, -.91, -.025], size: [.145, .38, .16] },
  { at: [-.22, -1.24, .09], size: [.14, .13, .26], color: "#bcb8b0" },
  { at: [.22, -1.24, .09], size: [.14, .13, .26], color: "#bcb8b0" },
];

function labelFor(group: Group, lang: Lang) {
  return groupNames[group][lang];
}

function colorFor(group: Group | undefined, score: number | undefined, selected: boolean, hovered: boolean) {
  if (!group) return "#c2beb6";
  if (selected || hovered) return "#f8f4ec";
  if (score == null) return "#aaa69e";
  return score < 35 ? "#dc655d" : score < 70 ? "#e4bb58" : "#75b78b";
}

function Muscle({ part, scores, selected, onSelect, lang }: { part: Part; scores: Props["scores"]; selected: Group | null; onSelect: Props["onSelect"]; lang: Lang }) {
  const [hover, setHover] = useState(false);
  const group = part.group;
  const active = !!group && selected === group;
  const color = colorFor(group, group ? scores[group] : undefined, active, hover);
  return <mesh position={part.at} scale={part.size} rotation={part.rot ?? [0, 0, 0]} onPointerOver={e => { if (group) { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; } }} onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }} onClick={e => { if (group) { e.stopPropagation(); onSelect(group); } }} castShadow receiveShadow>
    <primitive object={muscleGeometry} attach="geometry" />
    <meshStandardMaterial color={color} roughness={.66} metalness={.015} emissive={active || hover ? "#30271e" : "#000000"} emissiveIntensity={.16} />
    {group && (hover || active) && <Html distanceFactor={7} position={[0, part.size[1] * .72, 0]} center style={{ pointerEvents: "none" }}><div style={{ padding: "5px 9px", borderRadius: 6, background: "rgba(25,26,27,.92)", color: "#fff", font: "12px/1.2 system-ui", whiteSpace: "nowrap", boxShadow: "0 3px 12px #0004" }}>{labelFor(group, lang)}</div></Html>}
  </mesh>;
}

function Figure({ ...props }: Props & { facing: number }) {
  return <group rotation={[0, props.facing, 0]} position={[0, -.35, 0]}>{parts.map((part, i) => <Muscle key={i} part={part} scores={props.scores} selected={props.selected} onSelect={props.onSelect} lang={props.lang} />)}</group>;
}

class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode; lang: Lang }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div role="status" style={{ display: "grid", placeItems: "center", height: "100%", color: "#6f6c66", font: "14px system-ui" }}>{this.props.lang === "ru" ? "3D-модель недоступна в этом браузере." : "3D view is unavailable in this browser."}</div> : this.props.children; }
}

export default function Anatomy(props: Props) {
  const [back, setBack] = useState(false);
  const facing = useMemo(() => back ? Math.PI : 0, [back]);
  return <section aria-label={props.lang === "ru" ? "Интерактивная анатомическая карта мышц" : "Interactive anatomical muscle map"} style={{ position: "relative", width: "100%", height: "100%", minHeight: 420, overflow: "hidden" }}>
    <div style={{ position: "absolute", zIndex: 2, bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, padding: 4, borderRadius: 9, background: "rgba(248,247,244,.9)", boxShadow: "0 2px 10px #0001" }}>
      <button type="button" onClick={() => setBack(false)} aria-pressed={!back} style={buttonStyle(!back)}>{props.lang === "ru" ? "Спереди" : "Front"}</button>
      <button type="button" onClick={() => setBack(true)} aria-pressed={back} style={buttonStyle(back)}>{props.lang === "ru" ? "Сзади" : "Back"}</button>
    </div>
    <WebGLErrorBoundary lang={props.lang}><Canvas aria-label={props.lang === "ru" ? "3D модель человека, вращайте и выбирайте группу мышц" : "3D human model, rotate and select a muscle group"} shadows camera={{ position: [0, 0, 6], fov: 44 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#f7f6f3"]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[3, 5, 5]} intensity={2.3} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-4, 1, -3]} intensity={1.15} color="#d9e0e8" />
      <Suspense fallback={null}><Figure {...props} facing={facing} /></Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={4.4} maxDistance={8} minPolarAngle={.6} maxPolarAngle={2.5} target={[0, .1, 0]} />
    </Canvas></WebGLErrorBoundary>
  </section>;
}

function buttonStyle(active: boolean): React.CSSProperties {
  return { border: 0, borderRadius: 6, padding: "7px 12px", background: active ? "#242625" : "transparent", color: active ? "white" : "#52544f", font: "500 12px system-ui", cursor: "pointer" };
}
