import { Project, ExperienceItem, EducationItem, CompetencyTier, TechStackCategory, SocialLink } from '../types';

export const PERSONAL_INFO = {
  name: "Dhanvin Makwana",
  title: "AI Engineer & Data Scientist",
  tagline: "Architecting intelligent systems through Deep Learning, Large Language Models, and Real-Time Computer Vision pipelines.",
  bio: "I am an AI Engineer and Data Scientist with hands-on expertise in developing cutting-edge machine learning and deep learning solutions. My focus lies at the intersection of autonomous LLM reasoning systems (Agentic RAG) and edge-optimized computer vision pipelines. From training neural architectures to deploying production-ready APIs, I turn complex data into actionable artificial intelligence.",
  email: "dhanvinmakwana18@gmail.com",
  location: "Ahmedabad, Gujarat, India",
  availability: "Open to High-Impact Roles & AI Collaborations",
  stats: [
    { label: "Focus Domains", value: "LLMs & Vision" },
    { label: "Core Stack", value: "PyTorch & Transformers" },
    { label: "Model Optimization", value: "TensorRT & Quantization" },
    { label: "Active Pipeline Speed", value: "< 50ms Edge Latency" },
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "nexus-llm",
    title: "NexusLLM: Autonomous Agentic RAG & Multi-Modal Engine",
    subtitle: "Enterprise-grade Retrieval-Augmented Generation & Tool-Calling Agent System",
    category: "LLMs & GenAI",
    badge: "LLM Systems",
    description: "Distributed multimodal agent framework featuring dynamic query routing, self-correcting RAG verification loops, hybrid dense-sparse vector indexing, and tool execution orchestration for complex analytical queries.",
    longDescription: "NexusLLM is an end-to-end autonomous reasoning framework designed to overcome hallucination and context-window constraints in large language models. It introduces self-reflective verification layers where candidate answers are cross-examined against retrieved chunk citations before response synthesis. The system seamlessly handles multimodal input (tabular datasets, image charts, technical documents) via combined Vision-Language backbones and custom semantic embeddings.",
    problem: "LLMs suffer from hallucinations, limited context windows, and inability to interact with multimodal enterprise data effectively.",
    solution: "Built a distributed multimodal agent framework with dynamic routing, self-correcting RAG verification, and hybrid indexing.",
    results: "Achieved <110ms retrieval latency, reduced hallucinations by 42%, and supported 128k token context with 96.4% precision.",
    tags: ["LLMs", "LangChain", "Transformers", "FastAPI", "VectorDB (Qdrant)", "Python", "LlamaIndex", "vLLM"],
    metrics: [
      { label: "Retrieval Latency", value: "< 110ms" },
      { label: "Hallucination Reduction", value: "42%" },
      { label: "Context Window", value: "128k Tokens" },
      { label: "Precision Score", value: "96.4%" },
    ],
    keyFeatures: [
      "Dynamic Router Agent for deciding between direct generation, web retrieval, or domain-specific vector stores.",
      "Self-Correction & Evaluation loop calculating citation ground truth and consistency metrics.",
      "Quantized LLM deployment using vLLM & GGUF formats for low-cost high-throughput GPU serving.",
      "Multimodal document parser analyzing complex PDF tables, flowcharts, and embedded schematics."
    ],
    architectureOverview: "Client UI / REST -> FastAPI Gateway -> Agent Orchestrator (LangChain / LangGraph) -> Dense/BM25 Hybrid Retrieval (Qdrant & Cross-Encoder Reranker) -> LLM Inference Pipeline (Open-source / OpenAI / Gemini) -> Real-time Token Streaming.",
    githubUrl: "https://github.com/DhanvinMakwana/NexusLLM-Agentic-RAG",
    liveUrl: "",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "vision-pulse",
    title: "VisionPulse: Edge-Optimized Real-Time Perception & Defect Detection",
    subtitle: "Ultra-low latency deep learning computer vision pipeline for spatial localization and industrial inspection",
    category: "Computer Vision",
    badge: "Computer Vision",
    description: "High-throughput real-time object detection and anomaly localization system optimized for edge devices and video feeds, achieving 60+ FPS inference via TensorRT acceleration and custom anchor-free vision backbones.",
    longDescription: "VisionPulse delivers industrial-grade real-time computer vision processing for high-speed camera streams and automated defect segmentation. Built on top of customized YOLOv8/v9 architectures with specialized attention modules (CBAM) and multi-scale feature pyramids (BiFPN), it detects micro-scale surface anomalies and object bounding boxes under varying illumination with minimal false positives. The pipeline is compiled with ONNX and TensorRT for edge hardware deployment.",
    problem: "High-speed manufacturing lines require micro-defect detection in real-time, but standard models are too slow or resource-intensive for edge hardware.",
    solution: "Developed a custom anchor-free vision backbone (YOLOv8/v9 based) compiled with TensorRT and ONNX for ultra-low latency inference on edge devices.",
    results: "Attained 65+ FPS edge framerate with a 99.2% mAP@0.5 benchmark, reducing VRAM footprint by 68%.",
    tags: ["Computer Vision", "PyTorch", "YOLOv8/v9", "OpenCV", "TensorRT", "CUDA", "FastAPI", "Docker"],
    metrics: [
      { label: "Edge Framerate", value: "65+ FPS" },
      { label: "mAP@0.5 Benchmark", value: "99.2%" },
      { label: "Inference Footprint", value: "-68% VRAM" },
      { label: "Detection Latency", value: "14.2ms" },
    ],
    keyFeatures: [
      "Custom anchor-free convolutional backbone with spatial attention gates for micro-defect segmentation.",
      "FP16/INT8 post-training quantization pipeline via TensorRT and ONNX Runtime.",
      "Automated video frame ingestion stream with multi-threaded OpenCV CUDA acceleration.",
      "Active learning triage UI flagging low-confidence frames for human-in-the-loop retraining."
    ],
    architectureOverview: "RTSP Video Stream -> OpenCV Hardware Decoded Buffer -> TensorRT Pre-processing -> YOLOv8 Attention Backbone -> NMS & Spatial Filtering -> WebSocket Event Dispatcher & Dashboard.",
    githubUrl: "https://github.com/DhanvinMakwana/VisionPulse-Edge-Perception",
    liveUrl: "",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "yuvaintern",
    role: "Data Science Intern",
    company: "Yuvaintern",
    period: "2024 — Present",
    location: "Remote / India",
    type: "Internship",
    description: "Spearheaded end-to-end data science projects, focused on predictive statistical modeling, data preprocessing pipelines, and exploratory analysis across heterogeneous datasets.",
    highlights: [
      "Engineered machine learning and deep learning pipelines with scikit-learn, TensorFlow, and PyTorch, optimizing model hyperparameters to boost classification F1-score.",
      "Conducted extensive Exploratory Data Analysis (EDA), feature engineering, outlier detection, and statistical hypothesis testing.",
      "Implemented automated preprocessing workflows for missing values, encoding, and dimensional reduction, accelerating model training experimentation cycles.",
      "Collaborated in agile team sprints to document model architectures, evaluate bias/variance tradeoffs, and present data-driven insights to stakeholders."
    ],
    skills: ["Python", "Machine Learning", "Deep Learning", "EDA", "PyTorch", "scikit-learn", "Pandas", "Statistical Analysis"]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    id: "silver-oak",
    institution: "Silver Oak University",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Engineering / Artificial Intelligence & Data Science",
    period: "2021 — 2025",
    location: "Ahmedabad, Gujarat",
    highlights: [
      "Specialized in Machine Learning, Deep Neural Networks, Algorithms, Data Structures, and Database Management Systems.",
      "Hands-on coursework & lab projects in Computer Vision, Natural Language Processing, and Cloud Computing.",
      "Active participant in technical hackathons, AI workshops, and open-source data science symposiums."
    ]
  },
  {
    id: "bhagwati-vidyalay",
    institution: "Bhagwati Vidyalay",
    degree: "Higher Secondary Certificate (HSC) & Secondary School",
    field: "Science Stream (Mathematics, Physics, Chemistry)",
    period: "Secondary & Higher Secondary",
    location: "Gujarat, India",
    highlights: [
      "Built a solid foundation in advanced mathematics, calculus, linear algebra, and scientific logic.",
      "Excellence in academic coursework, laying the mathematical groundwork for advanced AI and machine learning theory."
    ]
  }
];

export const COMPETENCY_TIERS: CompetencyTier[] = [
  {
    id: "advanced-ai",
    label: "TIER 01 · ADVANCED AI",
    title: "Advanced AI & Generative AI",
    theme: "purple",
    skills: [
      {
        name: "Artificial Intelligence",
        description: "Designing intelligent systems using modern machine learning and deep learning techniques.",
        technologies: ["Python", "PyTorch", "TensorFlow", "Neural Networks"],
        projectId: "nexus-llm"
      },
      {
        name: "LLMs & Transformers",
        description: "Building generative and conversational architectures with transformer-based language models.",
        technologies: ["Transformers", "Hugging Face", "Prompt Engineering", "LangChain"],
        projectId: "nexus-llm"
      },
      {
        name: "Generative AI",
        description: "Developing multimodal generation pipelines, synthetic data engines, and fine-tuned models.",
        technologies: ["Generative AI Studio", "Stable Diffusion", "LLMs", "Embeddings"],
        projectId: "nexus-llm"
      },
      {
        name: "Agentic AI & RAG",
        description: "Architecting autonomous agents with vector retrieval, knowledge graphs, and tool execution.",
        technologies: ["RAG", "Vector Search", "ChromaDB", "LangGraph"],
        projectId: "nexus-llm"
      },
      {
        name: "Computer Vision",
        description: "Real-time object detection, segmentation, and visual classification systems.",
        technologies: ["OpenCV", "YOLO", "CNNs", "Vision Transformers"],
        projectId: "vision-pulse"
      }
    ]
  },
  {
    id: "core-ml-datascience",
    label: "TIER 02 · CORE ENGINE",
    title: "Machine Learning & Core Data Science",
    theme: "blue",
    skills: [
      {
        name: "Machine Learning",
        description: "Supervised and unsupervised algorithmic modeling, regression, and classification pipelines.",
        technologies: ["scikit-learn", "XGBoost", "LightGBM", "Model Evaluation"],
        projectId: "nexus-llm"
      },
      {
        name: "Deep Learning",
        description: "Designing and training deep multi-layer neural architectures for complex representations.",
        technologies: ["PyTorch", "TensorFlow", "Keras", "Backpropagation"],
        projectId: "vision-pulse"
      },
      {
        name: "Python",
        description: "Core language ecosystem for scalable AI modeling, data pipelines, and backend APIs.",
        technologies: ["Python", "NumPy", "Pandas", "FastAPI"],
        projectId: "nexus-llm"
      },
      {
        name: "Statistics & Mathematics",
        description: "Probability distributions, hypothesis testing, linear algebra, and calculus foundations.",
        technologies: ["Statistical Inference", "Optimization", "Multivariate Analysis"],
        projectId: "projects"
      },
      {
        name: "Data Science",
        description: "End-to-end scientific methodology translating unstructured data into predictive intelligence.",
        technologies: ["Feature Engineering", "Model Tuning", "Cross-Validation"],
        projectId: "projects"
      }
    ]
  },
  {
    id: "data-engineering",
    label: "TIER 03 · PIPELINE & QUALITY",
    title: "Data Engineering & Data Quality",
    theme: "emerald",
    skills: [
      {
        name: "Data Wrangling",
        description: "Transforming messy raw sources into structured, queryable analytical formats.",
        technologies: ["Pandas", "NumPy", "ETL Workflows"],
        projectId: "projects"
      },
      {
        name: "Exploratory Data Analysis",
        description: "Uncovering underlying data patterns, anomalies, distributions, and correlations.",
        technologies: ["EDA", "Statistical Summaries", "Visual Profiling"],
        projectId: "projects"
      },
      {
        name: "Data Cleaning",
        description: "Handling missing variables, deduplication, outlier treatment, and data normalization.",
        technologies: ["Imputation", "Outlier Detection", "Schema Validation"],
        projectId: "projects"
      },
      {
        name: "Data Preparation",
        description: "Feature encoding, scaling, tokenization, and dataset splitting for ML ingestion.",
        technologies: ["Scaling & Normalization", "One-Hot Encoding", "Tokenization"],
        projectId: "projects"
      },
      {
        name: "SQL & Data Pipelines",
        description: "Relational database querying, schema structuring, and automated ingestion pipelines.",
        technologies: ["SQL", "PostgreSQL", "Query Optimization", "Database Design"],
        projectId: "projects"
      }
    ]
  }
];

export const TECH_STACK_GROUPS: TechStackCategory[] = [
  {
    category: "Languages",
    iconName: "Code2",
    items: ["Python", "SQL", "R"]
  },
  {
    category: "ML / Deep Learning",
    iconName: "Brain",
    items: ["PyTorch", "TensorFlow", "Keras", "scikit-learn"]
  },
  {
    category: "LLM / AI",
    iconName: "Sparkles",
    items: ["Transformers", "RAG", "Vector Search", "AI Agents"]
  },
  {
    category: "Computer Vision",
    iconName: "Eye",
    items: ["OpenCV", "YOLO", "CNNs"]
  },
  {
    category: "Data",
    iconName: "Database",
    items: ["NumPy", "Pandas", "Matplotlib", "Seaborn"]
  },
  {
    category: "Engineering",
    iconName: "Terminal",
    items: ["Git", "GitHub", "Linux", "REST APIs", "Docker"]
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Email",
    url: "mailto:dhanvinmakwana18@gmail.com",
    icon: "Mail",
    handle: "dhanvinmakwana18@gmail.com"
  },
  {
    name: "GitHub",
    url: "https://github.com/DhanvinMakwana",
    icon: "Github",
    handle: "@DhanvinMakwana"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/dhanvin-makwana",
    icon: "Linkedin",
    handle: "in/dhanvin-makwana"
  },
  {
    name: "Twitter / X",
    url: "https://x.com/DhanvinMakwana",
    icon: "Twitter",
    handle: "@DhanvinMakwana"
  }
];

export const POLAROID_SNAPSHOTS = [
  {
    id: 1,
    title: "Neural Model Training",
    subtitle: "Loss convergence on custom dataset",
    rotation: "-3deg",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Edge Vision Deployment",
    subtitle: "60+ FPS inference benchmark",
    rotation: "2.5deg",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Multimodal Agent RAG",
    subtitle: "LangGraph orchestration test",
    rotation: "-2deg",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "Data Science at Yuvaintern",
    subtitle: "Exploratory modeling & metrics",
    rotation: "3deg",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  }
];
