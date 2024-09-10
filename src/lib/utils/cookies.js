import {
  setCookie,
  deleteCookie,
  getCookie
} from 'cookies-next';

export function set_cookie(key, value, req, res) {
  setCookie(
    key,
    value,
    {
      req,
      res,
      maxAge: 60 * 60 * 24 * Number(process.env.SESSION_COOKIE_EXPIRE_DAYS),
      httpOnly: true,
      secure: true,
      overwrite: true,
      domain: (
        (process.env.NODE_ENV === "production")
          ? `.${process.env.NEXT_PUBLIC_HOST}`
          : null
      )
    }
  );
}

export function set_client_cookie(key, value, req, res) {
  setCookie(
    key,
    value,
    {
      req,
      res,
      maxAge: 60 * 60 * 24 * Number(process.env.SESSION_COOKIE_EXPIRE_DAYS),
      httpOnly: false,
      secure: true,
      overwrite: true,
      domain: (
        (process.env.NODE_ENV === "production")
          ? `.${process.env.NEXT_PUBLIC_HOST}`
          : null
      )
    }
  );
}

export function delete_cookie(key, req, res) {
  deleteCookie(
    key,
    {
      req,
      res,
      domain: (
        (process.env.NODE_ENV === "production")
          ? `.${process.env.NEXT_PUBLIC_HOST}`
          : null
      )
    }
  );
}


export function get_cookie(key, req, res) {
  return getCookie(key, {
    req, res,
    domain: (
      (process.env.NODE_ENV === "production")
        ? `.${process.env.NEXT_PUBLIC_HOST}`
        : null
    )
  });
}