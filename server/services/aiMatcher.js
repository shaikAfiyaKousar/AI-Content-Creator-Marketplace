/**
 * Intelligent AI-Powered Creator Matching Service
 * Combines multi-factor weighted scoring and structured natural language rationales.
 */

function calculateToolOverlap(requiredTools = [], creatorTools = [], portfolioTools = []) {
  if (!requiredTools || requiredTools.length === 0) return { score: 100, matches: [], missing: [] };

  const allCreatorTools = Array.from(new Set([
    ...(creatorTools || []).map(t => t.toLowerCase().trim()),
    ...(portfolioTools || []).map(t => t.toLowerCase().trim())
  ]));

  const matches = [];
  const missing = [];

  requiredTools.forEach(req => {
    const cleanReq = req.toLowerCase().trim();
    const found = allCreatorTools.some(tool => tool.includes(cleanReq) || cleanReq.includes(tool));
    if (found) {
      matches.push(req);
    } else {
      missing.push(req);
    }
  });

  const ratio = matches.length / requiredTools.length;
  return {
    score: Math.round(ratio * 100),
    matches,
    missing
  };
}

function calculateCategoryFit(briefCategory = '', briefDesc = '', creatorCategories = [], creatorSkills = [], portfolioItems = []) {
  const normCategory = (briefCategory || '').toLowerCase();
  const descWords = (briefDesc || '').toLowerCase().split(/\W+/).filter(w => w.length > 3);

  let matchPoints = 0;
  let totalPoints = 3;

  // 1. Direct category match
  const catMatch = (creatorCategories || []).some(cat => 
    cat.toLowerCase().includes(normCategory) || normCategory.includes(cat.toLowerCase())
  );
  if (catMatch) matchPoints += 1.5;

  // 2. Portfolio items in this category
  const portMatch = (portfolioItems || []).some(p => 
    (p.category || '').toLowerCase().includes(normCategory)
  );
  if (portMatch) matchPoints += 1.0;

  // 3. Keyword / Skill relevance
  const skillMatches = (creatorSkills || []).some(skill => 
    normCategory.includes(skill.toLowerCase()) || descWords.some(w => skill.toLowerCase().includes(w))
  );
  if (skillMatches) matchPoints += 0.5;

  const score = Math.min(100, Math.round((matchPoints / totalPoints) * 100));
  return { score, categoryAligned: catMatch || portMatch };
}

function calculateBudgetFit(briefMin = 0, briefMax = 100000, creatorMin = 0, proposedRate = null) {
  // If an application has a specific proposedRate, evaluate that directly
  if (proposedRate !== null && proposedRate !== undefined) {
    if (proposedRate <= briefMax && proposedRate >= briefMin * 0.8) {
      return { score: 100, reason: `Proposed rate ($${proposedRate}) is within brief budget ($${briefMin} - $${briefMax})` };
    } else if (proposedRate < briefMin * 0.8) {
      return { score: 85, reason: `Proposed rate ($${proposedRate}) is lower than typical target budget` };
    } else {
      const overRatio = proposedRate / (briefMax || 1);
      const score = Math.max(30, Math.round(100 - (overRatio - 1) * 80));
      return { score, reason: `Proposed rate ($${proposedRate}) exceeds maximum budget ($${briefMax})` };
    }
  }

  // Otherwise evaluate creator's minimum project rate
  if (creatorMin <= briefMax) {
    return { score: 100, reason: `Creator minimum ($${creatorMin}) aligns with project budget ($${briefMin} - $${briefMax})` };
  } else {
    const diff = creatorMin - briefMax;
    const score = Math.max(20, Math.round(100 - (diff / briefMax) * 60));
    return { score, reason: `Creator baseline ($${creatorMin}) exceeds project budget cap ($${briefMax})` };
  }
}

function calculateAvailabilityScore(availability) {
  switch (availability) {
    case 'available':
      return { score: 100, label: 'Immediately Available' };
    case 'busy':
      return { score: 60, label: 'Limited Bandwidth' };
    case 'booked':
      return { score: 20, label: 'Currently Booked' };
    default:
      return { score: 80, label: 'Available' };
  }
}

function calculateReputationScore(rating = 5, completedProjects = 0, experienceYears = 1) {
  const ratingNorm = (Math.min(5, Math.max(1, rating)) / 5) * 60; // Up to 60 pts
  const projectNorm = Math.min(25, completedProjects * 1.5); // Up to 25 pts
  const expNorm = Math.min(15, experienceYears * 5); // Up to 15 pts
  return Math.round(ratingNorm + projectNorm + expNorm);
}

/**
 * Match a single creator against a creative brief
 */
function evaluateCreatorMatch(brief, creatorUser, creatorProfile, portfolioItems = [], proposedRate = null) {
  const portfolioTools = portfolioItems.flatMap(p => p.aiToolsUsed || []);

  const toolEval = calculateToolOverlap(
    brief.requiredAiTools || [],
    creatorProfile.aiTools || [],
    portfolioTools
  );

  const categoryEval = calculateCategoryFit(
    brief.category,
    brief.description,
    creatorProfile.categories,
    creatorProfile.skills,
    portfolioItems
  );

  const budgetEval = calculateBudgetFit(
    brief.budgetMin,
    brief.budgetMax,
    creatorProfile.pricing?.projectMin || 300,
    proposedRate
  );

  const availEval = calculateAvailabilityScore(creatorProfile.availability);
  const repEval = calculateReputationScore(
    creatorProfile.rating || 5,
    creatorProfile.completedProjects || 0,
    creatorProfile.experienceYears || 1
  );

  // Weights:
  // Tools: 35%
  // Category/Style: 25%
  // Budget: 20%
  // Experience/Rating: 10%
  // Availability: 10%
  const totalScore = Math.min(99, Math.max(45, Math.round(
    toolEval.score * 0.35 +
    categoryEval.score * 0.25 +
    budgetEval.score * 0.20 +
    repEval * 0.10 +
    availEval.score * 0.10
  )));

  // Generate natural language explanation
  const matchedToolsText = toolEval.matches.length > 0
    ? `Proficient in required tools (${toolEval.matches.join(', ')})`
    : 'Alternative AI toolset with adaptable capabilities';

  const catText = categoryEval.categoryAligned
    ? `Proven portfolio history in ${brief.category}`
    : `Experience across generative disciplines`;

  const ratingText = `${creatorProfile.rating || 5.0}★ rating over ${creatorProfile.completedProjects || 0} completed projects`;
  const availText = availEval.label;

  const explanation = `${totalScore}% Match: ${matchedToolsText}; ${catText}; ${budgetEval.reason}; ${ratingText}; ${availText}.`;

  return {
    score: totalScore,
    explanation,
    factors: {
      toolScore: toolEval.score,
      matchedTools: toolEval.matches,
      missingTools: toolEval.missing,
      categoryScore: categoryEval.score,
      budgetScore: budgetEval.score,
      budgetReason: budgetEval.reason,
      reputationScore: repEval,
      availabilityScore: availEval.score
    }
  };
}

module.exports = {
  calculateToolOverlap,
  calculateCategoryFit,
  calculateBudgetFit,
  evaluateCreatorMatch
};
