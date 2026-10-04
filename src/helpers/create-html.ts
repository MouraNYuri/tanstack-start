export const createHtml = (verificationCode: string) => {
  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Código de Verificação</title>
        <style>
          /* Estilos para garantir a renderização correta */
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          table {
            border-collapse: collapse;
          }

          /* === MEDIA QUERY PARA RESPONSIVIDADE === */
          @media screen and (max-width: 600px) {
            .container {
              width: 100% !important; /* Força o container a ocupar toda a largura */
            }
            .content-padding {
              padding: 20px 15px !important; /* Reduz o padding em telas pequenas */
            }
            .verification-code {
              font-size: 28px !important; /* Diminui o tamanho da fonte do código */
              letter-spacing: 5px !important; /* Reduz drasticamente o espaçamento */
              padding: 15px !important; /* Reduz o padding interno */
            }
            .header-logo {
              padding: 30px 0 20px 0 !important;
            }
          }
        </style>
      </head>
      <body
        style="
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        "
      >
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
        >
          <tr>
            <td align="center" style="padding: 20px 0">
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="600"
                class="container"
                style="border: 1px solid #cccccc; background-color: #ffffff"
              >
                <tr>
                  <td
                    align="center"
                    class="header-logo"
                    style="
                        padding: 40px 0 30px 0; 
                        border-bottom: 1px solid #eeeeee;
                        color: #153643;
                        font-size: 32px;
                        font-weight: bold;
                        text-align: center;
                    "
                  >
                    Federação Internacional de Potência
                  </td>
                </tr>
                <tr>
                  <td class="content-padding" style="padding: 40px 30px">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td
                          style="
                            color: #153643;
                            font-size: 24px;
                            font-weight: bold;
                            text-align: center;
                          "
                        >
                          Código de Verificação
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 20px 0;
                            color: #555555;
                            font-size: 16px;
                            line-height: 24px;
                          "
                        >
                          <p style="margin-top: 20px; text-align: center">
                            Use o código abaixo para realizar o acesso.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 20px 0">
                          <div
                            class="verification-code"
                            style="
                              font-size: 36px;
                              font-weight: bold;
                              letter-spacing: 10px;
                              color: #153643;
                              background-color: #f0f0f0;
                              padding: 15px 25px;
                              border-radius: 5px;
                              display: inline-block;
                            "
                          >
                            ${verificationCode}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            padding: 20px 0;
                            color: #555555;
                            font-size: 14px;
                            line-height: 20px;
                            text-align: center;
                          "
                        >
                          <p style="margin: 20px 0 0 0">
                            Este código expira em 5 minutos.
                          </p>
                          <p style="margin-top: 10px">
                            Se você não solicitou este código, pode ignorar este
                            e-mail com segurança.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr style="background-color: #eeeeee">
                  <td
                    style="
                      padding: 30px;
                      text-align: center;
                      color: #888888;
                      font-size: 12px;
                    "
                  >
                    <p style="margin-bottom: 10px">
                      &copy; 2025 IFPowerbrazil. Todos os direitos reservados - Federação Internacional de Potência - CNPJ 59.375.088/0001-79
                    </p>
                    <p style="margin-bottom: 10px">
                      Rua Barão de Jaceguai, Flores, Manaus - Amazonas, CEP 69058-180
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
`

  return html
}
