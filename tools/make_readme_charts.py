"""Regenerate every chart in the top-level README.

    python tools/make_readme_charts.py

Reads only committed data - the per-sampler benchmark results in
`rf_replication/results_*.json` and the BRFSS CSV in `diabetes_dataset/` - and
writes a light/dark SVG pair per chart into `docs/assets/`. The README embeds
them with <picture>, so GitHub serves whichever matches the reader's theme.

Nothing here is hand-tuned: change the JSON, re-run, and the README follows.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.colors
import matplotlib.patches
import matplotlib.ticker
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.path import Path as MPath
from matplotlib.patches import PathPatch

ROOT = Path(__file__).resolve().parents[1]
RESULTS_DIR = ROOT / "rf_replication"
CSV_PATH = ROOT / "diabetes_dataset" / "diabetes_binary_health_indicators_BRFSS2015.csv"
OUT_DIR = ROOT / "docs" / "assets"

SAMPLERS = ["ROS", "SMOTE", "ADASYN"]
HERO = "Random Forest"


# Checked for colour-vision deficiency and contrast against GitHub's canvases
# (#ffffff / #0d1117). Aqua is 2.82:1 on light, under the 3:1 bar, so charts
# using it carry value labels. `muted` is achromatic on purpose: it means "not
# the highlighted model", the axis label carries identity.
THEMES = {
    "light": {
        "series": ["#2a78d6", "#eb6834", "#1baf7a"],
        "pos": "#e34948",
        "neg": "#2a78d6",
        "seq": ["#cde2fb", "#9ec5f4", "#6da7ec", "#3987e5", "#2a78d6", "#256abf", "#184f95", "#0d366b"],
        "ink": "#0b0b0b",
        "ink2": "#52514e",
        "muted": "#898781",
        "grid": "#e1e0d9",
        "axis": "#c3c2b7",
        "surface": "#ffffff",
    },
    "dark": {
        "series": ["#3987e5", "#d95926", "#199e70"],
        "pos": "#e66767",
        "neg": "#3987e5",
        "seq": ["#0d366b", "#104281", "#184f95", "#256abf", "#2a78d6", "#3987e5", "#6da7ec", "#9ec5f4"],
        "ink": "#ffffff",
        "ink2": "#c3c2b7",
        "muted": "#898781",
        "grid": "#2c2c2a",
        "axis": "#383835",
        "surface": "#0d1117",
    },
}


def style(theme: dict) -> None:
    plt.rcParams.update({
        # Stable clip-path ids between runs.
        "svg.hashsalt": "diabetessense",
        "font.family": "sans-serif",
        "font.sans-serif": ["Segoe UI", "Helvetica Neue", "Arial", "DejaVu Sans"],
        "svg.fonttype": "path",
        "figure.facecolor": "none",
        "axes.facecolor": "none",
        "savefig.facecolor": "none",
        "text.color": theme["ink"],
        "axes.labelcolor": theme["ink2"],
        "xtick.color": theme["muted"],
        "ytick.color": theme["muted"],
        "axes.edgecolor": theme["axis"],
        "font.size": 10.5,
    })


def frame(ax, theme: dict, grid_axis: str = "x") -> None:
    """Recessive chrome: hairline grid on the value axis, no box."""
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(theme["axis"])
        ax.spines[side].set_linewidth(0.8)
    if grid_axis:
        ax.grid(axis=grid_axis, color=theme["grid"], linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
    ax.tick_params(length=0, labelsize=9.5)


def _radius(ax, px: float) -> tuple[float, float]:
    """Convert a pixel radius into x/y data units so corners stay circular."""
    inv = ax.transData.inverted()
    x0, y0 = inv.transform((0.0, 0.0))
    x1, y1 = inv.transform((px, px))
    return abs(x1 - x0), abs(y1 - y0)


def rounded_bar(ax, x0, x1, y0, y1, color, radius_px=4.0, end="right", **kw):
    """A bar with its data-end rounded and its baseline end left square."""
    rx, ry = _radius(ax, radius_px)
    rx = min(rx, abs(x1 - x0) * 0.5)
    ry = min(ry, abs(y1 - y0) * 0.5)
    # Bars can run either way (a negative correlation extends left), so the
    # rounded end follows the sign rather than assuming x1 > x0.
    dx = 1.0 if x1 >= x0 else -1.0
    dy = 1.0 if y1 >= y0 else -1.0
    if end == "right":
        verts = [
            (x0, y0), (x1 - dx * rx, y0),
            (x1, y0), (x1, y0 + dy * ry),
            (x1, y1 - dy * ry),
            (x1, y1), (x1 - dx * rx, y1),
            (x0, y1), (x0, y0),
        ]
    else:  # 'top'
        verts = [
            (x0, y0), (x0, y1 - dy * ry),
            (x0, y1), (x0 + dx * rx, y1),
            (x1 - dx * rx, y1),
            (x1, y1), (x1, y1 - dy * ry),
            (x1, y0), (x0, y0),
        ]
    codes = [
        MPath.MOVETO, MPath.LINETO,
        MPath.CURVE3, MPath.CURVE3,
        MPath.LINETO,
        MPath.CURVE3, MPath.CURVE3,
        MPath.LINETO, MPath.CLOSEPOLY,
    ]
    patch = PathPatch(MPath(verts, codes), facecolor=color, edgecolor="none", **kw)
    ax.add_patch(patch)
    return patch


def save(fig, name: str, mode: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}_{mode}.svg"
    # Date=None drops the timestamp, so reruns are byte identical.
    fig.savefig(path, format="svg", transparent=True, bbox_inches="tight",
                pad_inches=0.12, metadata={"Date": None})
    plt.close(fig)
    print(f"  {path.relative_to(ROOT)}")


def load_results() -> dict[str, dict]:
    out = {}
    for s in SAMPLERS:
        p = RESULTS_DIR / f"results_{s}.json"
        if not p.exists():
            sys.exit(f"missing {p} - run: python rf_replication/thesis_replication.py {s}")
        out[s] = json.loads(p.read_text())
    return out


# ---------------------------------------------------------------------------
# Charts
# ---------------------------------------------------------------------------

def chart_leaderboard(res, mode):
    t = THEMES[mode]; style(t)
    d = res["ROS"]
    models = sorted(d, key=lambda m: d[m]["accuracy"])
    vals = [d[m]["accuracy"] * 100 for m in models]

    fig, ax = plt.subplots(figsize=(8.6, 5.0))
    ax.set_xlim(0, 104); ax.set_ylim(-0.8, len(models) - 0.2)
    frame(ax, t, grid_axis="x")
    fig.canvas.draw()

    for i, (m, v) in enumerate(zip(models, vals)):
        hero = m == HERO
        rounded_bar(ax, 0, v, i - 0.34, i + 0.34,
                    t["series"][0] if hero else t["muted"],
                    alpha=1.0 if hero else 0.42, zorder=3)
        ax.text(v + 1.4, i, f"{v:.2f}%", va="center", ha="left", fontsize=9.5,
                color=t["ink"] if hero else t["ink2"],
                fontweight="bold" if hero else "normal")

    ax.axvline(50, color=t["ink2"], linewidth=1.0, linestyle=(0, (4, 3)), zorder=4, alpha=0.75)
    ax.text(50, len(models) - 0.35, "  majority-class baseline, 50/50 data",
            fontsize=8.5, color=t["ink2"], va="top", ha="left")

    ax.set_yticks(range(len(models)))
    ax.set_yticklabels(models, fontsize=9.5, color=t["ink2"])
    ax.set_xticks([0, 25, 50, 75, 100])
    ax.set_xticklabels(["0", "25", "50", "75", "100%"])
    ax.set_xlabel("Accuracy, held-out 20% of the over-sampled data", color=t["ink2"], labelpad=8)
    ax.set_title("Eleven classifiers, random over-sampling", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=12)
    save(fig, "leaderboard", mode)


def chart_sens_spec(res, mode):
    t = THEMES[mode]; style(t)
    d = res["ROS"]
    models = sorted(d, key=lambda m: d[m]["sensitivity"])
    sens = [d[m]["sensitivity"] * 100 for m in models]
    spec = [d[m]["specificity"] * 100 for m in models]

    fig, ax = plt.subplots(figsize=(8.6, 5.6))
    ax.set_xlim(0, 112); ax.set_ylim(-0.7, len(models) - 0.3)
    frame(ax, t, grid_axis="x")
    fig.canvas.draw()

    h = 0.34  # leaves a surface gap between the pair and between groups
    for i, m in enumerate(models):
        rounded_bar(ax, 0, sens[i], i + 0.02, i + 0.02 + h, t["series"][0], zorder=3)
        rounded_bar(ax, 0, spec[i], i - 0.02 - h, i - 0.02, t["series"][1], zorder=3)
        ax.text(sens[i] + 1.4, i + 0.02 + h / 2, f"{sens[i]:.1f}", va="center",
                fontsize=8.5, color=t["ink2"])
        ax.text(spec[i] + 1.4, i - 0.02 - h / 2, f"{spec[i]:.1f}", va="center",
                fontsize=8.5, color=t["ink2"])

    ax.set_yticks(range(len(models)))
    ax.set_yticklabels(models, fontsize=9.5, color=t["ink2"])
    ax.set_xticks([0, 25, 50, 75, 100]); ax.set_xticklabels(["0", "25", "50", "75", "100%"])
    ax.set_xlabel("Percent", color=t["ink2"], labelpad=8)
    ax.set_title("Catching cases against avoiding false alarms", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=26)
    ax.legend(handles=[
        plt.Line2D([], [], marker="s", linestyle="none", markersize=9, color=t["series"][0],
                   label="Sensitivity (cases caught)"),
        plt.Line2D([], [], marker="s", linestyle="none", markersize=9, color=t["series"][1],
                   label="Specificity (non-cases cleared)"),
    ], loc="lower left", bbox_to_anchor=(0, 1.005), ncol=2, frameon=False,
        fontsize=9.5, labelcolor=t["ink2"], handletextpad=0.5, columnspacing=1.8)
    save(fig, "sens_spec", mode)


def chart_roc(res, mode):
    t = THEMES[mode]; style(t)
    d = res["ROS"]

    fig, ax = plt.subplots(figsize=(6.6, 5.6))
    ax.set_xlim(0, 1); ax.set_ylim(0, 1.005)
    frame(ax, t, grid_axis="both")

    ax.plot([0, 1], [0, 1], color=t["axis"], linewidth=1.2, linestyle=(0, (4, 3)), zorder=2)
    ax.text(0.55, 0.50, "chance", fontsize=8.5, color=t["muted"], rotation=38,
            rotation_mode="anchor", va="bottom")

    for m, v in d.items():
        if m == HERO:
            continue
        ax.plot(v["roc_fpr"], v["roc_tpr"], color=t["muted"], linewidth=1.2, alpha=0.5, zorder=3)

    hero = d[HERO]
    ax.plot(hero["roc_fpr"], hero["roc_tpr"], color=t["series"][0], linewidth=2.4, zorder=5)
    ax.annotate(f"Random Forest\nAUC {hero['auc']:.4f}",
                xy=(0.16, 0.955), xytext=(0.33, 0.70), fontsize=10, color=t["ink"],
                fontweight="bold", ha="left",
                arrowprops=dict(arrowstyle="-", color=t["series"][0], linewidth=1.4,
                                connectionstyle="arc3,rad=-0.2"))
    ax.text(0.985, 0.055, "ten other classifiers", fontsize=9, color=t["ink2"], ha="right")

    ax.set_xlabel("False positive rate", color=t["ink2"], labelpad=8)
    ax.set_ylabel("True positive rate", color=t["ink2"], labelpad=8)
    ax.set_title("ROC, all eleven models", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=12)
    save(fig, "roc", mode)


def chart_balancing(res, mode):
    t = THEMES[mode]; style(t)
    order = sorted(res["ROS"], key=lambda m: res["ROS"][m]["accuracy"], reverse=True)

    fig, ax = plt.subplots(figsize=(9.0, 5.2))
    n = len(order)
    ax.set_xlim(-0.6, n - 0.4); ax.set_ylim(0, 100)
    frame(ax, t, grid_axis="y")
    fig.canvas.draw()

    w = 0.26
    for si, s in enumerate(SAMPLERS):
        off = (si - 1) * (w + 0.02)
        for i, m in enumerate(order):
            v = res[s][m]["accuracy"] * 100
            rounded_bar(ax, i + off - w / 2, i + off + w / 2, 0, v,
                        t["series"][si], end="top", zorder=3)

    ax.set_xticks(range(n))
    ax.set_xticklabels(order, rotation=32, ha="right", fontsize=9, color=t["ink2"])
    ax.set_yticks([0, 25, 50, 75, 100]); ax.set_yticklabels(["0", "25", "50", "75", "100%"])
    ax.set_ylabel("Accuracy", color=t["ink2"], labelpad=8)
    ax.set_title("Three ways to balance the classes", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=26)
    ax.legend(handles=[
        plt.Line2D([], [], marker="s", linestyle="none", markersize=9,
                   color=t["series"][i], label=s)
        for i, s in enumerate(SAMPLERS)
    ], loc="lower left", bbox_to_anchor=(0, 1.005), ncol=3, frameon=False,
        fontsize=9.5, labelcolor=t["ink2"], handletextpad=0.5, columnspacing=1.8)
    save(fig, "balancing", mode)


def chart_confusion(res, mode):
    t = THEMES[mode]; style(t)
    tn, fp, fn, tp = res["ROS"][HERO]["confusion"]
    grid = np.array([[tn, fp], [fn, tp]], dtype=float)
    total = grid.sum()

    fig, ax = plt.subplots(figsize=(5.6, 4.8))
    cmap = matplotlib.colors.LinearSegmentedColormap.from_list("seq", t["seq"])
    ax.set_xlim(-0.5, 1.5); ax.set_ylim(1.5, -0.5)

    gap = 0.012  # a surface gap so the four cells read as separate marks
    for r in range(2):
        for c in range(2):
            v = grid[r, c]
            frac = v / grid.max()
            rgba = cmap(frac)
            ax.add_patch(matplotlib.patches.Rectangle(
                (c - 0.5 + gap, r - 0.5 + gap), 1 - 2 * gap, 1 - 2 * gap,
                facecolor=rgba, edgecolor="none"))

            # Pick ink from the cell's own luminance, not from the mode: the
            # ramp runs light-to-dark on the light surface and dark-to-light on
            # the dark one, so the two cannot share a rule.
            lum = 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]
            on_light = lum > 0.55
            ax.text(c, r - 0.09, f"{int(v):,}", ha="center", va="center", fontsize=17,
                    fontweight="bold", color="#0b0b0b" if on_light else "#ffffff")
            ax.text(c, r + 0.19, f"{v / total * 100:.1f}%", ha="center", va="center",
                    fontsize=10, color="#3f3f3d" if on_light else "#e6e5df")

    ax.set_xticks([0, 1]); ax.set_xticklabels(["Predicted\nno diabetes", "Predicted\ndiabetes"], fontsize=9.5)
    ax.set_yticks([0, 1]); ax.set_yticklabels(["Actually\nno diabetes", "Actually\ndiabetes"], fontsize=9.5)
    ax.tick_params(length=0, colors=t["ink2"])
    ax.set_aspect("equal")
    for s in ax.spines.values():
        s.set_visible(False)
    ax.set_title(f"Random Forest, {int(total):,} held-out rows", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=12)
    save(fig, "confusion", mode)


# --- CSV-derived ------------------------------------------------------------

AGE_BANDS = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54",
             "55-59", "60-64", "65-69", "70-74", "75-79", "80+"]

CORR_LABELS = {
    "GenHlth": "General health (1 excellent - 5 poor)",
    "HighBP": "High blood pressure",
    "BMI": "BMI",
    "HighChol": "High cholesterol",
    "Age": "Age band",
    "DiffWalk": "Difficulty walking",
    "PhysHlth": "Poor physical-health days",
    "HeartDiseaseorAttack": "Heart disease or attack",
    "Income": "Income",
    "Education": "Education",
    "PhysActivity": "Physical activity",
}


def _balanced(df: pd.DataFrame) -> pd.DataFrame:
    """Reproduce the random over-sampled 50/50 cohort the benchmark trains on."""
    pos = df[df.Diabetes_binary == 1]
    neg = df[df.Diabetes_binary == 0]
    up = pos.sample(n=len(neg), replace=True, random_state=42)
    return pd.concat([neg, up], ignore_index=True)


def chart_correlations(df, mode):
    t = THEMES[mode]; style(t)
    bal = _balanced(df)
    feats = list(CORR_LABELS)
    raw = df[feats + ["Diabetes_binary"]].corr()["Diabetes_binary"][feats]
    bl = bal[feats + ["Diabetes_binary"]].corr()["Diabetes_binary"][feats]
    order = bl.abs().sort_values().index.tolist()

    fig, ax = plt.subplots(figsize=(8.4, 5.4))
    ax.set_xlim(-0.30, 0.52); ax.set_ylim(-0.7, len(order) - 0.3)
    frame(ax, t, grid_axis="x")
    fig.canvas.draw()

    h = 0.34
    for i, f in enumerate(order):
        for val, y0, alpha in ((bl[f], i + 0.02, 1.0), (raw[f], i - 0.02 - h, 0.45)):
            col = t["pos"] if val >= 0 else t["neg"]
            rounded_bar(ax, 0, val, y0, y0 + h, col, alpha=alpha, zorder=3)
            ax.text(val + (0.012 if val >= 0 else -0.012), y0 + h / 2, f"{val:+.2f}",
                    va="center", ha="left" if val >= 0 else "right",
                    fontsize=8.5, color=t["ink2"])

    ax.axvline(0, color=t["axis"], linewidth=1.0, zorder=4)
    ax.set_yticks(range(len(order)))
    ax.set_yticklabels([CORR_LABELS[f] for f in order], fontsize=9.5, color=t["ink2"])
    ax.set_xticks([-0.2, 0, 0.2, 0.4])
    ax.set_xlabel("Pearson correlation with a diabetes diagnosis", color=t["ink2"], labelpad=8)
    ax.set_title("What moves with diabetes", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=26)
    ax.legend(handles=[
        plt.Line2D([], [], marker="s", linestyle="none", markersize=9, color=t["muted"],
                   label="Over-sampled 50/50 cohort"),
        plt.Line2D([], [], marker="s", linestyle="none", markersize=9, color=t["muted"],
                   alpha=0.45, label="Full 253,680-record cohort"),
    ], loc="lower left", bbox_to_anchor=(0, 1.005), ncol=2, frameon=False,
        fontsize=9.5, labelcolor=t["ink2"], handletextpad=0.5, columnspacing=1.8)
    save(fig, "correlations", mode)


def chart_age(df, mode):
    t = THEMES[mode]; style(t)
    prev = df.groupby("Age")["Diabetes_binary"].mean() * 100
    prev = prev.reindex(range(1, 14))
    peak = int(prev.idxmax())

    fig, ax = plt.subplots(figsize=(8.4, 4.4))
    ax.set_xlim(-0.7, 12.7); ax.set_ylim(0, max(prev) * 1.22)
    frame(ax, t, grid_axis="y")
    fig.canvas.draw()

    for i, band in enumerate(range(1, 14)):
        v = prev[band]
        hero = band == peak
        rounded_bar(ax, i - 0.36, i + 0.36, 0, v, t["series"][0],
                    alpha=1.0 if hero else 0.48, end="top", zorder=3)
        ax.text(i, v + max(prev) * 0.03, f"{v:.1f}", ha="center", fontsize=8.5,
                color=t["ink"] if hero else t["ink2"],
                fontweight="bold" if hero else "normal")

    ax.set_xticks(range(13))
    ax.set_xticklabels(AGE_BANDS, rotation=45, ha="right", fontsize=9, color=t["ink2"])
    ax.set_ylabel("Share with diabetes", color=t["ink2"], labelpad=8)
    ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(decimals=0))
    ax.set_title("Diabetes rises steadily with age, then plateaus", color=t["ink"],
                 fontsize=12.5, fontweight="bold", loc="left", pad=12)
    ax.text(0, -0.36, "Full 253,680-record cohort, unbalanced.",
            transform=ax.transAxes, fontsize=8.5, color=t["muted"])
    save(fig, "age_prevalence", mode)


def main() -> None:
    res = load_results()
    print("charts from rf_replication/results_*.json")
    for mode in ("light", "dark"):
        chart_leaderboard(res, mode)
        chart_sens_spec(res, mode)
        chart_roc(res, mode)
        chart_balancing(res, mode)
        chart_confusion(res, mode)

    if not CSV_PATH.exists():
        sys.exit(f"missing {CSV_PATH}")
    print("charts from the BRFSS CSV")
    df = pd.read_csv(CSV_PATH)
    for mode in ("light", "dark"):
        chart_correlations(df, mode)
        chart_age(df, mode)


if __name__ == "__main__":
    main()
