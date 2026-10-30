// Génère le rapport d'audit en PDF, dans le navigateur. Chargé uniquement au clic : la bibliothèque est lourde.
import {
  Document,
  Image,
  Link,
  Page,
  Path,
  pdf,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  CATEGORY_LABELS,
  formatMetric,
  getImpact,
  getMetricTone,
  getScoreTone,
  IMPACT_GROUP_LABELS,
  IMPACT_LABELS,
  type Impact,
  METRIC_INFO,
  SCORE_LABELS,
  sortRecommendations,
  type Tone,
} from "@/lib/scoring";
import { getVerdict } from "@/lib/verdict";
import type { AuditResult, Recommendation } from "@/types/audit";

const COLORS = {
  ink: "#0d0b26",
  brand: "#3107af",
  gold: "#ffc35a",
  text: "#1c1a33",
  muted: "#56536f",
  line: "#e4e0ff",
  soft: "#f6f5ff",
};

const TONES: Record<Tone, { main: string; soft: string }> = {
  good: { main: "#0a7f45", soft: "#e5f6ec" },
  average: { main: "#b34d00", soft: "#fff1e3" },
  poor: { main: "#c9281c", soft: "#fdeceb" },
};

const IMPACT_TONES: Record<Impact, Tone> = { high: "poor", medium: "average", low: "good" };
const IMPACTS: Impact[] = ["high", "medium", "low"];

const styles = StyleSheet.create({
  // Pas de lineHeight : il ferait disparaître le pied de page, étirerait les badges et espacerait trop les lignes.
  page: { paddingTop: 36, paddingBottom: 56, fontFamily: "Helvetica", fontSize: 10, color: COLORS.text },
  band: { marginTop: -36, backgroundColor: COLORS.ink, paddingHorizontal: 40, paddingVertical: 20, color: "#ffffff" },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 15, letterSpacing: 1.5, marginLeft: 8 },
  bandTitle: { fontFamily: "Helvetica-Bold", fontSize: 24, lineHeight: 1.2 },
  bandInfo: { fontSize: 10, color: "#d5d2ee", marginTop: 5 },
  body: { paddingHorizontal: 40 },
  verdict: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 16, marginTop: 18, marginBottom: 12 },
  note: { fontFamily: "Helvetica-Bold", fontSize: 40, lineHeight: 1 },
  noteMax: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  verdictText: { flex: 1, marginLeft: 18 },
  verdictTitle: { fontFamily: "Helvetica-Bold", fontSize: 13, marginBottom: 3 },
  small: { fontSize: 8, color: COLORS.muted, marginTop: 4 },
  h2: { fontFamily: "Helvetica-Bold", fontSize: 13, color: COLORS.brand, marginTop: 8, marginBottom: 8 },
  scoreRow: { marginBottom: 8 },
  scoreHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  bold: { fontFamily: "Helvetica-Bold" },
  track: { height: 6, backgroundColor: COLORS.line, borderRadius: 3 },
  fill: { height: 6, borderRadius: 3 },
  metricRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  metricName: { width: 40, fontFamily: "Helvetica-Bold" },
  metricLabel: { flex: 1, color: COLORS.muted },
  metricValue: { width: 60, textAlign: "right", fontFamily: "Helvetica-Bold" },
  badge: { marginLeft: 10, width: 70, textAlign: "center", borderRadius: 8, paddingVertical: 2, fontSize: 8, fontFamily: "Helvetica-Bold" },
  capture: { marginTop: 2, alignSelf: "center", height: 200, marginBottom: 4, objectFit: "contain" },
  group: { fontFamily: "Helvetica-Bold", fontSize: 11, marginTop: 12, marginBottom: 6 },
  reco: { backgroundColor: COLORS.soft, borderRadius: 6, padding: 10, marginBottom: 6 },
  recoHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  recoTitle: { flex: 1, fontFamily: "Helvetica-Bold", paddingRight: 8 },
  recoMeta: { fontSize: 8, color: COLORS.muted, marginBottom: 3 },
  link: { color: COLORS.brand },
  footer: { position: "absolute", left: 40, right: 40, bottom: 22, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: COLORS.muted, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 7 },
});

// Les polices standard du PDF ne couvrent pas tous les caractères : espaces fines et signes rares sont remplacés.
const REPLACEMENTS: [RegExp, string][] = [
  [/[    ]/g, " "],
  [/→/g, "->"],
  [/≥/g, ">="],
  [/≤/g, "<="],
];
const WIN_ANSI = /[^ -~¡-ÿ–—‘’“”•…€ŒœŠšŸŽž\n]/g;

function clean(text: string): string {
  return REPLACEMENTS.reduce((value, [from, to]) => value.replace(from, to), text).replace(WIN_ANSI, "");
}

const TOKEN_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|`([^`]+)`/g;

// Texte de Google : les liens restent cliquables, le code devient du texte simple.
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    parts.push(clean(text.slice(cursor, match.index)));
    const [token, label, href, code] = match;
    parts.push(
      href ? (
        <Link key={match.index} src={href} style={styles.link}>
          {clean(label)}
        </Link>
      ) : (
        clean(code)
      ),
    );
    cursor = match.index + token.length;
  }
  parts.push(clean(text.slice(cursor)));

  return <Text>{parts}</Text>;
}

function PlainTitle({ text }: { text: string }) {
  return <Text style={styles.recoTitle}>{clean(text.replaceAll("`", ""))}</Text>;
}

function Badge({ tone, label }: { tone: Tone; label: string }) {
  return (
    <Text style={[styles.badge, { color: TONES[tone].main, backgroundColor: TONES[tone].soft }]}>
      {clean(label)}
    </Text>
  );
}

function RecommendationBlock({ item }: { item: Recommendation }) {
  const impact = getImpact(item);

  return (
    <View style={styles.reco} wrap={false}>
      <View style={styles.recoHead}>
        <PlainTitle text={item.title} />
        <Badge tone={IMPACT_TONES[impact]} label={IMPACT_LABELS[impact]} />
      </View>
      <Text style={styles.recoMeta}>
        {clean(CATEGORY_LABELS[item.category])}
        {item.savingsLabel ? clean(` · Gain estimé : ${item.savingsLabel}`) : ""}
      </Text>
      <RichText text={item.description} />
    </View>
  );
}

function Footer({ url }: { url: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{clean(`Audixia, une solution Trevixia · ${url}`)}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} sur ${totalPages}`} />
    </View>
  );
}

function ReportDocument({ report }: { report: AuditResult }) {
  const verdict = getVerdict(report);
  const sorted = sortRecommendations(report.recommendations);
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(report.fetchedAt));
  const device = report.strategy === "mobile" ? "Mobile" : "Ordinateur";

  return (
    <Document title={clean(`Rapport d'audit Audixia - ${report.url}`)} author="Audixia" language="fr">
      <Page size="A4" style={styles.page}>
        <Footer url={report.url} />
        <View style={styles.band}>
          <View style={styles.brandRow}>
            <Svg width={24} height={24} viewBox="0 0 32 32">
              <Path d="M16 1.500 28.500 5.500V17c0 7-5 11.300-12.500 13.500C8.500 28.300 3.500 24 3.500 17V5.500Z" fill="#3f1fcc" />
              <Path d="M10.500 22.500 16 9l5.500 13.500" stroke="#ffffff" strokeWidth={2.8} fill="none" />
              <Path d="M12.800 18h6.400" stroke={COLORS.gold} strokeWidth={2.8} />
            </Svg>
            <Text style={styles.brandName}>AUDIXIA</Text>
          </View>
          <Text style={styles.bandTitle}>Rapport d&apos;audit</Text>
          <Text style={styles.bandInfo}>{clean(report.url)}</Text>
          <Text style={styles.bandInfo}>{clean(`${device} · ${date}`)}</Text>
        </View>

        <View style={styles.body}>
          <View style={[styles.verdict, { backgroundColor: TONES[verdict.tone].soft }]}>
            <Text style={[styles.note, { color: TONES[verdict.tone].main }]}>
              {verdict.note}
              <Text style={styles.noteMax}>/100</Text>
            </Text>
            <View style={styles.verdictText}>
              <Text style={styles.verdictTitle}>{clean(verdict.title)}</Text>
              <Text>{clean(verdict.detail)}</Text>
              <Text style={styles.small}>Note Audixia : moyenne des {report.scores.length} domaines analysés.</Text>
            </View>
          </View>

          <Text style={styles.h2}>Le détail par domaine</Text>
          {report.scores.map(({ id, label, score }) => {
            const tone = getScoreTone(score);
            return (
              <View key={id} style={styles.scoreRow}>
                <View style={styles.scoreHead}>
                  <Text style={styles.bold}>{clean(label)}</Text>
                  <Text>
                    <Text style={{ color: TONES[tone].main }}>{clean(SCORE_LABELS[tone])}</Text>
                    {"   "}
                    <Text style={styles.bold}>{score}/100</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${score}%`, backgroundColor: TONES[tone].main }]} />
                </View>
              </View>
            );
          })}

          <Text style={styles.h2}>Core Web Vitals</Text>
          {report.metrics.map((metric) => {
            const tone = getMetricTone(metric);
            const info = METRIC_INFO[metric.id];
            return (
              <View key={metric.id} style={styles.metricRow}>
                <Text style={styles.metricName}>{info.name}</Text>
                <Text style={styles.metricLabel}>{clean(info.description)}</Text>
                <Text style={styles.metricValue}>{clean(formatMetric(metric))}</Text>
                <Badge tone={tone} label={SCORE_LABELS[tone]} />
              </View>
            );
          })}

          {report.screenshot && (
            <View wrap={false}>
              <Text style={styles.h2}>La page telle que Google l&apos;a vue</Text>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- le composant PDF n'a pas d'attribut alt */}
              <Image src={report.screenshot} style={styles.capture} />
            </View>
          )}

          {sorted.length > 0 && (
            <View>
            <Text style={styles.h2} minPresenceAhead={120}>Recommandations ({sorted.length})</Text>
            {IMPACTS.map((impact) => {
              const items = sorted.filter((item) => getImpact(item) === impact);
              if (items.length === 0) return null;
              return (
                <View key={impact}>
                  {/* Le titre reste sur la même page que la première recommandation */}
                  <View wrap={false}>
                    <Text style={styles.group}>
                      {clean(`${IMPACT_GROUP_LABELS[impact]} (${items.length})`)}
                    </Text>
                    <RecommendationBlock item={items[0]} />
                  </View>
                  {items.slice(1).map((item) => (
                    <RecommendationBlock key={item.id} item={item} />
                  ))}
                </View>
              );
            })}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

export function getReportFileName(report: AuditResult): string {
  const host = new URL(report.url).hostname.replace(/^www\./, "");
  return `audixia-rapport-${host}-${report.fetchedAt.slice(0, 10)}.pdf`;
}

export function createReportPdf(report: AuditResult): Promise<Blob> {
  return pdf(<ReportDocument report={report} />).toBlob();
}
