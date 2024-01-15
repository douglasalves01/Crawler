export function formatarData(data) {
  const dataFormatada = new Date(data);
  const ano = dataFormatada.getFullYear();
  const mes = (dataFormatada.getMonth() + 1).toString().padStart(2, "0");
  const dia = dataFormatada.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
