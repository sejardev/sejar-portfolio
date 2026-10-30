// Keep navigation context visible as visitors explore the page.
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll("nav a");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            if (link.hash === "#" + entry.target.id)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-20% 0px -55% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

