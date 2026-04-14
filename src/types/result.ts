export type Ok<T> = {
  ok: true;
  data: T;
};

export type Err<E extends string = string> = {
  ok: false;
  error: {
    code: E;
    message: string;
  };
};

export type Result<T, E extends string = string> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
  return { ok: true, data };
}

export function err<E extends string>(code: E, message: string): Err<E> {
  return { ok: false, error: { code, message } };
}
