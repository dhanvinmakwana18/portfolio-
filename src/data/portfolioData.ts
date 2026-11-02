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
    id: "project-toto",
    title: "TOTO: F1 Driver Consistency & Strategy Prediction Engine",
    subtitle: "Pinnacle F1 telemetry intelligence platform & sub-35ms strategic inference engine",
    category: "MLOps & Predictive AI",
    badge: "8 Seasons • 150+ GPs • 500k+ Laps",
    description: "An elite motorsport intelligence engine engineered to Mercedes pit-wall standards. Surgically disentangles pure driver craftsmanship, stint repeatability, and clutch psychological resilience from constructor aerodynamic hegemony across 8 Formula 1 seasons (2018–2025).",
    longDescription: `TOTO is an elite Formula 1 strategic analytics and performance prediction platform engineered to the demanding operational standards of a Grand Prix pit wall. Operating across 8 complete seasons (2018–2025) and half a million telemetry laps, the system mathematically isolates pure driver consistency, tire thermal degradation preservation, and clutch psychological resilience from constructor aerodynamic advantage.

By coupling an analytical DuckDB lakehouse with a multi-model ensemble—combining CUDA-accelerated XGBoost, LightGBM, and PyTorch Residual DeepNets with an empirical pit strategy simulator—TOTO delivers sub-35ms tactical recommendations and automated AI strategist briefings directly to race engineers.`,
    problem: "Constructor aerodynamics and power unit disparities account for ~62–66% of raw lap pace variance, masking uncompromised driver talent, tire degradation mastery, and high-stress psychological resilience.",
    solution: "Architected an 8-season telemetry intelligence platform featuring a DuckDB OLAP warehouse, 42 vectorized consistency features, an ensemble of CUDA-accelerated XGBoost, LightGBM, and PyTorch Residual DeepNet, an undercut/overcut simulator, and a sub-35ms FastAPI engine.",
    results: "Demonstrated >0.82 holdout AUC-ROC, ~88% strategy simulation precision, and <1.85 finishing position RMSE on unseen 2024–2025 seasons, with Welch t-tests confirming top-10 telemetry features govern >73% of predictive variance.",
    tags: ["FastF1", "DuckDB", "PyTorch", "XGBoost", "FastAPI", "Streamlit"],
    metrics: [
      { label: "Holdout AUC-ROC", value: "> 0.82" },
      { label: "Strategy Accuracy", value: "~88%" },
      { label: "Inference Latency", value: "< 35ms" },
      { label: "Simulated Windows", value: "50+ / race" },
    ],
    keyFeatures: [
      "Multi-Model Ensemble combining CUDA-accelerated XGBoost, LightGBM, and PyTorch Residual DeepNet (TotoDeepNet) with K-Means (k=4) driver behavioral segmentation.",
      "42 Engineered Telemetry Signals isolating clean-air lap variance, teammate pace deltas, tire degradation slopes, and cold-tire restart execution.",
      "Quantitative Pit Strategy Simulator delivering live undercut/overcut probability forecasts and stint time-loss curves.",
      "Sub-35ms FastAPI REST Server integrated with an autonomous LLM AI Strategist and DuckDB + Parquet OLAP warehouse."
    ],
    architectureOverview: "FastF1 & Micro-Climate → DuckDB Analytical OLAP → 42-Signal Vector Engine → PyTorch DeepNet & XGBoost Ensemble → Live Pit Strategist → Sub-35ms FastAPI → Pit-Wall Console",
    githubUrl: "https://github.com/DhanvinMakwana/project-toto",
    liveUrl: "",
    image: "/images/toto.png"
  },
  {
    id: "datamate",
    title: "DataMate: Autonomous Multi-Agent Data Science Platform",
    subtitle: "Sovereign 41-agent castle architecture delivering automated AutoML alchemy & executive boardroom intelligence",
    category: "MLOps & Predictive AI",
    badge: "41 Castle Agents • 7 Rooms",
    description: "A sovereign multi-agent cognitive architecture orchestrating end-to-end data alchemy. Mobilizes 41 specialized agents across 7 fortified functional rooms to autonomously conduct deep exploratory profiling, automated feature engineering, multi-model benchmarking, and boardroom-ready executive PDF dossiers in under 60 seconds.",
    longDescription: `DataMate is an enterprise-grade autonomous AI data science platform architected under a sovereign "Castle" multi-agent paradigm. Coordinated by a central MCP Brain, the platform mobilizes 41 specialized cognitive agents partitioned across 7 fortified chambers to execute end-to-end data workflows from raw multi-source ingestion to automated feature discovery and executive reporting.

Equipped with Milvus episodic vector memory and integrated with NVIDIA Nemotron, DataMate accelerates exploratory data analysis, hypothesis testing, and competitive AutoML model tournaments from days into under 60 seconds, dynamically outputting publication-grade boardroom PDF dossiers on demand.`,
    problem: "Enterprise data teams squander over 80% of their cognitive bandwidth on manual data sanitation, ad-hoc exploratory profiling, repetitive model tuning, and static reporting without persistent institutional memory.",
    solution: "Engineered a sovereign 7-room Castle multi-agent system coordinating 41 specialized cognitive agents under a central MCP Brain to automate data certification, statistical profiling, AutoML benchmarking, and ReportLab PDF dossier generation with Milvus episodic memory.",
    results: "Accelerated exploratory data science workflows from hours to <60 seconds, eliminated redundant compute via Milvus episodic vector recall, and delivered boardroom-ready executive PDF intelligence reports on demand.",
    tags: ["Multi-Agent", "NVIDIA Nemotron", "Milvus", "scikit-learn", "Streamlit", "ReportLab"],
    metrics: [
      { label: "Agent Network", value: "41 Agents • 7 Rooms" },
      { label: "Pipeline Speed", value: "< 60s End-to-End" },
      { label: "Memory Recall", value: "Milvus Episodic" },
      { label: "Automated Output", value: "Executive PDF" },
    ],
    keyFeatures: [
      "Modular 7-Room Castle Architecture coordinating 41 specialized agents under a central MCP Brain.",
      "Automated Data Quality & AutoML pipeline performing cleaning, correlation profiling, and multi-model benchmarking.",
      "Milvus Episodic Vector Memory storing execution runs to eliminate redundant computation and provide historical recall.",
      "Dynamic Executive PDF Generator producing publication-grade audit reports complete with plots, tables, and AI insights."
    ],
    architectureOverview: "Multi-Source Ingestion → Quality Certification → Statistical Profiling → AutoML Tournament → Milvus Episodic Recall → Executive PDF Dossier & Command UI",
    githubUrl: "https://github.com/DhanvinMakwana/DataMate",
    liveUrl: "",
    image: "/images/datamate.png"
  },
  {
    id: "syntera",
    title: "Syntera: Intelligent Retrieval & Grounding & Multi-Modal Engine",
    subtitle: "Enterprise-grade Retrieval-Augmented Generation & Tool-Calling Agent System",
    category: "LLMs & GenAI",
    badge: "128k Context • Qdrant RRF",
    description: "Distributed multimodal agent framework featuring dynamic query routing, self-correcting RAG verification loops, hybrid dense-sparse vector indexing, and tool execution orchestration for complex analytical queries.",
    longDescription: `Syntera is an enterprise-grade autonomous reasoning and grounding framework designed to overcome hallucination and context-window bottlenecks in large language models. The system introduces self-reflective verification layers where candidate inferences are cross-examined against retrieved chunk citations before response synthesis.

Operating across multimodal domains—including technical schematics, financial balance sheets, and tabular datasets—Syntera unifies dense vector search, BM25 lexical indexing, and cross-encoder rerankers to deliver sub-110ms precision retrieval with 128k token context handling.`,
    problem: "LLMs suffer from hallucinations, limited context windows, and inability to interact with multimodal enterprise data effectively.",
    solution: "Built a distributed multimodal agent framework with dynamic routing, self-correcting RAG verification, and hybrid indexing.",
    results: "Achieved <110ms retrieval latency, reduced hallucinations by 42%, and supported 128k token context with 96.4% precision.",
    tags: ["LangChain", "Transformers", "Qdrant", "FastAPI", "vLLM", "LlamaIndex"],
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
    architectureOverview: "Client UI → FastAPI Gateway → LangChain / LangGraph Agent → Qdrant & Cross-Encoder → LLM Pipeline → Streaming",
    githubUrl: "https://github.com/dhanvinmakwana18/syntera19",
    liveUrl: "",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "vision-pulse",
    title: "VisionPulse: Edge-Optimized Real-Time Perception & Defect Detection",
    subtitle: "Ultra-low latency deep learning computer vision pipeline for spatial localization and industrial inspection",
    category: "Computer Vision",
    badge: "65+ FPS Edge TensorRT",
    description: "High-throughput real-time object detection and anomaly localization system optimized for edge devices and video feeds, achieving 60+ FPS inference via TensorRT acceleration and custom anchor-free vision backbones.",
    longDescription: `VisionPulse is an ultra-low latency computer vision intelligence pipeline engineered for high-throughput edge inspection and industrial defect detection. Built upon customized anchor-free YOLO architectures with specialized spatial attention gates, it achieves micro-scale anomaly localization across real-time video streams under challenging ambient conditions.

Through INT8/FP16 post-training quantization via TensorRT and multi-threaded OpenCV CUDA buffering, VisionPulse delivers sustained 65+ FPS performance while slashing edge GPU memory consumption by 68%.`,
    problem: "High-speed manufacturing lines require micro-defect detection in real-time, but standard models are too slow or resource-intensive for edge hardware.",
    solution: "Developed a custom anchor-free vision backbone (YOLOv8/v9 based) compiled with TensorRT and ONNX for ultra-low latency inference on edge devices.",
    results: "Attained 65+ FPS edge framerate with a 99.2% mAP@0.5 benchmark, reducing VRAM footprint by 68%.",
    tags: ["PyTorch", "YOLOv8/v9", "TensorRT", "OpenCV", "CUDA", "FastAPI"],
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
    architectureOverview: "RTSP Video Stream → OpenCV CUDA Buffer → TensorRT Preprocessing → YOLOv8 Attention → NMS & Spatial Filter → Dashboard",
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
        projectId: "syntera"
      },
      {
        name: "LLMs & Transformers",
        description: "Building generative and conversational architectures with transformer-based language models.",
        technologies: ["Transformers", "Hugging Face", "Prompt Engineering", "LangChain"],
        projectId: "syntera"
      },
      {
        name: "Generative AI",
        description: "Developing multimodal generation pipelines, synthetic data engines, and fine-tuned models.",
        technologies: ["Generative AI Studio", "Stable Diffusion", "LLMs", "Embeddings"],
        projectId: "syntera"
      },
      {
        name: "Agentic AI & RAG",
        description: "Architecting autonomous agents with vector retrieval, knowledge graphs, and tool execution.",
        technologies: ["RAG", "Vector Search", "ChromaDB", "LangGraph"],
        projectId: "syntera"
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
        technologies: ["XGBoost", "LightGBM", "scikit-learn", "Model Ensembles"],
        projectId: "project-toto"
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
        projectId: "syntera"
      },
      {
        name: "Statistics & Mathematics",
        description: "Probability distributions, hypothesis testing, linear algebra, and calculus foundations.",
        technologies: ["Statistical Inference", "Optimization", "Multivariate Analysis"],
        projectId: "project-toto"
      },
      {
        name: "Data Science",
        description: "End-to-end scientific methodology translating unstructured data into predictive intelligence.",
        technologies: ["Feature Engineering", "AutoML", "Model Tuning", "Cross-Validation"],
        projectId: "datamate"
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
        projectId: "datamate"
      },
      {
        name: "Exploratory Data Analysis",
        description: "Uncovering underlying data patterns, anomalies, distributions, and correlations.",
        technologies: ["EDA", "Statistical Summaries", "Visual Profiling"],
        projectId: "datamate"
      },
      {
        name: "Data Cleaning",
        description: "Handling missing variables, deduplication, outlier treatment, and data normalization.",
        technologies: ["Imputation", "Outlier Detection", "Schema Validation"],
        projectId: "datamate"
      },
      {
        name: "Data Preparation",
        description: "Feature encoding, scaling, tokenization, and dataset splitting for ML ingestion.",
        technologies: ["Scaling & Normalization", "One-Hot Encoding", "Tokenization"],
        projectId: "datamate"
      },
      {
        name: "SQL & Data Pipelines",
        description: "Relational database querying, schema structuring, and automated ingestion pipelines.",
        technologies: ["DuckDB", "SQL", "PostgreSQL", "Query Optimization"],
        projectId: "project-toto"
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
    items: ["PyTorch", "XGBoost", "LightGBM", "TensorFlow", "scikit-learn"]
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
    items: ["DuckDB", "NumPy", "Pandas", "Matplotlib", "Seaborn"]
  },
  {
    category: "Engineering",
    iconName: "Terminal",
    items: ["FastAPI", "Docker", "Git", "GitHub", "Linux", "REST APIs"]
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
