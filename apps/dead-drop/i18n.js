/* Dead Drop language catalogue: English, Russian and Simplified Chinese.
 * Source copy remains English; UI translations never modify user-supplied data.
 * No library, network call or analytics is required.
 */
'use strict';

(() => {
  const entries = [
    ["CREATIVE INTELLIGENCE","КРЕАТИВНАЯ РАЗВЕДКА","创意情报"],
    ["CLASSIFIED CREATIVE OPERATIONS","СЕКРЕТНЫЕ КРЕАТИВНЫЕ ОПЕРАЦИИ","机密创意行动"],
    ["CHECKING CONNECTION","ПРОВЕРКА СОЕДИНЕНИЯ","检查连接"],
    ["NEW OPERATION","НОВАЯ ОПЕРАЦИЯ","新行动"],
    ["MISSION SEQUENCE","ЭТАПЫ МИССИИ","任务流程"],
    ["THE BRIEF","БРИФ","任务简报"],
    ["Classify the mission","Определение задачи","确定任务"],
    ["THE PARTNER","НАПАРНИК","合作搭档"],
    ["Combine intelligence","Объединение данных","汇集情报"],
    ["SIGNAL EXCHANGE","ОБМЕН СИГНАЛАМИ","交换信息"],
    ["Limited transmissions","Ограниченные сообщения","有限次传讯"],
    ["FINAL DOSSIER","ИТОГОВОЕ ДОСЬЕ","最终档案"],
    ["Concept and validation","Концепция и проверка","创意与验证"],
    ["// PROTOCOL 007","// ПРОТОКОЛ 007","// 协议 007"],
    ["The best ideas come from information no single person possesses alone.","Лучшие идеи рождаются, когда разные люди объединяют знания.","最好的创意来自任何一个人都无法独自掌握的信息。"],
    ["INTELLIGENCE CHANNEL","КАНАЛ РАЗВЕДКИ","情报频道"],
    ["● LIVE GUIDE","● НАВИГАТОР","● 实时向导"],
    ["Your mission controller","Куратор вашей миссии","您的任务指挥官"],
    ["INCOMING TRANSMISSION","ВХОДЯЩЕЕ СООБЩЕНИЕ","收到传讯"],
    ["Welcome, Agent. Two different perspectives. One exceptional campaign. Your mission starts here.","Добро пожаловать, агент. Две точки зрения. Одна выдающаяся кампания. Миссия начинается.","欢迎，特工。两种视角，一场卓越的营销行动。任务从这里开始。"],
    ["INTELLIGENCE FEED ACTIVE","РАЗВЕДКАНАЛ АКТИВЕН","情报传输已开启"],
    ["DEAD DROP AGENCY © 2026 · AN IMPOSSIBLE VENTURES EXPERIMENT","DEAD DROP AGENCY © 2026 · ЭКСПЕРИМЕНТ IMPOSSIBLE VENTURES","DEAD DROP AGENCY © 2026 · IMPOSSIBLE VENTURES 实验项目"],
    ["RESEARCH PROTOTYPE · USER-SUPPLIED CLAIMS ARE UNVERIFIED","ИССЛЕДОВАТЕЛЬСКИЙ ПРОТОТИП · УТВЕРЖДЕНИЯ ПОЛЬЗОВАТЕЛЯ НЕ ПРОВЕРЕНЫ","研究原型 · 用户提供的信息未经核实"],
    ["01 / THE BRIEF","01 / БРИФ","01 / 任务简报"],
    ["02 / THE PARTNER","02 / НАПАРНИК","02 / 合作搭档"],
    ["03 / THE EXCHANGE","03 / ОБМЕН","03 / 信息交换"],
    ["04 / FINAL DOSSIER","04 / ИТОГОВОЕ ДОСЬЕ","04 / 最终档案"],
    ["ENCRYPTED ROLES · NO ACCOUNT","РАЗНЫЕ РОЛИ · БЕЗ АККАУНТА","独立角色 · 无需注册"],
    ["● CO-OP SERVER CONNECTED","● СЕРВЕР СОВМЕСТНОЙ ИГРЫ ПОДКЛЮЧЁН","● 协作服务器已连接"],
    ["● TRAINING / STATIC PREVIEW","● ТРЕНИРОВКА / СТАТИЧЕСКОЕ ДЕМО","● 训练 / 静态预览"],
    ["WELCOME TO THE AGENCY","ДОБРО ПОЖАЛОВАТЬ В АГЕНТСТВО","欢迎加入情报局"],
    ["Great ideas","Большие идеи","伟大的创意"],
    ["are","под грифом","属于"],
    ["classified.","«секретно».","机密。"],
    ["The world does not need another ad generator. It needs two people who see the same problem differently.","Миру не нужен ещё один генератор рекламы. Ему нужны люди, которые видят одну задачу по-разному.","世界不需要又一个广告生成器，而需要从不同角度看待同一个问题的两个人。"],
    ["Join a covert creative operation, exchange limited signals, and unlock a campaign dossier.","Примите участие в секретной операции, обменяйтесь ограниченным числом сообщений и откройте рекламное досье.","加入秘密创意行动，用有限的消息交换情报，解锁完整营销档案。"],
    ["Create a mission","Создать миссию","创建任务"],
    ["You know the product. Recruit a partner who knows the audience.","Вы знаете продукт. Пригласите напарника, который понимает аудиторию.","您了解产品。邀请一位熟悉目标受众的搭档。"],
    ["Join as Agent Echo","Войти как агент Эхо","以回声特工身份加入"],
    ["You know the people. Use an invitation code to join an operation.","Вы знаете аудиторию. Войдите в операцию по коду приглашения.","您了解用户。使用邀请码加入行动。"],
    ["Training simulation","Тренировочная миссия","模拟训练"],
    ["Try both roles in one browser. No server or account is required.","Пройдите обе роли в одном браузере. Не нужны сервер и регистрация.","在一个浏览器中体验两种角色，无需服务器或账号。"],
    ["ENTER PROTOCOL ↗","НАЧАТЬ ↗","开始 ↗"],
    ["Co-op server connected.","Сервер совместной игры подключён.","协作服务器已连接。"],
    ["Static preview mode.","Статический режим демонстрации.","静态演示模式。"],
    ["Separate participants can join the same mission from different browsers using an eight-character code. Missions expire after seven days.","Два участника могут войти в одну миссию из разных браузеров по восьмизначному коду. Миссии удаляются после истечения семи дней при следующем обращении.","两人可在不同浏览器通过八位代码加入同一任务。任务将在七天后过期。"],
    ["Real remote collaboration requires the included Node server. The training simulation below lets you try the entire game without a backend.","Для совместной онлайн-игры нужен Node-сервер из репозитория. Тренировочный режим работает без сервера.","真正的远程协作需要随项目提供的 Node 服务器。无需后端也可以体验训练模拟。"],
    ["AGENT VECTOR / PRODUCT INTELLIGENCE","АГЕНТ ВЕКТОР / ДАННЫЕ О ПРОДУКТЕ","向量特工 / 产品情报"],
    ["Define the","Определите","定义"],
    ["operation.","миссию.","行动。"],
    ["Your partner will not see your confidential product notes until the final dossier. Only share information you have permission to use.","Напарник не увидит закрытую информацию о продукте до создания досье. Не вводите сведения, которыми вам запрещено делиться.","在生成最终档案前，搭档不会看到您的私有产品信息。仅分享您有权使用的数据。"],
    ["BRAND / ORGANIZATION","БРЕНД / КОМПАНИЯ","品牌 / 公司"],
    ["WHAT ARE WE PROMOTING?","ЧТО МЫ ПРОДВИГАЕМ?","我们要推广什么？"],
    ["EVIDENCE TO SUPPORT THE CLAIM","ДОКАЗАТЕЛЬСТВА ПРЕИМУЩЕСТВ","支持宣传主张的证据"],
    ["Evidence is user-supplied and will be marked unverified.","Данные пользователя будут помечены как непроверенные.","用户提供的证据将标记为未经核实。"],
    ["PRIMARY CAMPAIGN OBJECTIVE","ГЛАВНАЯ ЦЕЛЬ КАМПАНИИ","营销活动的主要目标"],
    ["Brand awareness","Узнаваемость бренда","提升品牌知名度"],
    ["Qualified leads","Целевые заявки","获取高质量潜在客户"],
    ["Product launch","Запуск продукта","新品上市"],
    ["CONTINUE TO AGENT ECHO","ПЕРЕЙТИ К АГЕНТУ ЭХО","继续至回声特工"],
    ["CREATE CLASSIFIED ROOM","СОЗДАТЬ СЕКРЕТНУЮ КОМНАТУ","创建机密房间"],
    ["GO BACK","НАЗАД","返回"],
    ["Specialty coffee subscription","Подписка на кофе","精品咖啡订阅"],
    ["Verified example, demonstration or measured customer outcome","Подтверждённый пример, демонстрация или измеримый результат","已核实的示例、演示或用户成果"],
    ["AGENT ECHO / AUDIENCE INTELLIGENCE","АГЕНТ ЭХО / ДАННЫЕ ОБ АУДИТОРИИ","回声特工 / 受众情报"],
    ["Know the people.","Поймите людей.","了解用户。"],
    ["Find the signal.","Найдите сигнал.","发现信号。"],
    ["Training mode: switch roles after entering both sets of intelligence. This is a simulation, not private multiplayer.","Тренировка: после заполнения данных переключайтесь между ролями. Это симуляция, а не закрытая онлайн-игра.","训练模式：输入双方信息后可切换角色。这只是模拟，并非私密联机游戏。"],
    ["Enter the room code sent by Agent Vector. Only one audience operative can join each mission.","Введите код комнаты от агента Вектор. К каждой миссии может присоединиться только один агент Эхо.","输入向量特工提供的房间代码。每个任务只允许一名受众特工加入。"],
    ["EIGHT-CHARACTER ROOM CODE","ВОСЬМИЗНАЧНЫЙ КОД КОМНАТЫ","八位房间代码"],
    ["Ask Agent Vector to copy the code from their briefing.","Попросите агента Вектор скопировать код комнаты.","请向量特工复制并分享代码。"],
    ["WHO ARE THE PEOPLE?","КТО НАША АУДИТОРИЯ?","目标人群是谁？"],
    ["THEIR REAL FRUSTRATION","ЧТО ИХ БЕСПОКОИТ?","他们真正的困扰"],
    ["BEST FORMAT","ПОДХОДЯЩИЙ ФОРМАТ","最佳传播形式"],
    ["Social sequence","Серия публикаций","社交媒体系列"],
    ["Short-form video","Короткое видео","短视频"],
    ["Interactive landing","Интерактивный лендинг","互动落地页"],
    ["Remote workers who value a quiet morning routine","Удалённые сотрудники, которые ценят спокойное утро","重视宁静早晨的远程办公者"],
    ["Their daily coffee ritual has become expensive and inconvenient","Утренний кофе стал дорогим и неудобным ритуалом","每天的咖啡习惯既昂贵又不便"],
    ["START TRAINING EXCHANGE","НАЧАТЬ ТРЕНИРОВОЧНЫЙ ОБМЕН","开始模拟传讯"],
    ["JOIN CLASSIFIED OPERATION","ПРИСОЕДИНИТЬСЯ К ОПЕРАЦИИ","加入机密行动"],
    ["PRODUCT INTELLIGENCE","ДАННЫЕ О ПРОДУКТЕ","产品情报"],
    ["AUDIENCE INTELLIGENCE","ДАННЫЕ ОБ АУДИТОРИИ","受众情报"],
    ["Your room is ready. Give the eight-character code to someone you trust. The mission begins only when Agent Echo joins.","Комната готова. Передайте восьмизначный код напарнику. Миссия начнётся, когда подключится агент Эхо.","房间已准备就绪。向可信赖的搭档提供八位代码。回声特工加入后，任务正式开始。"],
    ["Agent Vector: you know the product, but not the audience frustration. Ask an open question. Do not waste your three transmissions.","Агент Вектор: вы знаете продукт, но не проблемы аудитории. Задавайте открытые вопросы. У вас всего три сообщения.","向量特工：您了解产品，却不了解受众的困扰。请提出开放式问题，不要浪费三次传讯机会。"],
    ["Agent Echo: you know the audience, but not the product proof. Challenge the other agent to provide one concrete, verifiable benefit.","Агент Эхо: вы понимаете аудиторию, но не знаете доказательств продукта. Попросите напарника назвать конкретное проверяемое преимущество.","回声特工：您了解受众，但不了解产品证据。请搭档给出具体、可核实的优势。"],
    ["No transmissions intercepted yet. Ask a focused question instead of sharing the whole brief.","Сообщений пока нет. Задайте точный вопрос, а не пересказывайте весь бриф.","尚未收到任何消息。请提出精准问题，而不是发送完整简报。"],
    ["TRAINING OPERATION / TWO ROLES","ТРЕНИРОВКА / ДВЕ РОЛИ","模拟行动 / 双角色"],
    ["PRIVATE ROLE ROOM / TWO AGENTS","ЗАКРЫТАЯ КОМНАТА / ДВА АГЕНТА","私密角色房间 / 双特工"],
    ["Both operatives are in position.","Оба агента на связи.","两名特工均已就位。"],
    ["Waiting for Agent Echo to join.","Ожидаем подключения агента Эхо.","正在等待回声特工加入。"],
    ["OPERATION CODE","КОД ОПЕРАЦИИ","行动代码"],
    ["COPY INVITATION ↗","КОПИРОВАТЬ ПРИГЛАШЕНИЕ ↗","复制邀请 ↗"],
    ["LOCAL SIMULATION","ЛОКАЛЬНАЯ СИМУЛЯЦИЯ","本地模拟"],
    ["TRAINING: YOU CAN VIEW BOTH ROLES. THERE IS NO REAL SECRECY.","ТРЕНИРОВКА: ОБЕ РОЛИ ВИДНЫ В ОДНОМ БРАУЗЕРЕ. ЗДЕСЬ НЕТ СЕКРЕТНОСТИ.","训练：同一浏览器可查看两种角色，不存在真正的信息隔离。"],
    ["SWITCH TO","ПЕРЕКЛЮЧИТЬСЯ НА","切换至"],
    ["PRIVATE TO YOU","ТОЛЬКО ДЛЯ ВАС","仅您可见"],
    ["THE PRODUCT","ПРОДУКТ","产品"],
    ["EVIDENCE TO VERIFY","ДОКАЗАТЕЛЬСТВО ДЛЯ ПРОВЕРКИ","待核实的证据"],
    ["CAMPAIGN OBJECTIVE","ЦЕЛЬ КАМПАНИИ","营销目标"],
    ["THE AUDIENCE","АУДИТОРИЯ","目标受众"],
    ["THE FRICTION","ПРОБЛЕМА АУДИТОРИИ","受众痛点"],
    ["CHANNEL","КАНАЛ","渠道"],
    ["Information asymmetry:","Разделение информации:","信息不对称："],
    ["the other agent cannot read your private fields until the dossier is finalized. You may choose what to reveal in a transmission.","напарник не видит ваши закрытые данные до финального досье. Вы сами решаете, что раскрывать в сообщениях.","在最终档案生成前，搭档无法读取您的私有信息。您可自行决定在传讯中透露什么。"],
    ["INTERCEPTED TRANSMISSIONS","ПЕРЕХВАЧЕННЫЕ СООБЩЕНИЯ","截获的传讯"],
    ["SEND A SHORT SIGNAL (3–280 CHARACTERS)","ОТПРАВИТЬ СООБЩЕНИЕ (3–280 СИМВОЛОВ)","发送短讯（3–280 字符）"],
    ["What is the audience most skeptical about?","Какие сомнения есть у аудитории?","受众最怀疑的是什么？"],
    ["Which specific promise can the product genuinely prove?","Какое обещание продукта можно доказать?","产品能够真正证明哪一项承诺？"],
    ["EVERY WORD COUNTS","КАЖДОЕ СЛОВО ВАЖНО","字字重要"],
    ["AWAITING SECOND AGENT","ОЖИДАНИЕ ВТОРОГО АГЕНТА","等待第二名特工"],
    ["TRANSMIT ↗","ОТПРАВИТЬ ↗","发送 ↗"],
    ["OPTIONAL AI CREATIVE REFINEMENT","ДОПОЛНИТЕЛЬНОЕ УЛУЧШЕНИЕ ЧЕРЕЗ ИИ","可选 AI 创意优化"],
    ["Only when enabled, your private product and audience details are sent to the OpenAI API for creative refinement. The result is not fact-checked. Default: off.","Только с вашего согласия данные о продукте и аудитории будут отправлены в OpenAI API для улучшения идеи. Результат не проверен на достоверность. По умолчанию отключено.","仅在您主动开启后，私人产品和受众信息才会发送至 OpenAI API 进行创意优化。结果未经事实核查，默认关闭。"],
    ["DECODE THE CREATIVE DOSSIER ↗","РАСШИФРОВАТЬ ДОСЬЕ ↗","解锁创意档案 ↗"],
    ["Both agents have transmitted. Your dossier is ready.","Оба агента отправили сообщения. Досье готово.","两名特工均已传讯，档案已就绪。"],
    ["Each agent must send at least one transmission before decoding.","Перед расшифровкой каждый агент должен отправить хотя бы одно сообщение.","解锁前每名特工至少须发送一条消息。"],
    ["The two agents combined their intelligence. Now test the hypothesis with real people and verify the evidence before publishing.","Два агента объединили знания. Теперь проверьте гипотезу на реальных людях и подтвердите факты перед публикацией.","两名特工已融合情报。现在请用真实用户验证假设，并在发布前核实相关证据。"],
    ["MISSION ACCOMPLISHED / CLASSIFIED DOSSIER","МИССИЯ ВЫПОЛНЕНА / СЕКРЕТНОЕ ДОСЬЕ","任务完成 / 机密档案"],
    ["Signal","Сигнал","信号"],
    ["decoded.","расшифрован.","已解密。"],
    ["A concept built from two different perspectives. This structured creative brief is a starting point for human review.","Концепция создана на основе двух точек зрения. Это черновой рекламный бриф, который должен проверить человек.","一份融合双重视角的创意方案。这是一份供人工审核的初步广告简报。"],
    ["AI-ASSISTED CREATIVE DRAFT","ЧЕРНОВИК С ПОМОЩЬЮ ИИ","AI 辅助创意草案"],
    ["RULES-BASED CREATIVE DRAFT","ЧЕРНОВИК ПО ПРАВИЛАМ","规则生成的创意草案"],
    ["01 / THE OPENING HOOK","01 / ПЕРВЫЙ КРЮЧОК","01 / 开场钩子"],
    ["Stop the scroll.","Заставьте остановиться.","吸引注意力。"],
    ["02 / CREATIVE DIRECTION","02 / КРЕАТИВНАЯ ИДЕЯ","02 / 创意方向"],
    ["The big idea.","Главная идея.","核心创意。"],
    ["03 / EXECUTION","03 / РЕАЛИЗАЦИЯ","03 / 执行方案"],
    ["Where it comes to life.","Как воплотить в жизнь.","如何落地。"],
    ["04 / THE ACTION","04 / ДЕЙСТВИЕ","04 / 行动"],
    ["Call to action.","Призыв к действию.","行动号召。"],
    ["THE THREE-BEAT EXPERIENCE","СЦЕНАРИЙ ИЗ ТРЁХ СЦЕН","三幕式体验"],
    ["05 / PRODUCT EVIDENCE","05 / ДОКАЗАТЕЛЬСТВА","05 / 产品证据"],
    ["Verify before publishing.","Проверьте перед публикацией.","发布前核实。"],
    ["06 / MEASUREMENT","06 / ИЗМЕРЕНИЕ РЕЗУЛЬТАТА","06 / 效果衡量"],
    ["Run a real test.","Проведите реальный тест.","进行真实测试。"],
    ["07 / AGENT VECTOR","07 / АГЕНТ ВЕКТОР","07 / 向量特工"],
    ["Intercepted product signal.","Сигнал о продукте.","截获的产品讯息。"],
    ["08 / AGENT ECHO","08 / АГЕНТ ЭХО","08 / 回声特工"],
    ["Intercepted audience signal.","Сигнал об аудитории.","截获的受众讯息。"],
    ["Editorial note:","Примечание редактора:","编辑提示："],
    ["COPY DOSSIER ↗","КОПИРОВАТЬ ДОСЬЕ ↗","复制档案 ↗"],
    ["EXPORT .TXT ↓","СКАЧАТЬ .TXT ↓","导出 .TXT ↓"],
    ["Operation failed","Ошибка операции","行动失败"],
    ["AI generation was unavailable; rules-based dossier created instead.","ИИ недоступен: создано досье по базовым правилам.","AI 生成不可用，已改为规则生成档案。"],
    ["Invitation copied. Send it to your partner.","Приглашение скопировано. Отправьте напарнику.","邀请已复制，请发送给搭档。"],
    ["Clipboard unavailable. Share the room code displayed above.","Буфер обмена недоступен. Передайте код комнаты вручную.","无法使用剪贴板，请手动分享上方房间代码。"],
    ["Dossier copied to clipboard.","Досье скопировано.","档案已复制到剪贴板。"],
    ["Clipboard unavailable. Use export instead.","Буфер обмена недоступен. Используйте скачивание файла.","剪贴板不可用，请改用导出功能。"],
    ["Dossier exported.","Досье сохранено в файл.","档案已导出。"],
    ["The AI processing can be turned on only by your explicit choice.","ИИ включается только по вашему явному согласию.","仅在您明确选择后启用 AI 处理。"]
  ];

  entries.push(
    ["Private mission intelligence will be shared with the OpenAI API ONLY if BOTH agents independently opt in. Either agent can withdraw consent before finalization. The result is not fact-checked.","Данные миссии будут отправлены в OpenAI API, ТОЛЬКО ЕСЛИ ОБА агента отдельно дадут согласие. Каждый может отозвать согласие до завершения. Результат не проверен на достоверность.","仅在双方特工各自明确同意后，任务中的私人信息才会发送到 OpenAI API。任意一方可在生成前撤回同意，结果未经事实核查。"],
    ["GRANTED","ДАНО","已同意"],
    ["OFF","НЕТ","未同意"],
    ["Interface language","Язык интерфейса","界面语言"]
  );
  // v0.5: room lifecycle, role-scoped export and deletion confirmations.
  entries.push(
    ["YOUR DATA / TRAINING","ВАШИ ДАННЫЕ / ТРЕНИРОВКА","您的数据 / 训练"],
    ["Training data stays in this browser session.","Данные тренировки остаются только в этом сеансе браузера.","训练数据仅保留在当前浏览器会话中。"],
    ["No training data has been sent to our mission server. Leaving the session discards this local simulation.","Тренировочные данные не отправлялись на сервер миссий. При выходе локальная тренировка исчезнет.","训练数据不会发送到任务服务器。退出后本地训练内容将被清除。"],
    ["YOUR DATA / MISSION CONTROL","ВАШИ ДАННЫЕ / УПРАВЛЕНИЕ МИССИЕЙ","您的数据 / 任务管理"],
    ["Export or erase this mission.","Сохраните или удалите миссию.","导出或删除此任务。"],
    ["AGENT ACCESS","ДОСТУП АГЕНТА","特工权限"],
    ["Export contains only the data your role is authorized to view. Deletion removes the shared mission for BOTH agents.","В экспорт войдут только данные, доступные вашей роли. Удаление уничтожит общую миссию для ОБОИХ агентов.","导出的内容仅限您当前角色有权查看的数据。删除后双方特工都将失去该任务。"],
    ["ROOM EXPIRY","СРОК ХРАНЕНИЯ","房间到期时间"],
    ["EXPORT MY DATA .JSON ↓","СКАЧАТЬ МОИ ДАННЫЕ .JSON ↓","导出我的数据 .JSON ↓"],
    ["DELETE MISSION","УДАЛИТЬ МИССИЮ","删除任务"],
    ["DATA CONTROL / MISSION ERASURE","УПРАВЛЕНИЕ ДАННЫМИ / УДАЛЕНИЕ","数据控制 / 任务删除"],
    ["DELETE MISSION PERMANENTLY","УДАЛИТЬ МИССИЮ НАВСЕГДА","永久删除任务"],
    ["Both agents will lose access to the room, messages, private intelligence and dossier. This cannot be undone.","Оба агента потеряют доступ к комнате, сообщениям, закрытым данным и досье. Отменить действие нельзя.","双方特工都将无法再访问房间、消息、私密情报和档案。此操作无法撤销。"],
    ["TYPE THIS ROOM CODE TO CONFIRM","ВВЕДИТЕ ЭТОТ КОД ДЛЯ ПОДТВЕРЖДЕНИЯ","输入房间代码以确认"],
    ["ROOM CODE","КОД КОМНАТЫ","房间代码"],
    ["CANCEL","ОТМЕНА","取消"],
    ["DELETE ON SERVER","УДАЛИТЬ С СЕРВЕРА","从服务器删除"],
    ["LEAVE SESSION","ВЫЙТИ ИЗ МИССИИ","退出会话"],
    ["This mission was deleted or has expired.","Миссия удалена или срок её действия истёк.","此任务已删除或过期。"],
    ["Leaving only removes this browser session. The shared room remains on the server until deleted or expired. Leave anyway?","Выход удалит доступ к миссии только из этого браузера. Комната останется на сервере до удаления или истечения срока. Выйти?","退出只会清除此浏览器中的会话。共享房间仍将保留在服务器上，直至删除或过期。确定退出吗？"],
    ["The room code does not match.","Код комнаты не совпадает.","房间代码不匹配。"],
    ["Your role-scoped data was exported.","Данные вашей роли сохранены в файл.","您当前角色可访问的数据已导出。"],
    ["Mission deleted from the server. Both agents lost access.","Миссия удалена с сервера. Оба агента потеряли доступ.","任务已从服务器删除，双方特工均已失去访问权限。"],
    ["Deletion was not confirmed by the server","Сервер не подтвердил удаление","服务器未确认删除"],
    ["Deletion failed. Please retry.","Не удалось удалить. Попробуйте ещё раз.","删除失败，请重试。"]
  );
  entries.push(
    ["DATA & PRIVACY ↗","ДАННЫЕ И ПРИВАТНОСТЬ ↗","数据与隐私 ↗"],
    ["READ THE DATA HANDLING NOTICE ↗","ПРОЧИТАТЬ ОБРАБОТКУ ДАННЫХ ↗","查看数据处理说明 ↗"]
  );
  entries.push(
    ["EXPORT FOR APPEAL .JSON ↓","СКАЧАТЬ ДЛЯ APPEAL .JSON ↓","导出供 APPEAL 使用的 .JSON ↓"],
    ["OPEN APPEAL 2049 ↗","ОТКРЫТЬ APPEAL 2049 ↗","打开 APPEAL 2049 ↗"],
    ["Dossier JSON exported for Appeal 2049. Import it there to review. Nothing was sent to the server.","JSON-досье сохранено для Appeal 2049. Импортируйте файл в трибунал. Данные не отправлялись на сервер.","JSON 档案已导出供 Appeal 2049 使用。请在审查页面导入，数据未发送到服务器。"]
  );
  const maps = { ru: new Map(), zh: new Map() };
  const reverse = new Map();
  for (const [en, ru, zh] of entries) {
    maps.ru.set(en, ru);
    maps.zh.set(en, zh);
    reverse.set(ru, en);
    reverse.set(zh, en);
  }
  let locale = 'en';
  function canonical(text) {
    return reverse.get(text) || text;
  }
  function translate(text) {
    const key = canonical(String(text));
    return (maps[locale] && maps[locale].get(key)) || key;
  }
  function normalize(code) {
    const value = String(code || '').toLowerCase();
    if (value.startsWith('ru')) return 'ru';
    if (value.startsWith('zh')) return 'zh';
    return 'en';
  }
  function setLocale(value) {
    locale = normalize(value);
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    try { localStorage.setItem('dda-locale', locale); } catch {}
    const picker = document.getElementById('languageSelect');
    if (picker && picker.value !== locale) picker.value = locale;
    return locale;
  }
  function shouldSkip(node) {
    const p = node.parentElement;
    return !p || Boolean(p.closest(
      'script,style,[data-no-translate],.intel-value,.transmission p,' +
      '.result-card p,.story-card p,.room-code strong,.logo-glyph'
    ));
  }
  function apply(target = document.body) {
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    let node;
    const list = [];
    while ((node = walker.nextNode())) {
      if (!shouldSkip(node)) list.push(node);
    }
    for (const item of list) {
      const value = item.nodeValue;
      const matched = /^(\s*)([\s\S]*?)(\s*)$/.exec(value);
      if (!matched || !matched[2]) continue;
      const converted = translate(matched[2]);
      if (converted !== matched[2]) item.nodeValue = matched[1] + converted + matched[3];
    }
    if (target.querySelectorAll) {
      for (const item of target.querySelectorAll('[placeholder],[title],[aria-label]')) {
        if (item.closest('[data-no-translate],.transmission,.result-card')) continue;
        for (const attr of ['placeholder', 'title', 'aria-label']) {
          const value = item.getAttribute(attr);
          if (value) item.setAttribute(attr, translate(value));
        }
      }
    }
  }
function localizeRuleDossier(mission, draft, language = 'en') {
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


  const savedLocale = (() => {
    try { return localStorage.getItem('dda-locale'); } catch { return null; }
  })();
  setLocale(savedLocale || navigator.language || 'en');
  window.DeadDropLocale = {
    get locale() { return locale; },
    translate, normalize, setLocale, apply, localizeRuleDossier
  };
})();
