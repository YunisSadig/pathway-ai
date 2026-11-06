"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Compass,
  Earth,
  GraduationCap,
  MapPin,
  MoveUpRight,
  Route,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
export function HomeExperience() {
  const reduced = useReducedMotion();
  return (
    <main id="main">
      <section className="hero container">
        <motion.div
          className="hero-copy"
          initial={reduced ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="eyebrow">
            <span className="status-dot" /> BIG AMBITIONS. A CLEARER DIRECTION.
          </div>
          <h1>
            Your future
            <br />
            deserves more
            <br />
            than{" "}
            <span className="highlight">
              a guess.
              <svg viewBox="0 0 310 18" aria-hidden="true">
                <path d="M3 13 Q140 -4 304 9" />
              </svg>
            </span>
          </h1>
          <p className="hero-description">
            A world of universities. One path that feels like you.
            <br className="desktop-break" /> Turn your ambitions into a personal
            study-abroad plan —<br className="desktop-break" /> built around
            your strengths, budget, and real life.
          </p>
          <div className="hero-buttons">
            <Button asChild>
              <Link href="/onboarding">
                Let’s find your path <ArrowUpRight size={19} />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/universities">
                Explore the possibilities <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
          <div className="hero-note">
            <span className="mini-check">
              <Check size={12} />
            </span>{" "}
            No perfect grades required. Just a starting point.
          </div>
          <div className="audience">
            <span className="az-flag" aria-hidden="true">
              🇦🇿
            </span>
            <span>
              Made for big dreamers.
              <br />
              <strong>Starting with students in Azerbaijan.</strong>
            </span>
          </div>
        </motion.div>
        <motion.div
          className="hero-art"
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-star star-one" aria-hidden="true">
            ✳
          </span>
          <span className="art-star star-two" aria-hidden="true">
            ✧
          </span>
          <div className="destination-pill">
            <Earth size={15} /> YOUR WORLD IS GETTING BIGGER
          </div>
          <div className="preview-card">
            <div className="preview-top">
              <span className="preview-icon">
                <Compass size={20} />
              </span>
              <span>YOUR NEXT CHAPTER</span>
              <span className="demo-badge">DEMO</span>
            </div>
            <h2>
              Big dreams.
              <br />
              <span>Meet a real plan.</span>
            </h2>
            <div className="preview-route">
              <div className="route-stop">
                <span className="route-node filled">
                  <Check size={12} />
                </span>
                <div>
                  <strong>Where you are</strong>
                  <p>Baku, Azerbaijan · School student</p>
                </div>
              </div>
              <div className="route-stop">
                <span className="route-node">
                  <GraduationCap size={13} />
                </span>
                <div>
                  <strong>Where you could go</strong>
                  <p>Computer science · Europe</p>
                </div>
              </div>
              <div className="route-stop">
                <span className="route-node mint">
                  <Sparkles size={13} />
                </span>
                <div>
                  <strong>How you’ll get there</strong>
                  <p>A plan built around your potential</p>
                </div>
              </div>
            </div>
            <div className="preview-bottom">
              <div className="avatar">A</div>
              <div>
                <strong>Your story is still being written.</strong>
                <p>Let’s figure out the next page.</p>
              </div>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="floating-tag fit-tag">
            <span className="mini-check">
              <CheckCheck size={17} />
            </span>
            <span>
              More than a university.<strong>A better fit for you.</strong>
            </span>
          </div>
          <div className="floating-tag route-tag">
            <span className="tag-icon">
              <Route size={20} />
            </span>
            <div>
              One ambition.<strong>More than one way there.</strong>
            </div>
          </div>
          <div className="coordinate">
            <MapPin size={13} /> BAKU → YOUR NEXT CHAPTER
          </div>
        </motion.div>
      </section>
      <section className="promise-strip">
        <div className="container promise-inner">
          <p>
            A bigger picture.
            <br />
            <strong>A better starting point.</strong>
          </p>
          <span>
            <GraduationCap /> Your academic potential
          </span>
          <span>
            <Compass /> Your kind of student life
          </span>
          <span>
            <Earth /> Your real-world budget
          </span>
          <span>
            <Route /> Your plan A. And plan B.
          </span>
        </div>
      </section>
      <section className="section container" id="how-it-works">
        <div className="section-top">
          <div>
            <div className="eyebrow">FROM “WHAT IF” TO “WHAT’S NEXT”</div>
            <h2>
              You bring the ambition.
              <br />
              We help connect the dots.
            </h2>
          </div>
          <p>
            Studying abroad is a big decision.
            <br />
            Finding your next step shouldn’t be.
          </p>
        </div>
        <div className="steps-grid">
          {[
            {
              n: "01",
              icon: Compass,
              title: "Start with your story",
              text: "Your grades are just one chapter. Tell us about your interests, your budget, and the life you want to build.",
              tone: "purple",
            },
            {
              n: "02",
              icon: Earth,
              title: "See your possibilities",
              text: "Explore illustrative programs through the things that matter: academic fit, cost, lifestyle, and your future.",
              tone: "mint",
            },
            {
              n: "03",
              icon: Route,
              title: "Make your next move",
              text: "Build a preparation roadmap, explore what-if scenarios, and keep a thoughtful backup plan.",
              tone: "coral",
            },
          ].map(({ n, icon: Icon, title, text, tone }) => (
            <article className="step" key={n}>
              <div className="step-heading">
                <span className={`step-icon ${tone}`}>
                  <Icon size={24} />
                </span>
                <span className="step-number">{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="possibility-section container">
        <div className="possibility-visual">
          <span className="eyebrow">A LITTLE “WHAT IF?” CAN GO A LONG WAY</span>
          <div className="score-row">
            <span>
              IELTS today <strong>6.0</strong>
            </span>
            <MoveUpRight size={33} />
            <span>
              Your next goal <strong>7.0</strong>
            </span>
          </div>
          <div className="possibility-line" />
          <p>
            <Sparkles size={17} /> See how preparation changes your demo
            matches.
          </p>
          <span className="fine-print">
            Illustration only. No admission outcomes are predicted.
          </span>
        </div>
        <div className="possibility-copy">
          <span className="eyebrow">POTENTIAL ISN’T A FIXED NUMBER</span>
          <h2>
            You’re more than
            <br />
            your grades today.
          </h2>
          <p>
            A stronger language score. A new project. A few months of focused
            preparation. Explore how small steps could open different doors.
          </p>
          <Link className="text-link" href="/improvement">
            Step into the Improvement Lab <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="closing container">
        <div className="eyebrow">
          YOUR NEXT CHAPTER STARTS WITH ONE SMALL STEP
        </div>
        <h2>
          You don’t need all the answers.
          <br />
          Just somewhere to start.
        </h2>
        <Button asChild>
          <Link href="/onboarding">
            Find my starting point <ArrowUpRight size={18} />
          </Link>
        </Button>
        <p>A browser-local demo. No account needed.</p>
      </section>
    </main>
  );
}
