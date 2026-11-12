export type Lang = 'en' | 'ru';
export type Group =
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'back'
  | 'hips'
  | 'hamstrings'
  | 'quads'
  | 'calves'
  | 'forearms';

export type Exercise = {
  id: string;
  name: Record<Lang, string>;
  group: Group;
  bilateral: boolean;
  instruction: Record<Lang, string>;
  caution: Record<Lang, string>;
  levels: Record<Lang, string[]>;
  pose: 'neck' | 'arm' | 'fold' | 'lunge' | 'ankle' | 'twist' | 'wrist';
  angles: number[];
};

const levels = (
  en: [string, string, string, string, string],
  ru: [string, string, string, string, string],
): Record<Lang, string[]> => ({ en, ru });

export const groupNames: Record<Group, Record<Lang, string>> = {
  neck: { en: 'Neck', ru: 'Шея' },
  shoulders: { en: 'Shoulders', ru: 'Плечи' },
  chest: { en: 'Chest', ru: 'Грудной отдел' },
  back: { en: 'Back', ru: 'Спина' },
  hips: { en: 'Hips', ru: 'Тазобедренные суставы' },
  hamstrings: { en: 'Hamstrings', ru: 'Задняя поверхность бедра' },
  quads: { en: 'Quadriceps', ru: 'Передняя поверхность бедра' },
  calves: { en: 'Calves', ru: 'Икры' },
  forearms: { en: 'Forearms and wrists', ru: 'Предплечья и запястья' },
};

// Angles are illustrative positions for the drawings, not target scores or
// clinical thresholds. Move only through a comfortable, controlled range.
export const exercises: Exercise[] = [
  {
    id: 'neck-flexion', name: { en: 'Neck nod', ru: 'Наклон головы вперёд' }, group: 'neck', bilateral: false,
    instruction: { en: 'Sit or stand tall. Gently lower your chin toward your chest, then return to neutral.', ru: 'Сядьте или встаньте прямо. Мягко опустите подбородок к груди и вернитесь в нейтральное положение.' },
    caution: { en: 'Do not pull on your head or round your upper back to gain range. Stop for pain, dizziness, or tingling.', ru: 'Не тяните голову руками и не округляйте верх спины ради большей амплитуды. Остановитесь при боли, головокружении или покалывании.' },
    levels: levels(['Chin stays near neutral', 'Small comfortable nod', 'Chin moves partway toward chest', 'Chin approaches chest comfortably', 'Comfortable chin-to-chest motion'], ['Голова почти в нейтральном положении', 'Небольшой комфортный наклон', 'Подбородок проходит часть пути к груди', 'Подбородок комфортно приближается к груди', 'Комфортное движение подбородка к груди']),
    pose: 'neck', angles: [0, 15, 30, 45, 60],
  },
  {
    id: 'neck-extension', name: { en: 'Look upward', ru: 'Взгляд вверх' }, group: 'neck', bilateral: false,
    instruction: { en: 'Keep your shoulders relaxed and slowly look upward, then return to neutral.', ru: 'Расслабьте плечи и медленно направьте взгляд вверх, затем вернитесь в нейтральное положение.' },
    caution: { en: 'Avoid forcing the neck or arching your back. Stop if you feel pain, dizziness, or visual symptoms.', ru: 'Не форсируйте движение шеей и не прогибайте спину. Остановитесь при боли, головокружении или нарушении зрения.' },
    levels: levels(['Gaze stays near level', 'Slight upward gaze', 'Moderate upward gaze', 'Clear upward gaze, comfortably', 'Further upward gaze, without strain'], ['Взгляд почти прямо', 'Небольшой взгляд вверх', 'Умеренный взгляд вверх', 'Явный, комфортный взгляд вверх', 'Более высокий взгляд без напряжения']),
    pose: 'neck', angles: [0, 10, 20, 30, 40],
  },
  {
    id: 'neck-rotation', name: { en: 'Turn the head', ru: 'Поворот головы' }, group: 'neck', bilateral: true,
    instruction: { en: 'Face forward and slowly turn your head to one side. Return to center and observe the other side.', ru: 'Смотрите прямо и медленно поверните голову в сторону. Вернитесь в центр и оцените другую сторону.' },
    caution: { en: 'Keep your shoulders facing forward; do not twist your trunk to add range. Stop if painful or dizzy.', ru: 'Оставляйте плечи направленными вперёд; не разворачивайте корпус, чтобы увеличить амплитуду. При боли или головокружении остановитесь.' },
    levels: levels(['Very small turn', 'Small comfortable turn', 'Moderate turn', 'Turn well toward the side', 'Comfortable turn while shoulders stay forward'], ['Очень небольшой поворот', 'Небольшой комфортный поворот', 'Умеренный поворот', 'Поворот в сторону заметно дальше', 'Комфортный поворот при неподвижных плечах']),
    pose: 'neck', angles: [0, 20, 40, 60, 80],
  },
  {
    id: 'shoulder-flexion', name: { en: 'Raise an arm overhead', ru: 'Подъём руки вверх' }, group: 'shoulders', bilateral: true,
    instruction: { en: 'With your thumb forward, slowly raise one straight arm in front and overhead as comfortable.', ru: 'Направив большой палец вперёд, медленно поднимите прямую руку перед собой и вверх в комфортном диапазоне.' },
    caution: { en: 'Do not lean sideways, arch your back, or shrug to lift higher. Stop for pain, numbness, or weakness.', ru: 'Не наклоняйтесь в сторону, не прогибайтесь и не поднимайте плечо к уху ради большей высоты. Остановитесь при боли, онемении или слабости.' },
    levels: levels(['Arm near your side', 'Arm lifts a little', 'Arm reaches around shoulder height', 'Arm rises above shoulder height', 'Arm reaches overhead without trunk lean'], ['Рука у туловища', 'Рука немного поднята', 'Рука примерно на уровне плеча', 'Рука выше уровня плеча', 'Рука поднята над головой без наклона корпуса']),
    pose: 'arm', angles: [0, 45, 90, 135, 180],
  },
  {
    id: 'shoulder-abduction', name: { en: 'Raise an arm to the side', ru: 'Подъём руки в сторону' }, group: 'shoulders', bilateral: true,
    instruction: { en: 'Slowly raise one straight arm out to the side, palm facing down, then lower it with control.', ru: 'Медленно поднимите прямую руку через сторону ладонью вниз, затем плавно опустите.' },
    caution: { en: 'Keep your trunk upright and shoulder relaxed. Do not force through pinching or pain.', ru: 'Держите корпус прямо, плечо расслабленным. Не продавливайте движение через защемление или боль.' },
    levels: levels(['Arm by your side', 'Small side lift', 'Arm around halfway to shoulder height', 'Arm near shoulder height', 'Arm above shoulder height, comfortably'], ['Рука опущена вдоль тела', 'Небольшой подъём в сторону', 'Рука примерно на полпути к уровню плеча', 'Рука почти на уровне плеча', 'Рука комфортно выше уровня плеча']),
    pose: 'arm', angles: [0, 30, 60, 90, 120],
  },
  {
    id: 'shoulder-external-rotation', name: { en: 'Rotate the shoulder outward', ru: 'Наружный поворот плеча' }, group: 'shoulders', bilateral: true,
    instruction: { en: 'Keep your elbow gently against your side, bent to 90°. Move your forearm outward without moving the elbow.', ru: 'Мягко прижмите согнутый под углом 90° локоть к боку. Отведите предплечье наружу, не двигая локтем.' },
    caution: { en: 'Keep the elbow in place and avoid twisting your trunk. Use a smaller range if the shoulder pinches.', ru: 'Не сдвигайте локоть и не разворачивайте корпус. Уменьшите амплитуду, если в плече возникает защемление.' },
    levels: levels(['Forearm points forward', 'Small outward turn', 'Moderate outward turn', 'Forearm turns well outward', 'Comfortable outward turn with elbow steady'], ['Предплечье направлено вперёд', 'Небольшой поворот наружу', 'Умеренный поворот наружу', 'Предплечье заметно повёрнуто наружу', 'Комфортный поворот наружу при неподвижном локте']),
    pose: 'arm', angles: [0, 20, 40, 60, 80],
  },
  {
    id: 'chest-opener', name: { en: 'Open the chest', ru: 'Раскрытие грудного отдела' }, group: 'chest', bilateral: false,
    instruction: { en: 'Stand tall with arms relaxed. Gently draw your shoulder blades toward each other and release.', ru: 'Встаньте прямо, руки свободно опущены. Мягко сведите лопатки и расслабьтесь.' },
    caution: { en: 'Keep ribs over hips; avoid pushing your ribs forward or arching your lower back.', ru: 'Держите рёбра над тазом; не выпячивайте их вперёд и не прогибайте поясницу.' },
    levels: levels(['Shoulders remain relaxed', 'Very slight shoulder-blade movement', 'Visible gentle draw-back', 'Shoulder blades draw back comfortably', 'Full comfortable draw-back without back arch'], ['Плечи расслаблены', 'Едва заметное движение лопаток', 'Мягкое сведение заметно', 'Лопатки комфортно сведены', 'Полное комфортное сведение без прогиба спины']),
    pose: 'twist', angles: [0, 5, 10, 15, 20],
  },
  {
    id: 'thoracic-rotation', name: { en: 'Seated upper-back turn', ru: 'Поворот грудного отдела сидя' }, group: 'back', bilateral: true,
    instruction: { en: 'Sit tall with feet planted and arms crossed. Slowly turn your chest to one side, then repeat the other way.', ru: 'Сядьте прямо, поставьте стопы на пол и скрестите руки. Медленно поверните грудную клетку в сторону, затем повторите в другую.' },
    caution: { en: 'Keep your pelvis and knees facing forward. Do not force the turn or use momentum.', ru: 'Оставляйте таз и колени направленными вперёд. Не форсируйте поворот и не используйте инерцию.' },
    levels: levels(['Chest nearly faces forward', 'Small comfortable turn', 'Moderate turn', 'Chest turns clearly to the side', 'Comfortable turn with pelvis facing forward'], ['Грудная клетка почти направлена вперёд', 'Небольшой комфортный поворот', 'Умеренный поворот', 'Грудная клетка заметно развёрнута в сторону', 'Комфортный поворот при тазе, направленном вперёд']),
    pose: 'twist', angles: [0, 15, 30, 45, 60],
  },
  {
    id: 'back-flexion', name: { en: 'Gentle seated forward reach', ru: 'Мягкий наклон вперёд сидя' }, group: 'back', bilateral: false,
    instruction: { en: 'Sit with feet down. Hinge gently at your hips and reach your hands toward your knees, then sit tall.', ru: 'Сядьте, поставив стопы на пол. Мягко наклонитесь от тазобедренных суставов, направляя руки к коленям, затем выпрямитесь.' },
    caution: { en: 'Use a small range and keep the movement comfortable. Do not bounce or push into back pain.', ru: 'Используйте небольшую комфортную амплитуду. Не пружиньте и не продолжайте движение через боль в спине.' },
    levels: levels(['Torso upright', 'Small forward hinge', 'Torso inclines partway', 'Clear forward hinge, comfortably', 'Further comfortable hinge with steady control'], ['Корпус вертикален', 'Небольшой наклон от таза', 'Корпус наклонён примерно наполовину', 'Заметный комфортный наклон от таза', 'Более глубокий наклон с контролем']),
    pose: 'fold', angles: [0, 15, 30, 45, 60],
  },
  {
    id: 'hip-flexion', name: { en: 'Lift a knee', ru: 'Подъём колена' }, group: 'hips', bilateral: true,
    instruction: { en: 'Stand near a stable support. Slowly lift one bent knee in front, keeping your trunk upright.', ru: 'Встаньте рядом с устойчивой опорой. Медленно поднимите согнутое колено перед собой, сохраняя корпус прямым.' },
    caution: { en: 'Do not lean back or hike the opposite hip. Hold support for balance; stop if painful.', ru: 'Не отклоняйтесь назад и не поднимайте противоположную сторону таза. При необходимости держитесь за опору; при боли остановитесь.' },
    levels: levels(['Knee stays low', 'Small knee lift', 'Knee lifts partway toward hip height', 'Knee approaches hip height', 'Comfortable lift above hip height, trunk steady'], ['Колено поднято невысоко', 'Небольшой подъём колена', 'Колено поднято примерно на полпути к уровню таза', 'Колено приближается к уровню таза', 'Комфортный подъём выше таза при ровном корпусе']),
    pose: 'lunge', angles: [0, 30, 60, 90, 110],
  },
  {
    id: 'hip-extension', name: { en: 'Move a leg backward', ru: 'Отведение ноги назад' }, group: 'hips', bilateral: true,
    instruction: { en: 'Hold a stable support. Keeping your knee straight, move one leg a little backward without leaning forward.', ru: 'Держитесь за устойчивую опору. С прямым коленом немного отведите ногу назад, не наклоняясь вперёд.' },
    caution: { en: 'Keep your lower back neutral; do not arch to move the leg farther. Stop if you feel pain.', ru: 'Сохраняйте поясницу в нейтральном положении; не прогибайтесь ради большей амплитуды. При боли остановитесь.' },
    levels: levels(['Leg stays under hip', 'Small backward movement', 'Moderate backward movement', 'Leg moves clearly behind hip', 'Comfortable backward reach with trunk upright'], ['Нога под тазом', 'Небольшое движение назад', 'Умеренное движение назад', 'Нога заметно отведена за таз', 'Комфортное отведение при прямом корпусе']),
    pose: 'lunge', angles: [0, 10, 20, 30, 40],
  },
  {
    id: 'hip-rotation', name: { en: 'Hip rotation seated', ru: 'Поворот бедра сидя' }, group: 'hips', bilateral: true,
    instruction: { en: 'Sit with knees bent and feet down. Keeping the thigh still, gently move the lower leg inward and outward.', ru: 'Сядьте, согнув колени и поставив стопы. Не двигая бедром, мягко перемещайте голень внутрь и наружу.' },
    caution: { en: 'Keep the movement easy and do not press the knee. Stop if the hip or knee hurts.', ru: 'Двигайтесь без усилия и не надавливайте на колено. Остановитесь, если болит тазобедренный сустав или колено.' },
    levels: levels(['Lower leg stays near center', 'Small inward/outward movement', 'Moderate movement', 'Clear movement each way', 'Comfortable movement while thigh stays still'], ['Голень почти неподвижна', 'Небольшое движение внутрь и наружу', 'Умеренное движение', 'Заметное движение в обе стороны', 'Комфортное движение при неподвижном бедре']),
    pose: 'lunge', angles: [0, 15, 30, 45, 60],
  },
  {
    id: 'hamstring-hinge', name: { en: 'Standing hip hinge', ru: 'Наклон от таза стоя' }, group: 'hamstrings', bilateral: false,
    instruction: { en: 'Stand with soft knees. Push your hips back and tip your torso forward while keeping your back comfortable.', ru: 'Встаньте, слегка согнув колени. Отведите таз назад и наклоните корпус вперёд, сохраняя спину в комфортном положении.' },
    caution: { en: 'Do not lock your knees or round to reach lower. Stop before stretching becomes painful.', ru: 'Не блокируйте колени и не округляйте спину, чтобы наклониться ниже. Остановитесь до появления боли от растяжения.' },
    levels: levels(['Torso upright', 'Small hip hinge', 'Torso midway toward horizontal', 'Deep comfortable hinge', 'Further comfortable hinge with knees soft'], ['Корпус вертикален', 'Небольшой наклон от таза', 'Корпус наклонён примерно наполовину', 'Глубокий комфортный наклон', 'Более глубокий наклон с мягкими коленями']),
    pose: 'fold', angles: [0, 20, 40, 60, 80],
  },
  {
    id: 'hamstring-knee-extension', name: { en: 'Seated knee straighten', ru: 'Разгибание колена сидя' }, group: 'hamstrings', bilateral: true,
    instruction: { en: 'Sit upright and slowly straighten one knee until you feel a mild stretch, then bend it again.', ru: 'Сядьте прямо и медленно разогните одно колено до лёгкого ощущения натяжения, затем снова согните.' },
    caution: { en: 'Keep your back upright and ankle relaxed. A stretch is enough; do not force the knee straight.', ru: 'Держите спину прямо, стопу расслабленной. Достаточно лёгкого натяжения; не выпрямляйте колено силой.' },
    levels: levels(['Knee remains comfortably bent', 'Small amount of straightening', 'Knee straightens partway', 'Knee nearly straight', 'Comfortable straightening without leaning back'], ['Колено комфортно согнуто', 'Небольшое разгибание', 'Колено разогнуто примерно наполовину', 'Колено почти прямое', 'Комфортное разгибание без отклонения назад']),
    pose: 'fold', angles: [90, 70, 50, 25, 0],
  },
  {
    id: 'quad-knee-bend', name: { en: 'Bend the knee standing', ru: 'Сгибание колена стоя' }, group: 'quads', bilateral: true,
    instruction: { en: 'Hold a stable support and bend one knee, bringing the heel gently backward. Keep your thighs close.', ru: 'Держитесь за устойчивую опору и согните одно колено, мягко направляя пятку назад. Держите бёдра рядом.' },
    caution: { en: 'Do not pull the foot or arch your lower back. Stop if the knee feels painful or unstable.', ru: 'Не тяните стопу руками и не прогибайте поясницу. Остановитесь, если колено болит или кажется нестабильным.' },
    levels: levels(['Knee nearly straight', 'Small comfortable bend', 'Moderate bend', 'Heel moves well backward', 'Comfortable bend with trunk upright'], ['Колено почти прямое', 'Небольшое комфортное сгибание', 'Умеренное сгибание', 'Пятка заметно приближается назад', 'Комфортное сгибание при прямом корпусе']),
    pose: 'lunge', angles: [0, 30, 60, 90, 120],
  },
  {
    id: 'ankle-dorsiflexion', name: { en: 'Knee toward wall', ru: 'Колено к стене' }, group: 'calves', bilateral: true,
    instruction: { en: 'Face a wall with one foot forward. Keep the heel down and gently move your knee toward the wall over your toes.', ru: 'Встаньте лицом к стене, выставив одну стопу вперёд. Не отрывая пятку, мягко направьте колено к стене над пальцами стопы.' },
    caution: { en: 'Keep the heel grounded and knee tracking over the middle toes. Do not force through ankle pain.', ru: 'Не отрывайте пятку, направляйте колено по линии средних пальцев стопы. Не продавливайте движение через боль в голеностопе.' },
    levels: levels(['Knee moves very little forward', 'Small forward knee travel', 'Moderate travel with heel down', 'Knee approaches wall comfortably', 'Further comfortable travel with heel grounded'], ['Колено почти не движется вперёд', 'Небольшое движение колена вперёд', 'Умеренное движение при пятке на полу', 'Колено комфортно приближается к стене', 'Более дальнее движение при пятке на полу']),
    pose: 'ankle', angles: [0, 10, 20, 30, 40],
  },
  {
    id: 'wrist-extension', name: { en: 'Wrist bend back', ru: 'Разгибание запястья' }, group: 'forearms', bilateral: true,
    instruction: { en: 'Rest your forearm on a table, palm down and hand beyond the edge. Gently lift the back of your hand.', ru: 'Положите предплечье на стол ладонью вниз, оставив кисть за краем. Мягко поднимите тыльную сторону кисти.' },
    caution: { en: 'Keep your forearm still and fingers relaxed. Do not push the hand with your other hand.', ru: 'Не двигайте предплечьем и расслабьте пальцы. Не помогайте другой рукой.' },
    levels: levels(['Hand stays near forearm line', 'Small wrist lift', 'Moderate wrist lift', 'Hand lifts clearly', 'Comfortable lift with forearm still'], ['Кисть почти на линии предплечья', 'Небольшой подъём кисти', 'Умеренный подъём кисти', 'Кисть заметно поднята', 'Комфортный подъём при неподвижном предплечье']),
    pose: 'wrist', angles: [0, 15, 30, 45, 60],
  },
  {
    id: 'wrist-flexion', name: { en: 'Wrist bend forward', ru: 'Сгибание запястья' }, group: 'forearms', bilateral: true,
    instruction: { en: 'Rest your forearm on a table, palm down and hand beyond the edge. Gently lower your palm toward the floor.', ru: 'Положите предплечье на стол ладонью вниз, оставив кисть за краем. Мягко опустите ладонь к полу.' },
    caution: { en: 'Keep your forearm still and fingers relaxed. Move only within a comfortable range.', ru: 'Не двигайте предплечьем и расслабьте пальцы. Двигайтесь только в комфортном диапазоне.' },
    levels: levels(['Hand stays near forearm line', 'Small wrist bend', 'Moderate wrist bend', 'Hand lowers clearly', 'Comfortable bend with forearm still'], ['Кисть почти на линии предплечья', 'Небольшое сгибание кисти', 'Умеренное сгибание кисти', 'Кисть заметно опущена', 'Комфортное сгибание при неподвижном предплечье']),
    pose: 'wrist', angles: [0, 15, 30, 45, 60],
  },
];
