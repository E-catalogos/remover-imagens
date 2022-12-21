# Remover imagens

## Objetivo: mover imagens inutilizadas de um diretório para o outro.

> **Nota:** A **última atualização** foi feita em `21/12/2022`.

## Modo de usar

### Execução
 ```
  1. Baixe o arquivo .zip e descompacte-o
  2. cd remover-imagens
  3. npm install
  4. node app.mjs
 ```

Para usar o sistema, é necessário ter previamente definido:

- Diretório de **origem**
  > Local onde estão as imagens a serem movidas.
 
 - Diretório de **destino**
   > Local para onde as imagens serão movidas.
  
  - Arquivo JSON com o nome das imagens que estão sendo utilizadas.
    > **Exemplo:** Arquivo *imagensUtilizadas.json*
    ``` json
      [
        "2463_1655917133a2s5vuvo5t5h37mh292xzt.png",
        "2463_1655917133wi2xyf6bxuqmucgtyezn3t.png",
        "2463_1655917137q9rxjvoubrhe4fpinqillk.png",
      ]
    ```
    
  ### Demonstração 
  
  ![enter image description here](https://github.com/E-catalogos/remover-imagens/blob/main/demonstracao.png?raw=true)
 




