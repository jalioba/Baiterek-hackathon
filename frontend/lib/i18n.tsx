'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'RU' | 'KZ';

const translations = {
  RU: {
    nav: {
      home: 'Главная',
      services: 'Каталог услуг',
      knowledge: 'База знаний',
      news: 'Новости',
      about: 'О холдинге',
      dashboard: 'Личный кабинет',
    },
    header: {
      login: 'Войти',
      register: 'Регистрация',
      profile: 'Мой профиль',
      logout: 'Выйти',
      accessibility: 'Версия для слабовидящих',
      fontSize: 'Размер шрифта',
      contrast: 'Контрастность',
      contrastOn: 'Обычная версия',
      contrastOff: 'Черно-белая версия',
      portal: 'Портал поддержки бизнеса',
      viewAll: 'Смотреть все услуги →',
      aboutHolding: 'Подробнее о холдинге Байтерек',
      serviceCategories: 'Категории услуг',
      subsidiaries: 'Дочерние организации',
    },
    hero: {
      title: 'Государственная поддержка для вашего бизнеса',
      subtitle: 'Кредиты, субсидии, гарантии и гранты от холдинга «Байтерек» в одном окне.',
      cta: 'Подобрать услугу',
      secondary: 'Каталог мер поддержки',
      counterEntrepreneurs: 'предпринимателей',
      counterSupport: 'меры поддержки',
      counterOrgs: 'организаций',
    },
    dashboard: {
      welcome: 'Добро пожаловать,',
      subtitle: 'Здесь вы можете отслеживать статус ваших заявок и управлять услугами.',
      apply: 'Подать заявку',
      book: 'Записаться на консультацию',
      upload: 'Загрузить документ',
      activeApps: 'Активные заявки',
      allApps: 'Все заявки',
      notifications: 'Уведомления',
      all: 'Все',
      stats: {
        total: 'Всего заявок',
        inProgress: 'В работе',
        approved: 'Одобрено',
        newNotifs: 'Новых уведомлений',
      },
    },
    services: {
      title: 'Каталог мер господдержки',
      subtitle: 'Найдите подходящую программу для вашего бизнеса',
      search: 'Поиск по названию услуги...',
      apply: 'Подать заявку',
      all: 'Все',
      noResults: 'Ничего не найдено',
      noResultsDesc: 'Попробуйте изменить параметры поиска',
      filters: 'Фильтры',
      reset: 'Сбросить',
      category: 'Категория',
      audience: 'Целевая аудитория',
      processingTime: 'Срок рассмотрения',
      organizations: 'Организация',
      sort: 'Сортировка',
      found: 'Найдено',
      smartSelect: 'Умный подбор',
      anyTerm: 'Любой срок',
      days: 'дн.',
    },
    profile: {
      title: 'Мой профиль',
      backHome: 'На главную',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      phone: 'Телефон',
      iin: 'ИИН',
      company: 'Компания',
      save: 'Сохранить изменения',
      logout: 'Выйти из аккаунта',
    },
    ai: {
      name: 'Жакын AI',
      online: 'Онлайн',
      placeholder: 'Спросите Жакын AI...',
      welcome: 'Сәлем! Мен Жакын AI — Байтерек порталының ассистентімін. 👋\n\nМен сізге бизнесіңізге қолдау шараларын табуға көмектесемін.\n\nЖылдам сұрақтар:\n- *Қандай несиелер қол жетімді?*\n- *Кепілдік алу жолдары?*\n- *Экспорттық қолдау*',
    },
    common: {
      loading: 'Загрузка...',
      error: 'Что-то пошло не так',
      retry: 'Попробовать снова',
      status: {
        SUBMITTED: 'Подана',
        UNDER_REVIEW: 'На рассмотрении',
        APPROVED: 'Одобрено',
        REJECTED: 'Отклонено',
        DOCS_REQUIRED: 'Нужны документы',
        COMPLETED: 'Завершено',
      },
    },
    home: {
      stats: {
        programs: 'Программ господдержки',
        subsidiaries: 'Дочерних организаций',
        entrepreneurs: 'Предпринимателей',
        approved: 'Одобрено заявок',
      },
      howItWorks: {
        title: 'Как это работает',
        subtitle: 'Простой процесс получения поддержки онлайн',
        steps: [
          { title: '1. Найдите услугу', desc: 'Воспользуйтесь умным поиском или AI-ассистентом для подбора подходящей программы поддержки.' },
          { title: '2. Зарегистрируйтесь', desc: 'Авторизуйтесь с помощью ЭЦП Национального Удостоверяющего Центра (НУЦ РК).' },
          { title: '3. Подайте заявку', desc: 'Заполните онлайн-форму, приложите сканы документов и подпишите заявку через ЭЦП.' },
          { title: '4. Получите решение', desc: 'Отслеживайте статус заявки в личном кабинете. Уведомления будут приходить на почту и в SMS.' },
        ],
      },
      news: {
        title: 'Последние новости',
        subtitle: 'Актуальные события и обновления от холдинга Байтерек',
        readMore: 'Читать далее',
        allNews: 'Все новости',
        noNews: 'Нет новостей для выбранной организации.',
        mainNews: 'Главная новость',
        pressCenter: 'Пресс-центр',
        pressCenterSub: 'Главные новости холдинга Байтерек и дочерних организаций',
        readFull: 'Читать полностью',
      },
    },
  },

  KZ: {
    nav: {
      home: 'Басты бет',
      services: 'Қызметтер каталогы',
      knowledge: 'Білім базасы',
      news: 'Жаңалықтар',
      about: 'Холдинг туралы',
      dashboard: 'Жеке кабинет',
    },
    header: {
      login: 'Кіру',
      register: 'Тіркелу',
      profile: 'Менің профилім',
      logout: 'Шығу',
      accessibility: 'Нашар көретіндерге нұсқа',
      fontSize: 'Қаріп өлшемі',
      contrast: 'Контраст',
      contrastOn: 'Қалыпты нұсқа',
      contrastOff: 'Ақ-қара нұсқа',
      portal: 'Бизнесті қолдау порталы',
      viewAll: 'Барлық қызметтерді қарау →',
      aboutHolding: 'Байтерек холдингі туралы',
      serviceCategories: 'Қызмет санаттары',
      subsidiaries: 'Еншілес ұйымдар',
    },
    hero: {
      title: 'Сіздің бизнесіңізге арналған мемлекеттік қолдау',
      subtitle: 'Несиелер, субсидиялар, кепілдіктер мен гранттар «Байтерек» холдингінен бір терезеде.',
      cta: 'Қызметті таңдау',
      secondary: 'Қолдау шараларының каталогы',
      counterEntrepreneurs: 'кәсіпкерлер',
      counterSupport: 'қолдау шаралары',
      counterOrgs: 'ұйымдар',
    },
    dashboard: {
      welcome: 'Қош келдіңіз,',
      subtitle: 'Мұнда сіз өтінімдеріңіздің мәртебесін бақылай аласыз.',
      apply: 'Өтінім беру',
      book: 'Консультацияға жазылу',
      upload: 'Құжат жүктеу',
      activeApps: 'Белсенді өтінімдер',
      allApps: 'Барлық өтінімдер',
      notifications: 'Хабарландырулар',
      all: 'Барлығы',
      stats: {
        total: 'Жалпы өтінімдер',
        inProgress: 'Өңделуде',
        approved: 'Мақұлданды',
        newNotifs: 'Жаңа хабарландырулар',
      },
    },
    services: {
      title: 'Мемлекеттік қолдау шараларының каталогы',
      subtitle: 'Бизнесіңізге сәйкес бағдарламаны табыңыз',
      search: 'Қызмет атауы бойынша іздеу...',
      apply: 'Өтінім беру',
      all: 'Барлығы',
      noResults: 'Ештеңе табылмады',
      noResultsDesc: 'Іздеу параметрлерін өзгертіп көріңіз',
      filters: 'Сүзгілер',
      reset: 'Тазалау',
      category: 'Санат',
      audience: 'Мақсатты аудитория',
      processingTime: 'Қарау мерзімі',
      organizations: 'Ұйымдар',
      sort: 'Сұрыптау',
      found: 'Табылды',
      smartSelect: 'Ақылды таңдау',
      anyTerm: 'Кез келген',
      days: 'күн',
    },

    profile: {
      title: 'Менің профилім',
      backHome: 'Басты бетке',
      firstName: 'Аты',
      lastName: 'Тегі',
      email: 'Email',
      phone: 'Телефон',
      iin: 'ЖСН',
      company: 'Компания',
      save: 'Өзгерістерді сақтау',
      logout: 'Аккаунттан шығу',
    },
    ai: {
      name: 'Жакын AI',
      online: 'Онлайн',
      placeholder: 'Жакын AI-дан сұраңыз...',
      welcome: 'Сәлем! Мен Жакын AI — Байтерек порталының ассистентімін. 👋\n\nМен сізге бизнесіңізге қолдау шараларын табуға көмектесемін.\n\nЖылдам сұрақтар:\n- *Қандай несиелер қол жетімді?*\n- *Кепілдік алу жолдары?*\n- *Экспорттық қолдау*',
    },
    common: {
      loading: 'Жүктелуде...',
      error: 'Бірдеңе дұрыс болмады',
      retry: 'Қайталап көру',
      status: {
        SUBMITTED: 'Берілді',
        UNDER_REVIEW: 'Қарастырылуда',
        APPROVED: 'Мақұлданды',
        REJECTED: 'Қабылданбады',
        DOCS_REQUIRED: 'Құжаттар қажет',
        COMPLETED: 'Аяқталды',
      },
    },
    home: {
      stats: {
        programs: 'Мемлекеттік қолдау бағдарламалары',
        subsidiaries: 'Еншілес ұйымдар',
        entrepreneurs: 'Кәсіпкерлер',
        approved: 'Мақұлданған өтінімдер',
      },
      howItWorks: {
        title: 'Бұл қалай жұмыс істейді',
        subtitle: 'Қолдауды онлайн алудың қарапайым процесі',
        steps: [
          { title: '1. Қызметті табыңыз', desc: 'Қолайлы қолдау бағдарламасын табу үшін ақылды іздеуді немесе AI-ассистентті пайдаланыңыз.' },
          { title: '2. Тіркеліңіз', desc: 'ҰКО ЭЦП арқылы авторизациядан өтіңіз.' },
          { title: '3. Өтінім беріңіз', desc: 'Онлайн-форманы толтырып, құжаттардың сканерін тіркеп, ЭЦП арқылы қол қойыңыз.' },
          { title: '4. Шешім алыңыз', desc: 'Жеке кабинетте өтінімнің мәртебесін бақылаңыз. Хабарламалар электрондық поштаға және SMS-ке келеді.' },
        ],
      },
      news: {
        title: 'Соңғы жаңалықтар',
        subtitle: 'Байтерек холдингінің өзекті оқиғалары мен жаңартулары',
        readMore: 'Толығырақ оқу',
        allNews: 'Барлық жаңалықтар',
        noNews: 'Таңдалған ұйым үшін жаңалықтар жоқ.',
        mainNews: 'Негізгі жаңалық',
        pressCenter: 'Пресс-орталық',
        pressCenterSub: 'Байтерек холдингі мен еншілес ұйымдарының негізгі жаңалықтары',
        readFull: 'Толықтай оқу',
      },
    },
  },
};


type Translations = typeof translations.RU;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: 'RU',
  setLang: () => {},
  t: translations.RU,
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('RU');

  useEffect(() => {
    const saved = localStorage.getItem('baiterek-lang') as Lang | null;
    if (saved === 'RU' || saved === 'KZ') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('baiterek-lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
export { translations };
