import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export class PrevisaoTempo {
  static async getAll(req, res) {
    const response = axios
      .get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=Paris`
      )
      .then(function (response) {
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
