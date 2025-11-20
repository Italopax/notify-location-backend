export class DateUtilHelper {
  public static getNow(): string {
    const now = new Date();
    const hoursFormmated = now.toLocaleTimeString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      hour12: false,
    });

    return hoursFormmated;
  }
}