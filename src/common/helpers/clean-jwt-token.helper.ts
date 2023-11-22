export function cleanJwtTokenHelper(token: string) {
  return token.replace('Bearer ', '');
}
