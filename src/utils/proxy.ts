export function generateProxyPath(name: string) {
  return new RegExp(`^/api/v[1-9][0-9]?/${name}`);
}
