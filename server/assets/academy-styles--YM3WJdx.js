const mathImg = "/assets/teacher-math-CTSjk9C7.jpg";
const physicsImg = "/assets/teacher-physics-ExgfF00M.jpg";
const chemistryImg = "/assets/teacher-chemistry-DhG0G0w9.jpg";
const styles = {
  math: {
    accentClass: "text-math",
    bgGradientClass: "bg-math",
    glowClass: "shadow-glow-math",
    cssVar: "var(--math)",
    image: mathImg
  },
  physics: {
    accentClass: "text-physics",
    bgGradientClass: "bg-physics",
    glowClass: "shadow-glow-physics",
    cssVar: "var(--physics)",
    image: physicsImg
  },
  chemistry: {
    accentClass: "text-chemistry",
    bgGradientClass: "bg-chemistry",
    glowClass: "shadow-glow-chemistry",
    cssVar: "var(--chemistry)",
    image: chemistryImg
  }
};
const fallback = {
  accentClass: "text-primary",
  bgGradientClass: "bg-gradient-primary",
  glowClass: "shadow-glow-primary",
  cssVar: "var(--primary)",
  image: mathImg
};
function getAcademyStyle(slug) {
  return styles[slug] ?? fallback;
}
export {
  getAcademyStyle as g
};
