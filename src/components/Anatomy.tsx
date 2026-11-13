"use client";

import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bvh, OrbitControls, useGLTF } from "@react-three/drei";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { groupNames, type Group, type Lang } from "../lib/exercises";

type Props = {
  scores: Partial<Record<Group, number>>;
  selected: Group | null;
  onSelect: (g: Group) => void;
  lang: Lang;
};

// Écorché names each original anatomical structure. These broad assignments
// connect the visible structures to this app's nine exercise categories;
// they are not a diagnosis or a precise map of muscle function.
function groupFor(name: string): Group | undefined {
  const n = name.toLowerCase();
  if (/sternocleidomastoid|splenius|sternohyoid|sternothyroid|thyrohyoid|omohyoid/.test(n)) return "neck";
  if (/deltoid|biceps brachii|triceps brachii|brachialis|coracobrachialis|infraspinatus|teres minor/.test(n)) return "shoulders";
  if (/pectoralis|serratus anterior/.test(n)) return "chest";
  if (/trapezius|latissimus|thoracolumbar|erector spinae|rectus abdominis|external oblique|internal oblique|transversus abdominis|linea alba|teres major/.test(n)) return "back";
  if (/gluteus|tensor fasciae|adductor|pectineus|gracilis/.test(n)) return "hips";
  if (/biceps femoris|semitendinosus|semimembranosus/.test(n)) return "hamstrings";
  if (/rectus femoris|vastus|sartorius/.test(n)) return "quads";
  if (/gastrocnemius|soleus|fibularis|tibialis anterior|calcaneal tendon|extensor digitorum longus|extensor hallucis longus/.test(n)) return "calves";
  if (/brachioradialis|anconeus|carpi|palmaris|pronator|supinator|pollicis longus|extensor digitorum$|extensor digiti minimi|flexor digitorum superficialis/.test(n)) return "forearms";
}

function colorFor(group: Group | undefined, score: number | undefined, active: boolean) {
  if (active) return "#f1eee7";
  if (!group || score == null) return "#9b9f98";
  return score < 35 ? "#c86d64" : score < 70 ? "#d9b75e" : "#7ba98a";
}

const MODEL_URL = "/flexmap-pwa/models/ecorche.meshopt.glb";

type FigureProps = Props & { facing: number; hovered: Group | null; setHovered: (group: Group | null) => void; onReady: () => void };
function Figure({ scores, selected, onSelect, facing, hovered, setHovered, onReady }: FigureProps) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const invalidate = useThree(state => state.invalidate);
  const figure = useMemo(() => {
    // Bake each source node's transform into floating point attributes before
    // merging. The original GLB uses quantized integer coordinates and a root
    // scale; applying matrices to those integers would clamp their values.
    scene.updateMatrixWorld(true);
    const buckets = new Map<string, THREE.BufferGeometry[]>();
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const source = object.geometry;
      const position = source.getAttribute("position");
      if (!position) return;
      const layer = object.userData.layer;
      const name = String(object.userData.name || object.name || "");
      const group = layer === "skeleton" ? undefined : groupFor(name);
      const bucket = layer === "skeleton" ? "bone" : group ?? "neutral";
      const geometry = new THREE.BufferGeometry();
      const values = new Float32Array(position.count * 3);
      for (let i = 0; i < position.count; i++) {
        values[i * 3] = position.getX(i);
        values[i * 3 + 1] = position.getY(i);
        values[i * 3 + 2] = position.getZ(i);
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
      const normal = source.getAttribute("normal");
      if (normal) {
        const normals = new Float32Array(normal.count * 3);
        for (let i = 0; i < normal.count; i++) {
          normals[i * 3] = normal.getX(i);
          normals[i * 3 + 1] = normal.getY(i);
          normals[i * 3 + 2] = normal.getZ(i);
        }
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      }
      const oldIndex = source.getIndex();
      const indices = new Uint32Array(oldIndex ? oldIndex.count : position.count);
      for (let i = 0; i < indices.length; i++) indices[i] = oldIndex ? oldIndex.getX(i) : i;
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      if (!normal) geometry.computeVertexNormals();
      geometry.applyMatrix4(object.matrixWorld);
      const geometries = buckets.get(bucket) ?? [];
      geometries.push(geometry);
      buckets.set(bucket, geometries);
    });
    const merged = new THREE.Group();
    buckets.forEach((geometries, bucket) => {
      const geometry = mergeGeometries(geometries);
      geometries.forEach(part => part.dispose());
      if (!geometry) throw new Error(`Could not merge anatomy geometry: ${bucket}`);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      const material = new THREE.MeshStandardMaterial({
        color: bucket === "bone" ? "#d0c9bd" : "#9b9f98",
        roughness: .76,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.layer = bucket === "bone" ? "skeleton" : "muscle";
      mesh.userData.exerciseGroup = bucket === "bone" || bucket === "neutral" ? undefined : bucket;
      merged.add(mesh);
    });
    return merged;
  }, [scene]);
  useEffect(() => {
    figure.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const group = object.userData.exerciseGroup as Group | undefined;
      const material = object.material as THREE.MeshStandardMaterial;
      if (object.userData.layer !== "skeleton") material.color.set(colorFor(group, group ? scores[group] : undefined, !!group && (group === selected || group === hovered)));
    });
    invalidate();
  }, [figure, scores, selected, hovered, invalidate]);
  useEffect(() => { onReady(); invalidate(); }, [onReady, invalidate]);
  useEffect(() => () => {
    figure.traverse(object => {
      if (object instanceof THREE.Mesh) { object.geometry.dispose(); (object.material as THREE.Material).dispose(); }
    });
    document.body.style.cursor = "";
  }, [figure]);
  const getGroup = (event: ThreeEvent<PointerEvent | MouseEvent>) => event.object.userData.exerciseGroup as Group | undefined;
  return <group rotation={[0, facing, 0]} position={[0, -.9, 0]}
    onPointerMove={event => {
      const group = getGroup(event);
      setHovered(group ?? null);
      document.body.style.cursor = group ? "pointer" : "";
    }}
    onPointerOut={() => { setHovered(null); document.body.style.cursor = ""; }}
    onClick={event => { const group = getGroup(event); if (group) { event.stopPropagation(); onSelect(group); } }}>
    <Bvh firstHitOnly><primitive object={figure} /></Bvh>
  </group>;
}

class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode; lang: Lang }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div role="status" style={{ display: "grid", placeItems: "center", height: "100%", color: "#6f6c66", font: "14px system-ui" }}>{this.props.lang === "ru" ? "3D-модель недоступна в этом браузере." : "3D view is unavailable in this browser."}</div> : this.props.children; }
}

export default function Anatomy(props: Props) {
  const [back, setBack] = useState(false);
  const [hovered, setHovered] = useState<Group | null>(null);
  const [ready, setReady] = useState(false);
  const onReady = React.useCallback(() => setReady(true), []);
  const current = hovered ?? props.selected;
  return <section data-model-ready={ready ? "true" : "false"} aria-busy={!ready} aria-label={props.lang === "ru" ? "Интерактивная анатомическая карта мышц" : "Interactive anatomical muscle map"} style={{ position: "relative", width: "100%", height: "100%", minHeight: 420, overflow: "hidden" }}>
    {!ready && <div role="status" style={{ position: "absolute", zIndex: 1, top: 12, left: 12, color: "#777", font: "12px system-ui" }}>{props.lang === "ru" ? "Загрузка модели…" : "Loading model…"}</div>}
    <a href="https://github.com/Charleeh/ecorche/blob/main/ATTRIBUTION.md" target="_blank" rel="noreferrer" style={{ position: "absolute", zIndex: 2, left: 8, bottom: 4, color: "#6f6c66", font: "10px system-ui" }}>Écorché · BodyParts3D · Z-Anatomy · CC BY-SA 4.0</a>
    {current && <div role="status" style={{ position: "absolute", zIndex: 2, top: 12, left: "50%", transform: "translateX(-50%)", padding: "6px 10px", borderRadius: 6, background: "rgba(25,26,27,.9)", color: "white", font: "12px system-ui", whiteSpace: "nowrap", pointerEvents: "none" }}>{groupNames[current][props.lang]}</div>}
    <div style={{ position: "absolute", zIndex: 2, bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, padding: 4, borderRadius: 9, background: "rgba(248,247,244,.9)", boxShadow: "0 2px 10px #0001" }}>
      <button type="button" onClick={() => setBack(false)} aria-pressed={!back} style={buttonStyle(!back)}>{props.lang === "ru" ? "Спереди" : "Front"}</button>
      <button type="button" onClick={() => setBack(true)} aria-pressed={back} style={buttonStyle(back)}>{props.lang === "ru" ? "Сзади" : "Back"}</button>
    </div>
    <WebGLErrorBoundary lang={props.lang}><Canvas frameloop="demand" aria-label={props.lang === "ru" ? "3D модель человека, вращайте и выбирайте группу мышц" : "3D human model, rotate and select a muscle group"} camera={{ position: [0, 0, 3.3], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#f7f6f3"]} />
      <ambientLight intensity={.5} />
      <directionalLight position={[3, 5, 5]} intensity={2.4} />
      <directionalLight position={[-4, 1, -3]} intensity={.6} color="#d9e0e8" />
      <Suspense fallback={null}><Figure {...props} facing={back ? Math.PI : 0} hovered={hovered} setHovered={setHovered} onReady={onReady} /></Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={2.4} maxDistance={5} minPolarAngle={.6} maxPolarAngle={2.5} target={[0, 0, 0]} />
    </Canvas></WebGLErrorBoundary>
  </section>;
}

function buttonStyle(active: boolean): React.CSSProperties {
  return { border: 0, borderRadius: 6, padding: "7px 12px", background: active ? "#242625" : "transparent", color: active ? "white" : "#52544f", font: "500 12px system-ui", cursor: "pointer" };
}
