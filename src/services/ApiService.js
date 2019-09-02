import ApiRepository from "../repositories/ApiRepository";

const API_URL = 'https://univirtus.uninter.com/ava';

export default class ApiService {
    login = async (login,senha) => { 
        try {
            let res = await fetch(`${API_URL}/autenticacao/autenticar`, {
                method: 'POST',
                body: JSON.stringify({login, senha}),
                headers: {
                    'Content-Type':'application/json',
                    'X-UNIVIRTUS-APP':'mobile',
                    'X-UNIVIRTUS-APP-VS':'5.0'
                }});
            return res.json();
        } catch (err) {
            console.log('Error: ', err)
        }
    }
    getCursos = async (token) => { 
        let url = `${API_URL}/sistema/Curso/0/EscolaUsuario/true/?emCurso=true`;
        try {
            let res = await fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }});
            let json = await res.json();
            await ApiRepository.setItem(url,json);
            return json;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getItem(url);
        }
    }
    getDisciplinas = async (idSalaVirtual,idUsuarioCurso,token) => { 
        let url = `${API_URL}/ava/SalaVirtual/${idSalaVirtual}/CursoUsuarioPermissao/true/?emCurso=true&idUsuarioCurso=${idUsuarioCurso}`;
        try {
            let res = await fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }});
            let json = await res.json();
            await ApiRepository.setItem(url,json);
            return json;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getItem(url);
        }
    }
    getSalas = async (id,idSalaVirtualOferta,idSalaVirtualOfertaAproveitamento,token) => { 
        let url = `${API_URL}/ava/SalaVirtualEstrutura/0/TipoOfertaCriptografado/1?id=${id}&idSalaVirtualOferta=${idSalaVirtualOferta}&idSalaVirtualOfertaAproveitamento=${idSalaVirtualOfertaAproveitamento}`;
        try {
            let res = await fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }});
            let json = await res.json();
            await ApiRepository.setItem(url,json);
            return json;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getItem(url);
        }
    }
    getSala = async (idSalaVirtualEstrutura,idSalaVirtualOferta,idSalaVirtualOfertaPai,token) => { 
        let url = `${API_URL}/ava/SalaVirtualAtividade/${idSalaVirtualEstrutura}/SalaVirtualEstruturaAtividadeDesempenho/${idSalaVirtualOferta}?idSalaVirtualOfertaPai=${idSalaVirtualOfertaPai}`;
        try {
            let res = await fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }});
            let json = await res.json();
            await ApiRepository.setItem(url,json);
            return json;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getItem(url);
        }
    }
    getRotas = async (idAtividade,token) => { 
        let url = `${API_URL}/atv/AtividadeItemAprendizagem/${idAtividade}/Atividade?complementar=false`;
        try {
            let res = await fetch(url,{
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                }});
            let json = await res.json();
            await ApiRepository.setItem(url,json);
            return json;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getItem(url);
        }
    }
    getVideos = async (rota,token) => { 
        try {
            const formData = new URLSearchParams();
            if(rota.indexOf('?') != -1)
                rota = rota.split("?")[0];
            formData.append('url', encodeURIComponent(`${rota}?action=getvideos&value=all`));
            let res = await fetch(`${API_URL}/repositorio/SistemaRepositorioRemoto/`,{
                method: 'POST',
                body: formData.toString(),
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }});
            let text = await res.text();
            await ApiRepository.setText(rota,text);
            return text;
        } catch (error) {
            console.log('Error: ', error)
            return await ApiRepository.getText(rota);
        }
    }
}