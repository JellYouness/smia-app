'use strict';
exports.__esModule = true;
exports.routesConfig = void 0;
var api_routes_1 = require('@common/defs/api-routes');
var routes_1 = require('@common/defs/routes');
var apiUrl = process.env.NEXT_PUBLIC_API_URL;
var nextI18NextConfig = require('next-i18next.config.js');

const cleanedAppUrl = process.env.NEXT_PUBLIC_APP_URL?.split('#')[0].trim();

exports.routesConfig = {
  dynamicRoutes: [
    {
      name: 'articles',
      apiEndpoint: apiUrl + api_routes_1['default'].Posts.ReadAll,
      priority: 0.8,
      changefreq: 'daily',
      itemsArray: function (response) {
        return response.data;
      },
      urlGenerator: function (item) {
        return routes_1['default'].Users.UpdateOne.replace('{id}', item.id);
      },
      lastModGenerator: function (item) {
        return new Date(item.updatedAt).toISOString().split('T')[0];
      },
    },
    {
      name: 'users',
      apiEndpoint: apiUrl + api_routes_1['default'].Users.ReadAll,
      priority: 0.8,
      changefreq: 'daily',
      itemsArray: function (response) {
        return response.data;
      },
      urlGenerator: function (item) {
        return routes_1['default'].Posts.ReadOne.replace('{id}', item.id);
      },
      lastModGenerator: function (item) {
        return new Date(item.updatedAt).toISOString().split('T')[0];
      },
      childRoutes: [
        {
          name: 'articlesByUser',
          apiEndpoint: function (item) {
            return apiUrl + api_routes_1['default'].Posts.ReadAllByUser.replace('{userId}', item.id);
          },
          priority: 0.8,
          changefreq: 'daily',
          itemsArray: function (response) {
            return response.data;
          },
          urlGenerator: function (parentItem, childItem) {
            return routes_1['default'].Posts.ReadAllByUser.replace('{userId}', parentItem.id);
          },
          lastModGenerator: function (item) {
            return new Date(item.updatedAt).toISOString().split('T')[0];
          },
        },
      ],
    },
  ],
  excludedRoutes: ['/permissions/*'], // Exclude routes that are not part of the sitemap

  languages: nextI18NextConfig.i18n.locales.map(function (locale) {
    const code = locale;
    const url =
      locale === nextI18NextConfig.i18n.defaultLocale
        ? cleanedAppUrl
        : cleanedAppUrl + '/' + locale; // If the locale is the default locale, don't add the locale to the URL else add the locale to the URL
    return {
      code: code,
      url: url,
    };
  }),
};
