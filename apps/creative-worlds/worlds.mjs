/**
 * FIVE-WAVE CREATIVE WORLDS — authored interactive experiences.
 * Content, scores and simulated consequences are illustrative.
 * No AI-generated claims, conversions, population statistics or network requests.
 */
export const L = (ru, en, zh) => Object.freeze({ ru, en, zh });
export const pick = (value, locale = 'ru') => value?.[locale] || value?.ru || '';
const choice = (id, label, consequence, delta, artifact) =>
  ({ id, label, consequence, delta, artifact });
const turn = (id, heading, question, choices, hint, requiredNote = false) =>
  ({ id, heading, question, choices, hint, requiredNote });

export const WORLDS = Object.freeze({
  'anti-persona': {
    id: 'anti-persona', number: '03', symbol: '⊘', accent: 'coral',
    name: 'AntiPersona', mode: 'COUNTER-AUDIENCE LAB',
    title: L('Реклама для человека, которого никто не ждал.',
      'Advertising for the person nobody expected.',
      '为意想不到的人创造广告。'),
    introduction: L('Откажитесь от удобного стереотипа. Четыре решения меняют реальный творческий бриф: для кого делаем предложение, что обещаем и какие доказательства понадобятся.',
      'Challenge your comfortable stereotype. Four decisions reshape a creative brief: audience, promise and supporting proof.',
      '挑战习以为常的受众刻板印象。四个选择将改变受众、承诺和所需证据。'),
    objective: L('Результат: анти-персона, альтернативный рекламный тезис и перечень фактов для проверки.',
      'Output: counter-persona, alternative pitch and an evidence-to-verify list.',
      '成果：反向用户画像、广告主张和待核实证据清单。'),
    dimensions: [
      { id: 'empathy', label: L('Понимание человека','Human empathy','用户理解') },
      { id: 'originality', label: L('Неочевидность','Originality','独创性') },
      { id: 'evidence', label: L('Проверяемость','Verifiability','可验证性') }
    ],
    seed: { empathy: 50, originality: 50, evidence: 50 },
    ending: L('Анти-персона сформирована. Проверьте новую аудиторию настоящими интервью, прежде чем запускать рекламу.',
      'Your counter-persona is ready. Validate the audience through real interviews before running ads.',
      '反向用户画像已生成。投放广告前，请通过真实访谈验证。'),
    turns: [
      turn('audience',
        L('01 / Взлом привычного портрета','01 / Break the persona','01 / 打破惯常画像'),
        L('Кого маркетологи обычно забывают, когда описывают аудиторию продукта?',
          'Which person is most likely to be ignored by the ordinary buyer persona?',
          '传统的消费者画像最可能忽略哪类人？'),
        [
          choice('skeptic',L('Скептик: не верит рекламным обещаниям','Skeptic: distrusts ad claims','怀疑者：不相信广告承诺'),
            L('Начинайте с вопросов и ограничений, а не с восторженных прилагательных.','Lead with questions and limits, not superlatives.','从疑问和限制入手，不使用夸张形容词。'),
            {empathy:12,originality:5,evidence:9},'counterPersona'),
          choice('expert',L('Эксперт: знает слишком много','Expert: knows too much','专家：知道得太多'),
            L('Предложение обязано выдержать подробную профессиональную проверку.','Your pitch must withstand expert scrutiny.','广告主张必须经得住专业质疑。'),
            {empathy:8,originality:7,evidence:12},'counterPersona'),
          choice('outsider',L('Непокупатель: не пользуется категорией','Outsider: avoids the category','圈外人：不使用该类产品'),
            L('Вместо убеждения исследуйте, почему продукт пока не нужен.','Investigate why the category is irrelevant before selling it.','先探究该品类为何不适用，再考虑销售。'),
            {empathy:13,originality:12,evidence:1},'counterPersona')
        ],L('Какие реальные интервью могли бы подтвердить выбор?','What interview would test that hypothesis?','什么访谈能检验这一假设？')),
      turn('friction',
        L('02 / Истинное сопротивление','02 / Discover resistance','02 / 找到真实阻力'),
        L('Почему этот человек может отвергнуть вашу рекламу?',
          'Why might this person reject your advertisement?',
          '为什么这个人可能拒绝广告？'),
        [
          choice('time',L('Не хочет терять время','Does not want to waste time','不想浪费时间'),
            L('Дайте короткий конкретный пример без лишней драмы.','Show one useful example without needless drama.','用一个简短具体的例子说明价值。'),
            {empathy:10,originality:1,evidence:7},'barrier'),
          choice('privacy',L('Опасается слежки и манипуляции','Fears tracking and manipulation','担心跟踪和操纵'),
            L('Сделайте контроль и добровольность частью самого опыта.','Make agency and consent part of the experience.','让用户自主决定和同意成为体验的一部分。'),
            {empathy:12,originality:5,evidence:9},'barrier'),
          choice('proof',L('Не видит подтверждений','Cannot find supporting evidence','缺乏可信证据'),
            L('Укажите, что именно проверяется, и не скрывайте неопределённость.','State what was tested and what remains unknown.','明确已测试和未知的内容。'),
            {empathy:6,originality:3,evidence:14},'barrier')
        ],L('Опишите одно возможное возражение своими словами.','Describe one realistic objection in your own words.','用自己的话描述一个反对意见。')),
      turn('message',
        L('03 / Переворот рекламного тезиса','03 / Turn the message inside out','03 / 反转广告主张'),
        L('Какой тип коммуникации уважит позицию анти-персоны?',
          'Which message would respect the counter-persona?',
          '哪种沟通方式更尊重反向用户画像？'),
        [
          choice('honest',L('«Мы не для всех. Вот кому подойдём»','"Not for everyone. Here is who benefits."','“并非适合所有人。这里说明适合谁。”'),
            L('Ограничение аудитории может повысить честность сообщения.','Narrowing the claim can improve its honesty.','收紧承诺范围有助于提高可信度。'),
            {empathy:8,originality:11,evidence:11},'pitch'),
          choice('question',L('«Проверьте нас сами»','"Test the claim yourself."','“请亲自验证。”'),
            L('Пригласите человека сравнить гипотезу с реальностью.','Invite the user to challenge the claim with evidence.','邀请用户用证据检验广告主张。'),
            {empathy:8,originality:7,evidence:13},'pitch'),
          choice('switch',L('«Вот когда лучше выбрать конкурента»','"When a competitor is a better fit."','“何时竞争对手更适合您。”'),
            L('Необычная прямота требует реальных сравнительных данных.','Radical candor demands verified comparisons.','极度坦诚也需要可靠的比较证据。'),
            {empathy:7,originality:15,evidence:-2},'pitch')
        ],L('Напишите собственный рекламный тезис (от 8 символов).','Write your own ad headline (8+ characters).','写出自己的广告主张（至少8个字符）。'),true),
      turn('validation',
        L('04 / Проверка перед запуском','04 / Reality check','04 / 投放前验证'),
        L('Каким безопасным тестом вы проверите концепцию, не выдавая вымысел за результат?',
          'How would you test the concept without pretending assumptions are results?',
          '如何在不把假设当作结果的情况下测试这个概念？'),
        [
          choice('interview',L('5–10 интервью без продажи','5–10 interviews without selling','5–10次非销售访谈'),
            L('Слушайте возражения, а не ищите только подтверждения.','Listen for objections, not just validation.','倾听反对意见，而非只寻找支持。'),
            {empathy:12,originality:3,evidence:8},'verification'),
          choice('prototype',L('Кликабельный прототип без трекинга','Untracked clickable prototype','无需跟踪的可点击原型'),
            L('Проверьте ясность и удобство, не собирая лишние данные.','Test comprehension without collecting unnecessary data.','测试理解程度，不收集多余数据。'),
            {empathy:8,originality:10,evidence:6},'verification'),
          choice('ab',L('Добровольный A/B-тест с контрольной группой','Opt-in A/B test with a control','带对照组的自愿A/B测试'),
            L('Отличайте фактические заявки от кликов и учитывайте размер выборки.','Separate actual leads from clicks and disclose sample size.','区分真实线索与点击，并公开样本量。'),
            {empathy:5,originality:4,evidence:15},'verification')
        ],L('Какой показатель позволит отменить гипотезу?','Which result would make you reject the hypothesis?','什么结果会让你否定该假设？'))
    ]
  },
  'brief-theatre': {
    id: 'brief-theatre',number:'04',symbol:'◇',accent:'gold',name:'Brief Theatre',mode:'CREATIVE SCRIPT STUDIO',
    title:L('Один продукт. Четыре акта. Никакой халтуры.',
      'One product. Four acts. No shortcuts.',
      '一个产品，四幕故事，拒绝敷衍。'),
    introduction:L('Выбирайте режиссёрские решения, пишите реплики и соберите законченную рекламную сцену. Ограничения делают сюжет интереснее, но не заменяют факты.',
      'Make directorial decisions, write dialogue and complete a four-act branded story. Constraints improve the drama but never replace evidence.',
      '选择导演方案、撰写台词并完成四幕品牌故事。戏剧限制不能替代事实。'),
    objective:L('Результат: оригинальный сценарий с четырьмя актами, авторскими репликами и этической проверкой.',
      'Output: four-act script with authored lines and a responsible advertising checklist.',
      '成果：包含四幕、原创台词和广告伦理清单的剧本。'),
    dimensions:[
      {id:'tension',label:L('Драматургия','Dramatic tension','戏剧张力')},
      {id:'clarity',label:L('Ясность','Clarity','清晰度')},
      {id:'proof',label:L('Опора на факты','Evidence fit','证据支撑')}
    ],
    seed:{tension:45,clarity:55,proof:50},
    ending:L('Сцена написана. Проверьте, что заявленные преимущества продукта подтверждаются независимо от драматургии.',
      'The script is ready. Verify that every product claim holds outside the fiction.',
      '剧本已完成，请核实所有产品主张在虚构故事之外仍然成立。'),
    turns:[
      turn('curtain',L('АКТ I / ЗАВЯЗКА','ACT I / THE HOOK','第一幕 / 开场'),
        L('Каким кадром вы откроете историю?','How does the opening shot begin?','您将如何开场？'),
        [
          choice('silence',L('Тишина до первого сигнала','Silence before the first signal','第一个信号前的寂静'),
            L('Тишина создаёт вопрос, но ответ должен прийти быстро.','Silence introduces a question; answer it quickly.','沉默制造悬念，但答案应及时出现。'),
            {tension:12,clarity:-3,proof:1},'opening'),
          choice('failure',L('Герой встречает реальную проблему','A real problem blocks the hero','主人公遇到真实难题'),
            L('Начните с узнаваемого ограничения без запугивания.','Start with a familiar, non-manipulative problem.','从真实且不过度恐吓的问题入手。'),
            {tension:8,clarity:9,proof:7},'opening'),
          choice('reveal',L('Сразу покажите результат','Open with the outcome','直接展示成果'),
            L('Результат задаёт темп. Не выдавайте монтаж за доказательство.','An outcome sets the pace; editing is not evidence.','结果带来节奏，但剪辑不是证据。'),
            {tension:3,clarity:13,proof:2},'opening')
        ],L('Напишите первую реплику героя (8+ символов).','Write the protagonist’s first line (8+ characters).','写下主角第一句台词（至少8字）。'),true),
      turn('conflict',L('АКТ II / ПРЕПЯТСТВИЕ','ACT II / THE OBSTACLE','第二幕 / 冲突'),
        L('Какая творческая помеха перевернёт сцену?','What constraint changes the scene?','哪个限制将改变剧情？'),
        [
          choice('no-product',L('Продукт нельзя показывать до финала','Product cannot appear until the end','直到结局都不能展示产品'),
            L('Действие должно объяснять ценность, а не просто прятать бренд.','The story must demonstrate value, not merely hide branding.','故事必须表现价值，而不只是隐藏品牌。'),
            {tension:15,clarity:-7,proof:0},'obstacle'),
          choice('two-voices',L('Два персонажа не согласны','Two characters disagree','两个人物意见相左'),
            L('Спор выявляет недостатки и делает историю честнее.','Disagreement reveals limitations and improves honesty.','争论揭示不足，使故事更真实。'),
            {tension:9,clarity:5,proof:8},'obstacle'),
          choice('no-claims',L('Запрещены превосходные степени','Superlatives are forbidden','禁止使用最高级形容词'),
            L('Проверяемые детали часто сильнее слова «лучший».','Specific evidence can beat the word “best.”','具体证据往往胜过“最好”一词。'),
            {tension:4,clarity:11,proof:10},'obstacle')
        ],L('Как герой реагирует? Запишите одну реплику.','Write one line showing how the protagonist reacts.','写出主角对此的反应台词。'),true),
      turn('proof',L('АКТ III / ПОВОРОТ','ACT III / THE REVEAL','第三幕 / 转折'),
        L('Что зритель увидит вместо голословного обещания?','What does the audience see instead of a vague claim?','观众将看到什么，而不是空泛承诺？'),
        [
          choice('hands-on',L('Крупный план реального действия','Close-up of a real product action','特写真实产品操作'),
            L('Покажите функциональность и границы применения.','Show what actually happens and under what conditions.','展示实际功能及适用条件。'),
            {tension:4,clarity:10,proof:14},'evidenceScene'),
          choice('honest',L('Герой признаёт ограничение','The hero admits a limitation','主角承认产品局限'),
            L('Сильная история не обязана притворяться совершенством.','A good story does not require perfection.','好故事不需要假装完美。'),
            {tension:8,clarity:8,proof:13},'evidenceScene'),
          choice('compare',L('Сравнение двух способов решения','Compare two ways of solving it','比较两种解决方式'),
            L('Сравнение потребует воспроизводимой методики до публикации.','Any comparison requires a reproducible method before release.','发布前必须有可重复的比较方法。'),
            {tension:10,clarity:9,proof:-2},'evidenceScene')
        ],L('Опишите конкретную демонстрацию (8+ символов).','Describe one concrete product demonstration (8+ characters).','描述一个具体的产品演示（至少8字）。'),true),
      turn('resolution',L('АКТ IV / ФИНАЛ','ACT IV / THE RESOLUTION','第四幕 / 结尾'),
        L('Чем закончится история и что зритель сможет сделать добровольно?','How will the story end with a voluntary next step?','故事将如何以自愿行动结束？'),
        [
          choice('trial',L('Спокойное приглашение попробовать','A calm invitation to try','温和邀请亲自体验'),
            L('CTA предлагает выбор, а не давление.','The CTA invites choice rather than pressure.','行动号召提供选择，而非施加压力。'),
            {tension:2,clarity:12,proof:7},'ending'),
          choice('question',L('Оставьте открытый вопрос','End with a thoughtful question','以发人深省的问题结尾'),
            L('Открытый вопрос усилит память о сюжете, но не измеряет продажи.','A question may improve recall, not prove conversion.','问题或可增强记忆，但不能证明转化。'),
            {tension:10,clarity:1,proof:5},'ending'),
          choice('decision',L('Герой выбирает ответственный путь','The hero chooses responsibly','主角做出负责任的选择'),
            L('Покажите последствия выбора без ложной срочности.','Show consequences without artificial urgency.','展示选择的后果，不制造虚假紧迫感。'),
            {tension:8,clarity:8,proof:9},'ending')
        ],L('Запишите финальную реплику и честный CTA.','Write a closing line and an honest CTA.','写出结尾台词和真实的行动号召。'),true)
    ]
  },
  'ad-biome': {
    id:'ad-biome',number:'05',symbol:'✳',accent:'mint',name:'AdBiome',mode:'EVOLUTIONARY CREATIVE LAB',
    title:L('Эволюционируйте идеи. Не выдумывайте конверсии.',
      'Evolve ideas. Never invent conversions.',
      '让创意进化，不伪造转化数据。'),
    introduction:L('Четыре поколения рекламной идеи: внимание, ценность, доказательство и действие. Каждая мутация меняет стратегические параметры, но оценки — только проектная эвристика, не результаты настоящей рекламы.',
      'Four generations of a creative: attention, value, proof and action. Mutations change heuristic scores, not actual ad performance.',
      '广告创意历经四代演化：注意、价值、证据与行动。这里的评分仅是设计启发，不是真实广告表现。'),
    objective:L('Результат: цепочка мутаций креатива, контрольная версия и воспроизводимый A/B-план.',
      'Output: creative mutation trail, proposed control and reproducible A/B plan.',
      '成果：创意变异记录、对照版本和可重复的A/B测试计划。'),
    dimensions:[
      {id:'clarity',label:L('Ясность тезиса','Message clarity','信息清晰度')},
      {id:'novelty',label:L('Необычность','Novelty','新颖性')},
      {id:'proof',label:L('Доказательность','Evidence discipline','证据严谨性')}
    ],
    seed:{clarity:50,novelty:45,proof:50},
    ending:L('Эволюционный план готов. Баллы — это эвристика, а не CTR; проверка требует реального эксперимента и согласия участников.',
      'Evolution plan ready. Scores are heuristics, not CTR; use a real consented experiment to validate.',
      '进化方案已完成。评分是启发式指标，不是点击率；验证需真实且自愿的实验。'),
    turns:[
      turn('hook',L('ПОКОЛЕНИЕ 01 / ХУК','GENERATION 01 / HOOK','第一代 / 吸引点'),
        L('Как вы измените первые три секунды сообщения?','How will you mutate the first three seconds?','如何改变开头三秒？'),
        [
          choice('contrast',L('Показать контраст «до/после»','Show a before/after contrast','呈现前后对比'),
            L('Не используйте неподтверждённые сравнения результатов.','Do not make unsupported performance comparisons.','避免未经证实的效果对比。'),
            {clarity:8,novelty:9,proof:-4},'hookMutation'),
          choice('problem',L('Назвать конкретную проблему','Name one specific problem','说出一个具体问题'),
            L('Согласуйте проблему с реальным исследованием аудитории.','Ground the problem in actual audience research.','以真实受众研究为依据。'),
            {clarity:13,novelty:2,proof:7},'hookMutation'),
          choice('question',L('Начать с нестандартного вопроса','Open with an unusual question','以新奇问题开场'),
            L('Вопрос — гипотеза о внимании, не доказанный выигрыш.','A question is a hypothesis about attention, not measured lift.','问题只是假设，并非已测得的提升。'),
            {clarity:1,novelty:14,proof:3},'hookMutation')
        ],L('Вариант первой фразы.','Your candidate opening line.','候选开场语。')),
      turn('value',L('ПОКОЛЕНИЕ 02 / ЦЕННОСТЬ','GENERATION 02 / VALUE','第二代 / 价值'),
        L('Как сформулировать ценность без недоказуемого обещания?','How do you describe value without an unprovable promise?','如何在不夸大承诺的情况下表述价值？'),
        [
          choice('specific',L('Конкретный сценарий применения','Specific use case','具体使用场景'),
            L('Понятный сценарий делает сравнение честнее.','A clear use case enables fairer comparison.','清晰场景有助于公平比较。'),
            {clarity:13,novelty:5,proof:7},'valueMutation'),
          choice('surprise',L('Неожиданная аналогия','Unexpected analogy','意想不到的比喻'),
            L('Метафора должна оставаться отличимой от свойства продукта.','Keep metaphors distinct from product capabilities.','将比喻与真实功能区分开。'),
            {clarity:-4,novelty:15,proof:1},'valueMutation'),
          choice('limits',L('Честно указать, кому не подходит','Explain who should not use it','诚实说明不适用人群'),
            L('Честные ограничения могут повысить доверие.','Clearly stated limits may support trust.','明确限制可能增强信任。'),
            {clarity:8,novelty:10,proof:12},'valueMutation')
        ],L('Какой тезис вы хотите сравнить?','Which value claim would you test?','您想测试哪条价值主张？')),
      turn('proof',L('ПОКОЛЕНИЕ 03 / ДОКАЗАТЕЛЬСТВО','GENERATION 03 / PROOF','第三代 / 证据'),
        L('Что можно показать без смоделированных показателей?',
          'What proof can be shown without fabricated statistics?',
          '哪些证据可以展示而不伪造数字？'),
        [
          choice('demo',L('Демонстрация реального процесса','Demonstrate an actual workflow','展示真实操作流程'),
            L('Сохраните условия, при которых демонстрация повторима.','Document when the demonstration is reproducible.','记录可重复演示的条件。'),
            {clarity:9,novelty:3,proof:15},'proofMutation'),
          choice('limitations',L('Чек-лист ограничений и условий','Publish constraints and conditions','公开限制和条件'),
            L('Открытые ограничения снижают риск вводящей в заблуждение рекламы.','Transparent limits help avoid misleading claims.','公开限制有助于防止误导。'),
            {clarity:7,novelty:4,proof:15},'proofMutation'),
          choice('testimonial',L('Цитата клиента после подтверждения','Verified customer quote, if available','在核实后使用客户评价'),
            L('Без согласия и проверки клиента цитату публиковать нельзя.','Do not publish testimonials without consent and verification.','未获同意并核实前不得发布评价。'),
            {clarity:5,novelty:6,proof:-5},'proofMutation')
        ],L('Укажите, где взять проверяемое доказательство.','Where could verifiable proof come from?','从哪里获取可验证的证据？')),
      turn('experiment',L('ПОКОЛЕНИЕ 04 / ЭКСПЕРИМЕНТ','GENERATION 04 / EXPERIMENT','第四代 / 实验'),
        L('Как честно проверить ваш эволюционировавший креатив?','How will you evaluate your evolved creative?','如何诚实地评估变异后的广告？'),
        [
          choice('ab',L('A/B: одинаковая аудитория и одно различие','A/B: same audience, one difference','A/B：同受众、单一变量'),
            L('Заранее зафиксируйте первичную метрику и длительность теста.','Pre-register a primary metric and experiment duration.','提前确定主要指标和测试时长。'),
            {clarity:10,novelty:3,proof:15},'testDesign'),
          choice('usability',L('Качественный тест понятности','Qualitative comprehension test','定性理解测试'),
            L('Важна понятность, а не имитация статистической значимости.','Measure comprehension, not fake statistical certainty.','重在理解，不伪造统计显著性。'),
            {clarity:12,novelty:2,proof:8},'testDesign'),
          choice('interview',L('Интервью с отказавшимися участниками','Interviews with uninterested people','访谈不感兴趣的参与者'),
            L('Собирайте причины отказа с согласия людей.','Ask why people decline, with consent.','征得同意后了解拒绝原因。'),
            {clarity:5,novelty:6,proof:8},'testDesign')
        ],L('Запишите метрику и условие остановки теста.','Write the key metric and stopping rule.','写下关键指标和停止规则。'))
    ]
  },
  'museum-of-attention': {
    id:'museum-of-attention',number:'06',symbol:'✧',accent:'pink',name:'Museum of Attention',mode:'INTERACTIVE EXHIBITION',
    title:L('Музей внимания: четыре зала без манипуляции.',
      'Museum of Attention: four rooms beyond manipulation.',
      '注意力博物馆：四个不操纵人的展厅。'),
    introduction:L('Пройдите четыре интерактивных экспоната. Вы выбираете, что показать, что оставить за кадром и где проходит граница уважительной коммуникации.',
      'Walk four interactive exhibits. Decide what to show, what to omit and how to respect your audience.',
      '参观四个互动展品，决定展示什么、略去什么以及如何尊重观众。'),
    objective:L('Результат: карта экспозиции, принципы этичного привлечения внимания и проверочный лист.',
      'Output: exhibition map, ethical attention principles and a review checklist.',
      '成果：展览地图、合乎伦理的注意力原则及核查清单。'),
    dimensions:[
      {id:'focus',label:L('Фокус внимания','Focus','注意力聚焦')},
      {id:'consent',label:L('Уважение выбора','User agency','用户自主权')},
      {id:'comprehension',label:L('Понятность','Comprehension','理解度')}
    ],
    seed:{focus:45,consent:50,comprehension:50},
    ending:L('Экспозиция собрана. Это художественная модель, а не эксперимент с людьми: проверьте её понятность в добровольных тестах.',
      'The exhibition is curated. This is an artistic model, not a user study; test its clarity with volunteers.',
      '展览策划完成。这是艺术模型，并非用户研究；请在自愿参与的测试中验证理解度。'),
    turns:[
      turn('threshold',L('ЗАЛ I / ПЕРВЫЕ СЕКУНДЫ','GALLERY I / FIRST SECONDS','展厅一 / 最初几秒'),
        L('Как посетитель заметит экспонат, не попав в ловушку внимания?','How do you attract a visitor without creating an attention trap?','如何在不设置注意力陷阱的情况下吸引观众？'),
        [
          choice('one',L('Один ясный объект без мигания','One clear object, no flashing','单一清晰的对象，无闪烁'),
            L('Меньше отвлечений — больше контроля.','Less distraction can preserve agency.','减少干扰有助于自主选择。'),
            {focus:12,consent:12,comprehension:8},'exhibit'),
          choice('motion',L('Ненавязчивое движение','Subtle optional motion','可选择的轻微动态'),
            L('Уважайте режим уменьшенной анимации.','Respect reduced-motion preferences.','尊重减少动画的偏好。'),
            {focus:12,consent:2,comprehension:5},'exhibit'),
          choice('prompt',L('Вопрос, на который не нужно отвечать','An optional question','无需回答的问题'),
            L('Любопытство не должно становиться обязанностью.','Curiosity should not become an obligation.','好奇心不应变成义务。'),
            {focus:7,consent:13,comprehension:9},'exhibit')
        ],L('Как выглядит первый кадр экспозиции?','Describe the first frame.','描述展品的第一帧。')),
      turn('contrast',L('ЗАЛ II / КОНТРАСТ','GALLERY II / CONTRAST','展厅二 / 对比'),
        L('Как показать ценность, не выдавая монтаж за доказательство?','How can contrast illustrate value without masquerading as proof?','如何展示对比而不把剪辑当作证据？'),
        [
          choice('pair',L('Два честных сценария бок о бок','Two honest scenarios side by side','并排展示两个真实场景'),
            L('Подпишите, где художественный пример, а где факт.','Label fictional examples separately from facts.','明确标示虚构示例与事实。'),
            {focus:8,consent:9,comprehension:13},'comparison'),
          choice('reveal',L('Добровольное раскрытие подробностей','User-triggered reveal','用户自愿展开详情'),
            L('Дайте посетителю управлять темпом и глубиной.','Let the visitor set the pace.','让观众控制节奏与深度。'),
            {focus:7,consent:15,comprehension:7},'comparison'),
          choice('lab',L('Показать условия демонстрации','Show experimental conditions','展示实验条件'),
            L('Контекст помогает отличить гипотезу от свидетельства.','Context separates hypothesis from evidence.','背景信息有助于区分假设与证据。'),
            {focus:3,consent:9,comprehension:15},'comparison')
        ],L('Какая подпись предотвратит неверную трактовку?','What caption would prevent a misleading interpretation?','什么说明可防止误解？')),
      turn('memory',L('ЗАЛ III / ЧТО ЗАПОМИНАЕТСЯ','GALLERY III / RECALL','展厅三 / 记忆'),
        L('Что должно остаться с посетителем после выхода?','What should stay with the visitor afterward?','观众离开后应该记住什么？'),
        [
          choice('truth',L('Одна проверяемая мысль','One verifiable statement','一条可验证的陈述'),
            L('Цель — понимание, не шум.','Optimize for understanding, not noise.','目标是理解，而非噪音。'),
            {focus:8,consent:5,comprehension:15},'memory'),
          choice('story',L('Человеческая история с контекстом','A human story with context','带背景的人物故事'),
            L('Согласие героя и контекст обязательны.','Obtain the participant’s consent and preserve context.','取得人物同意并保留上下文。'),
            {focus:13,consent:10,comprehension:8},'memory'),
          choice('question',L('Открытый вопрос для размышления','A reflective open question','供思考的开放问题'),
            L('Вопрос должен оставлять право не отвечать.','Leave room to ignore the question.','允许观众不作回答。'),
            {focus:11,consent:14,comprehension:5},'memory')
        ],L('Какая мысль останется у посетителя?','Write one lasting takeaway.','写下观众最可能记住的一点。')),
      turn('exit',L('ЗАЛ IV / ВЫХОД','GALLERY IV / THE EXIT','展厅四 / 出口'),
        L('Как закончить опыт без бесконечного вовлечения и скрытого трекинга?','How does the experience end without an endless funnel or hidden tracking?','如何在不无限延长参与、不暗中追踪的情况下结束体验？'),
        [
          choice('leave',L('Свободный выход без формы','Free exit without a form','无需填写表单即可退出'),
            L('Посетитель не обязан платить вниманием за уход.','Visitors should not pay with attention to leave.','离开不应以更多注意力为代价。'),
            {focus:7,consent:15,comprehension:8},'exitRule'),
          choice('download',L('Скачать экспонат без аккаунта','Download the exhibit, no account','无需账号即可下载展品'),
            L('Отдавайте полезный материал без лишних данных.','Share value without unnecessary data.','无需收集多余数据即可分享价值。'),
            {focus:9,consent:13,comprehension:12},'exitRule'),
          choice('invite',L('Добровольное приглашение на следующий зал','Optional invitation to continue','自愿邀请参观下一展厅'),
            L('Продолжение не должно быть выбором по умолчанию.','Continuation must never be forced.','继续参观不得强制。'),
            {focus:10,consent:8,comprehension:9},'exitRule')
        ],L('Как пользователь узнает, какие данные не собираются?','How will visitors know what data is not collected?','如何告知观众不会收集哪些数据？'))
    ]
  },
  'attention-republic': {
    id:'attention-republic',number:'07',symbol:'◎',accent:'blue',name:'Attention Republic',mode:'STRATEGY & TRUST SIMULATOR',
    title:L('Постройте республику, которой доверяют.',
      'Build a republic worth trusting.',
      '建设值得信赖的共和国。'),
    introduction:L('Пять публичных решений определяют доверие, участие и устойчивость вымышленного сообщества. Жители и экономика — сценарная модель; здесь нет реальных голосований, людей или рекламного инвентаря.',
      'Five decisions shape trust, participation and sustainability in a fictional republic. Citizens and economics are simulations, not real users or ad inventory.',
      '五项公共决策将影响虚构社区的信任、参与和可持续性。居民和经济均为模拟。'),
    objective:L('Результат: пять принятых решений, отчёт о последствиях и правила честной кампании.',
      'Output: five policy decisions, a consequence report and fair campaign rules.',
      '成果：五项政策决策、后果报告和公平广告规则。'),
    dimensions:[
      {id:'trust',label:L('Доверие','Trust','信任')},
      {id:'inclusion',label:L('Участие','Inclusion','包容参与')},
      {id:'resilience',label:L('Устойчивость','Resilience','可持续性')}
    ],
    seed:{trust:50,inclusion:48,resilience:52},
    ending:L('Совет завершён. Индексы показывают только последствия выбранных правил в модели, не мнения реальных граждан.',
      'The council has concluded. Indicators describe only modeled consequences, not the views of real citizens.',
      '议会已结束。指数仅代表模型结果，并非真实公民观点。'),
    turns:[
      turn('charter',L('СОВЕТ I / ХАРТИЯ','COUNCIL I / THE CHARTER','议会一 / 宪章'),
        L('Какой принцип лежит в основе Республики Внимания?','Which founding principle will guide the republic?','注意力共和国的建国原则是什么？'),
        [
          choice('freedom',L('Полная свобода выхода и отказа','Freedom to leave or opt out','自由退出或拒绝'),
            L('Нет штрафа за отказ. Это укрепляет добровольность.','No penalty for declining strengthens agency.','拒绝不受惩罚可以增强自主权。'),
            {trust:13,inclusion:7,resilience:1},'charter'),
          choice('fairness',L('Равный голос каждому участнику','Equal voice for every participant','人人平等发声'),
            L('Равенство требует защиты от накруток и координированных атак.','Fair voices require defense against manipulation.','公平参与需要防范作弊。'),
            {trust:9,inclusion:14,resilience:-3},'charter'),
          choice('evidence',L('Все рекламные тезисы подлежат проверке','Require evidence for ad claims','广告主张必须有证据'),
            L('Создаётся процесс исправления ошибок, а не культ непогрешимости.','Build a correction process, not a claim of perfection.','建立纠错流程，而非自称永不犯错。'),
            {trust:12,inclusion:4,resilience:11},'charter')
        ],L('Одно предложение о ваших правилах сообщества.','Describe the community rule in one sentence.','用一句话描述社区规则。')),
      turn('budget',L('СОВЕТ II / ОБЩИЕ РЕСУРСЫ','COUNCIL II / RESOURCES','议会二 / 资源'),
        L('Вымышленный бюджет ограничен. Что получает приоритет?','Resources are finite. What gets priority?','资源有限。什么最重要？'),
        [
          choice('quality',L('Проверка качества сообщений','Review message quality','审核信息质量'),
            L('Меньше проектов, но выше прозрачность критериев.','Fewer projects with clearer review criteria.','项目减少，但审核标准更透明。'),
            {trust:11,inclusion:-4,resilience:12},'budget'),
          choice('access',L('Доступность и перевод интерфейсов','Accessibility and language support','无障碍和多语言支持'),
            L('Расширяется участие без искусственной гонки показов.','Participation broadens without chasing impressions.','扩大参与，但不追逐虚假展示量。'),
            {trust:7,inclusion:15,resilience:0},'budget'),
          choice('training',L('Обучение ответственных авторов','Train responsible creators','培训负责任的创作者'),
            L('Рост медленнее, но участники понимают правила.','Slower expansion, stronger understanding.','扩张放缓，但参与者更了解规则。'),
            {trust:8,inclusion:8,resilience:9},'budget')
        ],L('От чего вы осознанно отказываетесь ради этого приоритета?','What are you willing to sacrifice for this priority?','为这个优先事项，您愿意牺牲什么？')),
      turn('sponsor',L('СОВЕТ III / СПОНСОРЫ','COUNCIL III / SPONSORSHIP','议会三 / 赞助'),
        L('Бренд хочет профинансировать историю. Какие условия введёт республика?','A brand wants to sponsor a story. What conditions apply?','品牌希望赞助一个故事。共和国会规定什么条件？'),
        [
          choice('disclose',L('Яркая маркировка и отказ от скрытой рекламы','Clearly label all sponsored content','清晰标示所有赞助内容'),
            L('Пользователь знает, кто оплатил историю.','Participants can identify who funded the story.','参与者知道谁资助了故事。'),
            {trust:15,inclusion:5,resilience:6},'sponsorship'),
          choice('independence',L('Редакторская независимость от спонсора','Protect editorial independence','保障编辑独立性'),
            L('Пользователь видит честные противоречия, а не только лозунги.','The story can show trade-offs, not slogans alone.','故事可以展现权衡，而非只有口号。'),
            {trust:13,inclusion:8,resilience:-5},'sponsorship'),
          choice('match',L('Тематическое соответствие вместо навязывания','Relevant sponsorship only','只允许相关赞助'),
            L('Меньше доходных гипотез, зато меньше случайного давления.','Fewer monetization hypotheses, less irrelevant pressure.','变现机会减少，但干扰更小。'),
            {trust:8,inclusion:11,resilience:5},'sponsorship')
        ],L('Как спонсорство будет раскрыто понятными словами?','How will sponsorship be disclosed?','如何用清楚的语言披露赞助？')),
      turn('privacy',L('СОВЕТ IV / ЛИЧНЫЕ ГРАНИЦЫ','COUNCIL IV / PRIVACY','议会四 / 隐私'),
        L('Как учитывать вовлечение, не превращая людей в скрытые данные?','How should you measure engagement without covert tracking?','如何在不暗中追踪的前提下衡量参与？'),
        [
          choice('no-track',L('Только локальная игра без учёта людей','Entirely local gameplay, no user counts','完全本地体验，不统计用户'),
            L('Нельзя узнать реальные охваты, зато не нужно собирать личности.','No reach claims, but no identities collected.','不能声称真实覆盖人数，但也不收集身份。'),
            {trust:15,inclusion:5,resilience:-2},'privacy'),
          choice('optin',L('Согласие до анонимных событий','Opt-in before anonymous events','获得同意后才统计匿名事件'),
            L('Согласие можно отозвать, а метрики нужно объяснить.','Explain metrics and enable withdrawal.','解释指标并允许撤回同意。'),
            {trust:10,inclusion:8,resilience:10},'privacy'),
          choice('aggregate',L('Сводные отчёты без индивидуальных досье','Aggregate reporting, no personal dossiers','只提供汇总报告，不建立个人档案'),
            L('Малые группы требуют порога анонимности и осторожных выводов.','Small cohorts need disclosure thresholds.','小群体需要匿名性阈值。'),
            {trust:12,inclusion:7,resilience:8},'privacy')
        ],L('Что точно не будет сохраняться?','What will explicitly not be stored?','哪些数据将明确不予保存？')),
      turn('veto',L('СОВЕТ V / ПРАВО ВЕТО','COUNCIL V / THE VETO','议会五 / 否决权'),
        L('Жители спорят о новом рекламном проекте. Как принять итоговое решение?','The council disputes a new campaign. How is the decision made?','议会对新广告活动存在分歧。如何作出决定？'),
        [
          choice('appeal',L('Публичное обжалование с аргументами','An open, reasoned appeal','公开、有理由的申诉'),
            L('Решения можно пересматривать по новым фактам.','Allow decisions to change with evidence.','允许基于新证据修改决定。'),
            {trust:13,inclusion:8,resilience:10},'governance'),
          choice('independent',L('Независимая проверка обещаний','Independent review of claims','独立审查广告主张'),
            L('Проверка защищает доверие, но требует ресурсов.','Review supports trust but costs resources.','审查支持信任，但需要资源。'),
            {trust:15,inclusion:1,resilience:5},'governance'),
          choice('pause',L('Пауза и обсуждение без дедлайна','Pause and deliberate without urgency','暂停并充分讨论'),
            L('Замедление иногда предотвращает ошибку.','Slowing down can prevent a mistake.','放慢速度有时能避免错误。'),
            {trust:9,inclusion:14,resilience:0},'governance')
        ],L('Как вы объясните решение несогласным участникам?','How will you explain the outcome to dissenters?','您将如何向反对者解释结果？'))
    ]
  }
});

export const WORLD_IDS = Object.freeze(Object.keys(WORLDS));
