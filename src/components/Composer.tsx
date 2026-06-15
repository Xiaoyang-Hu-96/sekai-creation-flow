import { useState } from "react";
import { powers, type Effort, type PowerId } from "../types";
import { Icon, type IconName } from "./Icon";

export function Composer({ effort, setEffort, selected, setSelected, onAttach, onPowers, onSubmit }: {
  effort: Effort; setEffort: (e: Effort) => void; selected: PowerId[]; setSelected: (p: PowerId[]) => void; onAttach: () => void; onPowers: () => void; onSubmit: () => void;
}) {
  const [idea, setIdea] = useState("I want to make a chaotic mini-game where I tap as fast as I can to keep a llama from escaping the screen.");
  const [focused, setFocused] = useState(false);
  const suggestions = ["make it get faster every 5 taps", "add a dramatic escape animation", "turn mistakes into combo boosts"];
  return <main className="create-content"><h1>Create a game</h1><div className="composer">
    <textarea value={idea} onChange={e => setIdea(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 120)} />
    {selected.length > 0 && <div className="power-chips">{selected.map(id => <button key={id} onClick={() => setSelected(selected.filter(x => x !== id))}><Icon name={powers[id][0] as IconName} size={14} /> {powers[id][1]} ×</button>)}</div>}
    {focused && <div className="ideas"><span>✦</span>{suggestions.map(x => <button key={x} onMouseDown={e => e.preventDefault()} onClick={() => setIdea(idea.replace(/[.\s]+$/, "") + ", " + x + ".")}>… {x}</button>)}</div>}
    <footer className="composer-foot"><div className="composer-actions"><button className="round" onClick={onAttach} aria-label="Attach"><Icon name="plus" /></button><button className="round power" onClick={onPowers} aria-label="Powers"><Icon name="bolt" /><i>{selected.length}</i></button></div><button className="effort" onClick={() => setEffort(effort === "deep" ? "quick" : "deep")}><Icon name={effort === "deep" ? "deep" : "bolt"} size={15}/><b>{effort === "deep" ? "Deep" : "Quick"}</b><span className="effort-meta">{effort === "deep" ? "4 min" : "1 min"}<Icon name="chevronDown" size={13}/></span></button><div className="composer-submit"><button className="mic" aria-label="Voice input"><Icon name="mic" /></button><button className="send" onClick={onSubmit} aria-label="Submit idea"><Icon name="arrowUp" /></button></div></footer>
  </div><p className="hint"><b>{effort === "deep" ? "Deep" : "Quick"}</b> {effort === "deep" ? "plans first, then builds richer (~4 min). Quick just builds (~1 min)." : "just builds (~1 min), no plan step. Deep thinks first."}</p><h2>Need inspiration?</h2><div className="inspiration"><article className="i1"><span><Icon name="pencil" size={38}/></span><b>Draw to escape</b></article><article className="i2"><span><Icon name="grid" size={38}/></span><b>Color rush</b></article><article className="i3"><span><Icon name="plane" size={38}/></span><b>Paper pilot</b></article><article className="i4"><span><Icon name="star" size={38}/></span><b>Star catcher</b></article></div></main>;
}
