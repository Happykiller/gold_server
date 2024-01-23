export interface BddService {
  test(): Promise<boolean>;
}