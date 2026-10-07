/**
 * Federal Institute of Science and Technology (FISAT)
 * THE VIBE EDITION - Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initVibeSwitcher();
  initNavbar();
  initBranchQuiz();
  initCampusSynthSound();
  initCraveOMatic();
  initProjectsFilter();
  initPhoneSimulator();
  initLibraryBookSearch();
  initProgramFilter();
  initAdmissionsCalculator();
  initSearch();
  initModals();
  initEnquiryForm();
});

/* ==========================================================================
   1. The Vibe Switcher (Live Palette Theme Switcher)
   ========================================================================== */
function initVibeSwitcher() {
  const vibeButtons = document.querySelectorAll('.vibe-pill');
  const savedVibe = localStorage.getItem('fisat_vibe_mode') || 'default';

  if (savedVibe !== 'default') {
    document.documentElement.setAttribute('data-vibe', savedVibe);
  }

  vibeButtons.forEach(btn => {
    const vibe = btn.getAttribute('data-vibe');
    if ((savedVibe === 'default' && vibe === 'default') || savedVibe === vibe) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      vibeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (vibe === 'default') {
        document.documentElement.removeAttribute('data-vibe');
        localStorage.removeItem('fisat_vibe_mode');
      } else {
        document.documentElement.setAttribute('data-vibe', vibe);
        localStorage.setItem('fisat_vibe_mode', vibe);
      }

      showToast(`Vibe switched to ${btn.textContent.trim()} ⚡`, 'success');
      launchMiniConfetti();
    });
  });

  // Top header quick toggle
  const quickThemeBtn = document.getElementById('theme-toggle');
  if (quickThemeBtn) {
    quickThemeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-vibe');
      let nextVibe = 'synthwave';
      if (!current) nextVibe = 'synthwave';
      else if (current === 'synthwave') nextVibe = 'matrix';
      else if (current === 'matrix') nextVibe = 'ocean';
      else if (current === 'ocean') nextVibe = 'daybreak';
      else nextVibe = 'default';

      if (nextVibe === 'default') {
        document.documentElement.removeAttribute('data-vibe');
        localStorage.removeItem('fisat_vibe_mode');
      } else {
        document.documentElement.setAttribute('data-vibe', nextVibe);
        localStorage.setItem('fisat_vibe_mode', nextVibe);
      }

      vibeButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-vibe') === nextVibe);
      });

      showToast(`Vibe shifted! 🎨`, 'info');
    });
  }
}

/* ==========================================================================
   2. Sticky Header & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('open');
          const icon = toggle.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
          }
        }
      });
    });
  }
}

/* ==========================================================================
   3. "Find Your Vibe" Branch Matcher Quiz
   ========================================================================== */
const branchProfiles = {
  'coder': {
    title: 'B.Tech Computer Science & Engineering (AI / ML)',
    vibe: '🔥 100% Code Wizard / Algorithm Overlord',
    desc: 'You want to build deep neural nets, hack systems, and ship next-gen software. You thrive in hackathons like Arcane and want that ₹17.5 LPA bag.',
    stats: '180 + 60 Intake • NBA Accredited • NVIDIA GPU Labs',
    actionCourse: 'B.Tech Computer Science & Engineering'
  },
  'maker': {
    title: 'B.Tech Electronics & Communication Engineering',
    vibe: '⚡ Silicon Architect & Hardware Rebel',
    desc: 'Chips, IoT sensors, radio signals and microcontrollers are your jam. You will live inside the AICTE IDEA Lab and Cadence VLSI cleanrooms.',
    stats: '120 Intake • NBA Accredited • Synopsys & Cadence Tools',
    actionCourse: 'B.Tech Electronics & Communication Engineering'
  },
  'ev': {
    title: 'B.Tech Electrical & Electronics Engineering',
    vibe: '🔋 Clean Energy Titan & Power Beast',
    desc: 'You dream of building electric supercars, microgrids, and green energy powerplants. High-voltage energy and battery packs drive your passion.',
    stats: '60 Intake • NBA Accredited • EV Prototyping Benches',
    actionCourse: 'B.Tech Electrical & Electronics Engineering'
  },
  'speed': {
    title: 'B.Tech Mechanical Engineering',
    vibe: '🏎️ Formula SAE Gearhead & Aero Master',
    desc: 'You want to bend steel, design high-octane chassis, and run precision CNC routers. Additive manufacturing and robotics are your kingdom.',
    stats: '60 Intake • NBA Accredited • Formula Student Racing Team',
    actionCourse: 'B.Tech Mechanical Engineering'
  },
  'structures': {
    title: 'B.Tech Civil Engineering',
    vibe: '🏗️ Mega-Infrastructure Creator',
    desc: 'You want to build towering skyscrapers, resilient smart cities, and green structures that withstand earthquakes. Real-world civil impact.',
    stats: '60 Intake • NBA Accredited • NABL Testing Lab',
    actionCourse: 'B.Tech Civil Engineering'
  },
  'ceo': {
    title: 'MBA - FISAT Business School (FBS)',
    vibe: '💼 Future Tech Unicorn CEO & Hustler',
    desc: 'You analyze markets, raise venture capital, and build brands. Promoted by Federal Bank leaders with dual specializations in Finance and Analytics.',
    stats: '120 Intake • Dual Specialization • 100% Corporate Placement',
    actionCourse: 'MBA (FISAT Business School)'
  }
};

function initBranchQuiz() {
  const options = document.querySelectorAll('.quiz-option-btn');
  const resultCard = document.getElementById('quiz-result');

  if (!options.length || !resultCard) return;

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      const profileKey = opt.getAttribute('data-archetype');
      const profile = branchProfiles[profileKey];

      if (profile) {
        resultCard.style.display = 'block';
        resultCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="sticker sticker-pink">${profile.vibe}</span>
            <span style="font-family: var(--font-display); font-size: 0.85rem; color: var(--primary); font-weight: 700;">${profile.stats}</span>
          </div>
          <h3 style="font-size: 1.6rem; color: var(--text-main); margin-bottom: 0.5rem;">${profile.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">${profile.desc}</p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="openApplyModal('${profile.actionCourse}')">
              <i class="fas fa-fire"></i> Claim Your Spot in this Branch
            </button>
            <a href="departments.html" class="btn btn-glass btn-sm">
              <i class="fas fa-arrow-right"></i> Explore Department
            </a>
          </div>
        `;
        launchMiniConfetti();
        showToast(`Matched with ${profile.title}! 🎯`, 'success');
      }
    });
  });
}

/* ==========================================================================
   4. Ambient Campus Synth Beat Generator (Browser Audio API)
   ========================================================================== */
let audioCtx = null;
let isPlayingSynth = false;
let synthInterval = null;

function initCampusSynthSound() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!isPlayingSynth) {
      startAmbientSynth();
      isPlayingSynth = true;
      soundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Campus Beat: ON';
      soundBtn.classList.add('sticker-lime');
      showToast('Chill campus synth ambient playing 🎧', 'info');
    } else {
      stopAmbientSynth();
      isPlayingSynth = false;
      soundBtn.innerHTML = '<i class="fas fa-headphones"></i> Campus Vibe Track';
      soundBtn.classList.remove('sticker-lime');
      showToast('Synth audio paused 🔇', 'info');
    }
  });
}

function startAmbientSynth() {
  const chords = [
    [220.00, 261.63, 329.63], // A minor
    [174.61, 220.00, 261.63], // F major
    [196.00, 246.94, 293.66], // G major
    [164.81, 196.00, 246.94]  // E minor
  ];
  let chordIndex = 0;

  const playChord = () => {
    if (!isPlayingSynth) return;
    const currentChord = chords[chordIndex];
    chordIndex = (chordIndex + 1) % chords.length;

    currentChord.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 3.3);
    });
  };

  playChord();
  synthInterval = setInterval(playChord, 3500);
}

function stopAmbientSynth() {
  if (synthInterval) clearInterval(synthInterval);
}

/* ==========================================================================
   5. Lightweight Canvas-free Confetti Burst
   ========================================================================== */
function launchMiniConfetti() {
  const colors = ['#ccff00', '#ff007f', '#00f5d4', '#8b5cf6', '#ffffff'];
  for (let i = 0; i < 24; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${Math.random() * 80 + 10}vw`;
    confetti.style.top = `${Math.random() * 20 + 20}vh`;
    confetti.style.width = `${Math.random() * 8 + 6}px`;
    confetti.style.height = `${Math.random() * 8 + 6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
    document.body.appendChild(confetti);

    requestAnimationFrame(() => {
      confetti.style.transform = `translateY(${Math.random() * 200 + 100}px) rotate(${Math.random() * 720}deg) scale(0)`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => confetti.remove(), 1000);
  }
}

/* ==========================================================================
   6. Course Database & Modals
   ========================================================================== */
const courseDatabase = {
  'cse': {
    title: 'B.Tech in Computer Science & Engineering',
    dept: 'Department of Computer Science & Engineering',
    duration: '4 Years (8 Semesters)',
    intake: '180 Seats (NBA Accredited)',
    code: 'CS',
    keamCode: 'FIT',
    eligibility: '10+2 with Physics, Mathematics & Chem/CS (min 45%). Valid KEAM rank.',
    curriculum: ['Distributed Systems & Cloud', 'AI & Machine Learning Foundations', 'Data Structures & Algorithms', 'Operating Systems', 'Full Stack DevOps'],
    careers: ['Software Engineer @ Big Tech', 'Full Stack Unicorn Developer', 'AI Solutions Architect'],
    highlights: 'KTU Recognized Ph.D Research Centre. Established in 2002. High placement record with offers up to ₹17.5 LPA.'
  },
  'csa': {
    title: 'B.Tech CSE (Artificial Intelligence & Machine Learning)',
    dept: 'Department of Computer Science & Engineering',
    duration: '4 Years (8 Semesters)',
    intake: '60 Seats (AICTE Approved)',
    code: 'CSA',
    keamCode: 'FIT',
    eligibility: '10+2 with Physics, Mathematics & Chem/CS (min 45%). Valid KEAM rank.',
    curriculum: ['Deep Learning & Neural Nets', 'NLP & Large Language Models', 'Computer Vision & Robotics', 'Autonomous Systems'],
    careers: ['AI Researcher', 'Machine Learning Engineer', 'Data Scientist @ MNCs'],
    highlights: 'Dedicated NVIDIA GPU server clusters for student training.'
  },
  'ece': {
    title: 'B.Tech Electronics & Communication Engineering',
    dept: 'Department of Electronics & Communication',
    duration: '4 Years (8 Semesters)',
    intake: '120 Seats (NBA Accredited)',
    code: 'EC',
    keamCode: 'FIT',
    eligibility: '10+2 with Physics, Mathematics & Chem (min 45%). Valid KEAM rank.',
    curriculum: ['VLSI Chip Architecture', '5G Wireless Networks', 'Embedded IoT Systems', 'Digital Signal Processing'],
    careers: ['VLSI Design Engineer (Cadence / Intel)', 'Embedded Firmware Hacker', 'Robotics Hardware Engineer'],
    highlights: 'Equipped with licensed Cadence EDA and Synopsys toolkits.'
  },
  'eee': {
    title: 'B.Tech Electrical & Electronics Engineering',
    dept: 'Department of Electrical & Electronics',
    duration: '4 Years (8 Semesters)',
    intake: '60 Seats (NBA Accredited)',
    code: 'EE',
    keamCode: 'FIT',
    eligibility: '10+2 with PCM (min 45%). Valid KEAM rank.',
    curriculum: ['Electric Vehicle Powertrains', 'Microgrids & Solar Power', 'Industrial Automation & PLC', 'Power Electronics'],
    careers: ['EV Powertrain Specialist', 'Power Systems Consultant', 'Renewable Energy Architect'],
    highlights: 'Dedicated Smart Grid and Electric Vehicle test laboratory.'
  },
  'me': {
    title: 'B.Tech Mechanical Engineering',
    dept: 'Department of Mechanical Engineering',
    duration: '4 Years (8 Semesters)',
    intake: '60 Seats (NBA Accredited)',
    code: 'ME',
    keamCode: 'FIT',
    eligibility: '10+2 with PCM (min 45%). Valid KEAM rank.',
    curriculum: ['CAD/CAM/CAE Simulations', 'Industrial Robotics', 'Fluid Mechanics', 'Additive 3D Prototyping'],
    careers: ['Formula SAE Automotive Designer', 'Aerospace Simulation Engineer', 'Robotics Systems Lead'],
    highlights: 'Direct access to AICTE IDEA Lab 3D printers and CNC milling.'
  },
  'ce': {
    title: 'B.Tech Civil Engineering',
    dept: 'Department of Civil Engineering',
    duration: '4 Years (8 Semesters)',
    intake: '60 Seats (NBA Accredited)',
    code: 'CE',
    keamCode: 'FIT',
    eligibility: '10+2 with PCM (min 45%). Valid KEAM rank.',
    curriculum: ['Smart Infrastructure & BIM', 'Earthquake Resistant Structures', 'Geotechnical Soil Improvement', 'Environmental Engineering'],
    careers: ['Structural Consultant', 'Urban Smart City Planner', 'Project Lead @ Global Infra'],
    highlights: 'NABL Accredited testing and consultancy lab.'
  },
  'mba': {
    title: 'Master of Business Administration (MBA)',
    dept: 'FISAT Business School (FBS)',
    duration: '2 Years (4 Semesters)',
    intake: '120 Seats',
    code: 'MBA',
    keamCode: 'FIT',
    eligibility: 'Any Bachelor degree with min 50% marks. Valid KMAT / CMAT / CAT score.',
    curriculum: ['Financial Technology (Fintech)', 'Growth & Digital Marketing', 'Business Analytics', 'Strategic Leadership'],
    careers: ['Product Manager', 'Investment Banker', 'Management Consultant'],
    highlights: 'Promoted by Federal Bank officers. High placement record across BFSI.'
  },
  'mca': {
    title: 'Master of Computer Applications (MCA)',
    dept: 'Department of Computer Applications',
    duration: '2 Years (4 Semesters)',
    intake: '120 Seats',
    code: 'MCA',
    keamCode: 'FIT',
    eligibility: 'BCA / B.Sc / B.Com / B.A with Mathematics with 50% marks. LBS MCA entrance score.',
    curriculum: ['Cloud Architecture & DevOps', 'Enterprise Full Stack Systems', 'Information Security', 'Modern Web Apps'],
    careers: ['Lead Full Stack Developer', 'DevOps & Cloud Engineer', 'Software Architect'],
    highlights: 'One of Kerala’s premier MCA departments with active open source contributions.'
  },
  'phd': {
    title: 'Doctor of Philosophy (Ph.D) in Engineering',
    dept: 'FISAT Research Center',
    duration: '3 to 5 Years',
    intake: 'As per KTU Norms',
    code: 'PHD',
    keamCode: 'FIT',
    eligibility: 'Master Degree in Engineering with min 6.5 CGPA. KTU Ph.D test or GATE qualified.',
    curriculum: ['Research Methodology', 'Domain Specialized Coursework', 'Thesis Colloquium'],
    careers: ['R&D Scientist', 'Engineering Professor', 'Corporate Lab Fellow'],
    highlights: 'DSIR-recognized SIRO facility with funded AICTE grants.'
  }
};

function initProgramFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      programCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.view-program-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.getAttribute('data-course');
      openCourseModal(courseId);
    });
  });
}

function openCourseModal(id) {
  const course = courseDatabase[id];
  if (!course) return;

  const modal = document.getElementById('program-modal');
  const modalBody = document.getElementById('program-modal-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <span class="sticker sticker-lime" style="margin-bottom: 0.5rem;">KEAM CODE: ${course.keamCode} • ${course.code}</span>
      <h2 style="font-size: 1.8rem; color: var(--text-main); margin: 0.5rem 0 0.25rem;">${course.title}</h2>
      <p style="color: var(--primary); font-family: var(--font-display); font-size: 0.95rem;">${course.dept}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; background: var(--bg-card); padding: 1.25rem; border-radius: var(--border-radius-md); border: 1px solid var(--border);">
      <div>
        <strong style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">DURATION</strong>
        <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">${course.duration}</span>
      </div>
      <div>
        <strong style="display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">SANCTIONED SEATS</strong>
        <span style="font-weight: 700; color: var(--text-main); font-size: 1.05rem;">${course.intake}</span>
      </div>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 1rem; margin-bottom: 0.4rem; color: var(--primary);"><i class="fas fa-check-circle"></i> Eligibility Criteria</h4>
      <p style="font-size: 0.9rem; color: var(--text-muted);">${course.eligibility}</p>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--secondary);"><i class="fas fa-code"></i> What You'll Hack & Learn</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
        ${course.curriculum.map(c => `<span class="sticker sticker-glass">${c}</span>`).join('')}
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--accent);"><i class="fas fa-rocket"></i> Career Roles</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
        ${course.careers.map(c => `<span class="sticker sticker-lime">${c}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
      <button class="btn btn-primary" onclick="closeAllModals(); openApplyModal('${course.title}')">
        <i class="fas fa-bolt"></i> Apply for this Branch
      </button>
    </div>
  `;

  modal.classList.add('active');
}

/* ==========================================================================
   7. Cyber Admissions Calculator
   ========================================================================== */
function initAdmissionsCalculator() {
  const calcBtn = document.getElementById('calc-submit-btn');
  const resultBox = document.getElementById('calc-result');

  if (!calcBtn || !resultBox) return;

  calcBtn.addEventListener('click', () => {
    const stream = document.getElementById('calc-stream').value;
    const quota = document.getElementById('calc-quota').value;
    const marks = parseFloat(document.getElementById('calc-marks').value) || 0;

    if (marks <= 0 || marks > 100) {
      showToast('Enter a valid percentage between 40% and 100% ⚠️', 'error');
      return;
    }

    let estimatedTuition = "₹50,000 / year (Govt Merit Rate)";
    let seatCategory = "Government Merit Quota (KEAM)";
    let specialNote = "Qualifies for Hormis Memorial Scholarships!";

    if (quota === 'merit') {
      estimatedTuition = "₹50,000 to ₹75,000 / year";
      seatCategory = "Govt. Merit (Allotment via CEE KEAM)";
    } else if (quota === 'mgmt') {
      estimatedTuition = "₹85,000 to ₹1,10,000 / year";
      seatCategory = "Management Merit (FBOAES Society)";
      if (marks >= 85) specialNote = "Eligible for up to 25% Merit Tuition Concession!";
    } else if (quota === 'nri') {
      estimatedTuition = "₹1,50,000 / year (NRI Sponsored)";
      seatCategory = "NRI Quota (No KEAM entrance mandatory)";
    }

    if (stream === 'mba') estimatedTuition = "₹1,25,000 to ₹1,60,000 / year";
    else if (stream === 'mca') estimatedTuition = "₹65,000 to ₹80,000 / year";

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span class="sticker sticker-lime">${seatCategory}</span>
        <span style="font-family: var(--font-display); font-weight: 700; color: var(--accent);"><i class="fas fa-check-circle"></i> Eligible</span>
      </div>
      <div style="margin: 0.75rem 0;">
        <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Estimated Tuition</span>
        <h3 style="font-size: 1.6rem; color: var(--primary);">${estimatedTuition}</h3>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
        <i class="fas fa-bolt" style="color: var(--secondary);"></i> ${specialNote}
      </p>
      <button class="btn btn-secondary btn-sm" onclick="openApplyModal('${stream.toUpperCase()} - ${quota.toUpperCase()}')" style="width: 100%;">
        <i class="fas fa-paper-plane"></i> Fast-Track Admission Enquiry
      </button>
    `;
    launchMiniConfetti();
    showToast('Eligibility calculated! 🚀', 'success');
  });
}

/* ==========================================================================
   8. Search Modal
   ========================================================================== */
const siteSearchIndex = [
  { title: "B.Tech Computer Science & Engineering", url: "#programs", category: "Academics", desc: "180 seats, NBA Accredited, KTU Research Centre" },
  { title: "B.Tech Artificial Intelligence & ML", url: "#programs", category: "Academics", desc: "Cutting-edge specialization in Deep Learning & Vision" },
  { title: "AICTE IDEA Lab", url: "#ecosystem", category: "Labs", desc: "₹1.10 Cr 3D printing & laser prototyping facility" },
  { title: "FISAT Fab Lab", url: "#ecosystem", category: "Labs", desc: "MIT & KSUM partner digital fabrication lab" },
  { title: "Bharatham Arts Festival", url: "#fests", category: "Culture", desc: "Kerala's flagship inter-collegiate cultural fest" },
  { title: "Arcane Conference & Hackathon", url: "#fests", category: "Tech", desc: "National Free Software .s by ISTE" },
  { title: "Placements 750+ Offers", url: "#placements", category: "Placements", desc: "₹17.5 LPA peak package, TCS, Federal Bank, Infosys" },
  { title: "Admissions 2026-27 & KEAM FIT", url: "#admissions", category: "Admissions", desc: "Merit, Management, NRI seats and guidelines" }
];

function initSearch() {
  const searchBtn = document.getElementById('search-toggle-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results-list');

  if (!searchBtn || !searchModal || !searchInput) return;

  searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
    renderSearchResults('');
  });

  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.toLowerCase().trim());
  });
}

function renderSearchResults(query) {
  const container = document.getElementById('search-results-list');
  if (!container) return;

  const filtered = query === '' 
    ? siteSearchIndex.slice(0, 5) 
    : siteSearchIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No results found for "<strong>${query}</strong>" 👀</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <a href="${item.url}" onclick="closeAllModals()" style="display: block; padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border); margin-bottom: 0.6rem; background: var(--bg-card); transition: var(--transition);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
        <span style="font-weight: 700; color: var(--primary); font-size: 1rem;">${item.title}</span>
        <span class="sticker sticker-glass">${item.category}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${item.desc}</p>
    </a>
  `).join('');
}

/* ==========================================================================
   9. Modals & Apply Form
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  const headerApplyBtn = document.getElementById('header-apply-btn');
  if (headerApplyBtn) {
    headerApplyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openApplyModal('General Enquiry');
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

function openApplyModal(coursePref = '') {
  const modal = document.getElementById('apply-modal');
  if (!modal) return;
  const courseInput = document.getElementById('apply-course-pref');
  if (courseInput && coursePref) courseInput.value = coursePref;
  modal.classList.add('active');
}

function initEnquiryForm() {
  const form = document.getElementById('admission-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('enq-name').value.trim();
    const course = document.getElementById('apply-course-pref').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      closeAllModals();
      form.reset();
      launchMiniConfetti();
      showToast(`Boom! 🎉 Thank you ${name}, your application for ${course || 'FISAT'} is locked in! We'll ring you soon!`, 'success');
    }, 1000);
  });
}

/* ==========================================================================
   11. Canteen Crave-O-Matic Mood Selector
   ========================================================================== */
const canteenCombos = {
  'post-exam': {
    title: 'Post-Exam Stress Buster Meal',
    tag: '⚡ BRAIN RECOVERY FUEL',
    desc: 'You just battled a 3-hour KTU engineering mechanics paper. Time to indulge in legendary Kerala comfort cuisine.',
    items: [
      { name: '3x Flaky Kerala Porottas', price: '₹36' },
      { name: 'Spicy Beef Roast / Pepper Chicken Roast', price: '₹70' },
      { name: 'Hot Sulaimani Tea with Mint & Lemon', price: '₹12' }
    ],
    total: '₹118',
    vibeTip: 'Grab the corner table by the lawn with your study squad!'
  },
  'hackathon': {
    title: 'Arcane 36-Hr Sleepless Sprint',
    tag: '💻 CAFFEINE & CARBS COMBO',
    desc: 'You have been debugging segmentation faults since 2 AM. You need fast, high-octane finger food.',
    items: [
      { name: '2x Crispy Vegetable & Chicken Samosas', price: '₹30' },
      { name: 'Chilled Thick Cold Boost / Filter Coffee', price: '₹35' },
      { name: 'Golden Meat Cutlet', price: '₹15' }
    ],
    total: '₹80',
    vibeTip: 'Order via canteen.fisat.ac.in and skip the line right back to FabLab!'
  },
  'gym': {
    title: 'The Iron Den Post-Workout Protein Fix',
    tag: '💪 GYM BRO GAINZ PLATTER',
    desc: 'Straight out of the morning 6 AM squat session. Clean protein and carbs to fuel your recovery.',
    items: [
      { name: '3x Steamed Boiled Farm Eggs', price: '₹30' },
      { name: 'Fresh Banana Peanut Butter Milkshake', price: '₹40' },
      { name: 'Whole Wheat Vegetable Roll', price: '₹25' }
    ],
    total: '₹95',
    vibeTip: 'Hydrate at the RO stations right outside the hostel block!'
  },
  'broke': {
    title: 'End-of-Month Broke Student ₹30 Fix',
    tag: '🪙 POCKET-FRIENDLY LEGEND',
    desc: 'Only 30 rupees left in UPI? FISAT canteen has you covered with iconic Kerala teatime joy.',
    items: [
      { name: 'Hot Crispy Pazham Pori (Banana Fritter)', price: '₹15' },
      { name: 'Piping Hot Malabar Chaya (Tea)', price: '₹10' }
    ],
    total: '₹25',
    vibeTip: 'Still got ₹5 balance left! The true engineering survival pack.'
  },
  'feast': {
    title: 'Fest Day Grand Biriyani Feast',
    tag: '👑 BHARATHAM DAY INDULGENCE',
    desc: 'Music is blasting on the quadrangle. Time to celebrate with the college crown jewel meal.',
    items: [
      { name: 'FISAT Special Malabar Chicken Biriyani', price: '₹110' },
      { name: 'Fresh Mint Lime Cooler', price: '₹25' },
      { name: 'Soft Warm Gulab Jamun (2 pcs)', price: '₹20' }
    ],
    total: '₹155',
    vibeTip: 'Seats fill up fast at 12:45 PM—pre-order early!'
  }
};

function initCraveOMatic() {
  const moodButtons = document.querySelectorAll('.mood-btn');
  const resultCard = document.getElementById('crave-result');

  if (!moodButtons.length || !resultCard) return;

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      moodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const moodKey = btn.getAttribute('data-mood');
      const combo = canteenCombos[moodKey];

      if (combo) {
        resultCard.style.display = 'block';
        resultCard.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span class="sticker sticker-pink">${combo.tag}</span>
            <span style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--primary);">${combo.total}</span>
          </div>
          <h3 style="font-size: 1.5rem; color: var(--text-main); margin-bottom: 0.35rem;">${combo.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.885rem; margin-bottom: 1.25rem;">${combo.desc}</p>
          
          <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid var(--border); margin-bottom: 1.25rem;">
            ${combo.items.map(it => `
              <div class="canteen-item-row">
                <span style="color: var(--text-main); font-weight: 600; font-size: 0.9rem;">${it.name}</span>
                <span style="color: var(--accent); font-family: var(--font-display); font-weight: 700;">${it.price}</span>
              </div>
            `).join('')}
          </div>

          <p style="font-size: 0.825rem; color: var(--primary); margin-bottom: 1rem;">
            <i class="fas fa-lightbulb"></i> Pro-Tip: ${combo.vibeTip}
          </p>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="https://canteen.fisat.ac.in" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="flex-grow: 1;">
              <i class="fas fa-mobile-alt"></i> Pre-Order on canteen.fisat.ac.in
            </a>
            <button class="btn btn-glass btn-sm" onclick="showToast('Tray reserved in your mind! Now head over to the counter 😋', 'success')">
              <i class="fas fa-utensils"></i> Lock In Meal
            </button>
          </div>
        `;
        launchMiniConfetti();
        showToast(`Plate served: ${combo.title}! 🍽️`, 'success');
      }
    });
  });
}

/* ==========================================================================
   12. Student Projects Filter & Modal
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-project-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-project-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   13. Phone Device Simulator (Mobile View Preview)
   ========================================================================== */
function initPhoneSimulator() {
  const triggerBtns = document.querySelectorAll('.open-phone-sim-btn');
  const simOverlay = document.getElementById('phone-sim-modal');
  const closeBtn = document.getElementById('close-phone-sim-btn');
  const phoneCasing = document.getElementById('phone-casing-frame');
  const deviceTypeBtns = document.querySelectorAll('.device-type-btn');
  const phoneIframe = document.getElementById('phone-screen-iframe');

  if (!simOverlay) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      simOverlay.classList.add('active');
      if (phoneIframe && (!phoneIframe.src || phoneIframe.src === 'about:blank')) {
        phoneIframe.src = 'index.html';
      }
      showToast('Entered Mobile Phone Simulator Mode 📱', 'info');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      simOverlay.classList.remove('active');
    });
  }

  simOverlay.addEventListener('click', (e) => {
    if (e.target === simOverlay) {
      simOverlay.classList.remove('active');
    }
  });

  deviceTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const model = btn.getAttribute('data-device');
      if (model === 'pixel') {
        phoneCasing.className = 'phone-casing pixel';
        phoneCasing.style.width = '390px';
        phoneCasing.style.height = '780px';
      } else if (model === 'landscape') {
        phoneCasing.className = 'phone-casing';
        phoneCasing.style.width = '680px';
        phoneCasing.style.height = '390px';
      } else {
        phoneCasing.className = 'phone-casing';
        phoneCasing.style.width = '390px';
        phoneCasing.style.height = '760px';
      }
    });
  });
}

/* ==========================================================================
   14. Central Library Catalog & Author Search
   ========================================================================== */
const libraryCatalog = [
  { author: "Andrew S. Tanenbaum", title: "Modern Operating Systems (4th Ed.)", domain: "CSE", code: "QA 76.76.O63 T35", shelf: "Stack A4", available: "Available (8 Copies)" },
  { author: "Andrew S. Tanenbaum", title: "Computer Networks (5th Ed.)", domain: "CSE", code: "TK 5105.5 .T36", shelf: "Stack A5", available: "Available (12 Copies)" },
  { author: "Thomas H. Cormen (CLRS)", title: "Introduction to Algorithms (3rd Ed.)", domain: "CSE", code: "QA 76.6 .C662", shelf: "Stack A2", available: "Available (15 Copies)" },
  { author: "Donald E. Knuth", title: "The Art of Computer Programming (Vol 1-4)", domain: "CSE", code: "QA 76.6 .K64", shelf: "Reference Vault", available: "Reference Only" },
  { author: "Stuart Russell & Peter Norvig", title: "Artificial Intelligence: A Modern Approach (4th Ed.)", domain: "AI/ML", code: "Q 335 .R87", shelf: "Stack B1", available: "Available (6 Copies)" },
  { author: "Adel S. Sedra & Kenneth C. Smith", title: "Microelectronic Circuits (8th Ed.)", domain: "ECE", code: "TK 7867 .S4", shelf: "Stack C2", available: "Available (10 Copies)" },
  { author: "B.P. Lathi", title: "Modern Digital and Analog Communication Systems", domain: "ECE", code: "TK 5101 .L333", shelf: "Stack C4", available: "Available (9 Copies)" },
  { author: "Charles K. Alexander & Matthew Sadiku", title: "Fundamentals of Electric Circuits", domain: "EEE", code: "TK 454 .A437", shelf: "Stack D1", available: "Available (14 Copies)" },
  { author: "Joseph E. Shigley", title: "Mechanical Engineering Design (10th Ed.)", domain: "ME", code: "TJ 230 .S47", shelf: "Stack E3", available: "Available (8 Copies)" },
  { author: "Frank M. White", title: "Fluid Mechanics (8th Ed.)", domain: "ME", code: "TA 357 .W48", shelf: "Stack E2", available: "Available (7 Copies)" },
  { author: "B.C. Punmia", title: "Surveying (Vol I & II) and Soil Mechanics", domain: "Civil", code: "TA 545 .P86", shelf: "Stack F1", available: "Available (11 Copies)" },
  { author: "Philip Kotler", title: "Marketing Management (Global Edition)", domain: "MBA", code: "HF 5415.13 .K64", shelf: "FBS Reserve", available: "Available (16 Copies)" },
  { author: "Prasanna Chandra", title: "Financial Management: Theory and Practice", domain: "MBA", code: "HG 4026 .C43", shelf: "FBS Stack 2", available: "Available (9 Copies)" }
];

function initLibraryBookSearch() {
  const searchInput = document.getElementById('opac-book-search');
  const resultsContainer = document.getElementById('opac-search-results');

  if (!searchInput || !resultsContainer) return;

  function renderBooks(query) {
    const filtered = query === '' 
      ? libraryCatalog.slice(0, 4) 
      : libraryCatalog.filter(b => 
          b.title.toLowerCase().includes(query) || 
          b.author.toLowerCase().includes(query) ||
          b.domain.toLowerCase().includes(query)
        );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
          <p>No titles found matching "<strong>${query}</strong>" in Central Library OPAC.</p>
          <span style="font-size: 0.8rem;">Try searching for Cormen, Tanenbaum, Sedra, or Kotler.</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.map(b => `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--border-radius-sm); padding: 1rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span class="sticker sticker-glass" style="margin-bottom: 0.25rem;">${b.domain}</span>
          <h4 style="font-size: 1rem; color: var(--text-main); margin: 0.2rem 0;">${b.title}</h4>
          <span style="font-size: 0.825rem; color: var(--text-muted);"><i class="fas fa-user-edit"></i> By <strong>${b.author}</strong> • Call No: ${b.code}</span>
        </div>
        <div style="text-align: right;">
          <span style="display: block; font-size: 0.8rem; font-family: var(--font-display); color: var(--primary); font-weight: 700;">📍 ${b.shelf}</span>
          <span style="font-size: 0.75rem; color: var(--accent);"><i class="fas fa-check-circle"></i> ${b.available}</span>
        </div>
      </div>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => {
    renderBooks(e.target.value.toLowerCase().trim());
  });

  renderBooks('');
}
