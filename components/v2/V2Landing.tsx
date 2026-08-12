"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { FormEvent, PointerEvent, ReactNode, useMemo, useRef, useState } from "react";
import { asset, site, whatsappUrl } from "@/lib/site";
import styles from "@/app/v2/v2.module.css";

type ProgramId = "tef" | "delf" | "foundation";

type Program = {
  id: ProgramId;
  kicker: string;
  title: string;
  short: string;
  level: string;
  detail: string;
  chips: string[];
};

const PROGRAMS: Program[] = [
  {
    id: "tef",
    kicker: "Canada pathway",
    title: "TEF / TCF",
    short: "Exam-focused preparation with a clear CLB target.",
    level: "CLB 7+",
    detail: "Structured preparation across speaking, writing, listening and reading — with feedback built around the exam format and your current level.",
    chips: ["Exam strategy", "Speaking feedback", "Writing review"],
  },
  {
    id: "delf",
    kicker: "Certification pathway",
    title: "DELF",
    short: "Build your French toward an internationally recognised level.",
    level: "A1 → B2",
    detail: "A level-based learning path for learners preparing for DELF certification, from foundations through independent French.",
    chips: ["A1–B2", "Structured levels", "Exam confidence"],
  },
  {
    id: "foundation",
    kicker: "Language pathway",
    title: "French Foundations",
    short: "Start well. Speak sooner. Build the language properly.",
    level: "Beginner+",
    detail: "A guided path for learners who want a strong base before moving into exam preparation or more advanced French.",
    chips: ["Grammar", "Conversation", "Vocabulary"],
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function BrandMark() {
  return (
    <a href="#top" className={styles.wordmark} aria-label="The Français Hub home">
      <span className={styles.wordmarkThe}>the</span>
      <span className={styles.wordmarkFrancais}>français</span>
      <span className={styles.wordmarkHub}>hub<span>.</span></span>
    </a>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={styles.arrow}>{diagonal ? "↗" : "→"}</span>;
}

function MagneticButton({ children, href, filled = false }: { children: ReactNode; href: string; filled?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: .4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: .4 });

  function move(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * .12);
    y.set((e.clientY - r.top - r.height / 2) * .12);
  }

  return (
    <motion.a
      href={href}
      onPointerMove={move}
      onPointerLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }}
      className={`${styles.button} ${filled ? styles.buttonFilled : styles.buttonGhost}`}
    >
      <span>{children}</span><Arrow />
    </motion.a>
  );
}

function ProgramCard({ program, active, onSelect }: { program: Program; active: boolean; onSelect: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={`${styles.programCard} ${active ? styles.programCardActive : ""}`}
      whileHover={{ y: -6 }}
      transition={{ duration: .3 }}
    >
      <div className={styles.programTopline}>
        <span>{program.kicker}</span>
        <span>{program.level}</span>
      </div>
      <div>
        <h3>{program.title}</h3>
        <p>{program.short}</p>
      </div>
      <div className={styles.programCardBottom}>
        <span>Choose pathway</span>
        <span className={styles.programPlus}>{active ? "—" : "+"}</span>
      </div>
    </motion.button>
  );
}

function ResultTile({ type, lines, image }: { type: string; lines: { score: string; label: string }[]; image: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button type="button" className={styles.resultTile} onClick={() => setOpen(true)} whileHover={{ y: -5 }}>
        <div className={styles.resultHeader}><span>{type}</span><span>View proof ↗</span></div>
        <div className={styles.resultScores}>
          {lines.map((line) => <div key={line.label}><strong>{line.score}</strong><span>{line.label}</span></div>)}
        </div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div className={styles.modal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className={styles.modalCard} initial={{ opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} onClick={(e) => e.stopPropagation()}>
              <button type="button" className={styles.modalClose} onClick={() => setOpen(false)}>Close ×</button>
              <img src={asset(image)} alt={`${type} student result`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function V2Landing() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<ProgramId>("tef");
  const [form, setForm] = useState({ name: "", phone: "", level: "", goal: "" });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -34]);
  const selectedProgram = useMemo(() => PROGRAMS.find((p) => p.id === selected)!, [selected]);

  const jumpToRegister = (id: ProgramId) => {
    setSelected(id);
    document.getElementById("register")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = [
      "Hi Yana! I found The Français Hub website and I'd like to register my interest.",
      "",
      `Programme: ${selectedProgram.title}`,
      `Name: ${form.name || "Not provided"}`,
      `WhatsApp: ${form.phone || "Not provided"}`,
      `Current French level: ${form.level || "Not sure"}`,
      `Goal: ${form.goal || "I'd like to discuss this with you"}`,
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.shell} id="top">
      <div className={styles.noise} aria-hidden="true" />

      <header className={styles.header}>
        <BrandMark />
        <div className={styles.headerRight}>
          <span className={styles.liveDot}><i /> Small batches · online</span>
          <a href="#register" className={styles.headerCta}>Register <Arrow /></a>
        </div>
      </header>

      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroAura} aria-hidden="true" />
        <motion.div className={styles.heroCopy} style={{ y: textY }}>
          <motion.p className={styles.eyebrow} initial="hidden" animate="show" variants={reveal} transition={{ duration: .7 }}>French learning · by Yana Budhiraja</motion.p>
          <motion.h1 initial="hidden" animate="show" variants={reveal} transition={{ duration: .9, delay: .08, ease: [0.22, 1, 0.36, 1] }}>
            Your French goal,<br/><em>beautifully guided.</em>
          </motion.h1>
          <motion.p className={styles.heroDek} initial="hidden" animate="show" variants={reveal} transition={{ duration: .8, delay: .2 }}>
            Premium online French coaching for TEF, TCF and DELF learners — personal, structured and limited to four students per batch.
          </motion.p>
          <motion.div className={styles.heroActions} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34, duration: .7 }}>
            <MagneticButton href="#programs" filled>Choose your programme</MagneticButton>
            <MagneticButton href={whatsappUrl()}>Talk to Yana</MagneticButton>
          </motion.div>
          <motion.div className={styles.heroProof} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .8 }}>
            <span><strong>C1</strong> certified tutor</span>
            <span><strong>04</strong> max. per batch</span>
            <span><strong>100%</strong> online</span>
          </motion.div>
        </motion.div>

        <motion.div className={styles.heroVisual} style={{ y: imageY }} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, delay: .08, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.heroImageFrame}>
            <img src={asset("/images/yana-hero.webp")} alt="Yana Budhiraja, French tutor" />
            <div className={styles.heroImageShade} />
            <div className={styles.imageNote}><span>Bonjour,</span><strong>I&apos;m Yana.</strong></div>
          </div>
          <motion.div
  className={styles.heroCredential}
  aria-hidden="true"
  initial={{ opacity: 0, x: -24 }}
  animate={{ opacity: 1, x: 0 }}
  whileHover={{ y: -4 }}
  transition={{
    duration: .8,
    delay: .55,
    ease: [0.22, 1, 0.36, 1]
  }}
>
  <span className={styles.credentialLevel}>C1</span>

  <div className={styles.credentialCopy}>
    <strong>Certified</strong>
    <small>French tutor</small>
  </div>
</motion.div>
          <div className={styles.heroTag}>TEF · TCF · DELF</div>
        </motion.div>

        <a href="#programs" className={styles.scrollCue}><span>Explore</span><i /></a>
      </section>

      <section id="programs" className={styles.programsSection}>
        <motion.div className={styles.sectionIntro} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-12%" }} variants={reveal} transition={{ duration: .8 }}>
          <p className={styles.eyebrow}>01 · Choose your direction</p>
          <h2>What are you learning<br/><em>French for?</em></h2>
        </motion.div>

        <div className={styles.programGrid}>
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} active={selected === program.id} onSelect={() => setSelected(program.id)} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selected} className={styles.programDetail} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
            <div>
              <span className={styles.detailIndex}>{selectedProgram.level}</span>
              <h3>{selectedProgram.title}</h3>
            </div>
            <p>{selectedProgram.detail}</p>
            <div className={styles.chips}>{selectedProgram.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
            <button type="button" onClick={() => jumpToRegister(selectedProgram.id)} className={styles.inlineCta}>Register interest <Arrow /></button>
          </motion.div>
        </AnimatePresence>
      </section>

      <section className={styles.statementSection}>
        <div className={styles.statementSticky}>
          <p className={styles.eyebrowLight}>02 · Small by design</p>
          <h2>Maximum<br/><strong>04</strong></h2>
          <p>students per batch.</p>
          <span>Because language learning should never feel anonymous.</span>
        </div>
        <div className={styles.statementCards}>
          {["Personal feedback", "Adaptive teaching", "More speaking time", "Direct guidance from Yana"].map((item, i) => (
            <motion.div key={item} className={styles.statementCard} initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: .7, delay: i * .05 }}>
              <span>0{i + 1}</span><p>{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.yanaSection}>
        <div className={styles.yanaImageWrap}>
          <motion.img src={asset("/images/yana-standing.webp")} alt="Yana Budhiraja" initial={{ scale: 1.04 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.1 }} />
          <span className={styles.yanaCaption}>C1-level certified French tutor</span>
        </div>
        <motion.div className={styles.yanaCopy} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }} variants={reveal} transition={{ duration: .8 }}>
          <p className={styles.eyebrow}>03 · Learn with Yana</p>
          <h2>High energy.<br/><em>High attention.</em></h2>
          <p>Every class is taught by Yana herself — with an adaptable approach built around where you are, where you need to go, and what is holding your French back.</p>
          <div className={styles.yanaTraits}><span>Dedicated</span><span>Adaptable</span><span>Exam-focused</span><span>Language-first</span></div>
          <a href={site.instagram} target="_blank" rel="noreferrer" className={styles.inlineCta}>See Yana on Instagram <Arrow diagonal /></a>
        </motion.div>
      </section>

      <section className={styles.resultsSection}>
        <motion.div className={styles.resultsHead} initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ duration: .8 }}>
          <p className={styles.eyebrow}>04 · Student outcomes</p>
          <h2>Progress you can<br/><em>actually see.</em></h2>
          <p>Real scorecards shared by students. Names and personal details remain hidden.</p>
        </motion.div>
        <div className={styles.resultsGrid}>
          <ResultTile type="TEF Canada" image="/results/tef-result.jpg" lines={[{ score: "C1", label: "Reading" }, { score: "B2", label: "Listening" }, { score: "B2", label: "Writing" }, { score: "B2", label: "Speaking" }]} />
          <ResultTile type="TCF Canada" image="/results/tcf-result.jpg" lines={[{ score: "C1", label: "Listening" }, { score: "B2", label: "Reading" }, { score: "B2", label: "Speaking" }, { score: "B1", label: "Writing" }]} />
        </div>
      </section>

      <section className={styles.languageSection} aria-label="French learning progression">
        <p className={styles.eyebrowLight}>05 · The shift</p>
        <div className={styles.languageTrack}>
          {[
            ["Je mémorise.", "I memorise."],
            ["Je comprends.", "I understand."],
            ["Je parle.", "I speak."],
            ["Je pense", "en français."],
          ].map(([main, sub], i) => (
            <motion.div key={main} className={styles.languageLine} initial={{ opacity: .18, x: i % 2 ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: .65 }} transition={{ duration: .55 }}>
              <span>{main}</span><em>{sub}</em>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="register" className={styles.registerSection}>
        <div className={styles.registerCopy}>
          <p className={styles.eyebrow}>06 · Register your interest</p>
          <h2>Your next class<br/><em>starts with hello.</em></h2>
          <p>Tell Yana what you&apos;re working toward. Your details will be turned into a pre-filled WhatsApp message — no account, no checkout, no friction.</p>
          <div className={styles.selectedBadge}><span>Selected programme</span><strong>{selectedProgram.title}</strong><small>{selectedProgram.level}</small></div>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formPrograms}>
            {PROGRAMS.map((p) => <button type="button" key={p.id} onClick={() => setSelected(p.id)} className={selected === p.id ? styles.formProgramActive : ""}>{p.title}</button>)}
          </div>
          <label><span>Your name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" /></label>
          <label><span>WhatsApp number</span><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="+91 …" /></label>
          <label><span>Current French level</span><select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option value="">Choose one</option><option>Absolute beginner</option><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>Not sure</option></select></label>
          <label><span>What are you working toward?</span><textarea value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="TEF timeline, DELF level, your current challenge…" rows={4} /></label>
          <button type="submit" className={styles.submitButton}><span>Continue on WhatsApp</span><Arrow diagonal /></button>
          <p className={styles.formNote}>This does not send anything automatically. WhatsApp opens with your details ready for you to review and send.</p>
        </form>
      </section>

      <footer className={styles.footer}>
        <BrandMark />
        <p>French, with direction.</p>
        <div><a href={site.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={whatsappUrl()}>WhatsApp ↗</a></div>
        <span>© 2026 The Français Hub · by Yana Budhiraja</span>
      </footer>
    </div>
  );
}
