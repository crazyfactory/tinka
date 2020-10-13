module.exports = {
  title: 'Tinka',
  tagline: 'A dependency-free library to gracefully handle fetch requests.',
  url: 'https://crazyfactory.github.io/tinka',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'crazyfactory', // Usually your GitHub org/user name.
  projectName: 'tinka', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Tinka',
      logo: {
        alt: 'Tinka Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
            to: 'blog',
            label: 'Blog',
            position: 'left'
        },
        {
          href: 'https://github.com/crazyfactory/tinka',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/crazyfactory/tinka',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tinka. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/crazyfactory/tinka/edit/master/docs/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/crazyfactory/tinka/edit/master/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
