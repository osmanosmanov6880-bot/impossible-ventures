/**
 * First-party microstory player.
 *
 * These are authored interactive example story branches, not "personalized"
 * psychological profiles or measured audience response. Participant choices
 * remain in browser memory. Never sent to the launch API.
 */
const L=(ru,en,zh)=>({ru,en,zh});
const o=(id,label,after)=>({id,label,after});
const scene=(id,title,prompt,options)=>({id,title,prompt,options});
export const LANGUAGE=['ru','en','zh'];
export const local=(content,locale='ru')=>content?.[locale]||content?.ru||'';
export const STORY={
 'dead-drop':{
  symbol:'◇',label:'DEAD DROP / INTERACTIVE MISSION',
  intro:L('Два агента. Одна честная рекламная история.','Two agents. One truthful campaign story.','两名特工，一个真实的品牌故事。'),
  scenes:[
   scene('brief',L('01 / СЕКРЕТНЫЙ БРИФ','01 / SECRET BRIEF','01 / 秘密简报'),
     L('Какое доказательство станет основой миссии?','What should the agents verify first?','特工应该先核实什么？'),
     [
      o('source',L('Подтверждённый источник','A verifiable source','可验证的来源'),L('Агент фиксирует, где можно проверить утверждение.','The agent records where the claim can be checked.','特工记录核实主张的来源。')),
      o('limits',L('Ограничения продукта','Product limitations','产品局限'),L('Агент открыто показывает, где обещание не работает.','The agent openly shows where the promise does not apply.','特工公开承诺不适用的条件。'))
     ]),
   scene('signal',L('02 / ЗАШИФРОВАННЫЙ СИГНАЛ','02 / THE CODED SIGNAL','02 / 加密信号'),
     L('Агент обнаружил спорную фразу. Что делать?','The agent spots a questionable claim. What next?','特工发现可疑主张，下一步怎么办？'),
     [
      o('edit',L('Переписать честнее','Rewrite for accuracy','修改为准确表述'),L('Фраза становится осторожнее и понятнее.','The claim becomes more accurate and clear.','主张变得更准确易懂。')),
      o('test',L('Потребовать проверку','Request validation','要求验证'),L('Команда откладывает публикацию, пока нет источника.','The team delays launch pending evidence.','团队在获得证据前暂缓发布。'))
     ]),
   scene('decision',L('03 / РАЗВЯЗКА','03 / THE VERDICT','03 / 任务结论'),
     L('Как завершить миссию, не давя на человека?','How should the mission invite the next step?','如何在不施压的情况下结束任务？'),
     [
      o('learn',L('Познакомиться с методикой','Learn the method','了解方法'),L('Зритель может спокойно изучить предложение.','The viewer can explore the offer at their own pace.','观众可自行了解服务。')),
      o('pilot',L('Обсудить добровольный пилот','Discuss a voluntary pilot','讨论自愿试点'),L('Дальнейшее общение требует нового отдельного согласия.','Further contact requires separate consent.','进一步联系需要单独同意。'))
     ])
  ]
 },
 'appeal-2049':{
  symbol:'⚖',label:'APPEAL 2049 / THE CREATIVE TRIBUNAL',
  intro:L('Суд будущего проверяет силу рекламного обещания.','A future tribunal questions advertising claims.','未来法庭审查广告承诺。'),
  scenes:[
   scene('charge',L('01 / ОБВИНЕНИЕ','01 / THE CHARGE','01 / 指控'),
     L('Обещание звучит слишком уверенно. Что вы потребуете?','The promise sounds too strong. What do you ask for?','承诺过于肯定，您要求什么？'),
     [
      o('facts',L('Факты и источники','Facts and sources','事实和来源'),L('Суд не считает мнение доказательством.','The tribunal distinguishes opinion from proof.','法庭区分观点和证据。')),
      o('scope',L('Условия и исключения','Conditions and exceptions','条件和例外'),L('Границы обещания становятся частью дела.','The boundaries of the claim are now on record.','承诺的适用边界已被记录。'))
     ]),
   scene('witness',L('02 / СВИДЕТЕЛЬ','02 / THE WITNESS','02 / 证人'),
     L('Что даст зрителю право не соглашаться?','What lets the viewer challenge the case?','什么能让观众质疑案件？'),
     [
      o('compare',L('Проверяемое сравнение','A fair comparison','公平比较'),L('Сравнение должно быть воспроизводимым.','A comparison needs repeatable conditions.','比较需有可重复的条件。')),
      o('counter',L('Честное возражение','An honest objection','真实反对意见'),L('Суд слушает не только сторону бренда.','The court hears more than the sponsor.','法庭不仅听取品牌方意见。'))
     ]),
   scene('sentence',L('03 / РЕШЕНИЕ','03 / THE DECISION','03 / 判决'),
     L('Каким должен быть финал слушания?','What makes a fair final decision?','什么才是公正的最终决定？'),
     [
      o('verify',L('Отправить на дополнительную проверку','Request more evidence','要求更多证据'),L('Публикация может подождать ради точности.','Accuracy matters more than rushing a release.','准确性优先于仓促发布。')),
      o('review',L('Предложить зрителю оценить самому','Invite independent review','邀请观众独立判断'),L('Зритель сохраняет право сказать «нет».','The viewer remains free to decline.','观众保有拒绝的权利。'))
     ])
  ]
 },
 'anti-persona':{
  symbol:'⊘',label:'ANTIPERSONA / COUNTER-AUDIENCE',
  intro:L('Переверните привычный портрет покупателя.','Challenge the assumed buyer persona.','挑战传统买家画像。'),
  scenes:[
   scene('outsider',L('01 / ЧЕЛОВЕК ВНЕ СЕГМЕНТА','01 / THE OUTSIDER','01 / 目标人群之外'),
     L('Что бренды обычно не замечают?','What do brands often overlook?','品牌通常忽视什么？'),
     [
      o('skeptic',L('Честный скептицизм','Reasonable skepticism','合理怀疑'),L('Не каждый человек доверяет красивой упаковке.','Polished copy does not earn automatic trust.','精美文案不会自动赢得信任。')),
      o('context',L('Особый жизненный контекст','Different life circumstances','不同生活环境'),L('Контекст важнее рекламного стереотипа.','Real context matters more than stereotypes.','真实情境比刻板印象更重要。'))
     ]),
   scene('respect',L('02 / УВАЖЕНИЕ К ВЫБОРУ','02 / RESPECT CHOICE','02 / 尊重选择'),
     L('Как говорить с человеком без навязывания?','How can you communicate without pressure?','如何在不施压的情况下沟通？'),
     [
      o('limit',L('Чётко назвать ограничения','State limits clearly','明确说明限制'),L('Понимание начинается с честных границ.','Understanding starts with honest boundaries.','理解始于坦诚的界限。')),
      o('example',L('Показать конкретный пример','Show a useful example','展示有用实例'),L('Пример можно проверить и сравнить.','The example can be checked and compared.','实例可核实并比较。'))
     ]),
   scene('closing',L('03 / НОВАЯ ИСТОРИЯ','03 / A NEW STORY','03 / 新故事'),
     L('Каким будет уместное приглашение?','What is an appropriate next step?','什么是合适的下一步？'),
     [
      o('discover',L('«Посмотрите, подходим ли мы»','"See whether this fits"','“看看是否适合您”'),L('Человек принимает решение самостоятельно.','The person decides independently.','用户自行决定。')),
      o('decline',L('«Можно просто отказаться»','"You can always decline"','“您可以随时拒绝”'),L('Свобода отказа остаётся в центре опыта.','The freedom to decline remains central.','拒绝的自由始终重要。'))
     ])
  ]
 },
 'brief-theatre':{
  symbol:'◇',label:'BRIEF THEATRE / STAGE PERFORMANCE',
  intro:L('Одно предложение. Три акта. Зритель решает, куда повернёт сцена.','One product. Three acts. The audience directs the scene.','一个产品，三幕剧情，由观众作出选择。'),
  scenes:[
   scene('curtain',L('АКТ I / ЗАНАВЕС','ACT I / CURTAIN','第一幕 / 帷幕'),
     L('Как начинается история продукта?','How does the product story open?','产品故事如何开场？'),
     [
      o('real',L('Знакомая проблема','A recognizable problem','熟悉的问题'),L('В центре — реальная потребность героя.','A genuine need drives the scene.','真实需求推动剧情。')),
      o('mystery',L('Интригующий вопрос','An intriguing question','引人好奇的问题'),L('История начинается с любопытства, не с угрозы.','Curiosity opens the story, not a threat.','好奇而非威胁开启故事。'))
     ]),
   scene('plot',L('АКТ II / ПОВОРОТ','ACT II / THE TURN','第二幕 / 转折'),
     L('Герой сомневается. Как изменить сцену?','The protagonist has doubts. What changes?','主角产生怀疑，剧情如何转变？'),
     [
      o('dialogue',L('Честный диалог','An honest dialogue','坦诚对话'),L('Разговор показывает больше одной стороны.','Dialogue shows more than one perspective.','对话展示不同观点。')),
      o('demonstrate',L('Конкретная демонстрация','A concrete demonstration','具体演示'),L('Зритель видит действие, а не лозунг.','The audience sees an action, not a slogan.','观众看到行动，而非口号。'))
     ]),
   scene('finale',L('АКТ III / ФИНАЛ','ACT III / FINALE','第三幕 / 终幕'),
     L('Как зритель выйдет из этой истории?','How should the audience leave the story?','观众如何结束体验？'),
     [
      o('open',L('Открытый финал','An open ending','开放式结尾'),L('История оставляет пространство для размышления.','The story leaves room for thought.','故事留下思考空间。')),
      o('pilot',L('Спокойное предложение пилота','A calm pilot invitation','温和的试点邀请'),L('Контакт возможен только по желанию зрителя.','Further contact is strictly optional.','进一步联系完全自愿。'))
     ])
  ]
 },
 'ad-biome':{
  symbol:'✳',label:'AD BIOME / CREATIVE EVOLUTION',
  intro:L('Выберите путь рекламной гипотезы — без выдуманных кликов.','Choose how a creative hypothesis evolves—without fake clicks.','选择创意假设的进化路径，不虚构点击量。'),
  scenes:[
   scene('seed',L('01 / СЕМЯ ИДЕИ','01 / THE SEED','01 / 创意种子'),
     L('Какое свойство идеи нужно изменить?','Which creative property should evolve?','创意的哪一部分需要改变？'),
     [
      o('clarity',L('Сделать сообщение яснее','Increase clarity','提高清晰度'),L('Каждый должен понимать, что предлагается.','The offer should be clear to a new visitor.','新访客应能理解服务内容。')),
      o('novelty',L('Изменить метафору','Change the metaphor','改变比喻'),L('Метафора выделяет идею, но не подтверждает факты.','Metaphors inspire; they do not prove claims.','比喻提供灵感，但不能证明事实。'))
     ]),
   scene('grow',L('02 / РОСТ','02 / GROWTH','02 / 生长'),
     L('Как избежать неподтверждённых преимуществ?','How do you avoid unsupported advantages?','如何避免未经证实的优势？'),
     [
      o('demo',L('Показать реальный процесс','Show a real workflow','展示真实流程'),L('Демонстрацию можно повторить.','A workflow can be reproduced and checked.','流程可重复并核实。')),
      o('scope',L('Сузить обещание','Narrow the claim','缩小承诺范围'),L('Ограниченное обещание честнее абсолюта.','A scoped claim can be more defensible.','限定范围的承诺更可信。'))
     ]),
   scene('test',L('03 / ПРОВЕРКА','03 / THE TEST','03 / 测试'),
     L('Как оценить идею после истории?','How should a real test follow this story?','体验结束后应如何评估？'),
     [
      o('interview',L('Добровольное интервью','Voluntary interviews','自愿访谈'),L('Начните с понимания, а не фальшивой статистики.','Seek comprehension, not invented analytics.','先追求理解，而非虚假统计。')),
      o('ab',L('Контрольный A/B-тест','A controlled A/B test','有对照的 A/B 测试'),L('Для вывода нужны реальные данные и адекватная выборка.','Any conclusion requires real data and adequate sample size.','结论需要真实数据和足够样本。'))
     ])
  ]
 },
 'museum-of-attention':{
  symbol:'✧',label:'MUSEUM OF ATTENTION / INTERACTIVE EXHIBIT',
  intro:L('Три зала о том, как говорить с людьми уважительно.','Three galleries about respectful attention.','三个展厅探讨如何尊重注意力。'),
  scenes:[
   scene('door',L('ЗАЛ I / ВХОД','ROOM I / ENTRANCE','展厅一 / 入口'),
     L('Как посетитель откроет первый экспонат?','How should the visitor enter the exhibit?','观众如何进入首个展品？'),
     [
      o('quiet',L('Без мигающих отвлечений','Without flashing distractions','避免闪烁干扰'),L('Посетитель сохраняет контроль над вниманием.','The visitor controls their attention.','观众控制自己的注意力。')),
      o('curiosity',L('Необязательный вопрос','An optional question','可选择的问题'),L('Любопытство не превращается в обязанность.','Curiosity never becomes an obligation.','好奇心不成为义务。'))
     ]),
   scene('exhibit',L('ЗАЛ II / ЭКСПОНАТ','ROOM II / THE EXHIBIT','展厅二 / 展品'),
     L('Что экспонат показывает о рекламном сообщении?','What does the exhibit reveal about a claim?','展品揭示广告主张的什么内容？'),
     [
      o('two',L('Две точки зрения','Two viewpoints','两种视角'),L('Сравнение должно сохранять контекст.','Comparisons should preserve context.','比较应保留上下文。')),
      o('facts',L('Источник факта','The evidence source','事实来源'),L('Зритель знает, где искать проверку.','The viewer can find a verification source.','观众知道如何核实。'))
     ]),
   scene('exit',L('ЗАЛ III / СВОБОДНЫЙ ВЫХОД','ROOM III / FREE EXIT','展厅三 / 自由退出'),
     L('Как человек сможет уйти без лишнего трекинга?','How can someone leave without being tracked?','如何在不被追踪的情况下离开？'),
     [
      o('leave',L('Уйти без формы','Leave without a form','无需表单即可离开'),L('Отказ от контакта не мешает пройти историю.','Refusing contact does not block the experience.','拒绝联系不影响体验。')),
      o('optional',L('Добровольный следующий шаг','An optional next step','自愿的下一步'),L('Дальнейшее участие — осознанное решение.','Continued participation is a clear choice.','继续参与是明确选择。'))
     ])
  ]
 },
 'attention-republic':{
  symbol:'◎',label:'ATTENTION REPUBLIC / THE COUNCIL',
  intro:L('Совет вымышленной республики выбирает правила справедливой рекламы.','A fictional council chooses fair advertising rules.','虚构的议会制定公平广告规则。'),
  scenes:[
   scene('charter',L('СОВЕТ I / ХАРТИЯ','COUNCIL I / CHARTER','议会一 / 宪章'),
     L('Что важнее всего для честного сообщества?','What matters most in a fair creative community?','对公平创意社区最重要的是什么？'),
     [
      o('freedom',L('Право отказаться','The right to opt out','拒绝的权利'),L('Отказ не уменьшает права человека.','Declining has no penalty.','拒绝不会受到惩罚。')),
      o('transparency',L('Прозрачность правил','Transparent rules','透明规则'),L('Условия понятны до участия.','Rules are clear before participating.','参与前规则清晰。'))
     ]),
   scene('sponsor',L('СОВЕТ II / СПОНСОР','COUNCIL II / THE SPONSOR','议会二 / 赞助商'),
     L('Как бренд может участвовать честно?','How can the sponsor participate responsibly?','赞助商如何负责地参与？'),
     [
      o('label',L('Ясно маркировать рекламу','Clearly label sponsorship','明确标示赞助'),L('Посетитель видит коммерческую природу истории.','The commercial nature of the story is visible.','故事的商业性质清晰可见。')),
      o('limits',L('Сохранить независимость сюжета','Preserve editorial independence','保持内容独立'),L('История допускает неудобные вопросы.','The story can ask difficult questions.','故事可以提出尖锐问题。'))
     ]),
   scene('vote',L('СОВЕТ III / РЕШЕНИЕ','COUNCIL III / DECISION','议会三 / 决策'),
     L('Как завершить обсуждение без давления?','How should the council conclude fairly?','议会如何公平地结束讨论？'),
     [
      o('appeal',L('Возможность обжалования','Allow an appeal','允许申诉'),L('Новое доказательство может изменить решение.','New evidence may change the decision.','新证据可以改变决定。')),
      o('pause',L('Пауза для изучения','Pause to investigate','暂停以进行调查'),L('Иногда отказ от спешки — лучший выбор.','Sometimes not rushing is the wiser choice.','有时不急于决定是更明智的选择。'))
     ])
  ]
 }
};
export const IDS=Object.keys(STORY);
export function audit(){
  if(IDS.length!==7)throw Error('Expected seven first-party interactive ad worlds');
  for(const id of IDS){
    const story=STORY[id],seen=new Set();
    if(story.scenes.length!==3)throw Error('Incomplete story: '+id);
    const fields=[story.intro];
    for(const stage of story.scenes){
      if(seen.has(stage.id)||stage.options.length!==2)throw Error('Invalid story chapter: '+id);
      seen.add(stage.id);
      fields.push(stage.title,stage.prompt);
      for(const answer of stage.options)fields.push(answer.label,answer.after);
    }
    if(fields.some(field=>LANGUAGE.some(locale=>typeof field[locale]!=='string'||field[locale].length<8))){
      throw Error('Missing three-language story content: '+id);
    }
  }
  return {worlds:IDS.length,scenes:IDS.length*3,locales:LANGUAGE.length};
}
