const routesConfig = require('./sitemap-config/dist/sitemap-config.js');

const fetchedDynamicRoutes = async () => {
  const fetchRoutes = async (routes) => {
    return Promise.all(
      routes.map(async (route) => {
        const data = await fetch(route.apiEndpoint).then((res) => res.json());

        const items = await Promise.all(
          route.itemsArray(data).map(async (parentItem) => {
            const loc = route.urlGenerator(parentItem);
            const lastmod = route.lastModGenerator(parentItem);
            const alternateRefs = routesConfig.routesConfig.languages.map((lang) => ({
              href: lang.url,
              hreflang: lang.code,
            }));

            const childItems = [];
            if (route.childRoutes) {
              const childPromises = route.childRoutes.map(async (childRoute) => {
                const childData = await fetch(childRoute.apiEndpoint(parentItem)).then((res) =>
                  res.json()
                );

                return Promise.all(
                  childRoute.itemsArray(childData).map(async (childItem) => ({
                    loc: childRoute.urlGenerator(parentItem),
                    lastmod: childRoute.lastModGenerator(childItem),
                    alternateRefs: routesConfig.routesConfig.languages.map((lang) => ({
                      href: lang.url,
                      hreflang: lang.code,
                    })),
                    priority: childRoute.priority,
                    changefreq: childRoute.changefreq,
                  }))
                );
              });

              const childItemsArray = await Promise.all(childPromises);
              childItems.push(...childItemsArray.flat());
            }

            return [
              {
                loc,
                lastmod,
                alternateRefs,
                priority: route.priority,
                changefreq: route.changefreq,
              },
              ...childItems,
            ];
          })
        );

        return items.flat();
      })
    );
  };

  const dynamicRoutes = await fetchRoutes(routesConfig.routesConfig.dynamicRoutes);
  const resolvedRoutes = await Promise.all(dynamicRoutes);
  return resolvedRoutes.flat();
};

const exlude = routesConfig.routesConfig.excludedRoutes;
const additionalPaths = async () => {
  const dynamicRoutes = await fetchedDynamicRoutes();
  const resolvedRoutes = await Promise.all(dynamicRoutes);
  return resolvedRoutes.flat().map((path) => ({
    loc: path.loc,
    lastmod: path.lastmod,
    changefreq: path.changefreq,
    priority: path.priority,
    alternateRefs: path.alternateRefs,
  }));
};

const cleanedAppUrl = process.env.NEXT_PUBLIC_APP_URL?.split('#')[0].trim();

module.exports = {
  siteUrl: cleanedAppUrl || 'http://localhost:3000',
  generateRobotsTxt: true, // (optional)
  additionalPaths,
  exclude: exlude,
  alternateRefs: routesConfig.routesConfig.languages.map((lang) => ({
    href: lang.url,
    hreflang: lang.code,
  })),
};
