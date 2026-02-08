import { ROUTER_CONSTANTS } from '../constants/api-router.constant';

type UrlOptions = {
  overrideHost?: string;
  params?: string[] | string | number;
  query?: { skip: number; take: number } | Record<string, string | number>;
};

export const createUrl = (url: string, options?: UrlOptions) => {
  let urlResult = url.startsWith('/') ? url : `/${url}`;
  let HOST = ROUTER_CONSTANTS.HOST;

  if (options?.overrideHost) {
    HOST = options.overrideHost;
  }

  if (options?.params) {
    if (Array.isArray(options.params)) {
      options.params.forEach((param) => {
        urlResult += `/${param}`;
      });
    } else {
      urlResult += `/${options.params}`;
    }
  }

  if (options?.query) {
    const queryParams = new URLSearchParams();
    const query = options.query as Record<string, string | number>;
    Object.keys(query).forEach((key) => {
      const value = query[key];
      queryParams.append(key, String(value));
    });
    return `${HOST}${urlResult}?${queryParams.toString()}`;
  }

  ({
    host: HOST,
    URL: urlResult,
  });

  return `${HOST}${urlResult}`;
};
