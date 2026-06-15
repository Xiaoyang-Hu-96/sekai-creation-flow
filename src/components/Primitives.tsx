import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Sheet({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: ReactNode }) {
  return <section className={`sheet ${open ? "open" : ""}`} aria-hidden={!open}><div className="grab" /><header className="sheet-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close">×</button></header><div className="sheet-body">{children}</div></section>;
}
export function Toast({ text }: { text: string }) { return <div className={`toast ${text ? "open" : ""}`}><b>✓</b>{text}</div>; }
export function ToolButton({ icon, label, badge, onClick }: { icon: IconName; label: string; badge?: number; onClick: () => void }) {
  return <button className="tool-button" onClick={onClick}><span><Icon name={icon} /></span><small>{label}</small>{badge ? <i>{badge}</i> : null}</button>;
}
export function Stepper({ label, detail, value, setValue, step = 1, suffix = "" }: { label: string; detail: string; value: number; setValue: (n: number) => void; step?: number; suffix?: string }) {
  return <div className="setting-row"><div><b>{label}</b><small>{detail}</small></div><div className="stepper"><button onClick={() => setValue(Math.max(step, value - step))}>−</button><span>{value}{suffix}</span><button onClick={() => setValue(value + step)}>+</button></div></div>;
}
