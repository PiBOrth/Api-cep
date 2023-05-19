//Função para mostrar os estados no select
$.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`, function( data ) {
            html = "<option value=\"\" disabled selected>Selecione um estado</option>";
            data.forEach(element => {
                html += `<option value="${element.sigla}">${element.nome}</option>`
            });
            $('#uf').html(html)
});
//Funções para mudar de página
function mostrarTabCEP(){
    $('.tab-cep').addClass("active");
    $('.tab-endereco').removeClass("active");
    $('.result').html("")
}
function mostrarTabEndereco(){
    $('.tab-endereco').addClass("active");
    $('.tab-cep').removeClass("active");
    $('.result').html("")
}
//Função para máscara do CEP
$(document).ready(function() {
    $('#cep').inputmask('99999-999');
});
//Função para ver se o input do CEP tem os 9 caracteres. 8 do CEP e o -.
function validaCEP(){
    let el = $('#cep')
    if(el.val().replace('_', '').length == 9){
        $('#confirmar').removeAttr('disabled');
    } else {
        $('#confirmar').prop('disabled', true);
    }
} 
//Função para ver se input do Logradouro tem pelo menos um 1 caractere
function validaFormLogradouro(){
    if(todosCamposPreenchidos()){
        $('#confirmar2').removeAttr('disabled');
    } else {
        $('#confirmar2').prop('disabled', true);
    }
} 
//Verifica todos os campos do From de Logradouro estão preenchidos
function todosCamposPreenchidos(){
    let el = $('#logradouro')
    let uf = ($('#uf').val() != '') && (typeof $('#uf').val() != 'null')
    let cidade = ($('#cidade').val() != '') && (typeof $('#cidade').val() != 'object')
    return el.val().length > 0 && uf && cidade
}
// Funções para completar o form
function pesquisarCidades(){
    uf = $('#uf').val();
    $.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`, function( data ) {
        html = "<option value=\"\" disabled selected>Selecione uma cidade</option>";
        data.forEach(element => {
            html += `<option value="${element.nome}">${element.nome}</option>`
        });
        $('#cidade').html(html)
    });
    $('#cidade').val('')
    validaFormLogradouro()
}
// Funções das APIs
function pesquisarCEP(){
    cep = $('#cep').val();
    $.get(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
        console.log(data)
        if(Object.keys(data).length > 1){
            html = "";
            for (let chave in data) {
                html += `<li><b>${chave.toUpperCase()}</b>: ${data[chave]}</li>`;
            }
            $('.result').html(html)  
        } else {
            $('.result').html("Nenhum registro encontrado")
        }  
    });
}

function pesquisarEndereco(){
    uf = $('#uf').val();
    cidade = $('#cidade').val();
    logradouro = $('#logradouro').val();
    $.get(`https://viacep.com.br/ws/${uf}/${cidade}/${logradouro}/json/`, function(data) {
        if(data.length > 0){
            html = "";
            data.forEach(element => {
                html += '<tr>'
                for (let chave in element) {
                    html += `<td>${element[chave]}</td>`;
                }
                html += '</tr>'
            });
            $('.result').html(html)
        } else {
            $('.result').html("Nenhum registro encontrado")
        }
    });
}