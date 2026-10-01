const LearningEngine = (() => {
  function shuffle(items, random = Math.random) {
    const out = [...items];
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
    return out;
  }
  function grade(question, selected) {
    const ids = new Set(question.choices.map(c=>c.id));
    if(!Array.isArray(selected) || !selected.length || new Set(selected).size!==selected.length || selected.some(id=>!ids.has(id))) throw new Error('回答を選んでください。');
    if(question.type==='single_choice' && selected.length!==1) throw new Error('回答を一つ選んでください。');
    const correct = selected.length===question.correctChoiceIds.length && question.correctChoiceIds.every(id=>selected.includes(id));
    return {correct,itemResults:question.choices.map(c=>({choiceId:c.id,selected:selected.includes(c.id),expected:question.correctChoiceIds.includes(c.id),matched:selected.includes(c.id)===question.correctChoiceIds.includes(c.id)}))};
  }
  function pick(lesson, confirmed, presented, random = Math.random) {
    return lesson.objectives.filter(o=>!confirmed[o.id]).map(o=>{
      const counts=o.questions.map(q=>presented.filter(id=>id===q.id).length);
      const min=Math.min(...counts);
      let pool=o.questions.filter((q,i)=>counts[i]===min);
      const last=[...presented].reverse().find(id=>o.questions.some(q=>q.id===id));
      const fresh=pool.filter(q=>q.id!==last);if(fresh.length)pool=fresh;
      const question=pool[Math.floor(random()*pool.length)];
      return {objectiveId:o.id,questionId:question.id,choiceOrder:shuffle(question.choices,random).map(c=>c.id),selected:[],hintUsed:false};
    });
  }
  return {shuffle,grade,pick};
})();
if(typeof module!=='undefined') module.exports=LearningEngine;
