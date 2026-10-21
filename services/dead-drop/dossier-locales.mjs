/**
 * Non-AI creative dossier copy for English, Russian and Simplified Chinese.
 * Inputs are not translated or sent to external services; the editorial templates
 * are localized while product/audience information remains exactly user-provided.
 */
export function localizeRuleDossier(mission, draft, language = 'en') {
  if (!['ru', 'zh'].includes(language)) return { ...draft, generationMethod: 'rules', outputLanguage: 'en' };
  const host = mission.host;
  const guest = mission.guest;
  const tension = guest.friction.replace(/[.!?。！？]+$/, '');
  if (language === 'ru') {
    const channel = {
      social: 'серии публикаций в социальных сетях',
      video: 'короткого видеоролика',
      landing: 'интерактивной страницы'
    }[guest.channel];
    const action = {
      awareness: 'Узнать историю бренда',
      leads: 'Получить персональный бриф',
      launch: 'Посмотреть новый продукт'
    }[host.objective];
    return {
      ...draft,
      campaign: 'ОПЕРАЦИЯ / НЕОТПРАВЛЕННЫЙ СИГНАЛ',
      openingHook: 'ПРИВЫЧНАЯ ПРОБЛЕМА: ' + tension + '. А что, если есть другой путь?',
      concept: 'Превратите знакомую проблему аудитории «' + guest.audience + '» в небольшую загадку. Предложите сделать выбор, а затем покажите ' + host.product + ' от ' + host.brand + ' как один из возможных ответов.',
      execution: 'Постройте кампанию в формате ' + channel + ': привлечение внимания → выбор пользователя → раскрытие идеи с проверяемым доказательством.',
      storyboard: [
        { beat: '01 / СИГНАЛ', direction: 'Начните с реальной проблемы аудитории: ' + guest.friction + '.' },
        { beat: '02 / ВЫБОР', direction: 'Дайте два простых варианта, которые раскрывают ценности аудитории. Не запрашивайте персональные данные без необходимости.' },
        { beat: '03 / РАЗГАДКА', direction: 'Покажите ' + host.product + ' как возможное решение. Приводите только подтверждённые факты.' }
      ],
      callToAction: action,
      validation: 'Сравните концепцию с обычной рекламой в контролируемом A/B-тесте. Измеряйте целевые действия и повторные обращения, а не только клики.',
      disclosure: 'Только креативная гипотеза. Доказательства предоставлены пользователем и независимо не проверены. ИИ при создании этого варианта не использовался.',
      generationMethod: 'rules',
      outputLanguage: language
    };
  }
  const channel = {
    social: '社交媒体系列',
    video: '短视频',
    landing: '互动落地页'
  }[guest.channel];
  const action = {
    awareness: '了解品牌故事',
    leads: '获取专属简报',
    launch: '探索新产品'
  }[host.objective];
  return {
    ...draft,
    campaign: '行动 / 尚未发送的信号',
    openingHook: '习以为常的问题：' + tension + '。如果还有另一条路呢？',
    concept: '把目标受众“' + guest.audience + '”熟悉的难题变成一个谜题。邀请他们先做出选择，再将 ' + host.brand + ' 的 ' + host.product + ' 作为一种可能的解决方案。',
    execution: '通过' + channel + '呈现三个阶段：吸引注意 → 让受众选择 → 用可验证的证据揭示产品。',
    storyboard: [
      { beat: '01 / 截获', direction: '从真实的受众困扰开始：' + guest.friction + '。' },
      { beat: '02 / 抉择', direction: '提供两个简短选项，展现受众最在意的价值。避免不必要地收集个人数据。' },
      { beat: '03 / 揭示', direction: '把 ' + host.product + ' 作为可能的答案；所有事实性宣传都需要证据支持。' }
    ],
    callToAction: action,
    validation: '将此方案与直接响应式广告进行 A/B 对照测试，衡量高质量行动和复访，而不仅仅是点击。',
    disclosure: '这只是一项创意假设。产品证据来自用户，未经独立验证。此版本未使用实时 AI 模型。',
    generationMethod: 'rules',
    outputLanguage: language
  };
}
