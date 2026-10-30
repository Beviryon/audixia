import type { ReactNode } from "react";

export type AuditStepId =
  | "connection"
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo"
  | "recommendations";

const C = {
  panel: "#15123a",
  panelLine: "#2f2a6b",
  muted: "#8d88bd",
  line: "#3a3580",
  text: "#e4e0ff",
  blue: "#a698ff",
  cyan: "#ffc35a",
  violet: "#7a5cff",
  good: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function delay(seconds: number) {
  return { animationDelay: `${seconds}s` };
}

function Label({ x, y, children, fill = C.muted, anchor }: { x: number; y: number; children: ReactNode; fill?: string; anchor?: "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize="11" fontFamily={MONO} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

// Fenêtre sobre : fond sombre, filet fin et barre de titre discrète.
function Panel({ x, y, width, height, title, children }: { x: number; y: number; width: number; height: number; title?: string; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={height} rx="10" fill={C.panel} stroke={C.panelLine} />
      <path d={`M0 30H${width}`} stroke={C.panelLine} />
      <circle cx="16" cy="15" r="3" fill={C.line} />
      <circle cx="27" cy="15" r="3" fill={C.line} />
      <circle cx="38" cy="15" r="3" fill={C.line} />
      {title && <Label x={52} y={19}>{title}</Label>}
      {children}
    </g>
  );
}

// Étape 1 : la requête part du serveur de test et la page se construit.
function ConnectionScene() {
  const links = ["M150 120C200 120 200 150 262 150", "M150 200H262", "M150 280C200 280 200 250 262 250"];

  return (
    <>
      <g transform="translate(30 90)">
        {[0, 80, 160].map((y, index) => (
          <g key={y} transform={`translate(0 ${y})`}>
            <rect width="120" height="60" rx="8" fill={C.panel} stroke={C.panelLine} />
            <rect x="14" y="16" width="60" height="5" rx="2.500" fill={C.line} />
            <rect x="14" y="30" width="40" height="5" rx="2.500" fill={C.line} />
            <circle className="anim-lit" style={delay(index * 0.5)} cx="100" cy="30" r="5" fill={C.good} />
          </g>
        ))}
      </g>
      {links.map((path, index) => (
        <g key={path}>
          <path d={path} fill="none" stroke={C.line} />
          <path className="anim-flow" style={delay(index * 0.2)} d={path} fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <Panel x={262} y={60} width={348} height={280} title="connexion en cours">
        <rect className="anim-draw" pathLength="1" x="24" y="52" width="180" height="20" rx="4" fill="none" stroke={C.blue} strokeWidth="1.500" />
        <rect className="anim-draw" style={delay(0.3)} pathLength="1" x="24" y="86" width="130" height="10" rx="3" fill="none" stroke={C.muted} strokeWidth="1.500" />
        <rect className="anim-draw" style={delay(0.5)} pathLength="1" x="24" y="106" width="155" height="10" rx="3" fill="none" stroke={C.muted} strokeWidth="1.500" />
        <rect className="anim-draw" style={delay(0.7)} pathLength="1" x="224" y="52" width="100" height="84" rx="6" fill="none" stroke={C.cyan} strokeWidth="1.500" />
        {[24, 128, 232].map((x, index) => (
          <rect key={x} className="anim-draw" style={delay(0.9 + index * 0.2)} pathLength="1" x={x} y="158" width="92" height="94" rx="6" fill="none" stroke={C.violet} strokeWidth="1.500" />
        ))}
      </Panel>
    </>
  );
}

// Étape 2 : chronologie des ressources, comme dans un outil de mesure.
function PerformanceScene() {
  const rows = [
    { x: 0, width: 110, color: C.blue, name: "document" },
    { x: 60, width: 150, color: C.violet, name: "styles" },
    { x: 90, width: 220, color: C.amber, name: "scripts" },
    { x: 130, width: 130, color: C.cyan, name: "polices" },
    { x: 170, width: 240, color: C.good, name: "images" },
    { x: 280, width: 170, color: C.amber, name: "scripts" },
  ];

  return (
    <Panel x={20} y={40} width={600} height={320} title="chronologie du chargement">
      {[0, 120, 240, 360, 480].map((x) => (
        <path key={x} d={`M${100 + x} 44V292`} stroke={C.panelLine} strokeDasharray="2 5" />
      ))}
      {rows.map(({ x, width, color, name }, index) => (
        <g key={`${name}${x}`} transform={`translate(0 ${58 + index * 36})`}>
          <Label x={22} y={13}>{name}</Label>
          <rect className="anim-grow-x" style={{ ...delay(index * 0.18), fill: color }} x={100 + x} y="2" width={width} height="14" rx="3" />
        </g>
      ))}
      <g className="anim-appear" style={delay(0.7)}>
        <path d="M240 44V292" stroke={C.cyan} strokeWidth="1.500" />
        <rect x="222" y="292" width="36" height="18" rx="4" fill={C.cyan} />
        <Label x={240} y={305} fill="#04202a" anchor="middle">FCP</Label>
      </g>
      <g className="anim-appear" style={delay(1.2)}>
        <path d="M470 44V292" stroke={C.good} strokeWidth="1.500" />
        <rect x="452" y="292" width="36" height="18" rx="4" fill={C.good} />
        <Label x={470} y={305} fill="#04201a" anchor="middle">LCP</Label>
      </g>
      <g className="anim-sweep">
        <rect x="100" y="44" width="2" height="248" fill="#ffffff" fillOpacity="0.8" />
      </g>
    </Panel>
  );
}

// Étape 3 : le repère clavier parcourt la page et les attributs sont contrôlés.
function AccessibilityScene() {
  const attributes = [
    { label: 'alt="…"', color: C.cyan },
    { label: 'aria-label="…"', color: C.violet },
    { label: "contraste 4,5:1", color: C.good },
    { label: "<label for>", color: C.blue },
  ];

  return (
    <>
      <Panel x={20} y={50} width={370} height={300} title="navigation au clavier">
        <rect x="28" y="58" width="310" height="36" rx="6" fill={C.line} fillOpacity="0.45" />
        <rect x="28" y="122" width="310" height="36" rx="6" fill={C.line} fillOpacity="0.45" />
        <rect x="28" y="186" width="146" height="36" rx="18" fill={C.blue} fillOpacity="0.5" />
        <rect x="186" y="186" width="152" height="36" rx="18" fill={C.line} fillOpacity="0.45" />
        <Label x={28} y={254}>Tab ↹</Label>
        <rect x="74" y="248" width="264" height="5" rx="2.500" fill={C.line} />
        <rect className="anim-focus" x="22" y="52" width="164" height="48" rx="9" fill="none" stroke={C.amber} strokeWidth="2.500" />
      </Panel>
      <g transform="translate(412 50)">
        {attributes.map(({ label, color }, index) => (
          <g key={label} transform={`translate(0 ${index * 77})`}>
            <rect width="208" height="66" rx="10" fill={C.panel} stroke={C.panelLine} />
            <rect x="16" y="16" width="4" height="34" rx="2" fill={color} />
            <text x="32" y="30" fontSize="13" fontFamily={MONO} fill={C.text}>{label}</text>
            <rect className="anim-grow-x" style={{ ...delay(index * 0.45), fill: color }} x="32" y="42" width="156" height="5" rx="2.500" />
          </g>
        ))}
      </g>
    </>
  );
}

// Étape 4 : inspection du code, de la sécurité et des erreurs.
function BestPracticesScene() {
  const code = [
    [["#", 26, C.violet], ["", 110, C.blue], ["", 60, C.muted]],
    [["", 56, C.muted], ["", 150, C.cyan]],
    [["", 90, C.blue], ["", 44, C.amber], ["", 80, C.muted]],
    [["", 40, C.violet], ["", 130, C.muted]],
    [["", 130, C.cyan], ["", 66, C.blue]],
    [["", 70, C.muted], ["", 100, C.good]],
    [["", 34, C.violet], ["", 170, C.muted]],
    [["", 100, C.blue], ["", 54, C.amber]],
  ] as const;
  const checks = ["HTTPS", "Console", "Images"];

  return (
    <>
      <Panel x={20} y={50} width={370} height={300} title="index.html">
        <g transform="translate(22 50)">
          {code.map((tokens, row) => {
            let cursor = 34;
            return (
              <g key={row} transform={`translate(0 ${row * 29})`}>
                <Label x={0} y={9}>{row + 1}</Label>
                {tokens.map(([, width, color], index) => {
                  const x = cursor;
                  cursor += width + 8;
                  return <rect key={index} x={x} y="2" width={width} height="7" rx="3.500" fill={color} fillOpacity="0.8" />;
                })}
              </g>
            );
          })}
        </g>
        <g className="anim-scan-y">
          <rect x="1" y="38" width="368" height="24" fill={C.cyan} fillOpacity="0.1" />
          <rect x="1" y="50" width="368" height="1.500" fill={C.cyan} />
        </g>
      </Panel>
      <g transform="translate(505 130)">
        <circle className="anim-signal" r="66" fill="none" stroke={C.good} strokeWidth="1.500" />
        <path className="anim-draw" pathLength="1" d="M0-70 58-48V-6C58 34 30 58 0 72-30 58-58 34-58-6V-48Z" fill={C.good} fillOpacity="0.08" stroke={C.good} strokeWidth="2" />
        <rect x="-19" y="-10" width="38" height="30" rx="5" fill={C.good} />
        <path d="M-12-10V-20a12 12 0 0 1 24 0V-10" fill="none" stroke={C.good} strokeWidth="4" />
      </g>
      <g transform="translate(412 232)">
        {checks.map((label, index) => (
          <g key={label} transform={`translate(0 ${index * 40})`}>
            <g className="anim-appear" style={delay(0.5 + index * 0.45)}>
              <rect width="208" height="32" rx="8" fill={C.panel} stroke={C.panelLine} />
              <path d="m16 16 5 5 10-11" fill="none" stroke={C.good} strokeWidth="2.500" strokeLinecap="round" strokeLinejoin="round" />
              <text x="44" y="21" fontSize="13" fontFamily={MONO} fill={C.text}>{label}</text>
            </g>
          </g>
        ))}
      </g>
    </>
  );
}

// Étape 5 : exploration des liens du site et aperçu dans les résultats.
function SeoScene() {
  const root = { x: 180, y: 70 };
  const pages = [
    { x: 70, y: 190 },
    { x: 180, y: 190 },
    { x: 290, y: 190 },
  ];
  const leaves = [
    { x: 30, y: 310, from: 0 },
    { x: 110, y: 310, from: 0 },
    { x: 180, y: 310, from: 1 },
    { x: 250, y: 310, from: 2 },
    { x: 330, y: 310, from: 2 },
  ];

  return (
    <>
      {pages.map(({ x, y }) => (
        <g key={x}>
          <path d={`M${root.x} ${root.y}L${x} ${y}`} stroke={C.line} />
          <path className="anim-flow" d={`M${root.x} ${root.y}L${x} ${y}`} stroke={C.cyan} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      {leaves.map(({ x, y, from }) => (
        <g key={x}>
          <path d={`M${pages[from].x} ${pages[from].y}L${x} ${y}`} stroke={C.line} />
          <path className="anim-flow" style={delay(0.4)} d={`M${pages[from].x} ${pages[from].y}L${x} ${y}`} stroke={C.blue} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <rect x={root.x - 44} y={root.y - 20} width="88" height="40" rx="8" fill={C.cyan} />
      <Label x={root.x} y={root.y + 4} fill="#04202a" anchor="middle">accueil</Label>
      {pages.map(({ x, y }, index) => (
        <g key={x}>
          <rect x={x - 42} y={y - 18} width="84" height="36" rx="8" fill={C.panel} stroke={C.blue} />
          <rect className="anim-lit" style={delay(0.4 + index * 0.4)} x={x - 28} y={y - 3} width="56" height="6" rx="3" fill={C.blue} />
        </g>
      ))}
      {leaves.map(({ x, y }, index) => (
        <g key={x}>
          <rect x={x - 28} y={y - 16} width="56" height="32" rx="7" fill={C.panel} stroke={C.panelLine} />
          <rect className="anim-lit" style={delay(1 + index * 0.3)} x={x - 16} y={y - 3} width="32" height="6" rx="3" fill={C.violet} />
        </g>
      ))}
      <Panel x={392} y={70} width={228} height={260} title="résultat">
        <g transform="translate(18 50)">
          <Label x={0} y={8}>{"<title>"}</Label>
          <rect className="anim-grow-x" x="0" y="18" width="190" height="12" rx="4" style={{ fill: C.blue }} />
          <Label x={0} y={62}>meta description</Label>
          <rect className="anim-grow-x" style={{ ...delay(0.4), fill: C.muted }} x="0" y="72" width="190" height="6" rx="3" />
          <rect className="anim-grow-x" style={{ ...delay(0.6), fill: C.muted }} x="0" y="86" width="150" height="6" rx="3" />
          <Label x={0} y={124}>liens</Label>
          {[0, 66, 132].map((x, index) => (
            <rect key={x} className="anim-grow-x" style={{ ...delay(0.9 + index * 0.2), fill: C.cyan }} x={x} y="134" width="58" height="8" rx="4" />
          ))}
          <path className="anim-draw" pathLength="1" d="m0 176 8 8 16-18" fill="none" stroke={C.good} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <Label x={34} y={182} fill={C.text}>indexable</Label>
        </g>
      </Panel>
    </>
  );
}

// Étape 6 : le tableau de bord du bilan s'assemble.
function RecommendationsScene() {
  const bars = [
    { x: 26, height: 96, color: C.good },
    { x: 74, height: 58, color: C.amber },
    { x: 122, height: 82, color: C.good },
    { x: 170, height: 40, color: C.red },
  ];
  const rows = [
    { width: 220, color: C.red },
    { width: 190, color: C.amber },
    { width: 150, color: C.good },
  ];

  return (
    <>
      <Panel x={20} y={30} width={280} height={180} title="domaines">
        <path d="M18 160H262" stroke={C.panelLine} />
        {bars.map(({ x, height, color }, index) => (
          <rect key={x} className="anim-grow-y" style={{ ...delay(index * 0.18), fill: color }} x={x} y={160 - height} width="36" height={height} rx="3" />
        ))}
      </Panel>
      <Panel x={320} y={30} width={300} height={180} title="parcours du visiteur">
        <path d="M18 150H282" stroke={C.panelLine} />
        <path
          className="anim-draw"
          pathLength="1"
          d="M20 136C60 128 72 80 112 88S166 124 200 86 252 56 280 60"
          fill="none"
          stroke={C.cyan}
          strokeWidth="2.500"
          strokeLinecap="round"
        />
        {[
          [112, 88],
          [200, 86],
          [280, 60],
        ].map(([cx, cy], index) => (
          <circle key={cx} className="anim-appear" style={delay(0.8 + index * 0.3)} cx={cx} cy={cy} r="4.500" fill={C.cyan} />
        ))}
      </Panel>
      <Panel x={20} y={228} width={600} height={140} title="priorités">
        {rows.map(({ width, color }, index) => (
          <g key={width} transform={`translate(20 ${44 + index * 30})`}>
            <g className="anim-appear" style={delay(0.3 + index * 0.35)}>
              <circle cx="6" cy="9" r="5" fill={color} />
              <rect x="24" y="5" width={width} height="8" rx="4" fill={C.line} />
              <rect x="480" y="3" width="76" height="12" rx="6" fill={color} fillOpacity="0.3" />
            </g>
          </g>
        ))}
      </Panel>
    </>
  );
}

const SCENES: Record<AuditStepId, ReactNode> = {
  connection: <ConnectionScene />,
  performance: <PerformanceScene />,
  accessibility: <AccessibilityScene />,
  "best-practices": <BestPracticesScene />,
  seo: <SeoScene />,
  recommendations: <RecommendationsScene />,
};

type AuditSceneProps = {
  step: AuditStepId;
};

// Illustration décorative propre à chaque étape de l'audit.
export function AuditScene({ step }: AuditSceneProps) {
  return (
    <svg key={step} viewBox="0 0 640 400" aria-hidden="true" className="audit-scene h-auto w-full">
      {SCENES[step]}
    </svg>
  );
}
