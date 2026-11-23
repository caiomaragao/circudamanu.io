# O Maravilhoso Parque Digital

Site 100% feito em **HTML, CSS e JavaScript puros** (sem bibliotecas nem frameworks), inspirado na estética alegre, nostálgica e surreal de CGI anos 90 / CD-ROM interativo.

## Como abrir o site
Basta dar um clique duplo no arquivo `index.html` para abrir direto no navegador (ou rodar um servidor local se preferir).

## Como personalizar com seus textos, fotos e vídeos

Tudo o que você precisa editar está em **um único arquivo**: `conteudo.js`.

### 1. Colocando suas fotos
1. Coloque suas imagens (`.jpg`, `.png`, `.webp`) dentro da pasta `assets/imagens/`.
2. Abra `conteudo.js` e preencha o caminho da foto:
   - **Foto da pessoa (Sala 01):** campo `fotoPerfil: "assets/imagens/minha-foto.jpg"`
   - **Fotos da experiência (Sala 02):** campo `imagem: "assets/imagens/exp-1.jpg"`
   - **Fotos da vitrine (Sala 03):** campo `arquivo: "assets/imagens/foto-1.jpg"`

### 2. Colocando seus vídeos
1. Coloque seus vídeos (`.mp4` ou `.webm`) dentro da pasta `assets/videos/`.
2. Em `conteudo.js`, na seção `vitrine.itens`, preencha:
   ```js
   {
     id: "meu-video",
     tipo: "video",
     titulo: "Título do vídeo",
     descricao: "Uma descrição bem legal.",
     arquivo: "assets/videos/meu-video.mp4",
     capa: "assets/imagens/capa-video.jpg", // opcional!
     duracao: "0:35",
     data: "Vídeo #01",
   }
   ```

> **Dica:** Enquanto `arquivo`, `imagem` ou `fotoPerfil` estiverem vazios (`""`), o site gera automaticamente ilustrações e animações retrô em Canvas para você visualizar o layout completo!
