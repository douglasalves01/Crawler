import axios from "axios";
import dotenv from "dotenv";
import { client } from "../db/conn.js";
dotenv.config();
export class PrevisaoTempo {
  static async getAll(req, res) {
    axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=Paris`
      )
      .then(async function (response) {
        // handle success
        const dadosFiltrados = {
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
        const insercao = await client
          .db("previsao-tempo")
          .collection("previsao")
          .insertOne(dadosFiltrados);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
}
