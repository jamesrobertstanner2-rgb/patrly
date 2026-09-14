* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: Inter, Arial, Helvetica, sans-serif;
    background:
        radial-gradient(circle at 50% -10%, rgba(82, 52, 180, 0.22), transparent 35%),
        #050509;
    color: #ffffff;
    line-height: 1.6;
    overflow-x: hidden;
}

button,
a {
    font: inherit;
}

button {
    cursor: pointer;
}

a {
    color: inherit;
    text-decoration: none;
}


/* NAVBAR */

.navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(5, 5, 9, 0.78);
    backdrop-filter: blur(20px);
}

.nav-container {
    max-width: 1200px;
    margin: auto;
    min-height: 76px;
    padding: 0 25px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 21px;
    font-weight: 800;
}

.brand img {
    width: 38px;
    height: 38px;
    object-fit: contain;
}

.nav-links {
    display: flex;
    gap: 30px;
    margin-left: auto;
}

.nav-links a {
    color: #a7a7b5;
    font-size: 14px;
    transition: 0.2s;
}

.nav-links a:hover {
    color: #ffffff;
}

.login-button {
    border: 1px solid rgba(120, 90, 255, 0.5);
    background: rgba(91, 58, 220, 0.15);
    color: white;
    padding: 10px 17px;
    border-radius: 9px;
    transition: 0.2s;
}

.login-button:hover {
    background: rgba(91, 58, 220, 0.3);
}


/* HERO */

.hero {
    max-width: 1200px;
    margin: auto;
    padding: 110px 25px 90px;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-content {
    max-width: 850px;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;

    padding: 7px 13px;
    border-radius: 50px;

    color: #b9b9c9;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);

    font-size: 13px;
    margin-bottom: 25px;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #7c5cff;
    box-shadow: 0 0 12px #7c5cff;
}

.hero h1 {
    font-size: clamp(50px, 8vw, 86px);
    line-height: 1;
    letter-spacing: -4px;
    font-weight: 850;
}

.hero h1 span {
    background: linear-gradient(90deg, #5d5cff, #a66cff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.hero-content > p {
    max-width: 680px;
    margin: 25px auto 0;
    color: #9999aa;
    font-size: 18px;
}

.hero-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 32px;
    flex-wrap: wrap;
}

.primary-button,
.secondary-button {
    border-radius: 10px;
    padding: 13px 21px;
    border: none;
    font-weight: 700;
    transition: 0.2s;
}

.primary-button {
    color: white;
    background: linear-gradient(100deg, #5146df, #774ce7);
    box-shadow: 0 10px 35px rgba(90, 70, 220, 0.2);
}

.primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(90, 70, 220, 0.35);
}

.secondary-button {
    color: white;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.secondary-button:hover {
    background: rgba(255, 255, 255, 0.09);
}

.hero-note {
    margin-top: 18px;
    font-size: 12px;
    color: #777789;
}

.hero-note span {
    color: #7c5cff;
}


/* DASHBOARD PREVIEW */

.dashboard-preview {
    width: 100%;
    max-width: 1050px;
    margin-top: 70px;

    border-radius: 16px;
    overflow: hidden;

    background: #0b0b11;
    border: 1px solid rgba(255, 255, 255, 0.1);

    box-shadow:
        0 35px 100px rgba(0, 0, 0, 0.6),
        0 0 100px rgba(80, 50, 200, 0.08);

    text-align: left;
}

.preview-top {
    height: 48px;
    padding: 0 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    color: #777789;
    font-size: 12px;

    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.window-dots {
    position: absolute;
    left: 18px;
    display: flex;
    gap: 6px;
}

.window-dots i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #32323d;
}

.preview-body {
    display: flex;
    min-height: 520px;
}

.preview-sidebar {
    width: 190px;
    padding: 22px 13px;
    background: #09090e;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.preview-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 10px 25px;
}

.preview-logo img {
    width: 27px;
    height: 27px;
    object-fit: contain;
}

.preview-logo strong {
    font-size: 14px;
}

.sidebar-item {
    display: flex;
    gap: 10px;
    align-items: center;

    padding: 10px 12px;
    margin-bottom: 5px;

    border-radius: 7px;

    color: #777789;
    font-size: 12px;
}

.sidebar-item span {
    width: 16px;
    text-align: center;
}

.sidebar-item.active {
    background: rgba(92, 70, 220, 0.16);
    color: #b8aaff;
}

.preview-main {
    flex: 1;
    padding: 28px;
    background: #0d0d14;
}

.preview-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.preview-heading small {
    color: #666675;
    font-size: 9px;
    letter-spacing: 1px;
}

.preview-heading h3 {
    font-size: 20px;
    margin-top: 3px;
}

.user-circle {
    width: 35px;
    height: 35px;
    border-radius: 50%;

    display: grid;
    place-items: center;

    background: linear-gradient(135deg, #5545dd, #8b54e9);
    font-size: 13px;
    font-weight: bold;
}

.stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 13px;
    margin-top: 25px;
}

.stat-card {
    padding: 18px;
    border-radius: 10px;
    background: #111119;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-card small {
    display: block;
    color: #777789;
    font-size: 10px;
}

.stat-card strong {
    display: block;
    font-size: 27px;
    margin: 4px 0;
}

.stat-card span {
    font-size: 9px;
}

.positive {
    color: #6fca9d;
}

.neutral {
    color: #888898;
}

.preview-panels {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 13px;
    margin-top: 13px;
}

.panel {
    padding: 17px;
    background: #111119;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.panel-header strong {
    font-size: 12px;
}

.panel-header span {
    color: #7663dc;
    font-size: 10px;
}

.report {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.report-icon {
    width: 25px;
    height: 25px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background: rgba(255, 180, 80, 0.1);
    color: #e5ad64;
    font-size: 11px;
}

.report div:nth-child(2) {
    flex: 1;
}

.report strong {
    display: block;
    font-size: 10px;
}

.report small {
    color: #696977;
    font-size: 8px;
}

.report b {
    font-size: 8px;
}

.pending {
    color: #e6b45e;
}

.reviewed {
    color: #65bf95;
}

.activity {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    padding: 10px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.activity span {
    width: 6px;
    height: 6px;
    margin-top: 5px;
    border-radius: 50%;
    background: #765cff;
}

.activity p {
    color: #777789;
    font-size: 9px;
}

.activity b {
    color: #bcbccc;
}


/* SECTIONS */

.section {
    max-width: 1200px;
    margin: auto;
    padding: 110px 25px;
}

.section-heading {
    max-width: 700px;
    margin: auto;
    text-align: center;
}

.section-label {
    color: #7968e7;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    margin-bottom: 13px;
}

.section-heading h2,
.dashboard-content h2 {
    font-size: clamp(34px, 5vw, 54px);
    line-height: 1.1;
    letter-spacing: -2px;
}

.section-heading p,
.dashboard-content > p {
    margin-top: 17px;
    color: #888898;
}


/* FEATURES */

.feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-top: 55px;
}

.feature-card {
    padding: 28px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.07);
    transition: 0.25s;
}

.feature-card:hover {
    transform: translateY(-5px);
    border-color: rgba(112, 88, 230, 0.4);
    background: rgba(92, 70, 220, 0.06);
}

.feature-icon {
    width: 43px;
    height: 43px;

    display: grid;
    place-items: center;

    margin-bottom: 20px;

    border-radius: 10px;
    background: rgba(100, 75, 220, 0.14);
    color: #9688ed;
}

.feature-card h3 {
    font-size: 17px;
}

.feature-card p {
    margin-top: 9px;
    color: #777789;
    font-size: 13px;
}

.feature-card > span {
    display: block;
    margin-top: 18px;
    color: #8a79eb;
    font-size: 12px;
}


/* DASHBOARD SECTION */

.dashboard-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 70px;
    align-items: center;
}

.dashboard-content h2 span {
    color: #7966e6;
}

.dashboard-content .primary-button {
    margin-top: 25px;
}

.dashboard-box {
    padding: 25px;

    border-radius: 15px;

    background:
        radial-gradient(circle at top right, rgba(102, 75, 220, 0.18), transparent 45%),
        #0c0c13;

    border: 1px solid rgba(255, 255, 255, 0.08);

    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3);
}

.dashboard-line {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px 0;

    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    color: #888898;
}

.dashboard-line:last-child {
    border-bottom: none;
}

.dashboard-line b {
    color: white;
}

.dashboard-line .online {
    color: #62c798;
}


/* ABOUT */

.about-section {
    padding-top: 80px;
}


/* CTA */

.cta {
    max-width: 1150px;
    margin: 40px auto 100px;
    padding: 75px 25px;

    text-align: center;

    border-radius: 20px;

    background:
        radial-gradient(circle at 50% 100%, rgba(104, 75, 230, 0.22), transparent 55%),
        #0b0b12;

    border: 1px solid rgba(255, 255, 255, 0.08);
}

.cta-content {
    max-width: 650px;
    margin: auto;
}

.cta h2 {
    font-size: clamp(34px, 5vw, 52px);
    letter-spacing: -2px;
}

.cta p {
    color: #888898;
    margin-top: 12px;
}


/* FOOTER */

footer {
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding: 30px 25px;
}

.footer-container {
    max-width: 1200px;
    margin: auto;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.footer-brand {
    display: flex;
    align-items: center;
    gap: 9px;
    font-weight: 800;
}

.footer-brand img {
    width: 30px;
    height: 30px;
    object-fit: contain;
}

.footer-container p,
.copyright {
    color: #666675;
    font-size: 11px;
}


/* MOBILE */

@media (max-width: 850px) {

    .nav-links {
        display: none;
    }

    .preview-sidebar {
        display: none;
    }

    .preview-panels {
        grid-template-columns: 1fr;
    }

    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-section {
        grid-template-columns: 1fr;
    }

    .footer-container {
        flex-direction: column;
        text-align: center;
    }
}


@media (max-width: 600px) {

    .nav-container {
        padding: 0 15px;
    }

    .login-button {
        padding: 8px 12px;
        font-size: 12px;
    }

    .hero {
        padding-top: 80px;
    }

    .hero h1 {
        letter-spacing: -2px;
    }

    .hero-content > p {
        font-size: 15px;
    }

    .dashboard-preview {
        margin-top: 45px;
    }

    .preview-main {
        padding: 18px;
    }

    .stats {
        grid-template-columns: 1fr;
    }

    .feature-grid {
        grid-template-columns: 1fr;
    }

    .section {
        padding: 75px 18px;
    }

    .cta {
        margin: 20px 15px 70px;
        padding: 55px 18px;
    }
}