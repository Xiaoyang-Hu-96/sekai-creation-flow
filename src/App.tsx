import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Composer } from "./components/Composer";
import { Dock } from "./components/Dock";
import { Sheet, Stepper, Toast } from "./components/Primitives";
import { Icon, type IconName } from "./components/Icon";
import { powers, type Beat, type BuildStage, type Effort, type PowerId, type SheetName } from "./types";

const deepStages: BuildStage[] = [
  { label: "Wiring game logic & physics…", caption: "Wiring the chaos…" },
  { label: "Locking tuning values…", caption: "Deciding how fast a llama should be…" },
  { label: "Drawing the llama…", caption: "Drawing one very dramatic llama…" },
  { label: "Painting meadow & sky…", caption: "Painting the meadow…" },
  { label: "Layering arcade SFX…", caption: "Recording boops and fail-trombones…" },
];
const quickStages: BuildStage[] = [
  { label: "Wiring game logic…", caption: "Wiring the chaos…" },
  { label: "Quick art pass…", caption: "Sketching the llama…" },
  { label: "Final touches…", caption: "Final touches…" },
];

export function App() {
  const [stageScale, setStageScale] = useState(1);
  const [railView, setRailView] = useState<"flow" | "rationale" | "sekai" | "why">("flow");
  const [beat, setBeat] = useState<Beat>("create");
  const [effort, setEffort] = useState<Effort>("deep");
  const [selected, setSelected] = useState<PowerId[]>(["sfx"]);
  const [sheet, setSheet] = useState<SheetName>(null);
  const [built, setBuilt] = useState(false);
  const [building, setBuilding] = useState(false);
  const [stage, setStage] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [version, setVersion] = useState(1);
  const [badges, setBadges] = useState(false);
  const [toast, setToast] = useState("");
  const [playtest, setPlaytest] = useState<"off" | "running" | "report">("off");
  const [run, setRun] = useState(1);
  const [mode, setMode] = useState<"auto" | "guide">("auto");
  const [chatPlan, setChatPlan] = useState<"generating" | "spec" | "locking" | "edit" | null>(null);
  const [planNote, setPlanNote] = useState("");
  const [spec, setSpec] = useState([0, 0, 0, 0, 0]);
  const [timerAdded, setTimerAdded] = useState(false);
  const [taps, setTaps] = useState(0);
  const [llama, setLlama] = useState({ left: 45, top: 52 });
  const [tune, setTune] = useState({ speed: 1.4, ramp: 5, zones: 4, size: 58 });

  useEffect(() => {
    const resize = () => {
      if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return setStageScale(1);
      setStageScale(Math.min(1, (window.innerWidth - 24) / 720, (window.innerHeight - 24) / 930));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const stages = effort === "deep" ? deepStages : quickStages;
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600); };
  const openSheet = (name: SheetName) => setSheet(name);
  const close = () => { setSheet(null); setPlaytest("off"); };

  useEffect(() => {
    if (!building) return;
    if (stage >= stages.length) {
      const done = window.setTimeout(() => { setBuilding(false); setBuilt(true); setBeat("canvas"); setBadges(true); setExpanded(false); notify(`Built · saved as v${version}`); }, 650);
      return () => clearTimeout(done);
    }
    const timer = window.setTimeout(() => setStage(s => s + 1), effort === "deep" ? 2100 : 1500);
    return () => clearTimeout(timer);
  }, [building, effort, stage, stages.length, version]);

  useEffect(() => {
    if (playtest !== "running") return;
    const timer = window.setInterval(() => setRun(r => {
      const next = Math.min(24, r + 3);
      if (next === 24) window.setTimeout(() => setPlaytest("report"), 400);
      return next;
    }), 220);
    return () => clearInterval(timer);
  }, [playtest]);

  const beginBuild = () => { setSheet(null); setPlaytest("off"); setChatPlan(null); setBuilding(true); setBuilt(false); setStage(0); setBeat("build"); setExpanded(true); };
  const preparePlan = () => {
    setMode("auto"); setBuilt(false); setBuilding(false); setBeat("plan"); setPlanNote(""); setChatPlan("generating"); setSheet("chat");
    window.setTimeout(() => setChatPlan("spec"), 900);
  };
  const submit = () => {
    if (effort === "quick") { beginBuild(); notify("Quick build · no plan step, ~1 min"); return; }
    preparePlan();
  };
  const skipToBuilt = () => { setBuilding(false); setBuilt(true); setBeat("canvas"); setStage(stages.length); setBadges(true); setSheet("chat"); };
  const jump = (next: Beat) => {
    track("Walkthrough step viewed", { step: next });
    if (next === "create") { close(); setBeat("create"); return; }
    if (next === "plan") { setEffort("deep"); preparePlan(); return; }
    if (next === "build") { beginBuild(); return; }
    if (next === "canvas") { skipToBuilt(); return; }
    skipToBuilt(); setSheet(null); setRun(1); setPlaytest("running"); setBeat("ship");
  };
  const hop = () => { setTaps(t => t + 1); setLlama({ left: 8 + Math.random() * 72, top: 20 + Math.random() * 62 }); };
  const openPlaytest = () => { setSheet(null); setRun(1); setPlaytest("running"); setBeat("ship"); };

  const beatMeta: { id: Beat; title: string; problem: string; highlight: string }[] = [
    { id: "create", title: "Create with intent", problem: "Tools and inspiration were mixed together.", highlight: "Effort, attachments and powers are filed by responsibility." },
    { id: "plan", title: "Auto or Guide", problem: "One creation mode treated every user and decision the same.", highlight: "Auto makes more decisions and moves quickly; Guide slows down so creators can shape the game in depth." },
    { id: "build", title: "Productive waiting", problem: "Waiting pushed creators back to the feed.", highlight: "Semantic progress and Tune now keep review in context." },
    { id: "canvas", title: "Chat without switching", problem: "Separate Chat and Preview tabs made every switch feel like leaving the work.", highlight: "Chat, tuning and assets now live in an in-context menu, so conversation and creation flow together." },
    { id: "ship", title: "Trust before shipping", problem: "Verification required replaying every path.", highlight: "An agent playtests first; recommendations never block shipping." },
  ];
  const currentBeat = beatMeta.find(item => item.id === beat)!;
  const rationale = [
    ["One autonomy level", "Let Auto move decisively, while Guide gives creators more room to explore and make the calls."],
    ["Unverifiable promises", "Turn AI language into editable specs, changelogs and explicit boundaries."],
    ["Context-breaking waits", "Make build time useful without sending creators away from their work."],
    ["Chat / Preview split", "Embed conversation and edit actions into the game context instead of making creators switch modes."],
  ];
  const sekaiGames = [
    ["Night Line Racer", "https://link.prod.sekai.chat/QKQfa6"],
    ["How Smart Are You Vol.1?", "https://link.prod.sekai.chat/Z1MXYV"],
    ["Crystal of the Day", "https://link.prod.sekai.chat/2EV2G0"],
    ["The Crystal Pool", "https://link.prod.sekai.chat/Cdoke1"],
    ["Your Signature Scent", "https://link.prod.sekai.chat/MgxO8X"],
  ];
  const whySekai = [
    ["AI-native creation", "Sekai turns a sentence into something playable, social and remixable. That is the kind of creation surface I want to help shape."],
    ["Designing agency", "The hard product question is not just speed. It is deciding when AI should lead, when users should choose and how to make that handoff feel trustworthy."],
    ["My fit", "I enjoy designing systems where interaction, feedback, constraints and playfulness all matter. This prototype is how I would start contributing."],
  ];
  return <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${stageScale})` }}><nav className="rail"><header className="case-header"><img src="/sekai-mark.png" alt="Sekai mark" /><div><div className="rail-kicker">Creation redesign</div><h1>Sekai creation flow</h1></div></header><aside className="how-to"><span>How to explore</span><p><b>Choose a step</b> to jump to its interaction, or <b>tap the phone</b> to explore freely.</p></aside><div className="rail-tabs wide"><button className={railView === "flow" ? "active" : ""} onClick={() => { setRailView("flow"); track("Case study section viewed", { section: "walkthrough" }); }}>Walkthrough</button><button className={railView === "rationale" ? "active" : ""} onClick={() => { setRailView("rationale"); track("Case study section viewed", { section: "rationale" }); }}>Rationale</button><button className={railView === "sekai" ? "active" : ""} onClick={() => { setRailView("sekai"); track("Case study section viewed", { section: "my-sekai" }); }}>My Sekai</button><button className={railView === "why" ? "active" : ""} onClick={() => { setRailView("why"); track("Case study section viewed", { section: "why-sekai" }); }}>Why Sekai</button></div>{railView === "flow" ? <><div className="rail-highlight"><small>Design highlight · {currentBeat.title}</small><b>{currentBeat.highlight}</b></div><div className="rail-flow">{beatMeta.map((item, i) => <button key={item.id} className={beat === item.id ? "active" : ""} onClick={() => jump(item.id)}><span>0{i + 1}</span><strong>{item.title}</strong><small>{item.problem}</small></button>)}</div></> : railView === "rationale" ? <div className="rationale"><div className="rationale-intro"><small>Design thesis</small><b>Creation should feel trustworthy before it feels magical.</b></div>{rationale.map(([problem, solution], i) => <article key={problem}><span>0{i + 1}</span><div><b>{problem}</b><p>{solution}</p></div></article>)}</div> : railView === "sekai" ? <div className="sekai-section"><div className="rationale-intro"><small>Made in Sekai</small><b>Games I made while exploring the product from the inside.</b></div><article className="profile-card"><span>Sekai account</span><b>Xiaoyang Hu</b><p>User ID 12543745 · profile link not available yet.</p></article>{sekaiGames.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" onClick={() => track("Sekai game opened", { game: name })}><b>{name}</b><span>Open game ↗</span></a>)}</div> : <div className="rationale why-section"><div className="rationale-intro"><small>Why I want to join</small><b>I am excited by tools that make imagination playable.</b></div>{whySekai.map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><div><b>{title}</b><p>{copy}</p></div></article>)}</div>}<footer className="profile-footer"><div><b>Xiaoyang Hu</b><span>Product designer · AI experiences</span></div><div className="profile-links"><a href="https://xiaoyanghu.com/" target="_blank" rel="noreferrer" onClick={() => track("Profile link clicked", { link: "portfolio" })}>Portfolio ↗</a><a href="https://www.linkedin.com/in/xiaoyang-hu-elena" target="_blank" rel="noreferrer" onClick={() => track("Profile link clicked", { link: "linkedin" })}>LinkedIn ↗</a><a href="mailto:mshuxy@gmail.com" onClick={() => track("Profile link clicked", { link: "email" })}>Email ↗</a></div></footer></nav>
    <div className="device"><i className="side action"/><i className="side volume-up"/><i className="side volume-down"/><i className="side power-key"/><div className="bezel"><div className="phone"><div className="status"><b>9:41</b><span className="status-icons"><i className="signal"/><i className="wifi"/><i className="battery"/></span></div><div className="island"><i/></div>
      {beat === "create" ? <Composer effort={effort} setEffort={setEffort} selected={selected} setSelected={setSelected} onAttach={() => openSheet("attach")} onPowers={() => openSheet("powers")} onSubmit={submit} /> : <main className="canvas">
        <header className="canvas-top"><button className="circle" onClick={() => jump("create")}><Icon name="back"/></button><button className="circle"><Icon name="history"/></button><div className="title"><span>✦</span>Llama Panic! <small>v{version}</small></div><button className="circle"><Icon name="refresh"/></button><button className="circle white" disabled={!built} onClick={openPlaytest}><Icon name="arrowRight"/></button></header>
        <div className="game"><div className="hud"><b>Taps · {taps}</b><b>Best streak · {taps}</b>{timerAdded && <b><Icon name="timer" size={12}/> 30s</b>}</div><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span><button className="llama" style={{ left: `${llama.left}%`, top: `${llama.top}%`, fontSize: tune.size }} onClick={hop}>🦙</button>{!built && <div className="build-overlay"><span>✦</span><p>{building ? stages[Math.min(stage, stages.length - 1)]?.caption : chatPlan === "generating" ? "Turning your idea into a plan…" : "Plan ready — confirm it below"}</p><button onClick={() => notify("This keeps building and saves to Drafts")}><Icon name="home"/> Explore Feed</button><small>We'll save it to Drafts and notify you when it's ready</small></div>}</div>
        <div className="dock-zone"><Dock building={building} stage={stage} stages={stages} built={built} expanded={expanded} setExpanded={setExpanded} onChat={() => openSheet("chat")} onTune={() => openSheet("tune")} onCancel={() => { setBuilding(false); setBeat("plan"); setChatPlan("spec"); setSheet("chat"); notify("Build cancelled · plan kept"); }} onAssets={() => { setBadges(false); openSheet("assets"); }} onBug={() => { setMode("auto"); openSheet("chat"); notify("Bug report opens in Auto · screenshot attached"); }} badges={badges} /></div>
      </main>}
      <div className={`scrim ${sheet || playtest !== "off" ? "open" : ""}`} onClick={close} />
      <Sheet title="Attach to your idea" open={sheet === "attach"} onClose={close}><p className="note">Bring your own material. Sekai builds around it.</p><div className="attach-grid">{([["photo","Photo"],["camera","Camera"],["music","Music"],["volume","SFX"]] as [IconName,string][]).map(([icon,label]) => <button key={label} onClick={() => notify(`${label} picker opens here`)}><Icon name={icon}/>{label}</button>)}</div></Sheet>
      <Sheet title="Powers" open={sheet === "powers"} onClose={close}><p className="note">Abilities this engine already has. Add one and it attaches to your idea.</p>{(Object.keys(powers) as PowerId[]).map(id => <div className="power-row" key={id}><span><Icon name={powers[id][0] as IconName}/></span><div><b>{powers[id][1]}</b><small>{powers[id][2]}</small></div><button className={selected.includes(id) ? "selected" : ""} onClick={() => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])}>{selected.includes(id) ? "Added ✓" : "Add"}</button></div>)}</Sheet>
      <Sheet title="Sekai" open={sheet === "chat"} onClose={close}><Chat mode={mode} setMode={setMode} plan={chatPlan} setPlan={setChatPlan} spec={spec} setSpec={setSpec} planNote={planNote} onWait={() => setPlanNote("Take your time — the plan stays here. Tap any line, or tell me what feels off.")} onBuild={() => { setChatPlan("locking"); window.setTimeout(beginBuild, 650); }} onApply={() => { setVersion(v => v + 1); setTimerAdded(true); close(); notify("Applied · round logic rebuilt, art untouched"); }} onTune={() => openSheet("tune")} onAssets={() => openSheet("assets")} /></Sheet>
      <Sheet title={building ? "Tune · ready while I build" : "Tune instantly"} open={sheet === "tune"} onClose={close}><p className="note">These numbers are editable right now. No rebuild needed.</p><Stepper label="Llama speed" detail="How fast it dashes for the edge" value={tune.speed} step={0.2} suffix="×" setValue={speed => setTune({ ...tune, speed: Math.round(speed * 10) / 10 })} /><Stepper label="Speed ramp" detail="Gets faster every N taps" value={tune.ramp} suffix=" taps" setValue={ramp => setTune({ ...tune, ramp })} /><Stepper label="Escape zones" detail="Edges the llama can bolt through" value={tune.zones} setValue={zones => setTune({ ...tune, zones })} /><Stepper label="Llama size" detail="Smaller = harder to tap" value={tune.size} step={4} suffix="pt" setValue={size => setTune({ ...tune, size })} /></Sheet>
      <Sheet title="New from this build" open={sheet === "assets"} onClose={close}><p className="eyebrow">Images · 2</p><div className="asset-grid"><Asset icon="llama" name="Llama · hero sprite" onAction={notify} /><Asset icon="landscape" name="Meadow · backdrop" onAction={notify} /></div><p className="eyebrow">Music · 1</p><div className="music"><button><Icon name="play"/></button><b>Sunny chiptune loop</b><button onClick={() => notify("Queued: new track · music only")}>Replace</button></div><p className="note">Swapping an asset never rebuilds the game. Content edits are cheap.</p></Sheet>
      <Playtest state={playtest} run={run} version={version} onClose={close} onNotify={notify} />
      <Toast text={toast} /><div className="home" />
    </div></div></div>
  </div>;
}

function Chat({ mode, setMode, plan, setPlan, spec, setSpec, planNote, onWait, onBuild, onApply, onTune, onAssets }: { mode: "auto" | "guide"; setMode: (m: "auto" | "guide") => void; plan: "generating" | "spec" | "locking" | "edit" | null; setPlan: (p: "edit") => void; spec: number[]; setSpec: (v: number[]) => void; planNote: string; onWait: () => void; onBuild: () => void; onApply: () => void; onTune: () => void; onAssets: () => void }) {
  return <div className="chat"><div className="mode-switch"><button className={mode === "auto" ? "active" : ""} onClick={() => setMode("auto")}><Icon name="agent" size={15}/><span><b>Auto</b><small>Sekai makes more calls</small></span></button><button className={mode === "guide" ? "active" : ""} onClick={() => setMode("guide")}><Icon name="chat" size={15}/><span><b>Guide</b><small>You shape every decision</small></span></button></div><p className={`mode-tip ${mode}`}><span className="mode-dot"/><b>{mode === "auto" ? "Auto is on." : "Guide is on."}</b> {mode === "auto" ? "Sekai fills in details and moves low-risk decisions forward for a faster build." : "Sekai explores decisions with you, so you can shape the game in greater depth."}</p><div className="messages"><div className="message user">I want to make a chaotic mini-game where I tap as fast as I can to keep a llama from escaping the screen.</div><div className="message ai"><b>✦ Sekai</b>{plan === "generating" ? <div className="plan-thinking"><i/><span><b>Drafting a build contract…</b><small>Choosing a core loop, difficulty curve and visual direction</small></span></div> : plan === "spec" ? <PlanCard spec values={spec} setValues={setSpec} onPrimary={onBuild} onSecondary={onWait} /> : plan === "locking" ? <div className="plan-locking"><i>✓</i><span><b>Plan locked in</b><small>Starting the build. Cancel anytime — nothing is lost.</small></span></div> : plan === "edit" ? <PlanCard onPrimary={onApply} /> : <p>Llama Panic! is live. Small tweaks apply instantly; bigger ones come back as a plan first.</p>}{planNote && <p className="plan-note">{planNote}</p>}</div></div><div className="suggestions"><button onClick={() => setPlan("edit")}>Add a 30s timer and speed ramp</button><button>What if there were two llamas?</button></div><div className="chat-input"><input placeholder={mode === "auto" ? "Tell Sekai the outcome you want…" : "Explore a decision with Guide…"} /><button className="send" onClick={() => mode === "auto" && setPlan("edit")}><Icon name="arrowUp"/></button></div><div className="chat-tools"><button onClick={onTune}>Tune</button><button onClick={onAssets}>Images</button><button onClick={onAssets}>Music</button><button>Report bug</button></div></div>;
}

function PlanCard({ spec, values = [], setValues, onPrimary, onSecondary }: { spec?: boolean; values?: number[]; setValues?: (v: number[]) => void; onPrimary: () => void; onSecondary?: () => void }) {
  const options = [
    ["Core loop", "Tap the llama before it reaches the edge", "Drag a fence to block the llama", "Tap rhythm · llama moves on the beat"],
    ["Chaos curve", "Speeds up every 5 taps", "Fixed speed · shrinking llama", "Random teleports after 20 taps"],
    ["Run ends", "Endless · escape ends the run", "3 lives", "60-second rounds"],
    ["Style", "Sunny meadow, hand-drawn", "Neon synthwave desert", "Office carpet · security-cam style"],
    ["Scoring", "Best-streak score + share card", "Score only", "Global leaderboard"],
  ];
  const rows = spec ? options.map((row, i) => [row[0], row[(values[i] ?? 0) + 1]]) : [["Will change", "30-second round timer"], ["Will change", "Speed ramps every 5 taps"], ["Won't touch", "Art, controls and scoring"]];
  const cycle = (i: number) => setValues?.(values.map((v, x) => x === i ? (v + 1) % 3 : v));
  return <div className="plan-card"><p>{spec ? <><b>Here’s the plan for Llama Panic!</b> · took 4 seconds, nothing is built yet. Tap any line to change it before I spend the minutes.</> : "Here’s exactly what that touches:"}</p>{rows.map(([k, v], i) => <button key={i} onClick={() => spec && cycle(i)}><small>{k}</small><b>{v}</b><span>›</span></button>)}{spec && <div className="plan-exclusions"><b>Won’t include:</b> sign-in, ads, in-game chat. <b>Powers:</b> Arcade SFX.</div>}<footer><button className="primary" onPointerDown={onPrimary}>{spec ? "Start build · ~4 min" : "Apply · ~40s"}</button><button onClick={onSecondary}>Not yet</button></footer></div>;
}

function Asset({ icon, name, onAction }: { icon: IconName; name: string; onAction: (s: string) => void }) { return <article className="asset"><div><Icon name={icon} size={46}/></div><b>{name}</b><small>Generated in this build</small><footer><button onClick={() => onAction("Queued: redraw · art only")}>Redraw</button><button onClick={() => onAction("Pick a replacement")}>Swap</button></footer></article>; }

function Playtest({ state, run, version, onClose, onNotify }: { state: "off" | "running" | "report"; run: number; version: number; onClose: () => void; onNotify: (s: string) => void }) {
  return <section className={`playtest ${state !== "off" ? "open" : ""}`}><header><h2>{state === "report" ? `Playtest report · v${version}` : "Playtest before it ships"}</h2><button className="icon-btn" onClick={onClose}>×</button></header>{state === "running" ? <div className="running"><span>✦</span><h3>An agent is playing your game right now</h3><p>Run {run} of 24 · checking every way to win, lose and escape</p><div className="mini-progress"><i style={{ width: `${run / 24 * 100}%` }} /></div></div> : <div className="report"><div className="score"><b>84</b><span><strong>Played end-to-end · 24 runs</strong><small>Suggestions, not gates. Ship as-is anytime.</small></span></div><h3>Playtest</h3><Result ok title="Llama is always catchable" /><Result ok title="No stuck states" /><Result title="Tap target shrinks below 44pt" onFix={() => onNotify("Queued: clamp llama size at 44pt")} /><h3>Feed readiness</h3><Result ok title="Average run: 52 seconds" /><Result title="First 3 seconds are static" onFix={() => onNotify("Queued: auto-start on load")} /></div>} {state === "report" && <footer><button onClick={() => { onNotify(`Shipped to the feed · v${version}`); onClose(); }}>Ship as-is</button><button className="primary" onClick={() => { onNotify("Applying 2 fixes, then shipping"); onClose(); }}>Fix, then ship</button></footer>}</section>;
}
function Result({ ok, title, onFix }: { ok?: boolean; title: string; onFix?: () => void }) { return <div className={`result ${ok ? "ok" : "warn"}`}><span>{ok ? "✓" : "!"}</span><b>{title}</b>{onFix && <button onClick={onFix}>Fix it</button>}</div>; }
