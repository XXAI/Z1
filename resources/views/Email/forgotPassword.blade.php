{{-- @component('mail::message')
# Atención

Por favor de clic en el boton para resetear su password, si no lo redirecciona, favor de copiar y pegar el link en su navegador.

@component('mail::button', ['url' => 'http://localhost:4200/#/update-password?token='.$token])
Cambiar password
@endcomponent

Muchas gracias,<br>
(SIRH) Sistema de Información de Recursos Humanos.
@endcomponent --}}
<style>


    .centrado
    {
        text-align: center;
    }

    .falta
    {
        background-color: #EFEFEF;
    }
    .tamano
    {
        padding:0px 20px 0px 20px;
    }

    @page {
        margin: 100px 35px 0px 50px;

    }

    .encabezados
    {
        font-size: 7pt;
        text-align: center;
    }

    body{
        margin: 10px 0px 140px 5px;
    }

    header {
        position: fixed;
        width:100%;
        top: -80px;
        left: 0px;
        right: 0px;
        height: 100%;


    }

    .footer {
        position: fixed;
        bottom: 90px;
        left: 0px;
        right: 0px;
        height: 50px;
    }

    .marco {
        border: black 5px double;
        border-radius: 5px;
        padding: 2px 5px;
    }
    .espacio {
        white-space: normal;
    }

</style>

<header>
    <div>

        <table width="100%">
            <tbody>
                <tr>
                    <td>
                        <div class="centrado datos">
                            <a href="http://sirh.saludchiapas.gob.mx/#/update-password?token={{$token}}"><img src='http://sirh.saludchiapas.gob.mx/assets/ResetPass_1024px.png' alt="Cambiar Contraseña"/></a>
                            {{-- <img src='../aviso.png' width="100px"/> --}}
                        </div>
                    </td>
                </tr>
               <!--<tr>
                <td colspan='2' class='datos'>UNIDAD EXPEDIDORA: OFICINA CENTRAL</td>
                <td colspan='2' class='datos'>TIPO DE TRABAJADOR: </td>
               </tr>-->
            </tbody>
        </table>
    </div>
</header>

