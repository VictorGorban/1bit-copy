//* секция Библиотеки c функциями
import * as React from 'react';
import NextTopLoader from 'nextjs-toploader';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { ToastContainer, Slide as SlideTransition } from 'react-toastify';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Topbar from '@components/_global/Topbar'
import InitStores from '@components/_global/InitStores'
//* endof  Наши компоненты

//* секция Стили
import { Exo_2, Roboto, IBM_Plex_Sans } from 'next/font/google'

// стили через import триггерят обновление fast-refresh, а то что в Head - нет. 
// К тому стили через import в продакшене минифицируются и объединяются в один файл.
import 'tippy.js/dist/tippy.css'; // стили из либ должны перезаписываться нашими. Поэтому либы ставить перед index.scss, а не после.
import 'react-date-range/dist/styles.css'; // main css file
// import 'react-date-range/dist/theme/default.css'; // theme css file

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

export const metadata = {
  title: 'Сервер активации приложений'
}

export default function Layout({ children }) {

  return (
    <html id="pageRoot">
      <body className="bg-black py-0 py-md-35 px-0 px-md-40">
        <NextTopLoader />
        <InitStores />
        <main className="d-flex flex-column">
          <Topbar />
          {children}

        </main>
        {/* <Footer /> */}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          theme="colored"
          transition={SlideTransition}
          newestOnTop={true}
          closeOnClick={true}
          closeButton={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  )
}
