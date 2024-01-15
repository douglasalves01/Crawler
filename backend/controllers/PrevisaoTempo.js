import axios from "axios";
import dotenv from "dotenv";
import { client } from "../db/conn.js";
import { formatarData } from "../helpers/formatarData.js";
dotenv.config();
export class PrevisaoTempo {
  static async getAll(req, res) {
    const dados = req.query;
    const cidade = "Sao Paulo";
    const dataHoje = new Date();
    const data = formatarData(dataHoje);

    // Verificar se já existe um registro para a cidade e data de hoje
    const registroExistente = await client
      .db("previsao-tempo")
      .collection("previsao")
      .findOne({ cidade });
    console.log(registroExistente);
    if (registroExistente) {
      const dataCompara = formatarData(registroExistente.data);
      if (data === dataCompara) {
        // Se o registro já existe, retorna os dados existentes
        console.log("Registro já existe:", registroExistente);
        return res.status(200).json(registroExistente);
      }
    }
    axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${cidade}`
      )
      .then(async function (response) {
        // handle success
        const dadosFiltrados = {
          cidade: response.data.location.name,
          data: response.data.current.last_updated,
          temperatura: response.data.current.temp_c,
          condicao: {
            texto: response.data.current.condition.text,
            icone: response.data.current.condition.icon,
          },
          vento_kmh: response.data.current.wind_kph,
          humidade: response.data.current.humidity,
          sensacao: response.data.current.feelslike_c,
        };
        console.log(dadosFiltrados);
        await client
          .db("previsao-tempo")
          .collection("previsao")
          .updateOne({ cidade }, { $set: dadosFiltrados });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
}
