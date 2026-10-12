const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');

// Models
const User = require('../models/User');
const CreatorProfile = require('../models/CreatorProfile');
const BrandProfile = require('../models/BrandProfile');
const PortfolioItem = require('../models/PortfolioItem');
const CreativeBrief = require('../models/CreativeBrief');
const Application = require('../models/Application');
const Project = require('../models/Project');
const Message = require('../models/Message');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      CreatorProfile.deleteMany({}),
      BrandProfile.deleteMany({}),
      PortfolioItem.deleteMany({}),
      CreativeBrief.deleteMany({}),
      Application.deleteMany({}),
      Project.deleteMany({}),
      Message.deleteMany({})
    ]);

    console.log('[Seed] Existing data cleared. Inserting users and profiles...');

    // 1. Create Brands
    const brandApexUser = await User.create({
      name: 'Apex Digital Studios',
      email: 'brand@apex.com',
      password: 'password123',
      role: 'brand',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80'
    });

    const brandApexProfile = await BrandProfile.create({
      user: brandApexUser._id,
      companyName: 'Apex Digital Studios',
      industry: 'Gaming, Sci-Fi & Digital Entertainment',
      companySize: '51-200',
      website: 'https://apexdigital.example.com',
      bio: 'Leading creative powerhouse producing virtual productions, AAA game cinematics, and next-gen AI commercials.',
      location: 'Los Angeles, CA',
      verified: true,
      totalBriefsPosted: 6,
      totalHired: 4,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'
    });

    const brandLuminaUser = await User.create({
      name: 'Lumina Beauty Collective',
      email: 'brand@lumina.com',
      password: 'password123',
      role: 'brand',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    });

    await BrandProfile.create({
      user: brandLuminaUser._id,
      companyName: 'Lumina Beauty Collective',
      industry: 'Luxury Cosmetics & Fashion',
      companySize: '11-50',
      website: 'https://luminabeauty.example.com',
      bio: 'High-end cruelty-free cosmetics collective pioneering hyper-real generative visual campaigns for global retail.',
      location: 'Paris & New York',
      verified: true,
      totalBriefsPosted: 3,
      totalHired: 2,
      logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80'
    });

    // 2. Create Creators
    // Creator 1: Elena Rostova (Photorealism, Midjourney, Flux)
    const creatorElenaUser = await User.create({
      name: 'Elena Rostova',
      email: 'creator@elena.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    });

    const creatorElenaProfile = await CreatorProfile.create({
      user: creatorElenaUser._id,
      tagline: 'Hyper-Realistic Product Photography & Luxury Commercials (Midjourney v6.1 & Flux)',
      bio: 'Senior Generative Visual Director with 3+ years pioneering prompt engineering and LoRA consistency workflows. Specialized in photorealistic product lighting, macro cosmetics, and studio packshots.',
      skills: ['Prompt Engineering', 'Flux LoRA Training', 'Photorealistic Lighting', 'Product Packshots', '4K Upscaling', 'Color Grading'],
      aiTools: ['Midjourney', 'Flux', 'Stable Diffusion', 'Magnific AI', 'Photoshop GenFill', 'Runway'],
      categories: ['Advertising & Commercials', 'Photorealistic Renders', 'Fashion & Editorial', 'Product Renders'],
      pricing: { hourlyRate: 95, projectMin: 800, currency: 'USD' },
      availability: 'available',
      experienceYears: 4,
      location: 'Berlin, Germany',
      rating: 4.95,
      reviewsCount: 28,
      completedProjects: 34,
      badges: ['Top Rated AI Pro', 'Fast Turnaround', 'Flux Specialist', 'Verified Expert'],
      socialLinks: {
        portfolioUrl: 'https://elenarostova.art',
        x: 'https://x.com/elenarostova_ai',
        instagram: 'https://instagram.com/elena_generative'
      }
    });

    // Creator 2: Marcus Vance (Cinematic Video, Runway Gen-3, Kling, Sora)
    const creatorMarcusUser = await User.create({
      name: 'Marcus Vance',
      email: 'creator@marcus.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    });

    const creatorMarcusProfile = await CreatorProfile.create({
      user: creatorMarcusUser._id,
      tagline: 'AI Film Director & Motion Designer | Runway Gen-3 & Kling Alpha specialist',
      bio: 'Award-winning AI animator transforming still prompts into dynamic 60fps cinematic trailers, camera parallax maneuvers, and automotive commercial spots.',
      skills: ['Runway Gen-3 Motion', 'AI Video Direction', 'Camera Control Prompts', 'Sound Design & Sync', 'Visual Effects'],
      aiTools: ['Runway', 'Kling', 'Pika', 'Midjourney', 'ElevenLabs', 'After Effects'],
      categories: ['Motion & Video', 'Advertising & Commercials', 'Sci-Fi & Cyberpunk'],
      pricing: { hourlyRate: 120, projectMin: 1200, currency: 'USD' },
      availability: 'available',
      experienceYears: 3,
      location: 'Toronto, Canada',
      rating: 4.9,
      reviewsCount: 19,
      completedProjects: 22,
      badges: ['Runway Master', 'Video Pioneer', 'Top Rated AI Pro'],
      socialLinks: {
        portfolioUrl: 'https://marcusvance.video',
        x: 'https://x.com/vance_motion'
      }
    });

    // Creator 3: Aria Chen (ComfyUI Workflow Architect & Character Designer)
    const creatorAriaUser = await User.create({
      name: 'Aria Chen',
      email: 'creator@aria.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    });

    const creatorAriaProfile = await CreatorProfile.create({
      user: creatorAriaUser._id,
      tagline: 'ComfyUI Node Architect & Custom LoRA Character Consistency Specialist',
      bio: 'Engineer-turned-artist building deterministic generative pipelines for game studios and virtual influencers. Zero hallucination, strict seed locking, and multi-angle consistent character modeling.',
      skills: ['ComfyUI Custom Nodes', 'LoRA Training', 'Character Consistency', 'ControlNet IP-Adapter', 'Concept Art'],
      aiTools: ['ComfyUI', 'Stable Diffusion', 'Flux', 'ControlNet', 'Midjourney'],
      categories: ['Character Design', 'Concept Art', 'Sci-Fi & Cyberpunk', 'Photorealistic Renders'],
      pricing: { hourlyRate: 110, projectMin: 900, currency: 'USD' },
      availability: 'busy',
      experienceYears: 4,
      location: 'San Francisco, CA',
      rating: 4.88,
      reviewsCount: 22,
      completedProjects: 26,
      badges: ['ComfyUI Architect', 'LoRA Master'],
      socialLinks: {
        github: 'https://github.com/ariachen-ai',
        x: 'https://x.com/ariachen_nodes'
      }
    });

    // Creator 4: David O'Connor (Multimodal Audio-Visual & Voice)
    const creatorDavidUser = await User.create({
      name: "David O'Connor",
      email: 'creator@david.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    });

    await CreatorProfile.create({
      user: creatorDavidUser._id,
      tagline: 'Synthetic Voice Designer & Multimodal Storyteller (ElevenLabs + DALL-E 3)',
      bio: 'Blending AI speech synthesis, multilingual voice clones, and dynamic visuals for documentary storytelling, audiobooks, and corporate explainer campaigns.',
      skills: ['ElevenLabs Voice Cloning', 'Audio Engineering', 'ChatGPT Scriptwriting', 'Multilingual Dubbing', 'Podcast Production'],
      aiTools: ['ElevenLabs', 'ChatGPT', 'DALL-E', 'Midjourney', 'Descript'],
      categories: ['Voice & Audio', 'Advertising & Commercials', 'Editorial & Content'],
      pricing: { hourlyRate: 70, projectMin: 450, currency: 'USD' },
      availability: 'available',
      experienceYears: 2,
      location: 'Dublin, Ireland',
      rating: 4.85,
      reviewsCount: 15,
      completedProjects: 18,
      badges: ['Voice Specialist', 'Storyteller']
    });

    // Creator 5: Sofia Ramos (Brand Visual Identities & Fashion Editorial)
    const creatorSofiaUser = await User.create({
      name: 'Sofia Ramos',
      email: 'creator@sofia.com',
      password: 'password123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    });

    await CreatorProfile.create({
      user: creatorSofiaUser._id,
      tagline: 'Haute Couture Editorial Imagery & Fashion AI Campaigns (Flux & Midjourney)',
      bio: 'Bridging high-fashion editorial aesthetics with generative diffusion models. Created campaigns featured in digital vogue showcases and sustainable apparel branding.',
      skills: ['Fashion Editorial', 'Fabric Texture Simulation', 'Studio Lighting Prompting', 'Brand Identity', 'Lookbook Design'],
      aiTools: ['Flux', 'Midjourney', 'Stable Diffusion', 'Magnific AI'],
      categories: ['Fashion & Editorial', 'Advertising & Commercials', 'Photorealistic Renders'],
      pricing: { hourlyRate: 85, projectMin: 650, currency: 'USD' },
      availability: 'available',
      experienceYears: 3,
      location: 'Milan, Italy',
      rating: 4.92,
      reviewsCount: 24,
      completedProjects: 30,
      badges: ['Fashion Vanguard', 'Top Rated AI Pro']
    });

    console.log('[Seed] Creators created. Inserting portfolio items...');

    // 3. Portfolio Items
    await PortfolioItem.create([
      // Elena's portfolio
      {
        creator: creatorElenaUser._id,
        title: 'Luxe Obsidian Perfume Commercial Packshot',
        description: 'Macro studio photography shot for a minimalist fragrance campaign with refractive water droplets and titanium cap finish.',
        category: 'Advertising & Commercials',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Commercial product photography, luxury black obsidian perfume bottle resting on black polished marble, refractive micro water droplets, rim studio lighting, volumetric haze, 85mm f/1.8 lens --ar 16:9 --style raw --v 6.1',
        negativePrompt: 'blurry, plastic, text, watermark, bad reflections, dust, grainy',
        aiToolsUsed: ['Midjourney', 'Magnific AI', 'Photoshop GenFill'],
        aspectRatio: '16:9',
        generationParams: { model: 'Midjourney v6.1', seed: '4982103', steps: 40, sampler: 'DPM++ 2M Karras', cfgScale: 6.5 },
        likesCount: 142,
        featured: true
      },
      {
        creator: creatorElenaUser._id,
        title: 'ChronoTitan Kinetic Watch Render',
        description: 'Titanium mechanical watch with skeleton dial floating in zero-gravity space dust with golden hour illumination.',
        category: 'Product Renders',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Hyper-detailed futuristic titanium mechanical chronograph, skeleton movement, micro-gears, floating particles of interstellar gold dust, cinematic dark background, soft directional key light --ar 1:1 --v 6.1',
        aiToolsUsed: ['Flux', 'Midjourney', 'Photoshop GenFill'],
        aspectRatio: '1:1',
        generationParams: { model: 'Flux Schnell / Dev', seed: '881293', steps: 35, cfgScale: 7 },
        likesCount: 98,
        featured: true
      },
      {
        creator: creatorElenaUser._id,
        title: 'Botanical Serum Hydro-Droplet Campaign',
        description: 'Organic skincare glass pipette dispensing botanical oil over emerald monstera leaves with caustic sunlight reflections.',
        category: 'Advertising & Commercials',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1608248597359-005118c7c251?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1608248597359-005118c7c251?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Organic skincare dropper bottle with golden botanical oil, crystal clear glass pipette suspended over wet emerald monstera leaf, caustic dappled sunlight, high speed water ripple photography --ar 4:5 --v 6.1',
        aiToolsUsed: ['Midjourney', 'Flux'],
        aspectRatio: '4:5',
        generationParams: { model: 'Midjourney v6.1', seed: '3104992', steps: 30, cfgScale: 7 },
        likesCount: 115,
        featured: false
      },

      // Marcus's portfolio
      {
        creator: creatorMarcusUser._id,
        title: 'Cyberpunk Hypercar Neon Drift (Motion Scene)',
        description: 'Runway Gen-3 generated dynamic camera chase following a concept electric supercar navigating a rain-soaked Neo-Tokyo highway.',
        category: 'Motion & Video',
        mediaType: 'video',
        mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Cinematic FPV drone tracking shot low behind electric matte-black hypercar speeding through rainy neon-lit Tokyo street, wet reflections, motion blur, anamorphic red lens flare, 60fps',
        aiToolsUsed: ['Runway', 'Midjourney', 'After Effects'],
        aspectRatio: '16:9',
        generationParams: { model: 'Runway Gen-3 Alpha', seed: '992011', steps: 50, cfgScale: 8 },
        likesCount: 230,
        featured: true
      },
      {
        creator: creatorMarcusUser._id,
        title: 'Deep Space Orbital Station Cinematic Teaser',
        description: 'Gravitational spin ring sequence with photorealistic planetary curvature and cinematic solar corona lens flare.',
        category: 'Sci-Fi & Cyberpunk',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Orbital megastructure rotating above azure planet horizon, cinematic IMAX 70mm composition, realistic solar flare glare, harsh interstellar shadows --ar 16:9',
        aiToolsUsed: ['Runway', 'Midjourney', 'Kling'],
        aspectRatio: '16:9',
        generationParams: { model: 'Midjourney v6.1 + Runway', seed: '1092837', steps: 40, cfgScale: 7 },
        likesCount: 167,
        featured: true
      },

      // Aria's portfolio
      {
        creator: creatorAriaUser._id,
        title: 'Synthetic Android Envoy (Consistent LoRA)',
        description: 'Trained custom LoRA model maintaining 100% face and biometric armor consistency across 40 disparate scene lighting conditions.',
        category: 'Character Design',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Full body portrait of synth-android female with porcelain ceramic facial plates and copper fiber-optic braids, standing in brutalist concrete atrium, soft rim light, 35mm photograph --seed 44210',
        aiToolsUsed: ['ComfyUI', 'Stable Diffusion', 'ControlNet'],
        aspectRatio: '9:16',
        generationParams: { model: 'SDXL 1.0 + Custom LoRA', seed: '44210', steps: 45, cfgScale: 7.5 },
        likesCount: 184,
        featured: true
      },
      {
        creator: creatorAriaUser._id,
        title: 'Bioluminescent Alien Biome Concept',
        description: 'Exoplanetary flora with glowing fungal spores and atmospheric bioluminescence, created via multi-pass ControlNet depth passes.',
        category: 'Concept Art',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'Extraterrestrial jungle landscape bathed in twilight, glowing cyan and violet bioluminescent moss, mist, giant twisted ancient roots, environmental concept painting --ar 16:9',
        aiToolsUsed: ['ComfyUI', 'Flux', 'ControlNet'],
        aspectRatio: '16:9',
        generationParams: { model: 'Flux Dev / ComfyUI Node', seed: '619283', steps: 35, cfgScale: 7 },
        likesCount: 129,
        featured: false
      },

      // Sofia's portfolio
      {
        creator: creatorSofiaUser._id,
        title: 'Vogue Renaissance: Metallic Silk Draped Fashion',
        description: 'Editorial high-fashion lookbook showcasing liquid titanium fabrics draped in a classical marble palazzo setting.',
        category: 'Fashion & Editorial',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
        promptUsed: 'High-fashion editorial model wearing flowing molten silver liquid chrome gown, marble palace interior in Venice, dramatic baroque chiaroscuro lighting, Annie Leibovitz style --ar 4:5',
        aiToolsUsed: ['Flux', 'Midjourney', 'Magnific AI'],
        aspectRatio: '4:5',
        generationParams: { model: 'Flux Schnell', seed: '772910', steps: 40, cfgScale: 7.2 },
        likesCount: 201,
        featured: true
      }
    ]);

    console.log('[Seed] Portfolio items created. Publishing creative briefs...');

    // 4. Creative Briefs
    const brief1 = await CreativeBrief.create({
      brand: brandApexUser._id,
      title: 'Next-Gen Cyberpunk Game Cinematic Teaser & Key Art',
      description: 'We are launching our upcoming open-world RPG "Neo-Babylon 2088". We need 4 ultra-high-resolution key art illustrations depicting futuristic city vistas, cybernetic characters, and a 15-second teaser scene with realistic camera movement. Must adhere strictly to neon palette and consistent character armor design.',
      category: 'Advertising & Commercials',
      budgetMin: 1200,
      budgetMax: 2500,
      currency: 'USD',
      deliverables: [
        '4 Key Art Illustrations (3840x2160, 300 DPI)',
        '1 15-second Cinematic Video Loop (Runway or Kling)',
        'Full prompt documentation and generation seed logs'
      ],
      requiredAiTools: ['Midjourney', 'Runway', 'Flux'],
      promptGuidelines: 'Wet asphalt reflections, anamorphic cyan-magenta lighting, gritty photorealism, industrial mecha details.',
      targetAudience: 'Hardcore gamers, sci-fi enthusiasts, tech audience aged 18-35',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'in_progress',
      selectedCreator: creatorElenaUser._id
    });

    const brief2 = await CreativeBrief.create({
      brand: brandLuminaUser._id,
      title: 'Luxury Lumina Gold Peptide Serum Campaign',
      description: 'Lumina Beauty is unveiling our flagship gold peptide antioxidant facial serum. We require clean, clinical, yet opulent macro packshot renders demonstrating liquid consistency, gold leaf suspensions, and droplet refraction on model skin. Deliverables will be utilized across Sephora digital displays and social ads.',
      category: 'Advertising & Commercials',
      budgetMin: 800,
      budgetMax: 1600,
      currency: 'USD',
      deliverables: [
        '5 High-Resolution Hero Packshots (4K)',
        '3 Macro Skin & Serum Application Textures',
        'Transparent PNG cutouts with accurate alpha transparency'
      ],
      requiredAiTools: ['Midjourney', 'Flux', 'Magnific AI'],
      promptGuidelines: 'Soft directional studio lighting, warm champagne tones, clinical laboratory precision mixed with Parisian luxury.',
      targetAudience: 'Luxury skincare shoppers, premium cosmetics consumers aged 25-50',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      status: 'open'
    });

    const brief3 = await CreativeBrief.create({
      brand: brandApexUser._id,
      title: 'Automotive Electric Hypercar Social Video Reel',
      description: 'Need a fast-paced 9:16 Instagram & TikTok AI video campaign showing a futuristic matte-white electric hypercar cruising through a desert canyon at golden hour.',
      category: 'Motion & Video',
      budgetMin: 900,
      budgetMax: 1800,
      currency: 'USD',
      deliverables: [
        '2 Vertical 15s AI Video Clips (1080x1920, 60fps)',
        'Sound design stems and synced ambient audio'
      ],
      requiredAiTools: ['Runway', 'Kling', 'ElevenLabs'],
      promptGuidelines: 'Golden hour sunlight, dramatic camera chase, dust cloud physics, speed motion blur.',
      targetAudience: 'Automotive and design enthusiasts on TikTok and Instagram',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open'
    });

    console.log('[Seed] Creative briefs created. Inserting applications...');

    // 5. Applications
    // Elena applied for Brief 1 (Accepted)
    const appElenaBrief1 = await Application.create({
      brief: brief1._id,
      creator: creatorElenaUser._id,
      pitch: 'I have extensive experience crafting photorealistic cyberpunk key art and commercial packshots using Midjourney v6.1 and Flux. I can guarantee consistent volumetric lighting, razor-sharp 4K textures, and prompt transparency.',
      proposedRate: 1800,
      estimatedDeliveryDays: 7,
      samplePortfolioUrls: [
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85'
      ],
      status: 'accepted',
      aiMatchScore: 96,
      aiMatchReason: '96% Match: Exceptional tool alignment (Midjourney v6.1 + Flux), proven track record in Advertising & Commercials, highly competitive proposed rate ($1,800 within $1,200-$2,500 budget), and 4.95 rating across 34 projects.'
    });

    // Marcus applied for Brief 1
    await Application.create({
      brief: brief1._id,
      creator: creatorMarcusUser._id,
      pitch: 'As a motion director specializing in Runway Gen-3 and Kling, I can handle the 15-second teaser scene with fluid 60fps camera choreography and cinematic sound design.',
      proposedRate: 2100,
      estimatedDeliveryDays: 8,
      samplePortfolioUrls: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85'
      ],
      status: 'rejected',
      aiMatchScore: 91,
      aiMatchReason: '91% Match: Outstanding video motion capability with Runway Gen-3, high reputation (4.9 rating), though rate is on the upper end of project budget.'
    });

    // Elena applied for Brief 2 (Pending)
    await Application.create({
      brief: brief2._id,
      creator: creatorElenaUser._id,
      pitch: 'Skincare packshots and macro droplet refraction are my core specialty. I use custom Flux LoRA lighting models to ensure crystal-clear glass reflections and authentic botanical gold shimmer.',
      proposedRate: 1200,
      estimatedDeliveryDays: 5,
      samplePortfolioUrls: [
        'https://images.unsplash.com/photo-1608248597359-005118c7c251?auto=format&fit=crop&w=1200&q=85'
      ],
      status: 'pending',
      aiMatchScore: 97,
      aiMatchReason: '97% Match: Exact tool match (Midjourney, Flux, Magnific), deep portfolio expertise in skincare product packshots, ideal budget alignment ($1,200), and immediate availability.'
    });

    // Sofia applied for Brief 2 (Pending)
    await Application.create({
      brief: brief2._id,
      creator: creatorSofiaUser._id,
      pitch: 'I have designed luxury campaigns for European cosmetics houses with exquisite Parisian lighting and rich gold textures. Ready to deliver within 4 days.',
      proposedRate: 1100,
      estimatedDeliveryDays: 4,
      samplePortfolioUrls: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85'
      ],
      status: 'pending',
      aiMatchScore: 92,
      aiMatchReason: '92% Match: Strong aesthetic synergy with luxury brand guidelines, great budget compatibility ($1,100), verified 4.92 rating.'
    });

    console.log('[Seed] Applications inserted. Creating active projects...');

    // 6. Projects (Demonstrating project stages: In Progress, Submitted, Revision Requested, Completed)
    // Project 1: Linked to Brief 1 (Stage: 'Submitted' with deliverables)
    const project1 = await Project.create({
      brief: brief1._id,
      brand: brandApexUser._id,
      creator: creatorElenaUser._id,
      application: appElenaBrief1._id,
      title: 'Next-Gen Cyberpunk Game Cinematic Teaser & Key Art',
      budget: 1800,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      stage: 'Submitted',
      deliverables: [
        {
          title: 'Neo-Babylon Hero Key Art (Render 1 of 4)',
          url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=85',
          notes: 'Master render completed in 4K resolution. Enhanced with Magnific AI for micro mechanical details on the central cyber warrior.',
          promptUsed: 'Hyper-detailed cinematic key art of cybernetic female mercenary on neon drenched rain rooftop overlooking Neo-Babylon megacity, volumetric orange fog, cyan rim light --ar 16:9 --v 6.1',
          aiToolsUsed: ['Midjourney v6.1', 'Magnific AI', 'Photoshop'],
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Neo-Babylon Street Alley Scene (Render 2 of 4)',
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85',
          notes: 'Street-level perspective showing cybernetic market stalls and holographic signs.',
          promptUsed: 'Crowded cyberpunk bazaar at night, neon noodle stalls, floating holographic advertisements, wet pavement reflections --ar 16:9',
          aiToolsUsed: ['Flux Dev', 'Photoshop GenFill'],
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      revisions: [
        {
          feedback: 'The hero render looks breathtaking! On Render 2, could we slightly soften the background neon saturation so the central figure stands out even more?',
          requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    });

    // Project 2: Marcus with Apex (Stage: 'Completed' with review)
    await Project.create({
      brief: brief3._id,
      brand: brandApexUser._id,
      creator: creatorMarcusUser._id,
      title: 'Sci-Fi Orbital Flight Commercial Short',
      budget: 1500,
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      stage: 'Completed',
      deliverables: [
        {
          title: 'Final 60fps Master Render with Audio Mix',
          url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
          notes: 'Rendered at 60fps with Runway Gen-3 and synced with synthesized atmospheric SFX from ElevenLabs.',
          aiToolsUsed: ['Runway Gen-3', 'ElevenLabs', 'After Effects'],
          submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      ],
      revisions: [],
      review: {
        rating: 5,
        comment: 'Marcus delivered spectacular motion fidelity! The camera movement in Runway Gen-3 felt completely organic and the turnaround was lightning fast. Highly recommended!',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    });

    console.log('[Seed] Projects created. Inserting sample chat messages...');

    // 7. Messages
    await Message.create([
      {
        sender: brandApexUser._id,
        receiver: creatorElenaUser._id,
        project: project1._id,
        brief: brief1._id,
        content: 'Hi Elena! Welcome to the Neo-Babylon project. We reviewed your initial portfolio pieces and were blown away by the lighting precision.',
        read: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        sender: creatorElenaUser._id,
        receiver: brandApexUser._id,
        project: project1._id,
        brief: brief1._id,
        content: 'Thank you! Excited to collaborate. I have already loaded our custom LoRA models and started the first batch of 4K scene passes.',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        sender: creatorElenaUser._id,
        receiver: brandApexUser._id,
        project: project1._id,
        brief: brief1._id,
        content: 'I have uploaded the first 2 master deliverables to the project workspace. Please take a look and let me know your thoughts on the lighting!',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        sender: brandApexUser._id,
        receiver: creatorElenaUser._id,
        project: project1._id,
        brief: brief1._id,
        content: 'The hero key art is stunning! We left one small revision request on Render 2 to slightly tone down the background neon saturation. Other than that, spot on!',
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('[Seed] Database seeding completed successfully!');
    console.log('[Seed] Demo accounts available:');
    console.log('   Brand: brand@apex.com / password123');
    console.log('   Brand: brand@lumina.com / password123');
    console.log('   Creator: creator@elena.com / password123');
    console.log('   Creator: creator@marcus.com / password123');
    console.log('   Creator: creator@aria.com / password123');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
