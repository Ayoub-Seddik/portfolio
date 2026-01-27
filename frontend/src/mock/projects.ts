export type Project = {
  id: string;
  title: string;
  description: string;
  whatIDid: string[];
  languages: string[];
  frameworks: string[];
  links: {
    live?: string;
    github?: string;
  };
};

export const projectsMock: Project[] = [
  {
    id: "dmcreations",
    title: "DM Creations (Full-Stack Web App)",
    description:
      "A live business website with a bilingual UI, admin features, and a modern full-stack architecture.",
    whatIDid: [
      "Built a responsive UI with routing and internationalization (EN/FR)",
      "Implemented admin pages for managing content",
      "Integrated authentication and API communication patterns"
    ],
    languages: ["TypeScript", "Java"],
    frameworks: ["React (Vite)", "Spring Boot"],
    links: {
      live: "https://www.dmcreations.ca"
    }
  },

  {
    id: "onebone-finalproject",
    title: "Onebone Final Project (Android)",
    description:
      "A Kotlin Android app (school project) that recreates a simple clothing-store experience with catalog browsing, login, favorites, and a cart.",
    whatIDid: [
      "Built a product catalog screen where users can browse items",
      "Implemented login-gated features (favorites and cart) with clear user feedback",
      "Added favorites (heart toggle) including confirmation when removing",
      "Implemented cart quantity updates (setting quantity to 0 removes the item)",
      "Persisted favorites and cart per user using a local accounts.json file"
    ],
    languages: ["Kotlin"],
    frameworks: ["Android Studio", "Jetpack Compose"],
    links: {
      github: "https://github.com/Ayoub-Seddik/Onebone-FinalProject"
    }
  }
];
