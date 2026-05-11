import mathImg from "@/assets/teacher-math.jpg";
import physicsImg from "@/assets/teacher-physics.jpg";
import chemistryImg from "@/assets/teacher-chemistry.jpg";

export interface AcademyStyle {
  accentClass: string;
  bgGradientClass: string;
  glowClass: string;
  cssVar: string;
  image: string;
}

const styles: Record<string, AcademyStyle> = {
  math: {
    accentClass: "text-math",
    bgGradientClass: "bg-math",
    glowClass: "shadow-glow-math",
    cssVar: "var(--math)",
    image: mathImg,
  },
  physics: {
    accentClass: "text-physics",
    bgGradientClass: "bg-physics",
    glowClass: "shadow-glow-physics",
    cssVar: "var(--physics)",
    image: physicsImg,
  },
  chemistry: {
    accentClass: "text-chemistry",
    bgGradientClass: "bg-chemistry",
    glowClass: "shadow-glow-chemistry",
    cssVar: "var(--chemistry)",
    image: chemistryImg,
  },
};

const fallback: AcademyStyle = {
  accentClass: "text-primary",
  bgGradientClass: "bg-gradient-primary",
  glowClass: "shadow-glow-primary",
  cssVar: "var(--primary)",
  image: mathImg,
};

export function getAcademyStyle(slug: string): AcademyStyle {
  return styles[slug] ?? fallback;
}
