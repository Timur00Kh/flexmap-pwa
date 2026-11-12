import type { CSSProperties } from 'react';
import type { Exercise, Lang } from '../lib/exercises';

type Props = { exercise: Exercise; level: number; lang?: Lang };

const ink = '#334155';
const accent = '#0f766e';
const muted = '#cbd5e1';
const stroke: CSSProperties = { fill: 'none', stroke: ink, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const active: CSSProperties = { ...stroke, stroke: accent, strokeWidth: 6 };
const joint: CSSProperties = { fill: '#fff', stroke: ink, strokeWidth: 3 };

function Segment({ x1, y1, x2, y2, style = stroke }: { x1: number; y1: number; x2: number; y2: number; style?: CSSProperties }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} style={style} />;
}

function Head({ rotation = 0, cx = 100, cy = 42 }: { rotation?: number; cx?: number; cy?: number }) {
  return <g transform={`rotate(${rotation} ${cx} ${cy})`}>
    <ellipse cx={cx} cy={cy} rx="17" ry="22" style={{ fill: '#fff', stroke: ink, strokeWidth: 4 }} />
    <path d={`M${cx + 15} ${cy + 2} l5 4 -5 3`} style={{ ...stroke, strokeWidth: 2 }} />
    <circle cx={cx + 6} cy={cy - 5} r="1.8" fill={ink} />
  </g>;
}

function NeckPose({ id, angle }: { id: string; angle: number }) {
  if (id === 'neck-rotation') {
    const turn = Math.min(80, Math.max(0, angle));
    return <>
      <path d="M70 86 Q100 68 130 86 L137 143 Q100 155 63 143 Z" style={stroke} />
      <Segment x1={100} y1={69} x2={100} y2={83} />
      <g transform={`translate(${turn * 0.12} 0) scale(${1 - turn / 180} 1)`}>
        <Head cx={100} cy={43} />
        <path d="M95 48 Q100 51 105 48" style={{ ...stroke, strokeWidth: 2 }} />
      </g>
      <path d="M67 106 Q100 95 133 106" style={{ ...stroke, stroke: muted, strokeDasharray: '4 5', strokeWidth: 2 }} />
      <path d="M74 76 Q100 60 126 76" style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
    </>;
  }
  const direction = id === 'neck-flexion' ? 1 : -1;
  const rotation = direction * Math.min(42, angle * 0.72);
  const cy = 43 + (id === 'neck-flexion' ? angle * 0.12 : -angle * 0.08);
  return <>
    <path d="M67 88 Q100 71 133 88 L138 151 Q100 161 62 151 Z" style={stroke} />
    <Segment x1={100} y1={72} x2={100} y2={85} />
    <Head rotation={rotation} cy={cy} />
    <path d={id === 'neck-flexion' ? 'M74 74 Q100 91 126 74' : 'M74 74 Q100 58 126 74'} style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function ArmPose({ id, angle }: { id: string; angle: number }) {
  const rad = angle * Math.PI / 180;
  const torso = <><Head cy={38} /><path d="M75 81 Q100 72 125 81 L129 151 L71 151 Z" style={stroke} /><Segment x1={100} y1={60} x2={100} y2={81} /></>;
  if (id === 'shoulder-external-rotation') {
    const elbowX = 122;
    const elbowY = 126;
    const handX = elbowX + Math.sin(rad) * 36;
    const handY = elbowY + Math.cos(rad) * 30;
    return <>{torso}<Segment x1={122} y1={94} x2={elbowX} y2={elbowY} style={stroke} /><circle cx={elbowX} cy={elbowY} r="5" style={joint} /><Segment x1={elbowX} y1={elbowY} x2={handX} y2={handY} style={active} /><path d="M128 154 A30 30 0 0 0 152 128" style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} /></>;
  }
  const sideRaise = id === 'shoulder-abduction';
  // The arm starts down at 0°, moves forward/to the side at 90°, and
  // reaches overhead at 180°.
  const shoulderX = 118;
  const shoulderY = 88;
  const elbowX = shoulderX + Math.sin(rad) * 34;
  const elbowY = shoulderY + Math.cos(rad) * 34;
  const handX = shoulderX + Math.sin(rad) * 74;
  const handY = shoulderY + Math.cos(rad) * 74;
  return <>{torso}
    <Segment x1={shoulderX} y1={shoulderY} x2={elbowX} y2={elbowY} style={active} />
    <Segment x1={elbowX} y1={elbowY} x2={handX} y2={handY} style={active} />
    <circle cx={elbowX} cy={elbowY} r="4" style={joint} />
    <path d={sideRaise ? 'M121 78 A34 34 0 0 1 151 105' : 'M112 77 A34 34 0 0 0 139 108'} style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function ChestPose({ angle }: { angle: number }) {
  const spread = Math.min(18, angle * 0.8);
  return <>
    <Head cy={38} /><path d="M77 81 Q100 72 123 81 L128 151 L72 151 Z" style={stroke} />
    <path d="M80 98 Q100 108 120 98 M80 105 Q100 115 120 105" style={{ ...active, strokeWidth: 3 }} />
    <Segment x1={78} y1={85} x2={48 - spread} y2={113} style={active} />
    <Segment x1={48 - spread} y1={113} x2={41 - spread} y2={143} style={active} />
    <Segment x1={122} y1={85} x2={152 + spread} y2={113} style={active} />
    <Segment x1={152 + spread} y1={113} x2={159 + spread} y2={143} style={active} />
    <path d={`M72 76 Q100 ${62 - spread / 3} 128 76`} style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function TwistPose({ angle }: { angle: number }) {
  const spin = Math.min(60, angle);
  return <>
    <path d="M63 154 L137 154 M76 154 L72 179 M124 154 L128 179" style={stroke} />
    <path d="M72 87 Q100 77 128 87 L126 142 Q100 151 74 142 Z" style={stroke} />
    <g transform={`rotate(${spin * 0.45} 100 105)`}>
      <path d="M72 93 Q100 80 128 93 L126 132 Q100 143 74 132 Z" style={active} />
      <Segment x1={81} y1={92} x2={119} y2={92} style={{ ...active, strokeWidth: 3 }} />
      <Segment x1={82} y1={100} x2={118} y2={100} style={{ ...active, strokeWidth: 3 }} />
      <Segment x1={80} y1={91} x2={98} y2={114} style={stroke} />
      <Segment x1={120} y1={91} x2={102} y2={114} style={stroke} />
    </g>
    <Head cy={46} />
    <path d="M65 81 Q100 64 135 81" style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function FoldPose({ id, angle }: { id: string; angle: number }) {
  if (id === 'hamstring-knee-extension') {
    const kneeX = 130;
    const kneeY = 127;
    const bend = angle * Math.PI / 180;
    const footX = kneeX + 42 * Math.cos(bend);
    const footY = kneeY + 42 * Math.sin(bend);
    return <>
      <path d="M45 137 L111 137 L111 115 L78 115 M50 137 L50 174 M108 137 L108 174" style={stroke} />
      <Head cx={77} cy={64} /><path d="M88 84 L101 112" style={stroke} />
      <Segment x1={101} y1={112} x2={kneeX} y2={kneeY} />
      <Segment x1={kneeX} y1={kneeY} x2={footX} y2={footY} style={active} />
      <circle cx={kneeX} cy={kneeY} r="4" style={joint} />
    </>;
  }
  const lean = Math.min(80, angle);
  const a = lean * Math.PI / 180;
  const hipX = 100;
  const hipY = id === 'back-flexion' ? 126 : 119;
  const torsoLength = 43;
  const shoulderX = hipX + Math.sin(a) * torsoLength;
  const shoulderY = hipY - Math.cos(a) * torsoLength;
  const headX = shoulderX + Math.sin(a) * 16;
  const headY = shoulderY - Math.cos(a) * 16;
  const handX = shoulderX + Math.sin(a) * 34;
  const handY = shoulderY + Math.cos(a) * 34;
  const seated = id === 'back-flexion';
  return <>
    {seated ? <path d="M45 137 L118 137 L118 126 L76 126 M50 137 L50 174 M114 137 L120 174" style={stroke} /> : <path d="M69 153 L131 153 M78 119 L76 153 M122 119 L124 153 M78 119 L122 119" style={stroke} />}
    <path d={`M${hipX} ${hipY} L${shoulderX} ${shoulderY}`} style={active} />
    <Head cx={headX} cy={headY} rotation={lean} />
    <Segment x1={shoulderX} y1={shoulderY} x2={handX} y2={handY} style={active} />
    {seated ? <path d={`M${hipX - 4} ${hipY} L${hipX + 20} ${hipY} L${hipX + 20} 137 M${hipX + 20} 137 L${hipX + 20} 163`} style={stroke} /> : <circle cx="100" cy={hipY} r="4" style={joint} />}
    <path d="M70 82 Q82 69 94 82" style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function LungePose({ id, angle }: { id: string; angle: number }) {
  if (id === 'hip-rotation') {
    const rad = angle * Math.PI / 180;
    const footX = 100 + Math.sin(rad) * 42;
    const footY = 145 + Math.cos(rad) * 20;
    return <>
      <path d="M53 153 L147 153 M64 153 L60 180 M136 153 L140 180" style={stroke} />
      <Head cy={40} /><path d="M78 82 Q100 72 122 82 L121 119 Q100 126 79 119 Z" style={stroke} />
      <Segment x1={82} y1={116} x2={100} y2={131} />
      <Segment x1={118} y1={116} x2={100} y2={131} />
      <Segment x1={100} y1={131} x2={footX} y2={footY} style={active} />
      <path d="M73 113 Q100 104 127 113" style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
    </>;
  }
  const stand = <><Head cy={39} /><path d="M78 81 Q100 72 122 81 L124 119 L76 119 Z" style={stroke} /><path d="M76 119 L78 154 M73 154 L85 154" style={stroke} /></>;
  if (id === 'hip-flexion') {
    const rad = angle * Math.PI / 180;
    const kneeX = 124 + Math.sin(rad) * 35;
    const kneeY = 119 + Math.cos(rad) * 35;
    return <>{stand}<Segment x1={124} y1={119} x2={kneeX} y2={kneeY} style={active} /><Segment x1={kneeX} y1={kneeY} x2={kneeX + 15} y2={kneeY + 25} style={active} /><path d="M147 77 L147 157 M141 157 L153 157" style={{ ...stroke, stroke: muted }} /></>;
  }
  if (id === 'hip-extension') {
    const rad = Math.min(40, angle) * Math.PI / 180;
    const kneeX = 124 - Math.sin(rad) * 20;
    const kneeY = 119 + Math.cos(rad) * 18;
    const ankleX = 124 - Math.sin(rad) * 35;
    const ankleY = 119 + Math.cos(rad) * 35;
    return <>{stand}<path d="M145 77 L145 157 M139 157 L151 157" style={{ ...stroke, stroke: muted }} /><Segment x1={124} y1={119} x2={kneeX} y2={kneeY} style={active} /><Segment x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} style={active} /><Segment x1={ankleX} y1={ankleY} x2={ankleX - 10} y2={ankleY + 2} style={active} /></>;
  }
  if (id === 'quad-knee-bend') {
    const rad = angle * Math.PI / 180;
    const kneeX = 124;
    const kneeY = 145;
    const footX = kneeX - Math.sin(rad) * 34;
    const footY = kneeY + Math.cos(rad) * 34;
    return <>{stand}<Segment x1={124} y1={119} x2={kneeX} y2={kneeY} style={active} /><Segment x1={kneeX} y1={kneeY} x2={footX} y2={footY} style={active} /><Segment x1={footX} y1={footY} x2={footX - 12} y2={footY + 2} style={active} /><circle cx={kneeX} cy={kneeY} r="4" style={joint} /><Segment x1={145} y1={77} x2={145} y2={158} style={{ ...stroke, stroke: muted }} /></>;
  }
  return stand;
}

function AnklePose({ angle }: { angle: number }) {
  const move = Math.min(40, angle) * 0.65;
  const kneeX = 117 + move;
  return <>
    <path d="M152 39 L152 165 M145 165 L159 165" style={{ ...stroke, stroke: muted }} />
    <path d="M40 157 L115 157 L150 157 M40 157 L40 164" style={stroke} />
    <Head cx={78} cy={42} />
    <path d="M86 63 L100 91" style={stroke} />
    <Segment x1={100} y1={91} x2={kneeX} y2={118} style={active} />
    <Segment x1={kneeX} y1={118} x2={117} y2={153} style={active} />
    <Segment x1={117} y1={153} x2={148} y2={153} style={active} />
    <circle cx={kneeX} cy={118} r="4" style={joint} />
    <path d={`M${kneeX + 3} 120 Q${139 + move / 2} 128 147 148`} style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
  </>;
}

function WristPose({ id, angle }: { id: string; angle: number }) {
  const sign = id === 'wrist-extension' ? -1 : 1;
  const radians = (angle * Math.PI) / 180;
  const handX = 113 + Math.cos(radians) * 43;
  const handY = 100 + sign * Math.sin(radians) * 40;
  return <>
    <path d="M32 96 L116 96 L116 108 L32 108 Z" fill="#e2e8f0" stroke={muted} strokeWidth="2" />
    <path d="M57 84 L118 84 L118 96 L57 96 Z" fill="#e2e8f0" stroke={muted} strokeWidth="2" />
    <Segment x1={47} y1={90} x2={113} y2={90} style={stroke} />
    <Segment x1={113} y1={90} x2={handX} y2={handY} style={active} />
    <path d={`M114 89 Q${132 + Math.cos(radians) * 14} 90 ${handX - 4} ${handY - sign * 6}`} style={{ ...active, strokeDasharray: '3 5', strokeWidth: 2 }} />
    <path d="M33 120 L157 120" style={{ ...stroke, stroke: muted, strokeWidth: 2 }} />
  </>;
}

export function Pose({ exercise, level, lang = 'en' }: Props) {
  const safeLevel = Math.max(0, Math.min(exercise.angles.length - 1, Math.round(level)));
  const angle = exercise.angles[safeLevel] ?? 0;
  let figure;
  if (exercise.id.startsWith('neck-')) figure = <NeckPose id={exercise.id} angle={angle} />;
  else if (exercise.id.startsWith('shoulder-')) figure = <ArmPose id={exercise.id} angle={angle} />;
  else if (exercise.id === 'chest-opener') figure = <ChestPose angle={angle} />;
  else if (exercise.id === 'thoracic-rotation') figure = <TwistPose angle={angle} />;
  else if (exercise.pose === 'fold') figure = <FoldPose id={exercise.id} angle={angle} />;
  else if (exercise.pose === 'lunge') figure = <LungePose id={exercise.id} angle={angle} />;
  else if (exercise.pose === 'ankle') figure = <AnklePose angle={angle} />;
  else figure = <WristPose id={exercise.id} angle={angle} />;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={lang === 'ru'
        ? `${exercise.name.ru}: уровень ${safeLevel + 1} из ${exercise.angles.length}`
        : `${exercise.name.en}: level ${safeLevel + 1} of ${exercise.angles.length}`}
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="198" height="198" rx="22" fill="#f8fafc" />
      <path d="M25 181 H175" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      {figure}
      <circle cx="175" cy="25" r="3" fill={accent} />
    </svg>
  );
}

export default Pose;
