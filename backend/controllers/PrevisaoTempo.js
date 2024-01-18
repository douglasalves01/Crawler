import axios from "axios";
import dotenv from "dotenv";
import { client } from "../db/conn.js";
import { formatarData } from "../helpers/formatarData.js";
dotenv.config();
export class PrevisaoTempo {
  static async getWeatherCity(req, res) {
    const { cidade } = req.query;
    const dataHoje = new Date();
    const data = formatarData(dataHoje);

    // Verificar se já existe um registro para a cidade e data de hoje
    const registroExistente = await client
      .db("previsao-tempo")
      .collection("previsao")
      .findOne({ cidade });

    if (registroExistente) {
      const dataCompara = formatarData(registroExistente.data);
      if (data === dataCompara) {
        // Se o registro já existe, retorna os dados existentes

        return res
          .status(200)
          .json({ message: "já tinha no banco", registroExistente });
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

          await client
            .db("previsao-tempo")
            .collection("previsao")
            .updateOne({ cidade }, { $set: dadosFiltrados });
          return res
            .status(200)
            .json({ message: "Busquei na api", dadosFiltrados });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
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

        await client
          .db("previsao-tempo")
          .collection("previsao")
          .insertOne(dadosFiltrados);
        return res
          .status(200)
          .json({ message: "Busquei na api", dadosFiltrados });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  static async getWeatherCityApi(req, res) {
    const cidade = "Paris";
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

        await client
          .db("previsao-tempo")
          .collection("previsao")
          .insertOne({ cidade }, { $set: dadosFiltrados });
        return res.status(200).json({
          message: "Busquei realizada na api e dados salvados no banco",
          dadosFiltrados,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
}
