"""Draws the phone-mount concept render as an SVG for the deck.

A handlebar with a stem, a green clamp beside the stem, a tilt joint and a four-corner cradle
holding an iPhone that shows BikeTO mid-ride. The phone screen is embedded as a data URI so the
SVG works inside an <img> tag. Run: python3 -I tools/mount_concept.py (from biketo-deck/).
"""

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCREEN = ROOT / "site-src/images/ride-screen.jpg"
OUTPUT = ROOT / "site-src/images/phone-mount-concept.svg"

PHONE = {"x": 350, "y": 95, "width": 300, "height": 652, "radius": 44, "bezel": 9}
PHONE_TILT_DEGREES = -5
GREEN_DARK = "#167540"
GREEN_SOFT = "#7fdaa6"
NAVY = "#091a2a"


def defs(screen_data: str) -> str:
    p = PHONE
    inner = (p["x"] + p["bezel"], p["y"] + p["bezel"], p["width"] - 2 * p["bezel"], p["height"] - 2 * p["bezel"])
    return f"""<defs>
  <radialGradient id="glow" cx="500" cy="470" r="520" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#5bb8f0" stop-opacity="0.22"/><stop offset="1" stop-color="#5bb8f0" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="metal" x1="0" y1="832" x2="0" y2="890" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#7d8b99"/><stop offset="0.45" stop-color="#3a4856"/><stop offset="1" stop-color="#161f28"/>
  </linearGradient>
  <linearGradient id="stem" x1="440" y1="0" x2="560" y2="0" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#1b252f"/><stop offset="0.4" stop-color="#55636f"/><stop offset="1" stop-color="#1b252f"/>
  </linearGradient>
  <linearGradient id="mount" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#36c977"/><stop offset="1" stop-color="{GREEN_DARK}"/>
  </linearGradient>
  <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity="0.5"/>
  </filter>
  <clipPath id="screen"><rect x="{inner[0]}" y="{inner[1]}" width="{inner[2]}" height="{inner[3]}" rx="{p['radius'] - p['bezel']}"/></clipPath>
  <image id="screen-image" href="data:image/jpeg;base64,{screen_data}" x="{inner[0]}" y="{inner[1]}" width="{inner[2]}" height="{inner[3]}" preserveAspectRatio="xMidYMid slice"/>
</defs>"""


def handlebar() -> str:
    bar = "M 70 905 Q 300 858 500 858 Q 700 858 930 905"
    return f"""<g filter="url(#shadow)">
  <path d="M 455 880 L 442 1100 L 558 1100 L 545 880 Z" fill="url(#stem)"/>
  <path d="M 214 896 Q 262 958 334 976" fill="none" stroke="#8d99a6" stroke-width="12" stroke-linecap="round"/>
  <path d="M 786 896 Q 738 958 666 976" fill="none" stroke="#8d99a6" stroke-width="12" stroke-linecap="round"/>
  <path d="{bar}" fill="none" stroke="url(#metal)" stroke-width="50" stroke-linecap="round"/>
  <path d="M 120 880 Q 300 843 500 843 Q 700 843 880 880" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="6" stroke-linecap="round"/>
  <path d="M 70 905 L 178 883" stroke="#0d1014" stroke-width="64" stroke-linecap="round"/>
  <path d="M 822 883 L 930 905" stroke="#0d1014" stroke-width="64" stroke-linecap="round"/>
  <rect x="428" y="826" width="144" height="70" rx="18" fill="#26313c" stroke="#55636f" stroke-width="3"/>
  <circle cx="452" cy="861" r="7" fill="#9aa6b2"/><circle cx="548" cy="861" r="7" fill="#9aa6b2"/>
</g>"""


def clamp_and_arm() -> str:
    return f"""<g filter="url(#shadow)">
  <path d="M 512 690 L 566 806" stroke="url(#mount)" stroke-width="34" stroke-linecap="round"/>
  <path d="M 568 812 L 612 846" stroke="{GREEN_DARK}" stroke-width="28" stroke-linecap="round"/>
  <circle cx="566" cy="810" r="27" fill="url(#mount)" stroke="{GREEN_DARK}" stroke-width="3"/>
  <circle cx="558" cy="801" r="8" fill="#ffffff" fill-opacity="0.35"/>
  <rect x="590" y="822" width="76" height="80" rx="22" fill="url(#mount)" stroke="{GREEN_DARK}" stroke-width="3"/>
  <line x1="628" y1="826" x2="628" y2="898" stroke="{GREEN_DARK}" stroke-width="3"/>
  <rect x="612" y="900" width="32" height="34" rx="9" fill="#e9eef3"/>
  <line x1="620" y1="908" x2="620" y2="926" stroke="#9aa6b2" stroke-width="3"/>
  <line x1="628" y1="908" x2="628" y2="926" stroke="#9aa6b2" stroke-width="3"/>
  <line x1="636" y1="908" x2="636" y2="926" stroke="#9aa6b2" stroke-width="3"/>
</g>"""


def corner_claws() -> str:
    p = PHONE
    left, top = p["x"] - 8, p["y"] - 8
    right, bottom = p["x"] + p["width"] + 8, p["y"] + p["height"] + 8
    reach = 62
    claws = [
        f"M {left} {top + reach} L {left} {top + 26} Q {left} {top} {left + 26} {top} L {left + reach} {top}",
        f"M {right - reach} {top} L {right - 26} {top} Q {right} {top} {right} {top + 26} L {right} {top + reach}",
        f"M {left} {bottom - reach} L {left} {bottom - 26} Q {left} {bottom} {left + 26} {bottom} L {left + reach} {bottom}",
        f"M {right - reach} {bottom} L {right - 26} {bottom} Q {right} {bottom} {right} {bottom - 26} L {right} {bottom - reach}",
    ]
    return "".join(
        f'<path d="{d}" fill="none" stroke="url(#mount)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>'
        for d in claws
    )


def phone() -> str:
    p = PHONE
    cx, cy = p["x"] + p["width"] / 2, p["y"] + p["height"] / 2
    return f"""<g transform="rotate({PHONE_TILT_DEGREES} {cx} {cy})">
  <rect x="{p['x'] - 22}" y="{p['y'] + 120}" width="{p['width'] + 44}" height="{p['height'] - 240}" rx="30" fill="{GREEN_DARK}" filter="url(#shadow)"/>
  <rect x="{p['x']}" y="{p['y']}" width="{p['width']}" height="{p['height']}" rx="{p['radius']}" fill="#0b0d10" stroke="#3b4652" stroke-width="3"/>
  <rect x="{p['x'] + p['width'] - 1}" y="{p['y'] + 150}" width="5" height="70" rx="2" fill="#3b4652"/>
  <g clip-path="url(#screen)"><use href="#screen-image"/>
    <rect x="{p['x']}" y="{p['y']}" width="{p['width']}" height="{p['height']}" fill="url(#glare)"/></g>
  {corner_claws()}
</g>"""


def markers() -> str:
    spots = [(1, 712, 868), (2, 690, 150), (3, 500, 800)]
    return "".join(
        f'<g><circle cx="{x}" cy="{y}" r="25" fill="{NAVY}" stroke="{GREEN_SOFT}" stroke-width="4"/>'
        f'<text x="{x}" y="{y + 9}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" '
        f'font-size="26" font-weight="700" fill="{GREEN_SOFT}">{n}</text></g>'
        for n, x, y in spots
    )


def build() -> str:
    screen_data = base64.b64encode(SCREEN.read_bytes()).decode("ascii")
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1100" width="1000" height="1100">'
        f"<title>Concept render: a BikeTO phone mount on a Bike Share handlebar</title>{defs(screen_data)}"
        f'<rect width="1000" height="1100" fill="url(#glow)"/>{handlebar()}{clamp_and_arm()}{phone()}{markers()}</svg>\n'
    )


if __name__ == "__main__":
    OUTPUT.write_text(build(), encoding="utf-8")
    print(f"wrote {OUTPUT.relative_to(ROOT)} ({OUTPUT.stat().st_size // 1024} KB)")
