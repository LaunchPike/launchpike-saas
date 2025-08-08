interface NavigationItem {
  name: string;
  href: string;
};

export default function Footer({ footerNavigation }: {
  footerNavigation: {
    app: NavigationItem[]
    company: NavigationItem[]
  }
}) {
  return (
    <div className='mx-auto mt-6 max-w-7xl px-6 lg:px-8 dark:bg-boxdark-2'>
      <footer
        aria-labelledby='footer-heading'
        className='relative border-t border-gray-900/10 dark:border-gray-200/10 py-24 sm:mt-32'
      >
        <h2 id='footer-heading' className='sr-only'>
          Footer
        </h2>
        <div className='flex items-start justify-between mt-10 gap-20'>
          <div>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>LaunchPike</h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs'>
              Full-featured OpenSaaS template for quickly launching your project.
            </p>
          </div>
          <div className='flex gap-20'>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>App</h3>
              <ul role='list' className='mt-6 space-y-4'>
                {footerNavigation.app.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white'>Company</h3>
              <ul role='list' className='mt-6 space-y-4'>
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className='text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white'>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className='mt-10 pt-8 border-t border-gray-900/10 dark:border-gray-200/10'>
          <p className='text-sm text-gray-600 dark:text-gray-400 text-center'>
            © 2024 LaunchPike. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
