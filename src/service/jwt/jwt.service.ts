export interface JwtService {
  sign(dto: any): string;
  decode(token: string): any;
  verify(token: string): any;
}