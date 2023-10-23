import { useState, type ReactElement, type ReactNode } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

type PageContainerProps = {
  children: ReactNode;
};

const navigation = [
  { name: "Swipe", href: "/" },
  { name: "Likes", href: "/likes" },
  { name: "Stats", href: "/stats" },
];

export default function PageContainer(props: PageContainerProps): ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-w-screen flex min-h-screen flex-col items-center bg-background text-text">
      <header className="flex w-full justify-center shadow-md">
        <nav
          className="relative flex w-4/5 items-center justify-end p-6 lg:w-2/5 lg:justify-center lg:px-8"
          aria-label="Global"
        >
          <div className="absolute left-[4vw] w-8 lg:left-[-4vw] lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pokematch</span>
              <img className="h-8 w-auto" src="/pokematch-192.png" alt="Logo" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden w-full justify-between lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <main className="h-full w-full">{props.children}</main>
    </div>
  );
}
