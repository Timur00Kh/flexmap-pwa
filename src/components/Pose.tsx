import type { Exercise, Lang } from '../lib/exercises';

type Props = { exercise: Exercise; level: number; lang?: Lang };

/** Five local, equally sized reference frames; the range control chooses one. */
export function Pose({ exercise, level, lang = 'en' }: Props) {
  const safeLevel = Math.max(0, Math.min(exercise.angles.length - 1, Math.round(Number.isFinite(level) ? level : 0)));
  const description = exercise.levels[lang][safeLevel];
  const label = lang === 'ru'
    ? `${exercise.name.ru}: уровень ${safeLevel + 1} из ${exercise.angles.length}. ${description}`
    : `${exercise.name.en}: level ${safeLevel + 1} of ${exercise.angles.length}. ${description}`;

  return (
    <div
      role="img"
      aria-label={label}
      className="pose-illustration"
      style={{
        backgroundColor: '#fff',
        backgroundImage: `url("/flexmap-pwa/exercises/${exercise.id}.webp")`,
        backgroundSize: '500% 100%',
        backgroundPosition: `${safeLevel * 25}% center`,
        backgroundRepeat: 'no-repeat',
        aspectRatio: '1',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: 'inherit',
      }}
    />
  );
}

export default Pose;
