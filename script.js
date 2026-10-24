document.addEventListener("DOMContentLoaded", () => {
  // 1. Dual Cursor Trailing Logic
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  if (cursor && follower) {
    window.addEventListener("pointermove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll("a, button, .project, .matrix-item").forEach((item) => {
      item.addEventListener("pointerenter", () => cursor.classList.add("big"));
      item.addEventListener("pointerleave", () => cursor.classList.remove("big"));
    });
  }

  // 2. Dynamic Palette Accent Switcher
  const colorBtns = document.querySelectorAll(".color-btn");
  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const accent = btn.getAttribute("data-accent");
      document.documentElement.style.setProperty("--accent", accent);
      showToast(`Accent updated: ${btn.title}`);
    });
  });

  // 3. Scroll Reveal Observer
  const revealItems = document.querySelectorAll(".reveal:not(.hero > .eyebrow):not(.hero-bottom)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));

  // 4. Animated Counter for CP Metrics
  const statNumbers = document.querySelectorAll(".stat-number");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-target"));
        let count = 0;
        const duration = 1500;
        const stepTime = Math.max(10, Math.floor(duration / target));
        
        const timer = setInterval(() => {
          count += Math.ceil(target / 40);
          if (count >= target) {
            entry.target.innerText = target + "+";
            clearInterval(timer);
          } else {
            entry.target.innerText = count;
          }
        }, stepTime);

        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((num) => counterObserver.observe(num));

  // 5. Tech Matrix Tabs
  const matrixTabs = document.querySelectorAll(".matrix-tab");
  const matrixItems = document.querySelectorAll(".matrix-item");

  matrixTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      matrixTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.getAttribute("data-tab");

      matrixItems.forEach((item) => {
        if (category === "all" || item.getAttribute("data-cat") === category) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 6. Project Filter Logic
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");

      projects.forEach((proj) => {
        if (filter === "all" || proj.getAttribute("data-category") === filter) {
          proj.style.display = "block";
        } else {
          proj.style.display = "none";
        }
      });
    });
  });

  // 7. Interactive Project Modal
  const modal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalTech = document.getElementById("modalTech");
  const modalDesc = document.getElementById("modalDesc");
  const modalLink = document.getElementById("modalLink");

  projects.forEach((proj) => {
    proj.addEventListener("click", () => {
      modalTitle.innerText = proj.getAttribute("data-title");
      modalCategory.innerText = proj.getAttribute("data-category").toUpperCase();
      modalTech.innerText = proj.getAttribute("data-tech");
      modalDesc.innerText = proj.getAttribute("data-desc");
      modalLink.href = proj.getAttribute("data-link");

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  // 8. Contact Form & Email Copying
  const copyBtn = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("emailText").innerText;

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(emailText).then(() => {
      showToast("Email address copied to clipboard!");
    }).catch(() => {
      showToast("Email: " + emailText);
    });
  });

  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Message sent successfully! Thank you.");
    contactForm.reset();
  });

  // Helper: Toast Notification
  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 9. Preloader Handler
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    document.body.style.overflow = "hidden";
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hide");
        document.body.style.overflow = "";
      }, 1500);
    });
  }

  // 10. GSAP Hero Sequence
  function firstPageAnim() {
    const hero = document.querySelector(".hero");
    if (!hero || !window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("gsap-ready");
      return;
    }

    if (window.__heroIntroPlayed) return;
    window.__heroIntroPlayed = true;

    const subtitle = hero.querySelector(".eyebrow");
    const lines = hero.querySelectorAll(".title-line > span");
    const greenText = hero.querySelector(".hero-title em");
    const glow = hero.querySelector(".hero-orb");
    const bottom = hero.querySelector(".hero-bottom");

    gsap.set([subtitle, ...lines, greenText, glow, bottom], { visibility: "visible" });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        document.documentElement.classList.remove("gsap-ready");
      }
    });

    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.45 }, 0.1)
      .to(lines, { y: "0%", duration: 0.85, stagger: 0.18 }, 0.35)
      .to(greenText, { opacity: 1, duration: 0.45, ease: "power2.out" }, 1.45)
      .to(glow, { opacity: 0.15, scale: 1, duration: 1.1, ease: "power2.out" }, 0.8)
      .to(bottom, { opacity: 1, y: 0, duration: 0.6 }, 1.85);
  }

  firstPageAnim();
});