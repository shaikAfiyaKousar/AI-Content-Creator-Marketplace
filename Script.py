import dataclasses
from typing import List

@dataclasses.dataclass
class Persona:
    name: str
    description: str

@dataclasses.dataclass
class SubFeature:
    name: str
    description: str

@dataclasses.dataclass
class FeatureCategory:
    title: str
    features: List[SubFeature]

@dataclasses.dataclass
class SystemModule:
    name: str
    functionality: str
    tech_implementation: str

@dataclasses.dataclass
class Phase:
    title: str
    duration: str
    tasks: List[str]

class MarketplaceBlueprintBuilder:
    def __init__(self):
        self.title = "AI-Native Content Creator Marketplace Blueprint"
        self.intro = "Building an AI-Native Content Creator Marketplace requires tailoring the platform specifically to the unique workflows of generative AI production—such as model fine-tuning, prompt design, consistency management, and intellectual property (IP) verification."
        
        self.personas = [
            Persona("AI Creators", "Prompt engineers, LoRA/model trainers, AI animators, synthetic voice designers, and visual storytellers using tools like Midjourney, Runway, ComfyUI, ElevenLabs, and Flux."),
            Persona("Brands & Agencies", "Marketing teams, creative directors, and agencies seeking high-speed, cost-effective, scalable visual and voice assets while maintaining strict brand consistency.")
        ]
        
        self.feature_categories = [
            FeatureCategory(
                title="A. Intelligent Discovery & Search",
                features=[
                    SubFeature("Prompt-Based Search", "Brands search by uploading a mood board or entering descriptive prompts (e.g., 'Hyper-realistic sci-fi product shot') to find creators whose past work matches the aesthetic."),
                    SubFeature("Style & Tool Filtering", "Filter creators by specific tools used (e.g., ComfyUI pipelines, custom LoRAs), asset types, render resolution, and turnaround speed.")
                ]
            ),
            FeatureCategory(
                title="B. Dynamic Briefing & AI Matchmaker",
                features=[
                    SubFeature("Interactive Brief Builder", "Guides brands to specify technical constraints—aspect ratio, frame rate, seed consistency, brand color palettes, and negative prompts."),
                    SubFeature("Smart Creator Matching", "An internal AI agent evaluates creative briefs against creator profiles, turnaround capacity, and portfolio embeddings to recommend the top candidates.")
                ]
            ),
            FeatureCategory(
                title="C. AI-Native Portfolios & Provenance",
                features=[
                    SubFeature("Metadata-Rich Showcases", "Portfolios highlight workflows used, base models, post-processing steps, and generation seed variations."),
                    SubFeature("Interactive Previews", "Interactive sliders showing raw AI output vs. final edited assets."),
                    SubFeature("Provenance Verification", "Automatic watermark checks and C2PA metadata embedding to verify generation origin and ensure rights management.")
                ]
            ),
            FeatureCategory(
                title="D. Collaborative Project Workspace & Review",
                features=[
                    SubFeature("In-Canvas Annotations", "Brands can drop pins on video frames or images to request targeted inpainting, seed adjustments, or upscaling edits."),
                    SubFeature("Version Control", "Track revisions based on generation parameters, allowing clients to revert to previous model iterations easily."),
                    SubFeature("Escrow Payments & Milestone Tracking", "Milestones tied to specific deliverables (e.g., Concept Approval, Raw Render Generation, Upscaled Final Master).")
                ]
            )
        ]
        
        self.modules = [
            SystemModule("Search Engine", "Visual similarity & semantic prompt search", "Multimodal embeddings (CLIP/OpenCLIP) stored in Pinecone or Qdrant"),
            SystemModule("Brief Assistant", "Translates client requirements into structured technical specs", "LLM structured output engine (e.g., Claude 3.5 Sonnet / Gemini API)"),
            SystemModule("Asset Delivery", "Secure preview rendering with custom watermarks", "Cloudflare Workers + Sharp/FFmpeg image/video pipeline"),
            SystemModule("Rights & Legal", "Generation logging and commercial rights transfer", "Automated contract generation with attached metadata logs")
        ]
        
        self.monetization = [
            "**Marketplace Take Rate:** 10–15% fee charged to brands per project; 5–8% platform fee charged to creators.",
            "**Subscription Tier (Brands & Agencies):** Pro Tier with direct contact capabilities, advanced vector search, custom NDAs, and dedicated project managers.",
            "**Compute & Tooling Credits (Optional Phase 2):** Offer creators hosted GPU environments directly within the workspace, taking a small margin on compute usage."
        ]
        
        self.roadmap = [
            Phase("Phase 1: MVP", "Weeks 1–8", [
                "Creator profiles with manual asset uploads and model tagging.",
                "Basic job board for brands to post briefs.",
                "In-app messaging, escrow integration (Stripe Connect), and project milestone tracking."
            ]),
            Phase("Phase 2: AI Enhancements", "Weeks 9–16", [
                "Semantic prompt search and image-to-image similarity creator matching.",
                "Automated AI brief translation tool for non-technical brand managers.",
                "Enhanced proofing canvas with visual frame-by-frame annotations."
            ]),
            Phase("Phase 3: Scaling & Platform Ecosystem", "Weeks 17+", [
                "API access for agencies to push briefs programmatically.",
                "C2PA standard integration for enterprise copyright verification.",
                "In-platform sandbox for creators to run cloud generations for clients directly."
            ])
        ]

    def _build_architecture_diagram(self) -> str:
        return """```text
                  ┌─────────────────────────────────────────┐
                  │          Next.js Frontend / CDN         │
                  └────────────────────┬────────────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
            ┌─────────────────────────┐ ┌─────────────────────────┐
            │ Node.js / Go API Gateway│ │   Python AI Services    │
            └────────────┬────────────┘ └────────────┬────────────┘
                         │                           │
        ┌────────────────┼────────────────┐          │ (CLIP Embeddings,
        ▼                ▼                ▼          │  Vector Search,
┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │  Image Analysis)
│ PostgreSQL   │ │ Pinecone/Qdrant│ │ AWS S3 / Cloud │   │
│ (Users/Jobs) │ │ (Vector DB)  │ │ (Media Assets)│   │
└──────────────┘ └──────────────┘ └──────────────┘   ▼
                                         ┌─────────────────────────┐
                                         │ ComfyUI / API Engine    │
                                         │ (Optional GPU Workers)  │
                                         └─────────────────────────┘
```"""

    def generate_markdown(self) -> str:
        md = []
        md.append(f"{self.intro}\n")
        
        md.append("## 1. Target Audience & Core Personas")
        for persona in self.personas:
            md.append(f"* **{persona.name}:** {persona.description}")
        md.append("")
        
        md.append("## 2. Core Platform Capabilities & Feature Requirements")
        for category in self.feature_categories:
            md.append(f"### {category.title}")
            for feature in category.features:
                md.append(f"* **{feature.name}:** {feature.description}")
            md.append("")
            
        md.append("## 3. High-Level System Architecture")
        md.append(self._build_architecture_diagram())
        md.append("")
        
        md.append("## 4. Key Functional Modules")
        md.append("| Module | Core Functionality | Technical Implementation |")
        md.append("| :--- | :--- | :--- |")
        for module in self.modules:
            md.append(f"| **{module.name}** | {module.functionality} | {module.tech_implementation} |")
        md.append("")
        
        md.append("## 5. Monetization & Business Model")
        for idx, strategy in enumerate(self.monetization, 1):
            md.append(f"{idx}. {strategy}")
        md.append("")
        
        md.append("## 6. Implementation Roadmap")
        for phase in self.roadmap:
            md.append(f"### {phase.title} ({phase.duration})")
            for task in phase.tasks:
                md.append(f"* {task}")
            md.append("")
            
        return "\n".join(md)

# Execute the builder and print the Markdown output
if __name__ == "__main__":
    builder = MarketplaceBlueprintBuilder()
    output = builder.generate_markdown()
    print(output)