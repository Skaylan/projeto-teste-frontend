export function convertDatetime(dateTimeString: Date) {
  // Criar um objeto de data a partir da string fornecida
  let data = new Date(dateTimeString);

  // Array de nomes de meses
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez"
  ];

  // Obter o dia, mês e ano da data
  let dia = data.getDate();
  let mes = meses[data.getMonth()];
  let ano = data.getFullYear();

  // Formatar a data como desejado
  let dataFormatada = `${dia} de ${mes} de ${ano}`;

  return dataFormatada;
}