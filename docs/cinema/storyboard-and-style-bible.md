# IMPOSSIBLE VENTURES — THE IMPOSSIBLE SIGNAL
## Режиссёрская библия и раскадровка · 22 октября 2026

**Замысел:** полномасштабное интерактивное веб-кино из 16 конфигурационных сцен. В одном прохождении 12–14 посещений сцен; предполагаемый темп 4–6 минут без необязательного исследования. Зритель — потенциальный клиент, партнёр или автор истории. Цель — показать семь реально существующих творческих приложений и предложить добровольно открыть одно из них или коммерческий кабинет; не обещать реальные продажи.

## История — прежде изображения

**Логлайн:** в городе, где каждая секунда внимания превратилась в товар, бесследно исчезает последний свободный сигнал. Архитектор (сам зритель) получает сообщение из будущего и проходит через обсерваторию, пустой архив, театр и зеркальный зал. В момент открытия выясняется: сообщение послано не всесильным ИИ, а складывается из его собственных решений.

**Драматургия:** пролог → интрига → исследование → открытие → выбор → последствия → кульминация → финал. Состояния: одиночество → тревога → любопытство → сомнение → ответственность → надежда.

**Главный объект постоянства:** латунное кольцо с ровно тремя разрывами и плавающим световым трёхлучевым ядром диаметром примерно 16 см. Ни перемены формы, ни случайного изменения лица, потому что человеческое лицо главного героя не показывается. **Архитектура:** мокрый камень, базальт, оптическое стекло, сатинированный титан, патинированная латунь.

**Поворот:** в зеркале будущего отражается не рекламодатель, а решение зрителя. **Финальная фраза:** «Не покупай внимание. Создай историю, в которой человеку захочется остаться».

## Style Bible

| Категория | Решение |
|---|---|
| Цвет | Obsidian #070b11; белый сигнал #d9f1ec; латунь #d9af77; тревожный красный #c87862; надежда #add6b8 |
| Свет | Для каждой сцены один key light + умеренный rim/back; холод в городе, янтарь в архиве, вишнёвый театр, белая тишина в зеркале, утренний зелёный в финале |
| Материалы | Дождевой бетон/стекло, базальт/латунь, бархат/дерево, тёмное оптическое стекло, керамика/растения |
| Оптика | 28–35 мм на масштаб; 50 мм на поиск; 85 мм на открытие; отсутствие случайного экстремального fish-eye |
| Камера | push, pull, pan, drift — конфигурацией, скорость умеренная; на сценах 03, 10, 15 значимая пауза |
| Композиция | Главный объект справа или в центре, не менее 30% свободного пространства слева для титров; отдельные планы глубины и направляющие линии |
| Движение | Программное CSS transform на одном ключевом кадре; SVG-кольцо, редкие Canvas-частицы, отсутствие GPU-тяжёлого 3D |
| Шрифт | Системный sans с крупными короткими титрами и моноширинными микрометками; живой текст всегда DOM, не встроен в картинки |
| Аудио | Только Web Audio после явного нажатия; тихие собственные тональные сигналы, регулируемая громкость, по умолчанию звук выключен |
| Контроль | CINEMATIC / BALANCED / LITE, уменьшенное движение перекрывает режим; пауза эффектов при невидимой вкладке |
| Приватность | Только состояние памяти; локальное сохранение только по кнопке; никакого внешнего AI API или скрытых кликов |
| Качество | Не утверждать «настоящее 8K» без физического файла/разрешения; исходник 2560×1440 — цель, не подтверждённый факт |

## Полная режиссёрская таблица: 16 сцен

Длительности приблизительные; **никакая сцена не переключается принудительно**, чтобы зритель прочёл текст и принял решение.

| № | Сцена / задача / эмоция | Кадр / предмет / камера | Свет / атмосфера / звук | Темп | Титр / действие | Доступные ветки, переход / файлы |
|---|---|---|---|---|---|---|
| 01 | «Последний сигнал» · пролог, одиночество | Чёрный горизонт, один трёхлучевой огонь; медленный push | Холодный rim, одна низкая нота | 8–12с | «В будущем исчез последний честный сигнал» / Начать | →02; signal.webp + signal-core.svg |
| 02 | «Город исчезнувших секунд» · масштаб, тревога | Мокрый мегаполис с башней на правой трети; плавный pan | Холодные отражения, экономный Canvas-дождь, низкий шум | 12–18с | «Каждую секунду здесь кто-то купил» / Исследовать | →03; city.webp |
| 03 | «Пустой экран» · пауза | Один светящийся прямоугольник в кадрированном городе, камера остановлена | Холодный экран, тишина | 8–13с | «Но ни одна цифра не сказала, что чувствует человек» | →04; city.webp |
| 04 | «Сообщение» · интрига | Медное кольцо в космической чёрной пустоте; краткая фокусировка | Практический латунный свет, два тона | 12–16с | «Сигнал пришёл из завтрашнего дня» / Расшифровать | →05; signal.webp |
| 05 | «Обсерватория» · исследование | Колоссальный астрономический свод с подсвеченным прибором на правой трети; pan | Свет сверху + латунные practicals, умеренная пыль | 14–20с | «Послание осталось только в архиве» / исследовать прибор | →06; опциональная находка glass_note; observatory.webp |
| 06 | «Две двери» · первый выбор | Обсерватория, две геометрические двери, pull-back | Контраст тёплого и серебряного, мягкий тон | 15–25с | «Искать доказательства или воображение?» | proof→07 или wonder→08; observatory.webp |
| 07 | «Архив» · сомнение | Базальтовая библиотека, одна латунная папка справа; push 50 мм | Янтарь, пыль, едва слышный шорох | 15–25с | «Здесь хранились красивые, но пустые обещания» / открыть дело | →10 или (по hotspot) →09→10; archive.webp |
| 08 | «Театр» · уязвимость эмоции | Вишнёвый бархат, один пустой стул, тёмный передний план, push 85 мм | Одиночный spotlight, шелест кулисы | 15–25с | «Истории ничего не стоят без выбора зрителя» / прочесть реплику | →10 или (по hotspot) →09→10; theatre.webp |
| 09 | «Запечатанная запись» · необязательная тайна | Луч света на трёхлучевом ядре, камера статична | Тёплая лампа и тишина | 8–12с | «Лента записывала не людей, а решения» / взять фрагмент | →10; hidden_tape; archive.webp |
| 10 | «Зеркало Архитектора» · поворот | Пустой зеркальный зал БЕЗ лица, трёхлучевой свет справа, неподвижно | Белый свет, резкая тишина | 18–26с | «Отправитель — ты. Будущее отвечает на выбор» | →11; mirror.webp |
| 11 | «Договор с будущим» · этический выбор | Зеркальный зал и два выразительных канала света, никакой автопереход | Зелёный и красный, короткий cue | 15–30с | «Какую рекламу мы позволим создать?» | consent→12; extract→13; mirror.webp |
| 12 | «Город согласия» · вдохновение | Тихие сады на крышах нового города, мягкий вертикальный подъём | Рассвет, слабые частицы пыльцы, тихий аккорд | 12–20с | «Выбор важнее принуждения» | →14; dawn.webp |
| 13 | «Фабрика внимания» · предупреждение | Холодный безликий серверный зал, pull-back; без псевдостатистики | Серый верхний свет, редкий красный импульс | 12–20с | «Истории больше некому рассказывать» | →14; city.webp с иным crop |
| 14 | «Семь порталов» · агентность | Адаптивная SVG-галерея семи ворот (без ещё одного дорогого кадра), кликабельные метки | Семь цветовых акцентов, тихий cue на выбор | 25–50с | «Семь путей. Выбери, какой строить» / 7 hotspot-кнопок | selectedWorld из семи прототипов, →15; SVG/CSS |
| 15 | «Последняя секунда» · кульминация | Рассветный город и ядро Сигнала; 2 секунды полной статики | Один тихий эмоциональный аккорд | 12–18с | Итог меняется по path, ethics и selectedWorld | →16; dawn.webp |
| 16 | «Невозможное начинается» · финал | Тихий горизонт, медленный pull-back, кольцо замыкается | Аккорд и тишина; никакого autoplay | 15–30с | «Не покупай внимание. Создай историю…» | Открыть выбранный продукт / Commercial Command / Перезапуск; dawn.webp |

**Навигационный граф:** 01→02→03→04→05→06; 06{proof→07,wonder→08}; 07/08→10 или при открытии явного секрета →09→10; 10→11; 11{consent→12,extract→13}; 12/13→14→15→16. Хронология посещённых сцен сохраняется для кнопки Назад.

**Реальные семь ссылок:** Dead Drop /apps/dead-drop/; Appeal 2049 /apps/appeal-2049-studio/; AntiPersona /apps/antipersona/; Brief Theatre /apps/brief-theatre-studio/; AdBiome /apps/adbiome/; Museum /apps/museum-of-attention-studio/; Republic /apps/attention-republic-live/. Отдельная ссылка на /commercial/.

## План кадров, повторное использование и 7 промптов

**Кадры F01–F07:** целевое разрешение **2560×1440** и более лёгкие версии 1280×720 для мобильных. Эти размеры должны быть зафиксированы фактически при проверке исходников. Никакого автоматического «8K upscale».

1. **F01 city.webp (сцены 02,03,13)** — WIDE 28mm at human height from wet elevated walkway above sprawling rainy black-basalt megacity, one iconic tower at right third, muted cyan storm haze, muted amber windows, foreground rain-slick rail, long atmospheric depth, restrained physically plausible reflections, melancholic, 35% clear left negative space for external subtitles, photorealistic live-action still, no people, no readable text, no logos, aspect ratio 16:9.
2. **F02 signal.webp (01,04)** — 16cm oxidized-brass ring with exactly THREE subtle gaps surrounding a delicate three-ray WHITE glowing signal core, centered toward right third inside vast dark astronomical chamber, micro scratches, narrow rim light, one soft warm backlight, 50mm filmic optics, gentle dust and 35% empty left black space, restrained bloom, no typography, 16:9.
3. **F03 observatory.webp (05,06)** — monumentally scaled basalt-and-satin-titanium astronomical observatory interior, copper mechanical instruments, vaulted oculus admitting one dramatic cool shaft, tiny three-gap luminous brass signal at right, layered depth foreground console / midground rings / far gateway, 35mm human-height camera, subtle dust, cinematic realism, 35% empty left, no UI or logos, 16:9.
4. **F04 archive.webp (07,09)** — solemn underground archive carved in dark basalt, kilometers of oxidized brass shelves fading into haze, SINGLE small amber-glowing closed folder on right-hand desk, warm shafts of soft volumetric light with precise physically plausible shadows, foreground defocused rail, full-frame 50mm medium wide, tactile paper grain, 35% dark left space, no printed text, 16:9.
5. **F05 theatre.webp (08)** — grand deserted futuristic opera theatre, deep red velvet stage drapes and matte brass rails, one empty chair on right at foreground, soft isolated tungsten spotlight across realistic wood floor, intimate 85mm angle, distant auditorium dark but readable, melancholy wonder, 40% dark negative space left, no performer, no stage writing, 16:9.
6. **F06 mirror.webp (10,11)** — empty monolithic smoked mirror chamber with tall optical glass portal at right third and small white three-ray signal reflected in it, NO visible human face or human identity, physically plausible subtle floor reflection, cool white backlight and restrained particulate haze, contemplative 85mm framing, low-contrast left half for title, photorealistic, 16:9.
7. **F07 dawn.webp (12,15,16)** — sunrise over living mixed stone and ceramic megacity with verdant planted rooftop gardens, distant SAME iconic black tower from rainy-city keyframe, warm amber sun on right horizon, pale jade shadows, nearby wet stone foreground railing, volumetric morning mist, hopeful but architecturally believable, 35mm film still, 35% unobstructed left, no lettering, 16:9.

**Общая негативная инструкция:** no text in image, no watermarks, no logos, no stock-photo smiles, no plastic surfaces, no exaggerated neon glow, no repeated sci-fi interface, no unnatural face geometry, preserve oxidized brass and black basalt continuity, camera framing leaves text-safe area. HTML overlays contain readable text; generated кадр не должен содержать логотипы.

**Звук:** только синтезируемые Web Audio тёплый суббас/синусоидальные cue и затухание; без музыки чужих авторов. Звук **только по воле пользователя**.

**Минимум ресурсов:** 7 ключевых кадров на 16 сцен, SVG-галерея в сцене 14, автоматический prefetch только соседней сцены, лёгкий CSS-zoom если слои не отделены, отключение Canvas на LITE или reduced-motion. Если ключевых кадров пока нет, используют процедурную SVG/CSS-заглушку, честно отличимую от фотореализма.

**Приёмочные критерии:** 16 конфигураций, валидный граф без тупиков, 2 настоящие развилки, 1 спрятанный но подсказанный путь, 7 рабочих прототипов, итог по выбранным решениям; back, skip, restart, save/restore only by click; звук/громкость, режимы CINEMATIC/BALANCED/LITE, accessibility, статическая сборка, Node маршруты и browser smoke.
