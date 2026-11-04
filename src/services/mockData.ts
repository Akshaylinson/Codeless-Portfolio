import { Project, ProjectDetail, ProjectMedia, SiteConfig } from '../types/portfolio';

// Local high-fidelity generated asset paths
export const ASSETS = {
  hero: '/src/assets/images/hero_ai_platform_1793785173723.jpg',
  codevoice: '/src/assets/images/project_codevoice_1793785174943.jpg',
  aivoa: '/src/assets/images/project_aivoa_qms_1793785175317.jpg',
  bizflow: '/src/assets/images/project_bizflow_automation_1793785176183.jpg',
  vision: '/src/assets/images/project_vision_analytics_1793785175975.jpg',
};

export const INITIAL_SITE_CONFIG: SiteConfig = {
  company_name: "Codeless Technologies",
  company_tagline: "Building Intelligent Digital Solutions.",
  company_description: "Codeless Technologies is an AI-driven technology company focused on building intelligent software solutions, innovative SaaS products, and business automation systems.",
  website: "https://portfolio.codelessai.in",
  email: "contact@codelessai.in",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  linkedin: "https://www.linkedin.com/company/codeless-technologies",
  logo_url: "",
  portfolio_title: "Codeless Technologies | Engineering Intelligence",
  contact_cta_text: "Looking to develop an AI-powered application, automate your business processes, or build a custom software solution? Let's discuss your requirements.",
};

export const INITIAL_PROJECTS: Project[] = [
  {
    project_id: "PRJ001",
    slug: "codevoice",
    project_name: "CodeVoice",
    tagline: "Intelligent AI Voice Platform & Conversational Speech Engine",
    short_description: "Real-time conversational voice synthesis and agent framework delivering ultra-low-latency bidirectional speech interactions.",
    full_description: "CodeVoice is Codeless Technologies' flagship conversational speech technology platform. Built for latency-critical telephony and customer support automation, it combines custom streaming acoustic neural models with sub-200ms round-trip speech synthesis, real-time sentiment extraction, and seamless CRM integrations.",
    category: "AI & Voice Technology",
    technologies: ["Python", "FastAPI", "React", "ONNX", "WebSockets", "PyTorch"],
    thumbnail_image: ASSETS.codevoice,
    cover_image: ASSETS.codevoice,
    live_url: "https://voice.codelessai.in",
    github_url: "https://github.com/codelesstechnologies/codevoice-core",
    status: "Development",
    featured: true,
    published: true,
    created_date: "2026-03-15",
    sort_order: 1,
  },
  {
    project_id: "PRJ002",
    slug: "aivoa-pharmaceutical-qms",
    project_name: "AIVOA.AI",
    tagline: "Enterprise Pharmaceutical Quality Management & GMP Compliance",
    short_description: "Intelligent electronic batch records, CAPA workflow automation, and 21 CFR Part 11 compliant audit verification for life sciences.",
    full_description: "AIVOA.AI represents a leap forward in pharmaceutical quality and validation systems. Engineered in strict compliance with FDA 21 CFR Part 11 and EU Annex 11, it automates deviation tracking, audit trails, and automated batch release protocol verification through verifiable data integrity checks.",
    category: "Pharmaceutical Software",
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind CSS", "AuditLog21", "Python"],
    thumbnail_image: ASSETS.aivoa,
    cover_image: ASSETS.aivoa,
    live_url: "https://aivoa.codelessai.in",
    github_url: "",
    status: "Production",
    featured: true,
    published: true,
    created_date: "2026-02-10",
    sort_order: 2,
  },
  {
    project_id: "PRJ003",
    slug: "bizflow-automation-engine",
    project_name: "BizFlow Omni",
    tagline: "Autonomous Enterprise Process Automation & Orchestration",
    short_description: "Autonomous workflow execution engine linking legacy enterprise databases, third-party ERPs, and AI task planners.",
    full_description: "BizFlow Omni solves enterprise data silos by automating complex multi-stage approvals, document parsing, invoice reconciliation, and data synchronization between SAP, Salesforce, and bespoke internal systems.",
    category: "Business Automation",
    technologies: ["Go", "React", "Redis", "Temporal", "Docker", "REST API"],
    thumbnail_image: ASSETS.bizflow,
    cover_image: ASSETS.bizflow,
    live_url: "https://bizflow.codelessai.in",
    github_url: "https://github.com/codelesstechnologies/bizflow-engine",
    status: "Production",
    featured: true,
    published: true,
    created_date: "2026-01-20",
    sort_order: 3,
  },
  {
    project_id: "PRJ004",
    slug: "visionsense-edge-analytics",
    project_name: "VisionSense Edge",
    tagline: "Real-Time Computer Vision & Industrial Edge Telemetry",
    short_description: "High-speed edge camera inference platform for defect inspection, facility safety monitoring, and vehicle telemetry.",
    full_description: "VisionSense Edge deploys quantized computer vision models onto edge gateway hardware, achieving 30+ FPS video analysis with zero external cloud dependencies. Designed for manufacturing plants and logistics facilities.",
    category: "Computer Vision & Edge AI",
    technologies: ["C++", "Python", "TensorRT", "WebRTC", "React", "Tailwind CSS"],
    thumbnail_image: ASSETS.vision,
    cover_image: ASSETS.vision,
    live_url: "",
    github_url: "https://github.com/codelesstechnologies/visionsense",
    status: "Development",
    featured: true,
    published: true,
    created_date: "2025-11-14",
    sort_order: 4,
  },
  {
    project_id: "PRJ005",
    slug: "synthetix-pharmadocs",
    project_name: "Synthetix PharmaDocs",
    tagline: "Regulatory Dossier & Submission Automation Platform",
    short_description: "Automated eCTD regulatory dossier compiler and chemical composition validation engine for pharmaceutical submissions.",
    full_description: "Synthetix PharmaDocs simplifies the preparation of drug master files (DMF) and investigational new drug (IND) dossiers. Features automated cross-reference verification and regulatory terminology reconciliation.",
    category: "Pharmaceutical Software",
    technologies: ["Python", "FastAPI", "React", "NLP", "Elasticsearch"],
    thumbnail_image: ASSETS.aivoa,
    cover_image: ASSETS.aivoa,
    live_url: "https://pharmadocs.codelessai.in",
    github_url: "",
    status: "Beta",
    featured: false,
    published: true,
    created_date: "2025-10-05",
    sort_order: 5,
  },
  {
    project_id: "PRJ006",
    slug: "novaspeech-multilingual-tts",
    project_name: "NovaSpeech TTS",
    tagline: "Ultra-Low Latency Multilingual Neural Voice Generator",
    short_description: "High-fidelity neural text-to-speech API supporting 24+ languages with streaming acoustic pitch and pacing controls.",
    full_description: "NovaSpeech generates lifelike human speech from text streams with studio acoustic warmth. Used by interactive kiosks, audio-book publishers, and accessibility tools.",
    category: "AI & Voice Technology",
    technologies: ["Rust", "PyTorch", "gRPC", "Docker", "React"],
    thumbnail_image: ASSETS.codevoice,
    cover_image: ASSETS.codevoice,
    live_url: "https://novaspeech.codelessai.in",
    github_url: "https://github.com/codelesstechnologies/novaspeech",
    status: "Live",
    featured: false,
    published: true,
    created_date: "2025-08-18",
    sort_order: 6,
  }
];

export const INITIAL_PROJECT_DETAILS: ProjectDetail[] = [
  // CodeVoice Details
  {
    project_id: "PRJ001",
    section_type: "overview",
    heading: "Executive Overview",
    content: "CodeVoice is an end-to-end voice AI engine designed to solve the latency and unnatural phrasing barriers in traditional voicebots. It connects speech input, cognitive understanding, and neural audio synthesis directly in a streaming pipeline.",
    sort_order: 1
  },
  {
    project_id: "PRJ001",
    section_type: "problem",
    heading: "The Engineering Challenge",
    content: "Conventional automated voice systems exhibit 1.5–3 second pauses between conversational turns, disrupting dialogue flow and confusing users. Furthermore, voice quality frequently drops when synthesizers handle domain-specific terminology or accented speech.",
    sort_order: 2
  },
  {
    project_id: "PRJ001",
    section_type: "solution",
    heading: "Architecture & Solution",
    content: "We developed a stream-chunked audio pipeline leveraging optimized ONNX runtimes. Acoustic features are generated on-the-fly while token generation is in flight, reducing round-trip voice latency to under 200 milliseconds.",
    sort_order: 3
  },
  {
    project_id: "PRJ001",
    section_type: "features",
    heading: "Key Capabilities",
    content: JSON.stringify([
      "Bidirectional full-duplex conversational audio streaming over WebSockets",
      "Sub-200ms turnaround time from user sentence completion to synthesized audio playback",
      "Dynamic prosody, emotion injection, and pacing adjustment",
      "Custom vocabulary pronunciation dictionaries and acoustic fine-tuning",
      "Integrated barge-in detection with instant playback cancellation"
    ]),
    sort_order: 4
  },
  {
    project_id: "PRJ001",
    section_type: "outcomes",
    heading: "Technical Outcomes",
    content: "Deployed across internal pilot customer support channels with verifiable sub-200ms latency benchmarks and 99.4% speech recognition accuracy under standard acoustic conditions.",
    sort_order: 5
  },

  // AIVOA.AI Details
  {
    project_id: "PRJ002",
    section_type: "overview",
    heading: "Regulatory Quality Assurance",
    content: "AIVOA.AI is an automated pharmaceutical Quality Management System engineered to digitize critical manufacturing batch records, deviations, and corrective actions (CAPA) with cryptographic audit logging.",
    sort_order: 1
  },
  {
    project_id: "PRJ002",
    section_type: "problem",
    heading: "Compliance Inefficiencies",
    content: "Paper-based and legacy QMS solutions create lengthy review cycles during batch releases. Manual entry errors can delay critical pharmaceutical shipments and risk non-compliance during regulatory inspections.",
    sort_order: 2
  },
  {
    project_id: "PRJ002",
    section_type: "solution",
    heading: "Digital Verification Matrix",
    content: "AIVOA.AI introduces structured electronic signatures, automatic timestamp verification, and real-time validation checks during batch execution, ensuring 100% adherence to Good Manufacturing Practice (GMP) protocols.",
    sort_order: 3
  },
  {
    project_id: "PRJ002",
    section_type: "features",
    heading: "Core Specifications",
    content: JSON.stringify([
      "21 CFR Part 11 compliant electronic signatures and tamper-evident audit logs",
      "Automated CAPA routing with configurable multi-level review workflows",
      "Real-time deviation alerts with severity classification matrix",
      "Structured batch record generation with PDF/A export validation",
      "Role-based granular access control with re-authentication prompts"
    ]),
    sort_order: 4
  },

  // BizFlow Omni Details
  {
    project_id: "PRJ003",
    section_type: "overview",
    heading: "Workflow Orchestration",
    content: "BizFlow Omni provides an event-driven automation backbone for enterprises seeking to eliminate manual data re-entry between disparate business systems.",
    sort_order: 1
  },
  {
    project_id: "PRJ003",
    section_type: "problem",
    heading: "Operational Bottlenecks",
    content: "Enterprises frequently run separate CRM, ERP, and inventory platforms, forcing operations teams to spend hundreds of hours re-keying records and resolving synchronization discrepancies.",
    sort_order: 2
  },
  {
    project_id: "PRJ003",
    section_type: "solution",
    heading: "Distributed Execution Architecture",
    content: "Using durable execution workflows and asynchronous message brokers, BizFlow Omni executes resilient data pipelines that handle network interruptions with zero data loss.",
    sort_order: 3
  },
  {
    project_id: "PRJ003",
    section_type: "features",
    heading: "Platform Features",
    content: JSON.stringify([
      "Visual workflow canvas with automated error-recovery branches",
      "Pre-built enterprise connectors for SAP, Salesforce, and SQL databases",
      "Intelligent document parsing for incoming purchase orders and invoices",
      "Detailed step-by-step transaction observability and execution replays"
    ]),
    sort_order: 4
  },

  // VisionSense Edge Details
  {
    project_id: "PRJ004",
    section_type: "overview",
    heading: "Industrial Edge Intelligence",
    content: "VisionSense Edge connects directly to IP cameras on manufacturing and logistics floors to provide real-time object classification and perimeter safety alerts.",
    sort_order: 1
  },
  {
    project_id: "PRJ004",
    section_type: "problem",
    heading: "Bandwidth & Privacy Limits",
    content: "Streaming dozens of 4K video feeds to the cloud for analysis consumes prohibitive bandwidth and introduces latency and security concerns in sensitive manufacturing facilities.",
    sort_order: 2
  },
  {
    project_id: "PRJ004",
    section_type: "solution",
    heading: "On-Premises Edge Acceleration",
    content: "All inference executes locally on compact hardware accelerators using TensorRT optimization, only transmitting telemetry events and anonymized metadata to the central dashboard.",
    sort_order: 3
  },
  {
    project_id: "PRJ004",
    section_type: "features",
    heading: "Core Features",
    content: JSON.stringify([
      "Sub-30ms multi-class object detection and tracking",
      "Zero internet dependency for mission-critical perimeter monitoring",
      "Configurable geofencing and alert trigger notifications",
      "Encrypted event telemetry over lightweight MQTT protocols"
    ]),
    sort_order: 4
  }
];

export const INITIAL_PROJECT_MEDIA: ProjectMedia[] = [
  {
    media_id: "MED001",
    project_id: "PRJ001",
    image_url: ASSETS.codevoice,
    caption: "CodeVoice Speech Synthesizer & Acoustic Stream Control Console",
    media_type: "screenshot",
    sort_order: 1
  },
  {
    media_id: "MED002",
    project_id: "PRJ001",
    image_url: ASSETS.hero,
    caption: "Neural Processing Architecture and Audio Pipeline Routing",
    media_type: "gallery",
    sort_order: 2
  },
  {
    media_id: "MED003",
    project_id: "PRJ002",
    image_url: ASSETS.aivoa,
    caption: "AIVOA Operational Dashboard: Batch Record Validation and Audit Findings",
    media_type: "screenshot",
    sort_order: 1
  },
  {
    media_id: "MED004",
    project_id: "PRJ003",
    image_url: ASSETS.bizflow,
    caption: "BizFlow Omni Intelligent Enterprise Workflow Execution Canvas",
    media_type: "screenshot",
    sort_order: 1
  },
  {
    media_id: "MED005",
    project_id: "PRJ004",
    image_url: ASSETS.vision,
    caption: "VisionSense Edge Real-Time Analytics and Object Detection Monitor",
    media_type: "screenshot",
    sort_order: 1
  }
];
