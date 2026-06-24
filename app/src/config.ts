export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  eyebrow: string
  titleLines: string[]
  leadText: string
  supportingNotes: string[]
}

export interface ManifestoConfig {
  videoPath: string
  text: string
}

export interface FacilityArticle {
  title: string
  paragraphs: string[]
}

export interface FacilityItem {
  slug: string
  name: string
  code: string
  address: string
  status: string
  email: string
  phone: string
  ctaText: string
  ctaHref: string
  image: string
  utcOffset: number
  article: FacilityArticle
}

export interface FacilitiesConfig {
  sectionLabel: string
  detailBackText: string
  detailNotFoundText: string
  detailReturnText: string
  items: FacilityItem[]
}

export interface ObservationConfig {
  sectionLabel: string
  videoPath: string
  statusText: string
  latLabel: string
  lonLabel: string
  initialLat: number
  initialLon: number
}

export interface ArchiveItem {
  src: string
  label: string
  aspectRatio: number
}

export interface ArchivesConfig {
  sectionLabel: string
  vaultTitle: string
  closeText: string
  items: ArchiveItem[]
}

export interface FooterConfig {
  copyrightText: string
  statusText: string
  email: string
  githubUrl: string
}

export interface ProjectData {
  slug: string
  name: string
  language: string
  description: string
  tags: string
  image: string
  video?: string
  gallery?: string[]
  githubUrl: string
  article: FacilityArticle
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Medasani Puneeth | ASCII Cosmos Portfolio",
  siteDescription: "Software engineer building autonomous robots, AI research systems, and intelligent applications. Explore my ASCII-themed portfolio.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "PUNEETH",
  links: [
    { label: "RESUME", href: "/images/resume.pdf" },
    { label: "PROJECTS", href: "#/#projects" },
    { label: "CERTIFICATES", href: "#/#archives" },
    { label: "CONTACT", href: "#/#footer" },
  ],
}

export const heroConfig: HeroConfig = {
  eyebrow: "< SYSTEM.BOOT >",
  titleLines: ["MEDASANI", "PUNEETH"],
  leadText: "Software engineer building autonomous robots, AI research systems, and intelligent applications. 9 repositories. Infinite curiosity.",
  supportingNotes: [
    "ROS2 / Python / C++ / Computer Vision",
    "Autonomous Robotics & AI Research",
    "swarm intelligence · finance · automation",
  ],
}

export const manifestoConfig: ManifestoConfig = {
  videoPath: "",
  text: "I build intelligent systems that bridge software and hardware. From ROS2-based autonomous robots to multi-agent AI research platforms, my work lives at the intersection of robotics, computer vision, and machine learning. Every repository is a step toward autonomous intelligence.",
}

export const projectsData: ProjectData[] = [
  
  {
    slug: "SNOW-E",
    name: "SNOW-E",
    language: "C++",
    description: "ROS MELODIC BASED JESTSON NANO AUTONOMOUS ROBOT",
    tags: "ROS Melodic · Jetson · C++",
    image: "/images/snow-e.png",
    githubUrl: "https://github.com/techatron66/BOT",
    article: {
      title: "Autonomous Robot",
      paragraphs: [
        "An autonomous robot built on ROS Melodic and powered by the NVIDIA Jetson Nano. This project demonstrates edge AI inference for real-time object detection and semantic segmentation.",
        "The robot chassis features a custom motor controller board, IMU for odometry, and a stereo camera pair for depth estimation. All processing happens on-device using the Jetson's CUDA cores.",
        "Achieved sub-100ms inference latency for object detection using TensorRT-optimized models, enabling real-time navigation decisions in dynamic environments.",
      ],
    },
  },
  {
    slug: "orchestra_research",
    name: "ORCHESTRA_RESEARCH",
    language: "HTML/JS",
    description: "A multi-agent AI research authoring studio",
    tags: "Multi-Agent · AI · Research",
    image: "/images/orchestra_ai.png",
    githubUrl: "https://github.com/techatron66/Orchestra_RESEARCH",
    article: {
      title: "Multi-Agent AI Research Studio",
      paragraphs: [
        "Orchestra is a monorepo-based multi-agent AI research authoring studio where AI agents collaboratively assist in writing, verifying, and enriching research papers.",
        "The system uses a coordinator-agent pattern where specialized agents handle literature review, methodology generation, result interpretation, and citation management.",
        "Built with a modern web stack, the platform provides a real-time collaborative interface for researchers to interact with AI agents and review their outputs.",
      ],
    },
  },
  {
    slug: "swarm_bots",
    name: "SWARM_BOTS",
    language: "Python",
    description: "Swarm robotics coordination system",
    tags: "Swarm · Coordination · Python",
    image: "/images/swarm_bot.jpeg",
    githubUrl: "https://github.com/techatron66/swarm_bots",
    article: {
      title: "Swarm Robotics Coordination",
      paragraphs: [
        "A standalone ROS 2 workspace for multi-robot swarm behavior using camera-only perception.",
        "The system demonstrates emergent behaviors including flocking, foraging, and collective transport through simple local rules applied across the swarm.",
      ],
    },
  },
  {
    slug: "cooki",
    name: "COOKi",
    language: "Python",
    description: "Automated cooking robot OS with computer vision",
    tags: "CV · Robotics · Cooking · Python",
    image: "/images/cooki_p.jpeg",
    video: "/images/cooki.mp4",
    githubUrl: "https://github.com/techatron66/COOKi",
    article: {
      title: "COOKi — Automated Cooking Robot",
      paragraphs: [
        "COOKi is an automated cooking robot operating system that combines computer vision ingredient monitoring with precision motor control for autonomous meal preparation.",
        "The system uses a YAML-driven recipe format that defines ingredients, cooking steps, temperature profiles, and stirring patterns. Computer vision tracks ingredient state and doneness in real-time.",
        "Features include automated stirring control, temperature regulation, ingredient dispensing, and a web dashboard for recipe management and cooking monitoring.",
      ],
    },
  },
  {
    slug: "irizz",
    name: "iRIZZ",
    language: "C, ARDUINO",
    description: "Fast line maze solver",
    tags: "Embedded · C · Arduino ",
    image: "/images/irizz.jpeg",
    githubUrl: "",
    article: {
      title: "iRIZZ — Fast Line Maze Solver",
      paragraphs: [
        "A fast line maze solver built for embedded hardware. Utilizes infrared sensors for line detection.",
        "Written in C for Arduino microcontrollers, the system achieves sub-second line tracking and maze navigation with optimized PID control loops.",
        "Won second place in Mahindra technical fest 2026 and 4th place in IIT Bombay's Techfest 2024.",
      ],
    },
  },
  {
    slug: "ir-s_rev2",
    name: "IR-S_REV2",
    language: "HTML",
    description: "Web-based attendance management system",
    tags: "Web · HTML · TypeScript · Dashboard",
    image: "/images/ir-s_rev2_2.jpeg",
    gallery: [
      "/images/ir-s_rev2_0.jpeg",
      "/images/ir-s_rev2_1.jpeg",
      "/images/ir-s_rev2_2.jpeg",
    ],
    githubUrl: "https://github.com/techatron66/IR-S_rev2",
    article: {
      title: "Web Attendance Dashboard",
      paragraphs: [
        "A web-based attendance management interface that connects to the IR-S hardware system. Provides real-time attendance tracking, report generation, and analytics.",
        "The dashboard features a dark-mode UI with data visualization charts showing attendance trends, late arrivals, and absentee patterns across classes or departments.",
        "Built with vanilla HTML/CSS/JS for maximum portability, the system can run on any device with a browser and connects to the attendance database via a REST API.",
      ],
    },
  },
  {
    slug: "vitalix",
    name: "vitalix",
    language: "C++, esp32, tensorflow-lite, edgeAI",
    description: "Personal health monitor",
    tags: "Health · Wearable · AI",
    image: "/images/vitalix.png",
    githubUrl: "",
    article: {
      title: "vitalix — Personal Health Monitor",
      paragraphs: [
        "ESP32 wearable tracking SpO2, heart rate & temperature; lightweight anomaly detection model deployed on-device for real-time patient alerts.",
        "The system utilizes machine learning algorithms to identify potential health risks and provides timely notifications to both patients and healthcare providers.",
      ],
    },
  },
  {
    slug: "anemo",
    name: "anemo",
    language: "Drone, ROS2, PX4, MAVROS, C++",
    description: "Autonomous drone platform",
    tags: "Drone · Robotics · AI",
    image: "/images/drone_p.png",
    video: "/images/drone.mp4",
    githubUrl: "",
    article: {
      title: "anemo — Autonomous Drone Platform",
      paragraphs: [
        "A lightweight, modular autonomous drone platform designed for intelligent navigation and real-time surveillance in diverse operational environments.",
        "Equipped with autonomous flight capabilities and live monitoring systems for enhanced situational awareness and mission effectiveness.",
        
      ],
    },
  },
]

export const facilitiesConfig: FacilitiesConfig = {
  sectionLabel: "< FACILITIES >",
  detailBackText: "BACK",
  detailNotFoundText: "Project not found.",
  detailReturnText: "Return home",
  items: projectsData.map((p) => ({
    slug: p.slug,
    name: p.name,
    code: p.language,
    address: p.tags,
    status: p.description,
    email: p.githubUrl,
    phone: "",
    ctaText: "VIEW ON GITHUB",
    ctaHref: p.githubUrl,
    image: p.image,
    utcOffset: 0,
    article: p.article,
  })),
}

export const observationConfig: ObservationConfig = {
  sectionLabel: "< LIVE.TERMINAL >",
  videoPath: "",
  statusText: "TERMINAL.ACTIVE",
  latLabel: "LOC",
  lonLabel: "",
  initialLat: 17.38,
  initialLon: 78.48,
}

export const archivesConfig: ArchivesConfig = {
  sectionLabel: "< CERTIFICATES >",
  vaultTitle: "OPEN.VAULT",
  closeText: "CLOSE.VAULT",
  items: [
    {
      src: "/images/cert-megathon-2025.png",
      label: "MEGATHON 2025 PARTICIPATION",
      aspectRatio: 1.4115,
    },
    {
      src: "/images/cert-fast-line-follower.png",
      label: "FAST LINE FOLLOWER ACHIEVEMENT",
      aspectRatio: 1.375,
    },
    {
      src: "/images/cert-cs50.png",
      label: "CS50X COMPLETION",
      aspectRatio: 1.2945,
    },
    {
      src: "/images/cert-naest-2023.png",
      label: "NAEST 2023 PARTICIPATION",
      aspectRatio: 1.4141,
    },
    {
      src: "/images/cert-adaptive-computing-2022.png",
      label: "ADAPTIVE COMPUTING CHALLENGE 2022",
      aspectRatio: 2.0025,
    },
  ],
}

export const footerConfig: FooterConfig = {
  copyrightText: "© 2025 MEDASANI PUNEETH",
  statusText: "ALL SYSTEMS NOMINAL",
  email: "medasanipuneeth@gmail.com",
  githubUrl: "https://github.com/techatron66",
}
