async function test() {
  const briefsRes = await fetch('http://localhost:5000/api/briefs');
  const briefsData = await briefsRes.json();
  const brief = briefsData.briefs[0];
  console.log('Testing Brief:', brief.title);
  
  const recsRes = await fetch(`http://localhost:5000/api/match/recommendations/${brief._id}`);
  const recsData = await recsRes.json();
  
  console.log('AI Recommendations count:', recsData.count);
  recsData.recommendations.forEach(r => {
    console.log(`- ${r.creator.name}: ${r.aiMatchScore}% match`);
    console.log(`  Reason: ${r.aiMatchReason}`);
  });
}

test().catch(console.error);
