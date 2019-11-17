import { IncomingMessage, ServerResponse } from "http"

type TrustFn = (remoteAddress: string | undefined) => boolean

export interface Options {
  trustProxy: boolean | TrustFn
}

export const getHost = (
  trustFn: TrustFn,
  req: IncomingMessage
): string | undefined => {
  let host = req.headers["x-forwarded-host"] as string | undefined
  if (!host || !trustFn(req.connection.remoteAddress)) {
    host = req.headers["host"]
  } else if (host.indexOf(",") !== -1) {
    // Note: X-Forwarded-Host is normally only ever a
    //       single value, but this is to be safe.
    host = host.slice(0, host.indexOf(",")).trimRight()
  }
  return host
}

const host = <I extends IncomingMessage, R extends ServerResponse>(
  innerListener: (req: I & { host?: string }, res: R) => void,
  options?: Partial<Options>
): ((req: I, res: R) => void) => {
  const _options: Options = { trustProxy: false, ...options }
  const trustFn =
    typeof _options.trustProxy === "function"
      ? _options.trustProxy
      : ((() => _options.trustProxy) as TrustFn)
  const _getHost = getHost.bind(null, trustFn)

  return (req, res) =>
    innerListener(Object.assign(req, { host: _getHost(req) }), res)
}

export default host
