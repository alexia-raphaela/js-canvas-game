
            //variáveis de jogo
            var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 6,
            estadoAtual, record, img,

            estados = {
                jogar: 0,
                jogando: 1,
                perdeu: 2

            },


            chao = {
                y: 550,
                altura:50,
                cor: "#ff0000",

                desenha: function() {
                    ctx.fillStyle = this.cor;
                    ctx.fillRect(0, this.y, LARGURA, this.altura);
                }
            },

            bloco = {
                x: 50,
                y: 0,
                altura: 50,
                largura: 50,
                cor: "#ff4e4e",
                gravidade: 1.5,
                velocidade: 0,
                forcadoPulo: 20,
                qntPulos: 0,
                score: 0,

                atualiza: function() {
                    this.velocidade += this.gravidade;
                    this.y += this.velocidade;

                    if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) 
                        {
                        this.y = chao.y - this.altura;
                        this.qntPulos = 0;
                        this.velocidade = 0;

                    }

                },

                pula: function() {
                    if (this.qntPulos < maxPulos) {
                        this.velocidade = -this.forcadoPulo;
                        this.qntPulos++;
                    }                              
                },

                reset: function() {
                    this.velocidade = 0;
                    this.y = 0;
                    
                    if (this.score > record) {
                        localStorage.setItem("record", this.score);
                        record = this.score;
                    }

                    this.score = 0;
                },
            
                desenha: function() {
                    ctx.fillStyle = this.cor;
                    ctx.fillRect(this.x, this.y, this.largura, this.altura);
                }
            },

            obstaculos = {
                _obs: [],
                cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
                tempoInsere: 0,


                insere: function() {
                    this._obs.push({
                        x: LARGURA,
                        //largura: 30 + Math.floor(21 * Math.random()),
                        largura: 50,
                        altura: 30 + Math.floor(120 * Math.random()),
                        cor: this.cores[Math.floor(5 * Math.random())]

                    });

                    this.tempoInsere = 100 //50 + Math.floor(400 * Math.random());
                     

                },

                atualiza: function(){
                    if (this.tempoInsere == 0)
                        this.insere();
                    else
                        this.tempoInsere--;

                    for (var i = 0, tam = this._obs.length; i < tam; i++) {
                        var obs = this._obs[i];

                        obs.x -= velocidade;

                        if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >=
                         obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
                        estadoAtual = estados.perdeu;

                        }

                        else if (obs.x == 0)
                            bloco.score++;
                       
                        
                        else if (obs.x <= -obs.largura) {
                            this._obs.splice(i, 1);
                            tam--;
                            i--;
                        }

                    }
                },

                limpa: function() {
                    this._obs = [];

                },

                desenha: function(){
                    for (var i = 0, tam = this._obs.length; i < tam; i++) {
                         var obs = this._obs[i];
                         ctx.fillStyle = obs.cor;
                         ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
                    }
                }
                
            
            };





            //função para reconhecer o clique do usuário
            function clique(event) {
               if (estadoAtual == estados.jogando){
                   bloco.pula();
               } else if (estadoAtual == estados.jogar) {
                   estadoAtual = estados.jogando;
               } else if (estadoAtual == estados.perdeu) {
                   estadoAtual = estados.jogar;
                   obstaculos.limpa();
                   bloco.reset();
               }

            }



            //funçao principal de um sistema
            function main() {

                ALTURA = window.innerHeight;
                LARGURA = window.innerWidth;

                if (LARGURA >= 500) {
                    LARGURA = 600;
                    ALTURA = 600;
                }

                canvas = document.createElement("canvas");
                canvas.width = LARGURA;
                canvas.height = ALTURA;
                canvas.style.border = "1px solid #000";

                ctx = canvas.getContext("2d");
                document.body.appendChild(canvas);
                
                document.addEventListener("mousedown", clique);

                estadoAtual = estados.jogar;
                record = localStorage.getItem("record");
                
                if (record == null) {
                    record = 0;
                }
            
                img = new Image();
                img.src = "imagens/sheet.png";
                
                roda();

            }

            //função para manter o loop, ou seja,o jogo rodando
            function roda() {

                atualiza();
                
                desenha();

                window.requestAnimationFrame(roda);
            }

            //função para atualizar os frames
            function atualiza() {
                frames++;

                bloco.atualiza();
                
                if (estadoAtual == estados.jogando) 
                   obstaculos.atualiza(); 

            }

            //função para ser feito o desenho do jogo
            function desenha() {
                ctx.fillStyle = "#50beff"
                ctx.fillRect(0, 0, LARGURA, ALTURA);
                
                ctx.fillStyle = "#fff";
                ctx.font = "50px Arial";
                ctx.fillText(bloco.score, 30, 68);
                
                if (estadoAtual == estados.jogar) {
                    ctx.fillStyle = "green";
                    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
                } 

                else if (estadoAtual == estados.perdeu) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);

                    ctx.save();
                    ctx.translate(LARGURA / 2, ALTURA / 2);
                    ctx.fillStyle =  "#fff";

                    if (bloco.score > record){
                        ctx.fillText("Novo Record!", -200, -105);

                        if (record >= 0 && record < 10){
                            ctx.fillText("Record ", + " " + record, -99, -65);
                        }
                        else if (record >= 10 && record < 100){
                            ctx.fillText("Record ", + " " + record, -112, -65);
                        }
                    }                    
                    
                    else{
                        ctx.fillText("Record " + record, -125, -65);
                    }
                          
                    if (bloco.score < 10){
                        ctx.fillText(bloco.score, -13, 19);
                    }
                    else if (bloco.score >= 10 && bloco.score < 100){
                        ctx.fillText(bloco.score, -26, 19);
                    }
                    else {
                        ctx.fillText(bloco.score, -39, 19);
                    }

                    ctx.restore();
                
                }

                else if (estadoAtual == estados.jogando) {
                    obstaculos.desenha();
                }
                     

                chao.desenha();
                bloco.desenha();

            }

            //inicializa o jogo
            main();