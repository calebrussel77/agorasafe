import Link from 'next/link';
import { type FC } from 'react';

import { Accordion } from '@/components/ui/accordion';

import { Image } from '../image';

const FullPageError: FC<{ error: { message: string } }> = ({ error }) => {
  return (
    <>
      <div className="grid h-screen min-h-full bg-white sm:grid-cols-2">
        <div className="flex flex-col">
          <main className="flex flex-grow flex-col bg-white">
            <div className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-6 lg:px-8">
              <div className="flex-shrink-0 pt-10 sm:pt-16">
                <Link href="/" className="inline-flex">
                  <span className="sr-only">Agorasafe</span>
                  <Image
                    className="h-10 w-auto"
                    src="/images/finexs-logo.png"
                    alt="Finexs tombola logo symbol"
                  />
                </Link>
              </div>
              <div className="my-auto flex-shrink-0 py-16 sm:py-32">
                <p className="text-primary-500 text-base font-semibold">501</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Erreur survenue
                </h1>
                <p className="mt-2 w-full max-w-lg text-base text-gray-500">
                  Nous sommes désolé, une erreur est survenue lors de votre
                  précédente action, nous travaillons dessus pour un retour à la
                  normale le plus vite possible.
                </p>

                <Accordion
                  type="single"
                  collapsible
                  className="w-full max-w-md"
                >
                  <Accordion.Item value="item-1">
                    <Accordion.Trigger className="mt-3 rounded-md bg-gray-100 p-2">
                      Developer stack
                    </Accordion.Trigger>
                    <Accordion.Content className="mt-1 max-h-80 w-full max-w-xl overflow-y-auto rounded-md bg-gray-100 p-3 text-gray-500">
                      {error?.message}
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <div className="mt-6">
                  <Link
                    href="#"
                    className="text-primary-500 hover:text-primary-500 text-base font-medium"
                  >
                    Retour en arrière
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </main>
          <footer className="flex-shrink-0 bg-gray-50">
            <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
              <nav className="flex space-x-4">
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-500"
                >
                  Contact Support
                </Link>
                <span
                  className="inline-block border-l border-gray-300"
                  aria-hidden="true"
                />
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-500"
                >
                  Status
                </Link>
                <span
                  className="inline-block border-l border-gray-300"
                  aria-hidden="true"
                />
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-500"
                >
                  Twitter
                </Link>
              </nav>
            </div>
          </footer>
        </div>
        <div className="hidden sm:block">
          <Image
            className="h-full w-full"
            src="https://images.unsplash.com/photo-1470847355775-e0e3c35a9a2c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1825&q=80"
            alt="user not found"
          />
        </div>
      </div>
    </>
  );
};

export { FullPageError };
