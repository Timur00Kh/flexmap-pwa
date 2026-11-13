"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Globe2,
  LockKeyhole,
  Moon,
  Settings2,
  ShieldCheck,
  Sun,
  Upload,
  X,
} from "lucide-react";
import {
  getExercises,
  groupNames,
  type Exercise,
  type Group,
  type Lang,
} from "@/lib/exercises";
import {
  latestResults,
  summarize,
  useStore,
  validateImport,
  type Result,
} from "@/lib/store";
import { messages } from "@/lib/i18n";
import Pwa from "./Pwa";
import Pose from "./Pose";

const Anatomy = dynamic(() => import("./Anatomy"), {
  ssr: false,
  loading: () => (
    <div className="model-loading">
      <Activity size={28} />
    </div>
  ),
});
type Tab = "tests" | "map" | "history" | "settings";
const groups = Object.keys(groupNames) as Group[];

function tone(score: number | undefined) {
  return score === undefined
    ? "gray"
    : score < 35
      ? "red"
      : score < 70
        ? "amber"
        : "green";
}

function isComplete(exercise: Exercise, results: Result[]) {
  const latest = latestResults(results).filter(
    (result) =>
      result.exerciseId === exercise.id &&
      !result.stopped &&
      result.level !== null,
  );
  return exercise.bilateral
    ? latest.some((result) => result.side === "left") &&
        latest.some((result) => result.side === "right")
    : latest.length > 0;
}

export default function App({ initialLang }: { initialLang?: Lang }) {
  const store = useStore();
  const { lang, dark, results, mode } = store;
  const t = messages[lang];
  const [tab, setTab] = useState<Tab>("tests");
  const [group, setGroup] = useState<Group | null>(null);
  const [catalogGroup, setCatalogGroup] = useState<Group | "">("");
  const [active, setActive] = useState<Exercise | null>(null);
  const [remaining, setRemaining] = useState<Exercise[]>([]);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void useStore.getState().init(initialLang);
  }, [initialLang]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "ru"
        ? "FlexMap · Карта вашей подвижности"
        : "FlexMap · Your movement, mapped";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [lang, dark]);
  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );

  const catalog = getExercises(mode);
  const stretching = mode === "stretching";
  const firstExercise =
    catalog.find(
      (exercise) =>
        exercise.id ===
        (stretching ? "standing-forward-fold" : "shoulder-flexion"),
    ) ?? catalog[0];
  const guidedExercises = [
    firstExercise,
    ...catalog.filter((exercise) => exercise !== firstExercise),
  ];
  const currentResults = results.filter((result) =>
    catalog.some((exercise) => exercise.id === result.exerciseId),
  );
  const hasResults = currentResults.length > 0;
  const modeGroups = groups.filter((value) =>
    catalog.some((exercise) => exercise.group === value),
  );
  const stats = summarize(results, catalog);
  const recent = [...currentResults].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const latestScored = recent.find(
    (result) => !result.stopped && result.level !== null,
  );
  const suggested =
    guidedExercises.find((exercise) => !isComplete(exercise, currentResults)) ??
    firstExercise;
  const completedChecks = catalog.filter((exercise) =>
    isComplete(exercise, currentResults),
  ).length;
  const heroTitle = stretching
    ? hasResults
      ? t.stretchReturnTitle
      : t.stretchWelcome
    : hasResults
      ? t.keepMoving
      : t.welcome;
  const heroDescription = stretching
    ? hasResults
      ? t.stretchReturnText
      : t.stretchWelcomeText
    : hasResults
      ? t.returnText
      : t.welcomeText;

  function notify(value: string) {
    setNotice(value);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4500);
  }
  function open(exercise: Exercise) {
    store.onboard();
    const index = guidedExercises.findIndex((item) => item.id === exercise.id);
    setRemaining(
      [
        ...guidedExercises.slice(index + 1),
        ...guidedExercises.slice(0, index),
      ].filter((item) => !isComplete(item, results)),
    );
    setActive(exercise);
  }
  function showMap() {
    setActive(null);
    setRemaining([]);
    setTab("map");
    setGroup(active?.group ?? null);
  }
  function advance() {
    const next = remaining[0];
    if (next) {
      setRemaining((items) => items.slice(1));
      setActive(next);
    } else {
      showMap();
    }
  }
  function changeLang(value: Lang) {
    store.setLang(value);
    window.history.replaceState(null, "", `/flexmap-pwa/${value}/`);
  }
  function exportData() {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), results },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flexmap-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importData(file: File | undefined) {
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw Error("size");
      await store.importData(validateImport(JSON.parse(await file.text())));
      notify(t.imported);
    } catch {
      notify(t.invalid);
    }
    if (fileRef.current) fileRef.current.value = "";
  }
  function date(value: string) {
    return new Intl.DateTimeFormat(lang, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  }

  if (!store.ready)
    return (
      <div className="loading">
        <Activity />
        <span>{t.loading}</span>
      </div>
    );

  return (
    <div className="app-shell">
      <div className="workspace" inert={!!active}>
        <header className="topbar">
          <a
            href={`/flexmap-pwa/${lang}/`}
            className="brand"
            aria-label="FlexMap"
          >
            <span className="brand-symbol">
              <Activity size={21} strokeWidth={1.7} />
            </span>
            flexmap<span className="brand-dot">®</span>
          </a>
          <nav className="primary-nav" aria-label={t.navigation}>
            <button
              className={tab === "tests" ? "active" : ""}
              aria-current={tab === "tests" ? "page" : undefined}
              onClick={() => setTab("tests")}
            >
              {t.tests}
            </button>
            <button
              className={tab === "map" || tab === "history" ? "active" : ""}
              aria-current={tab === "map" ? "page" : undefined}
              onClick={() => setTab("map")}
            >
              {t.map}
            </button>
          </nav>
          <button
            className={`settings-link ${tab === "settings" ? "active" : ""}`}
            onClick={() => setTab("settings")}
            aria-label={t.settings}
          >
            <Settings2 size={18} />
            <span>{t.settings}</span>
          </button>
        </header>

        <main className="main-content">
          {tab !== "settings" && (
            <section className="mode-context" aria-label={t.practiceMode}>
              <div
                className="mode-switch"
                role="group"
                aria-label={t.practiceMode}
              >
                {(["stretching", "basic"] as const).map((value) => (
                  <button
                    key={value}
                    aria-pressed={mode === value}
                    className={mode === value ? "selected" : ""}
                    onClick={() => {
                      store.setMode(value);
                      setGroup(null);
                      setCatalogGroup("");
                    }}
                  >
                    {value === "stretching" ? t.stretchingMode : t.basicMode}
                  </button>
                ))}
              </div>
              <p>{stretching ? t.stretchModeHint : t.basicModeHint}</p>
            </section>
          )}
          {store.error && (
            <div className="safety storage-error" role="alert">
              <ShieldCheck size={18} />
              <p>{t.storageError}</p>
            </div>
          )}

          {tab === "tests" && (
            <>
              <section className="check-hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    {stretching
                      ? t.stretchKicker
                      : hasResults
                        ? t.yourPace
                        : t.welcomeKicker}
                  </div>
                  <h1>{heroTitle}</h1>
                  <p className="hero-description">{heroDescription}</p>
                  <div className="suggested-check">
                    <span>{hasResults ? t.nextCheck : t.firstCheck}</span>
                    <h2>{suggested.name[lang]}</h2>
                    <p>
                      {t.minutes} <span aria-hidden="true">·</span>{" "}
                      {suggested.bilateral ? t.twoSides : t.both}
                    </p>
                  </div>
                  <button
                    className="button primary hero-action"
                    onClick={() => open(suggested)}
                  >
                    {stretching
                      ? t.startPractice
                      : hasResults
                        ? t.continue
                        : t.start}
                    <ArrowRight size={18} />
                  </button>
                  <p className="hero-footnote">
                    <LockKeyhole size={14} />
                    {t.privateNote}
                  </p>
                  {!hasResults && (
                    <button
                      className="text-button preview-link"
                      onClick={() => setTab("map")}
                    >
                      {t.previewMap}
                      <ArrowRight size={15} />
                    </button>
                  )}
                  {hasResults && (
                    <p className="quiet-progress">
                      {completedChecks} / {catalog.length} {t.completedChecks}
                    </p>
                  )}
                </div>
                <div className="hero-visual" aria-hidden="true">
                  <span className="visual-orbit" />
                  <Pose exercise={suggested} level={3} lang={lang} />
                  <span className="visual-caption">
                    {groupNames[suggested.group][lang]}
                    <span>01—18</span>
                  </span>
                </div>
              </section>
              <div className="gentle-note">
                <ShieldCheck size={17} />
                <p>{stretching ? t.stretchSafety : t.gentleNote}</p>
              </div>
              <details className="catalog">
                <summary>
                  <div>
                    <h2>{t.catalog}</h2>
                    <p>{stretching ? t.stretchCatalogHint : t.catalogHint}</p>
                  </div>
                  <ChevronDown size={20} />
                </summary>
                <div className="catalog-content">
                  <label className="area-filter">
                    <span>{t.area}</span>
                    <select
                      value={catalogGroup}
                      onChange={(event) =>
                        setCatalogGroup(event.target.value as Group | "")
                      }
                    >
                      <option value="">{t.all}</option>
                      {modeGroups.map((value) => (
                        <option key={value} value={value}>
                          {groupNames[value][lang]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="exercise-grid">
                    {catalog
                      .filter(
                        (exercise) =>
                          !catalogGroup || exercise.group === catalogGroup,
                      )
                      .map((exercise) => (
                        <button
                          className="exercise-card"
                          key={exercise.id}
                          onClick={() => open(exercise)}
                        >
                          <div className="exercise-art">
                            <Pose exercise={exercise} level={3} lang={lang} />
                            {isComplete(exercise, results) && (
                              <span
                                className="checked-badge"
                                aria-label={t.checked}
                              >
                                <Check size={13} />
                              </span>
                            )}
                          </div>
                          <div className="exercise-card-body">
                            <small>{groupNames[exercise.group][lang]}</small>
                            <h3>{exercise.name[lang]}</h3>
                            <span>
                              {exercise.bilateral ? t.twoSides : t.both}
                              <ArrowRight size={16} />
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </details>
            </>
          )}

          {tab === "map" && (
            <>
              <section className="page-heading map-heading">
                <div>
                  <div className="eyebrow">{t.overview}</div>
                  <h1>{stretching ? t.stretchMapTitle : t.title}</h1>
                  <p>
                    {stretching
                      ? t.stretchMapIntro
                      : hasResults
                        ? t.mapIntro
                        : t.emptyText}
                  </p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setTab("history")}
                >
                  <Clock3 size={16} />
                  {t.history}
                  <ArrowRight size={16} />
                </button>
              </section>
              <div className="map-summary">
                <span>
                  <b>{stats.count}</b> / {stats.total} {t.completed}
                </span>
                <span className="range-summary">
                  {stretching ? t.latestRange : t.mobility}{" "}
                  <b>
                    {stretching
                      ? latestScored
                        ? `${t.level} ${latestScored.level! + 1}`
                        : "—"
                      : (stats.average ?? "—")}
                  </b>
                  <small>
                    {stretching
                      ? latestScored
                        ? ` / 5 · ${catalog.find((exercise) => exercise.id === latestScored.exerciseId)?.name[lang]}`
                        : ""
                      : " / 100"}
                  </small>
                </span>
                <span className="summary-coverage">
                  {stats.coverage}% {t.coverage.toLowerCase()}
                </span>
              </div>
              <section className={`map-layout ${group ? "has-selection" : ""}`}>
                <article className="body-panel">
                  <div className="model-topline">
                    <span>{t.model}</span>
                    <span>{t.interactive}</span>
                  </div>
                  <div className="anatomy-wrap">
                    <Anatomy
                      scores={stats.scores}
                      selected={group}
                      onSelect={setGroup}
                      lang={lang}
                    />
                  </div>
                  <p className="model-hint">{t.modelHint}</p>
                  <div className="heat-legend">
                    {(["gray", "red", "amber", "green"] as const).map(
                      (color, index) => (
                        <span key={color}>
                          <i className={color} />
                          {[t.untested, t.limited, t.moderate, t.free][index]}
                        </span>
                      ),
                    )}
                  </div>
                  <p className="model-caption">{t.modelNote}</p>
                </article>
                {group && (
                  <aside className="detail-panel">
                    <div className="panel-header">
                      <div className="eyebrow">{t.selectedArea}</div>
                      <button
                        className="icon-button"
                        onClick={() => setGroup(null)}
                        aria-label={t.close}
                      >
                        <X size={17} />
                      </button>
                    </div>
                    <h2>{groupNames[group][lang]}</h2>
                    <div
                      className={`group-score ${stretching ? "is-range" : ""} ${tone(stats.scores[group])}`}
                    >
                      {stretching
                        ? stats.scores[group] === undefined
                          ? t.untested
                          : stats.scores[group]! < 35
                            ? t.limited
                            : stats.scores[group]! < 70
                              ? t.moderate
                              : t.free
                        : (stats.scores[group] ?? "—")}
                      {!stretching && <small>/ 100</small>}
                    </div>
                    <p className="muted">
                      {stretching ? t.stretchGroupNote : t.groupScoreNote}
                    </p>
                    <h3>{stretching ? t.stretches : t.checks}</h3>
                    {!catalog.some((exercise) => exercise.group === group) && (
                      <p className="muted">{t.noChecksInMode}</p>
                    )}
                    {catalog
                      .filter((exercise) => exercise.group === group)
                      .map((exercise) => (
                        <button
                          className="related-check"
                          key={exercise.id}
                          onClick={() => open(exercise)}
                        >
                          {exercise.name[lang]}
                          <ArrowRight size={16} />
                        </button>
                      ))}
                  </aside>
                )}
              </section>
              <div className="map-bottom">
                <p>
                  <span className="tiny-dot" />
                  {t.select}
                </p>
                <label className="area-filter">
                  <span>{t.findArea}</span>
                  <select
                    value={group ?? ""}
                    onChange={(event) =>
                      setGroup((event.target.value as Group) || null)
                    }
                  >
                    <option value="">{t.chooseArea}</option>
                    {modeGroups.map((value) => (
                      <option key={value} value={value}>
                        {groupNames[value][lang]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {!hasResults && (
                <div className="map-start">
                  <p>{t.mapStart}</p>
                  <button
                    className="button primary"
                    onClick={() => open(firstExercise)}
                  >
                    {t.start}
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}
            </>
          )}

          {tab === "history" && (
            <>
              <button
                className="text-button back-link"
                onClick={() => setTab("map")}
              >
                <ArrowLeft size={16} />
                {t.map}
              </button>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">{t.yourPace}</div>
                  <h1>{t.history}</h1>
                  <p>{stretching ? t.stretchCompare : t.compare}</p>
                </div>
              </section>
              <section className="history-panel">
                {recent.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>{t.movement}</th>
                          <th>{t.date}</th>
                          <th>{stretching ? t.range : t.score}</th>
                          <th>{t.change}</th>
                          <th>
                            <span className="sr-only">{t.retake}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((result) => {
                          const exercise = catalog.find(
                            (value) => value.id === result.exerciseId,
                          )!;
                          const previous = recent.find(
                            (value) =>
                              value.exerciseId === result.exerciseId &&
                              value.side === result.side &&
                              value.date < result.date &&
                              !value.stopped &&
                              value.level !== null,
                          );
                          const change =
                            previous && result.level !== null
                              ? (result.level - previous.level!) *
                                (stretching ? 1 : 25)
                              : null;
                          return (
                            <tr key={result.id}>
                              <td>
                                <strong>{exercise.name[lang]}</strong>
                                <small>{t[result.side]}</small>
                              </td>
                              <td>{date(result.date)}</td>
                              <td>
                                {result.stopped
                                  ? t.stoppedShort
                                  : stretching
                                    ? `${t.level} ${result.level! + 1} / 5`
                                    : result.level! * 25}
                              </td>
                              <td>
                                {change === null
                                  ? "—"
                                  : `${change > 0 ? "+" : ""}${change}`}
                              </td>
                              <td>
                                <button
                                  className="text-button"
                                  onClick={() => open(exercise)}
                                >
                                  {t.retake}
                                  <ArrowRight size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <Clock3 size={30} strokeWidth={1.3} />
                    <h2>{t.noHistory}</h2>
                    <button
                      className="button primary"
                      onClick={() => open(firstExercise)}
                    >
                      {t.start}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {tab === "settings" && (
            <>
              <button
                className="text-button back-link"
                onClick={() => setTab(hasResults ? "map" : "tests")}
              >
                <ArrowLeft size={16} />
                {t.back}
              </button>
              <section className="page-heading">
                <div>
                  <h1>{t.settings}</h1>
                  <p>{t.settingsIntro}</p>
                </div>
              </section>
              <div className="settings-layout">
                <section className="settings-card">
                  <div className="setting-row">
                    <div>
                      <Globe2 size={19} />
                      <h2>{t.language}</h2>
                    </div>
                    <div className="segmented">
                      {(["en", "ru"] as const).map((value) => (
                        <button
                          key={value}
                          aria-pressed={lang === value}
                          className={lang === value ? "selected" : ""}
                          onClick={() => changeLang(value)}
                        >
                          {value === "en" ? "English" : "Русский"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="setting-row">
                    <div>
                      {dark ? <Moon size={19} /> : <Sun size={19} />}
                      <h2>{t.appearance}</h2>
                    </div>
                    <button
                      className="button outline"
                      onClick={store.toggleTheme}
                    >
                      {dark ? t.light : t.dark}
                    </button>
                  </div>
                </section>
                <section className="settings-card data-card">
                  <LockKeyhole size={20} />
                  <h2>{t.data}</h2>
                  <p>{t.dataText}</p>
                  <div className="data-actions">
                    <button className="button outline" onClick={exportData}>
                      <ArrowDownToLine size={16} />
                      {t.export}
                    </button>
                    <button
                      className="button outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload size={16} />
                      {t.import}
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/json,.json"
                      hidden
                      onChange={(event) =>
                        void importData(event.target.files?.[0])
                      }
                    />
                  </div>
                  <button
                    className="danger-button"
                    onClick={() => {
                      if (confirm(t.deleteConfirm))
                        void store.clear().catch(() => notify(t.storageError));
                    }}
                  >
                    {t.delete}
                  </button>
                </section>
              </div>
              <details className="method">
                <summary>
                  <ShieldCheck size={17} />
                  {t.method}
                  <ChevronDown size={16} />
                </summary>
                <p>{t.methodText}</p>
                <p>{t.modeMethod}</p>
                <p>{t.uncertainty}</p>
                <a
                  href="https://www.nhs.uk/live-well/exercise/flexibility-exercises/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.references} · NHS ↗
                </a>
              </details>
            </>
          )}
          <footer>
            <span>{stretching ? t.stretchDisclaimer : t.disclaimer}</span>
            <Pwa lang={lang} />
          </footer>
        </main>
      </div>
      {notice && (
        <div
          className={`toast ${active ? "toast-in-dialog" : ""}`}
          role="status"
        >
          <CheckCheck size={18} />
          {notice}
        </div>
      )}
      {active && (
        <CheckDialog
          key={active.id}
          exercise={active}
          lang={lang}
          nextExercise={remaining[0] ?? null}
          onClose={() => setActive(null)}
          onSaved={notify}
          onNext={advance}
          onMap={showMap}
        />
      )}
    </div>
  );
}

function CheckDialog({
  exercise,
  lang,
  nextExercise,
  onClose,
  onSaved,
  onNext,
  onMap,
}: {
  exercise: Exercise;
  lang: Lang;
  nextExercise: Exercise | null;
  onClose: () => void;
  onSaved: (message: string) => void;
  onNext: () => void;
  onMap: () => void;
}) {
  const t = messages[lang];
  const [side, setSide] = useState<Result["side"]>(() => {
    if (!exercise.bilateral) return "both";
    const latest = latestResults(useStore.getState().results).filter(
      (result) =>
        result.exerciseId === exercise.id &&
        !result.stopped &&
        result.level !== null,
    );
    return latest.some((result) => result.side === "left") &&
      !latest.some((result) => result.side === "right")
      ? "right"
      : "left";
  });
  const [level, setLevel] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [sideNotice, setSideNotice] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input, summary, a[href], [tabindex="0"]',
      );
      const visible = Array.from(elements ?? []).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (!visible.length) return;
      const first = visible[0],
        last = visible[visible.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);

  async function save(stopped: boolean) {
    if (busy || (!stopped && level === null)) return;
    setBusy(true);
    try {
      await useStore.getState().save({
        exerciseId: exercise.id,
        side,
        level: stopped ? null : level,
        stopped,
      });
      if (!stopped && exercise.bilateral && side === "left") {
        setSide("right");
        setLevel(null);
        setSideNotice(true);
        dialogRef.current?.focus();
        dialogRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        onSaved(stopped ? t.stopped : t.saved);
        if (stopped) onClose();
        else onNext();
      }
    } catch {
      onSaved(t.storageError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <section
        ref={dialogRef}
        tabIndex={-1}
        className="check-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="check-title"
      >
        <div className="dialog-heading">
          <div>
            <div className="eyebrow">
              {groupNames[exercise.group][lang]}
              {exercise.bilateral && (
                <span className="step-label">
                  {side === "left" ? "1" : "2"} / 2
                </span>
              )}
            </div>
            <h2 id="check-title">{exercise.name[lang]}</h2>
          </div>
          <button
            className="icon-button"
            disabled={busy}
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>
        <>
          {sideNotice && (
            <p className="side-notice" role="status">
              <Check size={16} />
              {t.leftSaved}
            </p>
          )}
          <p className="instruction">{exercise.instruction[lang]}</p>
          <div className="check-stage">
            <div className="active-pose">
              <Pose exercise={exercise} level={level ?? 2} lang={lang} />
              <span>
                {level === null ? t.referencePose : `${t.level} ${level + 1}`}
              </span>
            </div>
            <div className="check-controls">
              {exercise.bilateral && (
                <div className="side-control">
                  <span>{t.currentSide}</span>
                  <div className="segmented side-selector">
                    {(["left", "right"] as const).map((value) => (
                      <button
                        key={value}
                        aria-pressed={side === value}
                        className={side === value ? "selected" : ""}
                        onClick={() => {
                          setSide(value);
                          setLevel(null);
                          setSideNotice(false);
                        }}
                      >
                        {t[value]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <h3>{t.choose}</h3>
              <p className="range-hint">{t.chooseHint}</p>
              <div className="level-grid" role="group" aria-label={t.choose}>
                {exercise.levels[lang].map((label, index) => (
                  <button
                    key={index}
                    aria-pressed={level === index}
                    aria-label={`${t.level} ${index + 1}: ${label}`}
                    className={`level-card ${level === index ? "selected" : ""}`}
                    onClick={() => {
                      setLevel(index);
                    }}
                  >
                    <div className="range-thumbnail" aria-hidden="true">
                      <Pose exercise={exercise} level={index} lang={lang} />
                    </div>
                    <span>
                      {index + 1}
                      {level === index && <Check size={11} />}
                    </span>
                  </button>
                ))}
              </div>
              <div className="selected-range" aria-live="polite">
                <span>
                  {level === null ? t.choosePrompt : `${t.level} ${level + 1}`}
                </span>
                <p>
                  {level === null ? t.noTarget : exercise.levels[lang][level]}
                </p>
              </div>
              <details className="technique">
                <summary>
                  <ShieldCheck size={16} />
                  {t.technique}
                  <ChevronDown size={15} />
                </summary>
                <p>{exercise.caution[lang]}</p>
                <p>{t.safe}</p>
              </details>
            </div>
          </div>
          <div className="dialog-bottom">
            <div className="dialog-actions">
              <button
                disabled={busy}
                className="text-button skip-button"
                onClick={onNext}
              >
                {t.skip}
              </button>
              <button
                disabled={level === null || busy}
                className="button primary"
                onClick={() => void save(false)}
              >
                {busy
                  ? t.saving
                  : exercise.bilateral && side === "left"
                    ? t.saveLeft
                    : nextExercise
                      ? t.saveNext
                      : t.saveFinish}
                <ArrowRight size={17} />
              </button>
            </div>
            <div className="dialog-secondary-actions">
              <button
                disabled={busy}
                className="stop-button"
                onClick={() => void save(true)}
              >
                <ShieldCheck size={16} />
                {t.stop}
              </button>
              <button disabled={busy} className="text-button" onClick={onMap}>
                {t.map}
              </button>
            </div>
          </div>
        </>
      </section>
    </div>
  );
}
