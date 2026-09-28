import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAccountType } from "../utils/constants";
import { formatCurrency } from "../utils/format";

// Each of these is an original, generic decorative texture (dots, stripes,
// blobs, chevrons) — not any brand's actual logo or trademarked artwork.
// They're assigned per institution in utils/constants.js via `pattern`.

function DotsPattern() {
  const rows = 4;
  const cols = 7;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={[
            styles.dot,
            {
              top: r * 16,
              left: c * 16,
              opacity: 0.5 - r * 0.09,
            },
          ]}
        />
      );
    }
  }
  return <View style={styles.dotsWrap}>{dots}</View>;
}

function DiagonalPattern() {
  const bars = [0, 1, 2, 3, 4];
  return (
    <View style={styles.diagonalWrap}>
      {bars.map((i) => (
        <View
          key={i}
          style={[
            styles.diagonalBar,
            { right: -40 + i * 26, opacity: 0.14 - i * 0.015 },
          ]}
        />
      ))}
    </View>
  );
}

function WavePattern() {
  return (
    <View style={styles.waveWrap}>
      <View style={[styles.waveBlob, { width: 180, height: 180, borderRadius: 90, opacity: 0.12, top: 10, right: -50 }]} />
      <View style={[styles.waveBlob, { width: 120, height: 120, borderRadius: 60, opacity: 0.16, bottom: -40, right: 30 }]} />
      <View style={[styles.waveBlob, { width: 70, height: 70, borderRadius: 35, opacity: 0.2, bottom: 20, right: -10 }]} />
    </View>
  );
}

function ChevronPattern() {
  const chevrons = [0, 1, 2];
  return (
    <View style={styles.chevronWrap}>
      {chevrons.map((i) => (
        <View
          key={i}
          style={[
            styles.chevron,
            { bottom: -20 + i * 14, right: -20 + i * 14, opacity: 0.16 - i * 0.03 },
          ]}
        />
      ))}
    </View>
  );
}

function DepthCircle() {
  return <View style={styles.depthCircle} />;
}

const PATTERNS = {
  dots: DotsPattern,
  diagonal: DiagonalPattern,
  wave: WavePattern,
  chevron: ChevronPattern,
  none: DepthCircle,
};

export default function WalletCard({ account, balance }) {
  const type = getAccountType(account.type);
  const baseColor = account.color || type.color;
  const PatternComponent = PATTERNS[type.pattern] || DepthCircle;

  return (
    <View style={[styles.card, { backgroundColor: baseColor }]}>
           <View style={styles.scrim} />
           <PatternComponent />

      <View style={styles.topRow}>
        <View style={styles.iconBadge}>
          <Ionicons name={type.icon} size={17} color="#FFFFFF" />
        </View>
        <Text style={styles.groupLabel}>{(type.group || type.label).toUpperCase()}</Text>
      </View>

      <Text style={styles.accountName} numberOfLines={1}>
        {account.name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.institutionLabel}>{type.label}</Text>
        <Text style={[styles.balance, balance < 0 && styles.balanceNegative]}>
          {formatCurrency(balance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    height: 168,
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: 14,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  scrimStrong: {
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  depthCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -90,
    right: -60,
  },

  dotsWrap: {
    position: "absolute",
    top: -10,
    right: -30,
    width: 130,
    height: 90,
  },
  dot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
  },

  diagonalWrap: {
    position: "absolute",
    top: -20,
    bottom: -20,
    right: 0,
    width: 140,
    overflow: "hidden",
  },
  diagonalBar: {
    position: "absolute",
    top: -20,
    bottom: -20,
    width: 14,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "18deg" }],
  },

  waveWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  waveBlob: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },

  chevronWrap: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 90,
    height: 90,
  },
  chevron: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  groupLabel: { color: "rgba(255,255,255,0.78)", fontSize: 10, fontWeight: "700", letterSpacing: 0.8 },
  accountName: { color: "#FFFFFF", fontSize: 19, fontWeight: "700" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  institutionLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  balance: { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  balanceNegative: { color: "#FFD9CE" },
});