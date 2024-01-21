import { Preview } from "@storybook/react";
import * as React from "react";
//* секция Стили
import { Exo_2, Roboto, IBM_Plex_Sans } from 'next/font/google'

// стили через import триггерят обновление fast-refresh, а то что в Head - нет. 
// К тому стили через import в продакшене минифицируются и объединяются в один файл.
import 'tippy.js/dist/tippy.css'; // стили из либ должны перезаписываться нашими. Поэтому либы ставить перед index.scss, а не после.
import 'react-date-range/dist/styles.css'; // main css file

import 'font-awesome/css/font-awesome.min.css';
import 'react-toastify/dist/ReactToastify.css';

import '@assets/scss/index.scss'

//* endof Стили

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto'
})

const exo2 = Exo_2({
  weight: ['700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-exo2'
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--ibm-plex-sans'
})

// Что по факту: Storybook не генерирует истории сам - все их нужно писать заново. 
// Стили и шрифты, которые у меня включены в главный файл nextjs приложения - их тут тоже нет.
// То есть storybook это отдельное приложение с отдельной средой выполнения и контекстом, который нужно настраивать отдельно.
// В итоге ценность библиотеки исключительно в экосистеме плагинов - никакой помощи Storybook не предоставляет -
// всё пишется, обновляется и поддерживается вручную. Хотя впринципе интерфейс весьма удобный, заново такой делать будет долго.
// TODO 2 задачи: 2. Написать истории для всех ts-компонентов, что несложно. 3. Возможная 3 - переписать общие модалки на ts и написать для них истории. И можно релизить.
// TODO написать интерактивность хотя бы. Хоть заполнение что ли. Чтобы было красиво, видно как это работает.


import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from "@storybook/blocks";

const preview: Preview = {
  parameters: {
    toc: true,
    layout: 'centered',
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle /> 
          {/* В любом случае этот шаблон можно настроить для каждой отдельной истории или компонента. */}
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};

export default preview;
