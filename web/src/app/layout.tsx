import '~/styles/globals.css'

import { Metadata } from 'next'
import LocalFont from 'next/font/local'
import Image from 'next/image'
import Navbar from '~/components/Navbar'
import { siteConfig } from '~/config/site'
<<<<<<< HEAD
import ThemeProvider from '~/context/useTheme'
=======
import { StoreProvider } from '~/context/useStore'
import { cn } from '~/utils/classNames'
>>>>>>> web

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ['docker', 'compose.yml', 'devops'],
  authors: [
    {
      name: 'profclems',
      url: 'https://github.com/profclems'
    }
  ],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/icons/icon.png',
    apple: '/icons/icon.png'
  },
  manifest: `/manifest.json`
}

const Satoshi = LocalFont({
  src: [{ path: './Satoshi-Variable.woff2', style: 'normal' }],
  variable: '--font-satoshi'
})

const Lobster = LocalFont({
  src: [{ path: './lobster.ttf', style: 'normal' }],
  variable: '--font-lobster'
})

const JetbrainsMono = LocalFont({
  src: [
    { path: './jetbrainsmono.ttf', style: 'normal' },
    { path: './jetbrainsmono-italic.ttf', style: 'italic' }
  ],
  variable: '--font-mono'
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={cn(
        'bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white',
        Satoshi.variable,
        Lobster.variable,
        JetbrainsMono.variable
      )}
    >
      <head />
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
        <ThemeProvider>
          <main className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
            <div className={cn('relative')}>
              <div className="fixed inset-0">
                <Image
                  src="/images/beams-2.png"
                  alt="Background parttern"
                  loading="eager"
                  fill
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
              </div>
<<<<<<< HEAD
              <div className="relative inset-0 z-[1] min-h-screen w-full">{children}</div>
=======
              <Navbar className={cn('sticky inset-x-0 top-0 z-[4] bg-white/90 dark:bg-neutral-800/90')} />
              <div className="relative inset-0 z-[3] min-h-screen w-full">{children}</div>
>>>>>>> web
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
