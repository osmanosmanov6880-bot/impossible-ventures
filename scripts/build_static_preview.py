#!/usr/bin/env python3
"""Build a static GitHub Pages preview without exposing private APIs or operator UI.

The full two-agent game and Pilot Studio applications require a Node backend.
This bundle intentionally supports training and calculations only.
"""
from __future__ import annotations

from pathlib import Path
from shutil import copy2, copytree, rmtree

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "_site"


def build() -> None:
    if DIST.exists():
        rmtree(DIST)
    (DIST / "apps").mkdir(parents=True)

    for name in ("index.html", "privacy.html"):
        copy2(ROOT / name, DIST / name)
    for name in ("dead-drop", "appeal-2049"):
        copytree(ROOT / "apps" / name, DIST / "apps" / name)


    experiment = DIST / "experiments"
    experiment.mkdir()
    for name in ("index.html", "app.js", "style.css"):
        copy2(ROOT / "apps" / "experiment-lab" / name, experiment / name)
    experiment_html = (experiment / "index.html").read_text(encoding="utf-8")
    experiment_html = experiment_html.replace(
        '<a href="./operator/" data-i18n="operatorLink">Кабинет оператора</a>',
        '<span data-i18n="operatorLink">Кабинет доступен через Node-сервер</span>',
        1,
    )
    experiment_html = experiment_html.replace(
        "<body>",
        '<body data-static-preview="true"><div role="note" '
        'style="padding:13px 24px;text-align:center;color:#d4fce7;'
        'background:#1a3431;border-bottom:1px solid #7ab69d">'
        'STATIC PREVIEW / ДЕМОВЕРСИЯ / 静态演示: '
        'Real A/B events and operators require a Node server.</div>',
        1,
    )
    (experiment / "index.html").write_text(experiment_html, encoding="utf-8")

    pilot = DIST / "pilot"
    pilot.mkdir()
    for name in ("index.html", "app.js", "style.css"):
        copy2(ROOT / "apps" / "pilot-studio" / name, pilot / name)

    landing = pilot / "index.html"
    html = landing.read_text(encoding="utf-8")
    for original, replacement in {
        'href="/pilot/style.css"': 'href="./style.css"',
        'src="/pilot/app.js"': 'src="./app.js"',
        'href="/apps/dead-drop/"': 'href="../apps/dead-drop/"',
        'href="/apps/appeal-2049/"': 'href="../apps/appeal-2049/"',
    }.items():
        if original not in html:
            raise RuntimeError(f"Missing Pilot Studio static-preview link: {original}")
        html = html.replace(original, replacement)

    if 'id="submitLead"' not in html or "<main>" not in html:
        raise RuntimeError("Pilot Studio form or main landmark missing")
    # Users can use the calculator, but the public static demo cannot accept
    # a live pilot application, and must not imply that it can.
    html = html.replace(
        'id="submitLead"',
        'id="submitLead" disabled aria-disabled="true" title="Requires the Node API"',
        1,
    )
    notice = (
        '<div role="note" style="max-width:1100px;margin:22px auto;'
        'padding:17px 22px;border:1px solid #7da98d;border-radius:12px;'
        'background:#14241f;color:#e6fbe7;font:15px/1.6 system-ui,sans-serif">'
        '<strong>STATIC PREVIEW / ДЕМОВЕРСИЯ / 静态预览</strong> — '
        'Campaign planning works locally. Submitting a pilot request needs '
        'the private Node server. Заявка требует сервер. 申请需连接服务器.'
        '</div>'
    )
    html = html.replace("<main>", notice + "\n<main>", 1)
    if "<body>" not in html:
        raise RuntimeError("Pilot Studio body tag missing")
    html = html.replace("<body>", '<body data-static-preview="true">', 1)
    landing.write_text(html, encoding="utf-8")

    app_file = pilot / "app.js"
    app_code = app_file.read_text(encoding="utf-8")
    submit_anchor = "leadForm.addEventListener('submit',async event=>{" + chr(10) + "  event.preventDefault();"
    if submit_anchor not in app_code:
        raise RuntimeError("Pilot Studio submit handler changed; adjust static preview guard")
    app_code = app_code.replace(
        submit_anchor,
        submit_anchor + chr(10)
        + "  if (document.body.dataset.staticPreview === 'true') {"
        + chr(10) + "    showMessage(labels().unavailable, true);"
        + chr(10) + "    return;"
        + chr(10) + "  }",
        1,
    )
    app_file.write_text(app_code, encoding="utf-8")

    (DIST / ".nojekyll").touch()

    for name in (
        "index.html",
        "privacy.html",
        "pilot/index.html",
        "pilot/app.js",
        "pilot/style.css",
        "experiments/index.html",
        "experiments/app.js",
        "experiments/style.css",
        "apps/dead-drop/index.html",
        "apps/dead-drop/app.js",
        "apps/dead-drop/i18n.js",
        "apps/appeal-2049/index.html",
    ):
        if not (DIST / name).is_file():
            raise RuntimeError(f"Missing static output: {name}")

    if 'data-static-preview="true"' not in (DIST / "pilot/index.html").read_text(encoding="utf-8"):
        raise RuntimeError("Static Pilot Studio data mode not declared")
    if "disabled aria-disabled" not in (DIST / "pilot/index.html").read_text(encoding="utf-8"):
        raise RuntimeError("Static Pilot Studio application button must be disabled")

    if (DIST / "experiments" / "operator").exists():
        raise RuntimeError("Operator console must not be in public static preview")
    if 'data-static-preview="true"' not in (DIST / "experiments/index.html").read_text(encoding="utf-8"):
        raise RuntimeError("Experiment Lab static-only disclosure missing")

    print("Static preview built:", DIST)


if __name__ == "__main__":
    build()
