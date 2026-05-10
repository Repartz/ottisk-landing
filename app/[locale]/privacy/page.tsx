import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface PrivacyProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale !== 'en';

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-background">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-sm sm:prose-base text-foreground">
            {isRu ? <PrivacyRu /> : <PrivacyEn />}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function PrivacyRu() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-foreground">Политика конфиденциальности и обработки персональных данных</h1>

      <p className="text-muted-foreground text-sm mb-6">Последнее обновление: май 2026 г.</p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">1. Общие положения</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Настоящая Политика конфиденциальности описывает, как команда OTTISK (далее — «мы», «нас», «наш») собирает, использует и защищает персональные данные пользователей сайта <strong>ottisk.vercel.app</strong> (далее — «Сайт»).
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Используя Сайт или отправляя форму заявки, вы соглашаетесь с настоящей Политикой.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">2. Какие данные мы собираем</h2>
      <p className="text-muted-foreground leading-relaxed mb-2">При отправке формы заявки мы получаем:</p>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>Имя и фамилию</li>
        <li>Номер телефона</li>
        <li>Адрес электронной почты</li>
        <li>Telegram username</li>
        <li>Описание задачи / проекта</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Также мы используем <strong>Яндекс.Метрику</strong> для анализа посещаемости Сайта. Яндекс.Метрика может собирать технические данные (IP-адрес, тип браузера, страницы просмотра) в соответствии с собственной политикой Яндекса.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">3. Как мы используем данные</h2>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>Для связи с вами по поводу вашего запроса</li>
        <li>Для подготовки коммерческого предложения</li>
        <li>Для улучшения качества наших услуг</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Мы <strong>не передаём</strong> ваши данные третьим лицам, не продаём их и не используем в рекламных целях.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">4. Хранение данных</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Данные из форм поступают на электронную почту ottiskcomp@gmail.com. Мы храним переписку в течение срока, необходимого для исполнения договорных обязательств, но не более 3 лет.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">5. Cookie-файлы</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Сайт использует cookie-файлы для работы Яндекс.Метрики и сохранения ваших настроек (тема оформления, язык). Cookie не содержат личных данных.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Вы можете отключить cookie в настройках браузера, однако некоторые функции Сайта могут работать некорректно.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">6. Права пользователя</h2>
      <p className="text-muted-foreground leading-relaxed mb-2">Вы вправе:</p>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>Запросить информацию о хранящихся данных</li>
        <li>Потребовать исправления или удаления данных</li>
        <li>Отозвать согласие на обработку данных</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Для реализации прав обратитесь по адресу: <a href="mailto:ottiskcomp@gmail.com" className="text-primary underline">ottiskcomp@gmail.com</a>
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">7. Изменения политики</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Мы оставляем за собой право обновлять настоящую Политику. Актуальная версия всегда доступна на этой странице.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">8. Контакты</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        По вопросам, связанным с обработкой персональных данных, обращайтесь:<br />
        Email: <a href="mailto:ottiskcomp@gmail.com" className="text-primary underline">ottiskcomp@gmail.com</a><br />
        Telegram: <a href="https://t.me/ottisk_lab" target="_blank" rel="noopener noreferrer" className="text-primary underline">@ottisk_lab</a>
      </p>
    </>
  );
}

function PrivacyEn() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-foreground">Privacy Policy & Personal Data Processing</h1>

      <p className="text-muted-foreground text-sm mb-6">Last updated: May 2026</p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">1. General</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        This Privacy Policy describes how the OTTISK team ("we", "us", "our") collects, uses and protects personal data of users of <strong>ottisk.vercel.app</strong> (the "Site").
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        By using the Site or submitting the contact form, you agree to this Policy.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">2. Data We Collect</h2>
      <p className="text-muted-foreground leading-relaxed mb-2">When submitting the contact form, we receive:</p>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>Full name</li>
        <li>Phone number</li>
        <li>Email address</li>
        <li>Telegram username</li>
        <li>Project / task description</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        We also use <strong>Yandex.Metrica</strong> for site analytics. Yandex.Metrica may collect technical data (IP address, browser type, page views) in accordance with Yandex's own policy.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">3. How We Use Data</h2>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>To contact you regarding your request</li>
        <li>To prepare a commercial offer</li>
        <li>To improve our services</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        We <strong>do not share</strong> your data with third parties, sell it or use it for advertising.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">4. Data Retention</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Form submissions are delivered to ottiskcomp@gmail.com. We retain correspondence for the period required to fulfil contractual obligations, but no longer than 3 years.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">5. Cookies</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        The Site uses cookies for Yandex.Metrica and to save your preferences (theme, language). Cookies do not contain personal data.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        You can disable cookies in your browser settings; however, some Site features may not work correctly.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">6. Your Rights</h2>
      <p className="text-muted-foreground leading-relaxed mb-2">You have the right to:</p>
      <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
        <li>Request information about stored data</li>
        <li>Request correction or deletion of data</li>
        <li>Withdraw consent to data processing</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mb-4">
        To exercise your rights, contact us at: <a href="mailto:ottiskcomp@gmail.com" className="text-primary underline">ottiskcomp@gmail.com</a>
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">7. Policy Changes</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        We reserve the right to update this Policy. The current version is always available on this page.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3 text-foreground">8. Contact</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        For questions about personal data processing:<br />
        Email: <a href="mailto:ottiskcomp@gmail.com" className="text-primary underline">ottiskcomp@gmail.com</a><br />
        Telegram: <a href="https://t.me/ottisk_lab" target="_blank" rel="noopener noreferrer" className="text-primary underline">@ottisk_lab</a>
      </p>
    </>
  );
}
