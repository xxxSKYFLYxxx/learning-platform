/**
 * Контент уроков в формате Markdown.
 * Ключ — slug курса + индекс модуля + индекс урока (например "js_0_0")
 */

export const lessonContent: Record<string, string> = {
  // ═══════════════════════════════════════════════════════════
  // ОСНОВЫ JAVASCRIPT
  // ═══════════════════════════════════════════════════════════
  js_0_0: `
# Что такое JavaScript

**JavaScript** – это язык программирования, который изначально создавался для оживления страниц в браузере. Сегодня он работает везде: в браузере, на сервере (Node.js), в мобильных приложениях, в умных устройствах.

![Программирование](https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800)

## Где используется JavaScript

- **Фронтенд** – интерактивные сайты и веб-приложения (Яндекс, ВКонтакте, Авито)
- **Бэкенд** – серверы и API через Node.js
- **Мобильная разработка** – React Native, Ionic
- **Десктоп** – Electron (VS Code, Discord, Telegram Desktop)
- **Игры** – HTML5 игры в браузере

## Первая программа

Откройте консоль браузера (F12 → Console) и напишите:

\`\`\`javascript
console.log("Привет, мир!");
\`\`\`

Поздравляю – вы только что выполнили свой первый JavaScript-код. Функция \`console.log\` выводит сообщение в консоль разработчика.

## Маленький эксперимент

Попробуйте посчитать что-то прямо в консоли:

\`\`\`javascript
console.log(2 + 2);          // 4
console.log("при" + "вет");  // "привет"
console.log(10 * 365);       // 3650 – количество часов в году
\`\`\`

> **Важно:** JavaScript не требует установки чего-либо для начала. Он уже встроен в каждый браузер – Chrome, Firefox, Safari, Yandex Browser.

## Что дальше

В следующих уроках мы:

1. Настроим удобную среду разработки – VS Code
2. Изучим переменные и типы данных
3. Напишем первые функции
4. Создадим интерактивные элементы на странице

Главное правило обучения программированию: **пишите код руками**. Не копируйте примеры – перепечатывайте их и экспериментируйте.
`.trim(),

  js_0_1: `
# Настройка рабочего окружения

Программисту нужны два инструмента: **редактор кода** и **среда исполнения**. Установим VS Code и Node.js.

## Visual Studio Code

VS Code – бесплатный редактор от Microsoft, самый популярный в мире разработки.

1. Скачайте с [code.visualstudio.com](https://code.visualstudio.com)
2. Установите как обычную программу
3. Запустите

### Полезные расширения

В разделе Extensions (\`Ctrl+Shift+X\`) установите:

| Расширение | Зачем |
|---|---|
| **Prettier** | Автоформатирование кода |
| **ESLint** | Подсвечивает ошибки |
| **Russian Language Pack** | Русский интерфейс |
| **Live Server** | Запуск HTML в браузере одной кнопкой |

## Node.js

Node.js позволяет запускать JavaScript вне браузера – прямо в терминале.

\`\`\`bash
# Проверьте версию (должна быть 20+)
node --version
\`\`\`

Если Node нет – скачайте с [nodejs.org](https://nodejs.org) (LTS-версию).

## Первый файл

Создайте папку \`my-first-js\` и в ней файл \`hello.js\`:

\`\`\`javascript
const name = "Иван";
console.log(\`Привет, \${name}!\`);

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log(\`Сумма: \${sum}\`);
\`\`\`

Запустите в терминале:

\`\`\`bash
node hello.js
\`\`\`

Вывод:

\`\`\`
Привет, Иван!
Сумма: 15
\`\`\`

## Горячие клавиши VS Code

- \`Ctrl+S\` – сохранить
- \`Ctrl+\`\` – открыть терминал
- \`Ctrl+P\` – быстрый поиск файла
- \`Ctrl+/\` – закомментировать строку
- \`Alt+↑/↓\` – переместить строку
- \`Shift+Alt+↓\` – продублировать строку

> **Совет:** Сразу привыкайте к горячим клавишам. Через месяц вы будете писать код в два раза быстрее.
`.trim(),

  js_0_2: `
# Переменные: var, let, const

Переменная – это **именованный контейнер** для данных. В JavaScript есть три способа их объявлять.

## const – константа

Используется, когда значение **не будет меняться**. Это 95% случаев.

\`\`\`javascript
const PI = 3.14159;
const userName = "Анна";
const courses = ["JS", "React", "Python"];

PI = 4; // ❌ TypeError: Assignment to constant variable
\`\`\`

## let – изменяемая переменная

Используется, когда значение **будет меняться** – например, счётчик или флаг.

\`\`\`javascript
let count = 0;
count = count + 1;
count += 1;     // короткая запись
count++;        // ещё короче

let isLoading = true;
isLoading = false;
\`\`\`

## var – устаревший способ

\`var\` существовал до 2015 года. **Не используйте его в новом коде** – у него странные правила области видимости.

\`\`\`javascript
// Так писали в 2010 году. Сегодня — нет.
var x = 10;
\`\`\`

## Правила именования

- Только латинские буквы, цифры, \`$\` и \`_\`
- Не начинаются с цифры
- Регистрозависимые: \`userName\` ≠ \`username\`
- camelCase для переменных: \`firstName\`, \`isActive\`
- SCREAMING_SNAKE_CASE для констант: \`MAX_USERS\`, \`API_URL\`

\`\`\`javascript
const firstName = "Иван";      // ✅
const first_name = "Иван";     // ⚠️ работает, но не принято в JS
const 1name = "Иван";          // ❌ синтаксическая ошибка
const className = "btn";       // ✅ (class — зарезервированное слово, classNm нельзя)
\`\`\`

## Практика

Напишите код, который вычисляет, сколько секунд в неделе:

\`\`\`javascript
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

const secondsInWeek =
  SECONDS_IN_MINUTE *
  MINUTES_IN_HOUR *
  HOURS_IN_DAY *
  DAYS_IN_WEEK;

console.log(secondsInWeek); // 604800
\`\`\`

> **Главное правило:** всегда начинайте с \`const\`. Меняйте на \`let\` только когда поймёте, что значение точно будет меняться.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // REACT
  // ═══════════════════════════════════════════════════════════
  react_0_0: `
# Что такое React и Virtual DOM

**React** – библиотека от Meta (бывший Facebook) для построения пользовательских интерфейсов. Создана в 2013 году, сегодня используется в Яндекс.Маркете, ВКонтакте, Авито, Wildberries и тысячах других продуктов.

![React код](https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800)

## Зачем нужен React

Представьте: у вас есть страница с кнопкой "Лайк". При клике число лайков должно увеличиваться. На чистом JavaScript:

\`\`\`javascript
const button = document.querySelector('.like-button');
const counter = document.querySelector('.counter');
let likes = 0;

button.addEventListener('click', () => {
  likes++;
  counter.textContent = likes;
});
\`\`\`

На каждое изменение мы **вручную** находим элемент и обновляем его. На большом приложении это превращается в хаос.

В React всё проще:

\`\`\`jsx
function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes}
    </button>
  );
}
\`\`\`

Вы описываете **что должно быть на экране**, React сам решает **как это обновить**.

## Virtual DOM

DOM (Document Object Model) – дерево HTML-элементов в браузере. Работа с ним медленная.

React хранит **виртуальную копию** этого дерева в памяти. Когда состояние меняется:

1. React создаёт **новое виртуальное дерево**
2. Сравнивает его со **старым** (алгоритм diffing)
3. Обновляет в реальном DOM **только то, что изменилось**

> Это называется **reconciliation** – согласование. Благодаря этому React работает быстро даже на сложных интерфейсах.

## Компоненты – строительные блоки

В React всё – компоненты. Маленькие, переиспользуемые, изолированные.

\`\`\`jsx
// Простой компонент-кнопка
function PrimaryButton({ text, onClick }) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {text}
    </button>
  );
}

// Используем компонент
<PrimaryButton text="Купить" onClick={handleBuy} />
<PrimaryButton text="В избранное" onClick={handleFavorite} />
\`\`\`

## Что вам понадобится

- Знание HTML и CSS – базовое
- JavaScript ES6+ – обязательно (arrow functions, destructuring, modules)
- Node.js 20+ установлен
- Любимый редактор кода (VS Code)

В следующем уроке мы создадим первый React-проект и напишем компонент с нуля.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // TYPESCRIPT
  // ═══════════════════════════════════════════════════════════
  ts_0_0: `
# Зачем нужен TypeScript

JavaScript – язык **с динамической типизацией**. Переменная может содержать что угодно – строку, число, функцию, объект. Это даёт гибкость, но порождает ошибки.

## Боль JavaScript

\`\`\`javascript
function calculateTotal(price, quantity) {
  return price * quantity;
}

calculateTotal("100", 5);  // "100100100100100" – оп-па
calculateTotal(100);       // NaN
calculateTotal();          // NaN
\`\`\`

Ошибка проявится только во время работы приложения – когда уже поздно.

## TypeScript к спасению

\`\`\`typescript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

calculateTotal("100", 5);  // ❌ ошибка ещё в редакторе
calculateTotal(100);       // ❌ "Expected 2 arguments, but got 1"
calculateTotal(100, 5);    // ✅ 500
\`\`\`

TypeScript ловит ошибки **до запуска** – прямо в редакторе.

## Что такое TypeScript

- **Надстройка над JavaScript** – любой JS-код является валидным TS-кодом
- **Компилируется в JavaScript** – браузеры не понимают TS напрямую
- **Опенсорсный** – развивается Microsoft с 2012 года
- **Стандарт индустрии** – используется в Slack, Airbnb, Microsoft, Яндексе, Тинькофф

## Базовые типы

\`\`\`typescript
const name: string = "Анна";
const age: number = 25;
const isAdmin: boolean = false;
const colors: string[] = ["red", "green", "blue"];
const user: { name: string; age: number } = { name: "Иван", age: 30 };

// Типы можно не указывать — TS их выведет
const city = "Москва";  // TS знает, что city — string
\`\`\`

## Главные плюсы

| Плюс | Что это значит |
|---|---|
| **Автодополнение** | Редактор знает, какие методы доступны |
| **Рефакторинг** | Переименование – безопасно, ошибок не будет |
| **Документация** | Типы сами по себе документируют код |
| **Меньше багов** | Большинство ошибок ловятся ещё на этапе разработки |

> По исследованию Airbnb, переход на TypeScript предотвращает **38% багов**, которые иначе попали бы в продакшен.

## Когда стоит использовать

- **Большие проекты** – обязательно
- **Командная разработка** – обязательно
- **Долгоживущий код** – обязательно
- **Скрипт на 50 строк** – необязательно (но не помешает)

В следующих уроках мы установим TypeScript, настроим компилятор и начнём писать типизированный код.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // NODE.JS
  // ═══════════════════════════════════════════════════════════
  node_0_0: `
# Node.js: архитектура и event loop

**Node.js** – среда выполнения JavaScript вне браузера, построенная на движке V8 (тот самый, что в Chrome). Создана Райаном Далом в 2009 году.

## Главная фишка Node.js

Node.js использует **однопоточную асинхронную модель**. Вместо того чтобы создавать новый поток на каждое подключение (как PHP или Java), Node обрабатывает все запросы в одном потоке через **event loop**.

\`\`\`javascript
// Этот сервер обрабатывает тысячи запросов в секунду
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('Привет, мир!');
});

server.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
\`\`\`

## Event Loop простыми словами

Представьте ресторан с одним официантом:

1. Официант принимает заказ у столика А
2. Передаёт заказ повару (это **долгая операция**)
3. Вместо ожидания идёт к столику Б принимать заказ
4. Когда повар сообщает "готово!" – официант несёт еду столику А

Точно так же работает Node:

\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Вывод: 1, 4, 3, 2
\`\`\`

### Почему такой порядок?

1. \`console.log('1')\` – синхронный, выполняется сразу
2. \`setTimeout\` – планирует задачу в **macrotask queue**
3. \`Promise.then\` – планирует задачу в **microtask queue**
4. \`console.log('4')\` – синхронный, выполняется сразу
5. После завершения текущего стэка Node берёт сначала **микротаски** (Promise)
6. Потом **макротаски** (setTimeout)

## Чем хорош Node

- **Производительность** – один Node-процесс держит ~10 тысяч одновременных соединений
- **Единый язык** – JS на фронте и на бэке (меньше когнитивной нагрузки)
- **npm** – самый большой репозиторий пакетов в мире (2+ миллиона)
- **Огромное сообщество** – ответ на любой вопрос найдётся за 5 минут

## Чего Node делать не должен

Node плохо подходит для:

- **CPU-нагруженных задач** – обработка видео, машинное обучение (используйте Python или Rust)
- **Тяжёлых вычислений в одном потоке** – Node заблокируется

> Для CPU-задач есть **Worker Threads** – но если основная нагрузка вычислительная, выберите другой инструмент.

## Что дальше

В следующих уроках:
- Модульная система: require vs import
- Работа с файловой системой
- HTTP-сервер с нуля без фреймворков
- Переход к Express.js
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // PYTHON
  // ═══════════════════════════════════════════════════════════
  python_0_0: `
# Почему Python?

**Python** – самый популярный язык программирования в мире (по индексу TIOBE и PYPL). Создан Гвидо ван Россумом в 1991 году с одной целью – **читаемость**.

![Python код](https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800)

## Где используется Python

| Область | Примеры |
|---|---|
| **Web-разработка** | Django, Flask, FastAPI |
| **Data Science** | NumPy, Pandas, Matplotlib |
| **Machine Learning** | TensorFlow, PyTorch, scikit-learn |
| **Автоматизация** | Скрипты для DevOps, парсинг сайтов |
| **Telegram-боты** | aiogram, python-telegram-bot |
| **Game Dev** | Pygame (любительские игры) |

## Сравните: Java vs Python

Вывести "Hello, World" на Java:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
\`\`\`

На Python:

\`\`\`python
print("Hello, World")
\`\`\`

Одна строка против пяти. Это философия Python – **простота**.

## Установка

1. Скачайте с [python.org](https://python.org) (версия 3.12+)
2. На Windows: **обязательно поставьте галочку "Add Python to PATH"**
3. Проверьте в терминале:

\`\`\`bash
python --version
# Python 3.12.0
\`\`\`

## Первая программа

Создайте файл \`hello.py\`:

\`\`\`python
name = input("Как тебя зовут? ")
print(f"Привет, {name}!")

age = int(input("Сколько тебе лет? "))
if age >= 18:
    print("Ты совершеннолетний.")
else:
    print(f"До совершеннолетия осталось {18 - age} лет.")
\`\`\`

Запустите:

\`\`\`bash
python hello.py
\`\`\`

## Главные особенности Python

### 1. Отступы вместо скобок

\`\`\`python
# В Python отступ — это синтаксис, а не оформление
if x > 0:
    print("положительное")
    print("ещё одна строка")
else:
    print("отрицательное или ноль")
\`\`\`

### 2. Динамическая типизация

\`\`\`python
x = 10       # число
x = "текст"  # теперь строка
x = [1, 2]   # теперь список
\`\`\`

### 3. Огромная стандартная библиотека

\`\`\`python
import math
import datetime
import json
import urllib.request

# Скачать страницу
html = urllib.request.urlopen("https://yandex.ru").read()
\`\`\`

> **Принцип Python:** "Должен существовать один – и желательно, только один – очевидный способ сделать это."

## Сколько зарабатывает Python-разработчик в РФ

По данным hh.ru (2025):

- **Junior**: 60-120 тыс ₽
- **Middle**: 150-300 тыс ₽
- **Senior**: 300-500 тыс ₽
- **Data Scientist Senior**: 400-800 тыс ₽

Python – отличный первый язык. Поехали учить.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // GIT
  // ═══════════════════════════════════════════════════════════
  git_0_0: `
# Установка и настройка Git

**Git** – система контроля версий, придуманная Линусом Торвальдсом (создателем Linux) в 2005 году. Без знания Git вас не возьмут даже на стажировку.

## Зачем нужен Git

Представьте проект с папками:

\`\`\`
project_final.zip
project_final_v2.zip
project_final_v2_FIXED.zip
project_final_v2_FIXED_ACTUAL.zip
project_FINAL_THIS_TIME_I_PROMISE.zip
\`\`\`

Знакомо? Git решает эту проблему. Он хранит **всю историю** изменений и позволяет:

- Откатиться к любой версии кода
- Работать в команде, не мешая друг другу
- Видеть, кто и когда изменил каждую строку
- Создавать отдельные ветки для экспериментов

## Установка

### Windows

Скачайте с [git-scm.com](https://git-scm.com/download/win). При установке оставьте все галочки по умолчанию.

### macOS

\`\`\`bash
# Через Homebrew
brew install git

# Или через Xcode Command Line Tools
xcode-select --install
\`\`\`

### Linux

\`\`\`bash
sudo apt install git        # Ubuntu/Debian
sudo dnf install git        # Fedora
\`\`\`

## Первоначальная настройка

Откройте терминал и выполните:

\`\`\`bash
git config --global user.name "Иван Петров"
git config --global user.email "ivan@example.com"
git config --global init.defaultBranch main
\`\`\`

Это **обязательно** – Git будет подписывать ваши коммиты этим именем.

## Полезные настройки

\`\`\`bash
# Цветной вывод
git config --global color.ui auto

# Псевдонимы для частых команд
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --all"

# Теперь можно писать короче
git st                       # вместо git status
git lg                       # красивая история коммитов
\`\`\`

## Проверка установки

\`\`\`bash
git --version
# git version 2.43.0

git config --list
# user.name=Иван Петров
# user.email=ivan@example.com
# ...
\`\`\`

## Минимальный набор команд

В следующих уроках мы детально разберём:

| Команда | Назначение |
|---|---|
| \`git init\` | Создать репозиторий в текущей папке |
| \`git add\` | Добавить файлы в "корзину" для коммита |
| \`git commit\` | Зафиксировать изменения |
| \`git log\` | Посмотреть историю |
| \`git status\` | Что изменилось с последнего коммита |
| \`git push\` | Отправить изменения на сервер |
| \`git pull\` | Забрать изменения с сервера |

> **Совет:** не пытайтесь выучить все команды Git сразу. На практике 90% работы – это 5 команд: \`status\`, \`add\`, \`commit\`, \`push\`, \`pull\`. Остальное приходит с опытом.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // CSS
  // ═══════════════════════════════════════════════════════════
  css_0_0: `
# Box model, display, position

**Box model** – основа основ CSS. Без понимания box model вы не сможете нормально верстать. Разбираем досконально.

## Каждый элемент – коробка

В HTML **всё** – это прямоугольная коробка. У каждой коробки есть 4 уровня:

\`\`\`
┌────────────────────────────────┐
│        margin (внешний)        │
│   ┌────────────────────────┐   │
│   │   border (граница)     │   │
│   │  ┌──────────────────┐  │   │
│   │  │ padding (внутр.) │  │   │
│   │  │  ┌────────────┐  │  │   │
│   │  │  │  content   │  │  │   │
│   │  │  └────────────┘  │  │   │
│   │  └──────────────────┘  │   │
│   └────────────────────────┘   │
└────────────────────────────────┘
\`\`\`

\`\`\`css
.card {
  width: 300px;
  height: 200px;
  padding: 20px;          /* внутренний отступ */
  border: 2px solid red;  /* граница */
  margin: 16px;           /* внешний отступ */
}
\`\`\`

## box-sizing – важнейшее свойство

По умолчанию \`width: 300px\` – это ширина **только контента**. Padding и border добавляются сверху, и реальная ширина становится 344px.

Это контринтуитивно. Поэтому в начале любого CSS пишут:

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

Теперь \`width: 300px\` – это **итоговая ширина**, включая padding и border. Жизнь становится проще в 10 раз.

## display – тип элемента

\`\`\`css
.inline   { display: inline; }     /* в строке, не задаётся width */
.block    { display: block; }      /* во всю ширину родителя */
.flex     { display: flex; }       /* флекс-контейнер */
.grid     { display: grid; }       /* грид-контейнер */
.none     { display: none; }       /* скрыть полностью */
\`\`\`

### Inline vs Block – чем отличаются

| | inline | block |
|---|---|---|
| Ширина | по контенту | 100% родителя |
| Перенос строки до/после | нет | да |
| width/height | игнорируются | работают |
| margin сверху/снизу | игнорируется | работает |
| Примеры | \`<span>\`, \`<a>\`, \`<strong>\` | \`<div>\`, \`<p>\`, \`<h1>\` |

## position – позиционирование

\`\`\`css
.relative {
  position: relative;     /* остаётся в потоке, но можно сместить */
  top: 10px;
  left: 20px;
}

.absolute {
  position: absolute;     /* выпадает из потока */
  top: 0;                 /* относительно родителя с position */
  right: 0;
}

.fixed {
  position: fixed;        /* относительно окна браузера */
  bottom: 20px;
  right: 20px;            /* кнопка "наверх" */
}

.sticky {
  position: sticky;       /* прилипает к краю при скролле */
  top: 0;
}
\`\`\`

## Практика: карточка товара

\`\`\`html
<div class="card">
  <img src="phone.jpg" alt="iPhone 15">
  <h3>iPhone 15 Pro</h3>
  <p class="price">99 990 ₽</p>
  <button>В корзину</button>
</div>
\`\`\`

\`\`\`css
* { box-sizing: border-box; }

.card {
  width: 280px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.card h3 {
  margin: 12px 0 4px;
  font-size: 18px;
}

.card .price {
  font-weight: 700;
  font-size: 22px;
  color: #d4402f;
  margin: 8px 0 16px;
}

.card button {
  width: 100%;
  padding: 12px;
  background: #0f0f0f;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
\`\`\`

> **Запомните:** прежде чем верстать что угодно сложное – проверьте, что вы понимаете box-sizing, display и position. 80% багов вёрстки – из-за этих трёх свойств.
`.trim(),

  // ═══════════════════════════════════════════════════════════
  // NEXT.JS
  // ═══════════════════════════════════════════════════════════
  nextjs_0_0: `
# Next.js 14: что нового в App Router

**Next.js** – самый популярный React-фреймворк, развивается компанией Vercel. С 13-й версии в Next появился **App Router** – новый подход к маршрутизации, основанный на React Server Components.

![Next.js](https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800)

## Зачем нужен Next.js

React – это библиотека UI. Чтобы сделать на нём полноценное приложение, нужно:

- Настроить роутинг
- Настроить SSR (server-side rendering) для SEO
- Настроить сборку (webpack, vite, ...)
- Оптимизировать изображения
- Настроить API endpoints
- Кэширование

**Next.js даёт всё это из коробки**.

## App Router vs Pages Router

В Next до 13 версии был **Pages Router** – файлы в \`/pages\` становятся маршрутами:

\`\`\`
pages/
  index.tsx        → /
  about.tsx        → /about
  blog/[slug].tsx  → /blog/123
\`\`\`

В Next 13+ появился **App Router** – папки в \`/app\`, каждая со своим \`page.tsx\`:

\`\`\`
app/
  page.tsx              → /
  about/page.tsx        → /about
  blog/[slug]/page.tsx  → /blog/123
\`\`\`

Разница не только в структуре – App Router использует **React Server Components**.

## Server Components – главная фишка

В App Router компоненты по умолчанию **серверные**. Они:

- Рендерятся **только на сервере**
- Не отправляют JS-код в браузер
- Могут напрямую обращаться к БД, файловой системе, секретам

\`\`\`tsx
// app/products/page.tsx — это Server Component
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  // Запрос к БД прямо в компоненте — это работает!
  const products = await prisma.product.findMany();

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`

## Когда нужны Client Components

Серверные компоненты не могут использовать:
- \`useState\`, \`useEffect\`, любые хуки
- \`onClick\`, \`onChange\` и другие обработчики событий
- Браузерные API (\`window\`, \`localStorage\`)

Для этого есть **Client Components** – с директивой \`"use client"\`:

\`\`\`tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Кликни! {count}
    </button>
  );
}
\`\`\`

## Структура папок App Router

| Файл | Назначение |
|---|---|
| \`page.tsx\` | Страница маршрута |
| \`layout.tsx\` | Обёртка для всех страниц в папке |
| \`loading.tsx\` | UI пока загружается |
| \`error.tsx\` | UI при ошибке |
| \`not-found.tsx\` | 404 |
| \`route.ts\` | API endpoint |

## Создание проекта

\`\`\`bash
npx create-next-app@latest my-app

# Вопросы установщика:
# ✓ TypeScript? → Yes
# ✓ ESLint? → Yes
# ✓ Tailwind CSS? → Yes
# ✓ src/ directory? → Yes
# ✓ App Router? → Yes
# ✓ Turbopack? → Yes
\`\`\`

Запуск:

\`\`\`bash
cd my-app
npm run dev
\`\`\`

Откройте [localhost:3000](http://localhost:3000).

В следующих уроках мы детально разберём **layouts**, **dynamic routes** и **data fetching паттерны**.
`.trim(),
};

/**
 * Получить контент урока по slug курса + индексу модуля + индексу урока.
 * Если контента нет — возвращает null (на странице отобразится плейсхолдер).
 */
export function getLessonContent(courseSlugPrefix: string, moduleIdx: number, lessonIdx: number): string | null {
  const key = `${courseSlugPrefix}_${moduleIdx}_${lessonIdx}`;
  return lessonContent[key] ?? null;
}
