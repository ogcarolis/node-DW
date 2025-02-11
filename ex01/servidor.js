import http from "http";
import { URL } from "url";
import { readFileSync } from "fs";
import { readFile } from "fs/promises";

export const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname;

  switch (path) {
    case "/teste":
      res.end("Teste");
      break;
    case "/nome":
      const nome = url.searchParams.get("usuario");
      res.end(`Olá ${nome}!`);
      break;
    case "/arquivosync":
      const arquivo = readFileSync("ex01/texto.txt", "utf-8");
      res.end(`Arquivo: ${arquivo}`);
      break;
    case "/arquivoasync":
      const arquivoa = readFile("ex01/texto.txt").then((text) => {
        res.end(text);
      });
      break;
  }
});
