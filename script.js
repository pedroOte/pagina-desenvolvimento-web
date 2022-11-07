
var black = ('b');
var white = ('w');
var vazio = ('-');

let tabuleiro_inicial = new Array(8);
let direcoes = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}, {x:1, y:1}, {x:1, y:-1}, {x:-1, y:1}, {x:-1, y:-1}];

for(let i = 0; i < 8; i++){
    tabuleiro_inicial[i] = new Array(8);
}

criaTabuleiro();
tabuleiro_inicial = inicializa_tabuleiro(tabuleiro_inicial);
atualiza_tabuleiro(tabuleiro_inicial);

selecionar_modo_jogo(tabuleiro_inicial);

function pontos_partida_atualizar(tabuleiro){
    let pontos_black = 0 ;
    let pontos_white = 0 ;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if (tabuleiro[i][j] == white)
                pontos_white++;
            if (tabuleiro[i][j] == black)
                pontos_black++;
        }
    }
    document.getElementById('pontuacaoPretas').innerHTML = pontos_black;
    document.getElementById('pontuacaoBrancas').innerHTML = pontos_white;
    return {w: pontos_white, b:pontos_black};
}

function criaTabuleiro(){ //cria o tabuleiro vazio no html
    const tabu = document.getElementById('tabuleiro');

    for (let i = 0; i < 8; i++) {
        var element = document.createElement("div");
        element.className="row";
        for (let j = 0; j < 8; j++) {
            var casa =  document.createElement("div");
            casa.className="casa"  
            casa.id=`${i}${j}`
            //tabuleiro_inicial[i-1][j-1]=0;
            element.appendChild(casa);
        }
        tabu.appendChild(element);
    }
}

function selecionar_modo_jogo(matriz_tabuleiro){
    let botao1jogador = document.getElementById('modoMaquina');
    let botao2jogadores = document.getElementById('modoJogador');

    botao1jogador.addEventListener('click', e  =>
    {
        botao1jogador.remove();
        botao2jogadores.remove();
        atualiza_jogadas_validas(white, matriz_tabuleiro, black);
}, {once: true})

    botao2jogadores.addEventListener('click', e  =>
    {
        botao1jogador.remove();
        botao2jogadores.remove();
        atualiza_jogadas_validas(white, matriz_tabuleiro, 0);
    }, {once: true})
}

function atualiza_tabuleiro(matriz_tabuleiro){ //recebe uma matriz de tabuleiro e atualiza o tabuleiro no html colocando as peças

    pontos_partida_atualizar(matriz_tabuleiro);

    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(matriz_tabuleiro[i][j] == white){
                casa = document.getElementById(`${i}${j}`);

                var peca_branca = document.createElement('div');
                peca_branca.className="whiteP";

                if(casa.hasChildNodes()){
                    casa.replaceChildren(peca_branca);
                }
                else{
                    casa.appendChild(peca_branca);
                }
            }
            else if(matriz_tabuleiro[i][j] == black){
                casa = document.getElementById(`${i}${j}`);

                var peca_preta = document.createElement('div');
                peca_preta.className="blackP";
                
                if(casa.hasChildNodes()){
                    casa.replaceChildren(peca_preta);
                }
                else{
                    casa.appendChild(peca_preta);
                }
        }
    }
}
}

function atualiza_jogadas_validas(cor, matriz_tabuleiro, ia){ //recebe o clique no site e retorna um movimento
    if(fim_do_jogo(black, white,matriz_tabuleiro)) {
        let pts_final = pontos_partida(matriz_tabuleiro);
        let vencedor = "Empate!";

        if (pts_final.w > pts_final.b) {
            vencedor = "O jogador da peça branca venceu!";
        }

        if (pts_final.b > pts_final.w) {
            vencedor = "O jogador da peça preta venceu!";
        }
        document.getElementById('vez').innerHTML = vencedor;
        return matriz_tabuleiro; 
    }

    let jogadas_possiveis = jogadas_validas(cor, matriz_tabuleiro);
    

    if(cor == white){
        prox_cor = black;
    }
    else{
        prox_cor = white;
    }


    if(jogadas_possiveis.length == 0){
        atualiza_jogadas_validas(prox_cor, matriz_tabuleiro, ia);
    }

    if(cor == ia){
        let maximizador = true;
        if(ia == black){
            maximizador = false;
        }
        let jogada_ia = minimax(matriz_tabuleiro, 1, cor, maximizador, 1);
        matriz_tabuleiro = mover_peca(cor, jogada_ia.x, jogada_ia.y, matriz_tabuleiro);

        setTimeout(function() {
            atualiza_tabuleiro(matriz_tabuleiro);
        }, 500)

        atualiza_jogadas_validas(prox_cor, matriz_tabuleiro, ia);
    }

    else{
        for(let i = 0; i < jogadas_possiveis.length; i++){

            const casa = document.getElementById(`${jogadas_possiveis[i].x}${jogadas_possiveis[i].y}`)

            const jogada_possivel = document.createElement('div');
            jogada_possivel.className = 'jogada-possivel';

            casa.append(jogada_possivel);

            jogada_possivel.addEventListener('click', e  =>{

                matriz_tabuleiro = mover_peca(cor, jogadas_possiveis[i].x, jogadas_possiveis[i].y, matriz_tabuleiro);

                atualiza_tabuleiro(matriz_tabuleiro);

                remover_jogadas_possiveis();

                atualiza_jogadas_validas(prox_cor, matriz_tabuleiro, ia);
                
            },{once: true});
        }
    }
    return tabuleiro_inicial;
}

function remover_jogadas_possiveis(){
    var jogadas_possiveis = document.getElementsByClassName('jogada-possivel');

    n = jogadas_possiveis.length;

    for(let i = 0; i < n; i++){
        jogadas_possiveis[0].remove()
    }
}

function receber_jogada(){
    matriz_tabuleiro = mover_peca(cor, jogadas_possiveis[i].x, jogadas_possiveis[i].y, matriz_tabuleiro);
    console.log(jogadas_possiveis[i].x);
    console.log(jogadas_possiveis[i].y);
    atualiza_tabuleiro(matriz_tabuleiro);

    atualiza_jogadas_validas(cor, matriz_tabuleiro);
}

function inicializa_tabuleiro (tabuleiro){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){ 
            if((i==3 && j==3) || (i==4 && j==4))
                tabuleiro[i][j] = white
            else if((i==3 && j==4) || (i==4 && j==3))
                tabuleiro[i][j] = black
            else tabuleiro[i][j] = vazio
        }
    }
    return tabuleiro;
}

function jogadas_validas(cor, tabuleiro){

    let jogadas_possiveis = [];

    for(let a = 0; a < 8; a++){
        for(let b = 0; b < 8; b++){
            if(e_valido(cor, a, b, tabuleiro)){
                jogadas_possiveis.push({x: a, y: b});
            }
        }
    }

    return jogadas_possiveis;
}

function pontos_partida(tabuleiro){
    let pontos_black = 0 ;
    let pontos_white = 0 ;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if (tabuleiro[i][j] == white)
                pontos_white++;
            if (tabuleiro[i][j] == black)
                pontos_black++;
        }
    }
    return {w: pontos_white, b:pontos_black};
}

function e_valido(cor, x, y, tabuleiro){
    if(tabuleiro[x][y] != vazio){
        return false;
    }

    let i = 0;
    let j = 0;

    for(let n = 0; n < 8; n++){
        if(esta_no_tabuleiro(x + direcoes[n].x) && esta_no_tabuleiro(y + direcoes[n].y)){
            if (tabuleiro[x + direcoes[n].x][y + direcoes[n].y] != cor && tabuleiro[x + direcoes[n].x][y + direcoes[n].y] != vazio){
                i = x + direcoes[n].x;
                j = y + direcoes[n].y;
                while(esta_no_tabuleiro(i) && esta_no_tabuleiro(j)){
                    if(tabuleiro[i][j] == cor){
                        return true;
                    }
                    i = i + direcoes[n].x
                    j = j + direcoes[n].y
                }
            }
        }
    }
    return false;
}

function mover_peca(cor, x, y, tabuleiro){ //move as pecas na matriz

    let pecas_movidas = [];

    if(e_valido(cor, x, y, tabuleiro)){
        for(let n = 0; n < 8; n++){

            pecas_movidas = [{x: x, y: y}];

            if(esta_no_tabuleiro(x + direcoes[n].x) && esta_no_tabuleiro(y + direcoes[n].y)){
                if (tabuleiro[x + direcoes[n].x][y + direcoes[n].y] != cor && tabuleiro[x + direcoes[n].x][y + direcoes[n].y] != vazio){
                    i = x + direcoes[n].x;
                    j = y + direcoes[n].y;
                    while(esta_no_tabuleiro(i) && esta_no_tabuleiro(j)){
                        if(tabuleiro[i][j] == cor){
                            if(cor == white){
                                for(let k = 0; k < pecas_movidas.length; k++){
                                    tabuleiro[pecas_movidas[k].x][pecas_movidas[k].y] = white;
                                }
                            }
                            else if(cor == black){
                                for(let k = 0; k < pecas_movidas.length; k++){
                                    tabuleiro[pecas_movidas[k].x][pecas_movidas[k].y] = black;
                                }
                            }
                        }
                        pecas_movidas.push({x: i, y: j});
                        i = i + direcoes[n].x
                        j = j + direcoes[n].y
                    }
                }
            }
        }
    }

    return tabuleiro;
}

function print_tabuleiro(tabuleiro){
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            process.stdout.write(tabuleiro[i][j] + ' ');
        }
        process.stdout.write('\n');
    }
}

function esta_no_tabuleiro(x){
    if (x >= 0 && x < 8){
        return true;
    }
    return false;
}

function fim_do_jogo(cor1, cor2, tabuleiro){
    if (jogadas_validas(cor1, tabuleiro).length == 0 && jogadas_validas(cor2, tabuleiro).length == 0){
        console.log('Fim de jogo!');
        return true;
    } return false;
}

function minimax(tabuleiro, nivel, cor, jogador_maximizador, nivel_max){

    if(nivel == 0 || jogadas_validas(cor, tabuleiro).length == 0){
        let pontos = pontos_partida(tabuleiro);
        let pontos_total = pontos.w - pontos.b;
        return pontos_total;
    }

    let valor_jogada;
    let jogada = {x: null, y: null}

    /*let jogador = {'white': 1, 'black': 0}
    let jogador_id = jogador[cor]
    let prox_jogador = Object.keys(jogador)[jogador_id]
    */

    if (cor ==  white){
        prox_jogador = black;
    }
    else if (cor == black){
        prox_jogador = white;
    }

    if(jogador_maximizador){
        let valor_max = -100;
        jogadas_possiveis = jogadas_validas(cor, tabuleiro);

        for(let i = 0; i < jogadas_validas(cor, tabuleiro).length; i++){
            let prox_mov = JSON.parse(JSON.stringify(tabuleiro));
            prox_mov = mover_peca(cor, jogadas_validas(cor, tabuleiro)[i].x, jogadas_validas(cor, tabuleiro)[i].y, prox_mov)
            valor_jogada = minimax(prox_mov, nivel - 1, prox_jogador , false, nivel_max)
            if(valor_jogada > valor_max){
                jogada = jogadas_validas(cor, tabuleiro)[i];
                valor_max = valor_jogada;
            }
        }
        if(nivel == nivel_max){
            //console.log('jogadas validas: ');
            //console.log(jogadas_validas(cor, tabuleiro));
            return jogada;
        }
        return valor_max;
    }

    else{
        let valor_min = 100;
        jogadas_possiveis = jogadas_validas(cor, tabuleiro);

        for(let i = 0; i < jogadas_possiveis.length; i++){
            let prox_mov = JSON.parse(JSON.stringify(tabuleiro));
            prox_mov = mover_peca(cor, jogadas_possiveis[i].x, jogadas_possiveis[i].y, prox_mov)
            valor_jogada = minimax(prox_mov, nivel - 1, prox_jogador , true, nivel_max);
            if(valor_jogada < valor_min){
                jogada = jogadas_possiveis[i];
                valor_min = valor_jogada;
            }
        }
        if(nivel == nivel_max){
            return jogada;
        }
        return valor_min;
    }
}


function criar_peca(cor){
    let peca = document.createElement('div')
}