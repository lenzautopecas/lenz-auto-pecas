const numeroWhatsApp = "555399310172";

console.log("script funcionando")

/* =========================
   WHATSAPP DOS PRODUTOS
========================= */

const botoesWhatsApp = document.querySelectorAll(
    ".produto button:not(.btn-detalhes):not(.btn-carrinho)"
);

botoesWhatsApp.forEach((botao) => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");

        const nome = produto.querySelector("h3").textContent;
        const preco = produto.querySelector(".preco").textContent;

        const mensagem =
            `Olá! 👋\n\n` +
            `Tenho interesse em comprar:\n\n` +
            `🔧 Produto: ${nome}\n` +
            `💰 Preço: ${preco}\n\n` +
            `Gostaria de confirmar a disponibilidade.`;

        const url =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    });

});


/* =========================
   DETALHES DO PRODUTO
========================= */

const botoesDetalhes = document.querySelectorAll(".btn-detalhes");

const modal = document.querySelector("#modal-detalhes");
const modalNome = document.querySelector("#modal-nome");
const modalWhatsApp = document.querySelector("#modal-whatsapp");
const fecharModal = document.querySelector(".fechar-modal");

botoesDetalhes.forEach((botao) => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");
        const nome = produto.querySelector("h3").textContent;

        modalNome.textContent = nome;

        const mensagem =
            `Olá! 👋\n\n` +
            `Gostaria de consultar detalhes sobre:\n\n` +
            `🔧 Produto: ${nome}\n\n` +
            `Gostaria de confirmar aplicação, disponibilidade e preço.`;

        modalWhatsApp.href =
            `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        modal.classList.add("ativo");
    });

});

fecharModal.addEventListener("click", () => {
    modal.classList.remove("ativo");
});

modal.addEventListener("click", (evento) => {

    if (evento.target === modal) {
        modal.classList.remove("ativo");
    }

});


/* =========================
   BUSCA DE PRODUTOS
========================= */

const campoBusca = document.querySelector("#busca");
const produtos = document.querySelectorAll(".produto");

campoBusca.addEventListener("input", () => {

    const termo = campoBusca.value.toLowerCase().trim();

    produtos.forEach((produto) => {

        const textoProduto = produto.textContent.toLowerCase();

        if (textoProduto.includes(termo)) {

            produto.classList.remove("produto-oculto");
            produto.style.display = "";

        } else {

            if (produto.classList.contains("produto-oculto")) {
                produto.style.display = "none";
            } else {
                produto.style.display = "none";
            }

        }

    });

});


/* =========================
   CARRINHO
========================= */

let carrinho = JSON.parse(localStorage.getItem("carrinhoLenz")) || [];

const contadorCarrinho = document.querySelector("#contador-carrinho");
const listaCarrinho = document.querySelector("#lista-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");

const botoesCarrinho = document.querySelectorAll(".btn-carrinho");

botoesCarrinho.forEach((botao) => {

    botao.addEventListener("click", () => {

        const produto = botao.closest(".produto");

        const nome = produto.querySelector("h3").textContent;
        const precoTexto = produto.querySelector(".preco").textContent;

        const preco = parseFloat(
            precoTexto
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
                .trim()
        );

        const produtoExistente = carrinho.find(
            (item) => item.nome === nome
        );

        if (produtoExistente) {

            produtoExistente.quantidade++;

        } else {

            carrinho.push({
                nome: nome,
                preco: preco,
                quantidade: 1
            });

        }

        atualizarCarrinho();

    });

});


/* =========================
   ATUALIZAR CARRINHO
========================= */

function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML =
            "<p>Seu carrinho está vazio.</p>";

    }

    carrinho.forEach((item, index) => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;
        quantidadeTotal += item.quantidade;

        const itemCarrinho = document.createElement("div");

        itemCarrinho.className = "item-carrinho";

        itemCarrinho.innerHTML = `
            <div>
                <strong>${item.nome}</strong>
                <p>
                    R$ ${item.preco.toFixed(2).replace(".", ",")}
                    × ${item.quantidade}
                </p>
            </div>

            <div class="controles-carrinho">

                <button onclick="diminuirQuantidade(${index})">
                    −
                </button>

                <span>${item.quantidade}</span>

                <button onclick="aumentarQuantidade(${index})">
                    +
                </button>

                <button
                    class="remover-item"
                    onclick="removerProduto(${index})">
                    🗑️
                </button>

            </div>
        `;

        listaCarrinho.appendChild(itemCarrinho);

    });

    contadorCarrinho.textContent = quantidadeTotal;

    totalCarrinho.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;

        localStorage.setItem("carrinhoLenz", JSON.stringify(carrinho));
    }


/* =========================
   AUMENTAR QUANTIDADE
========================= */

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    atualizarCarrinho();
}


/* =========================
   DIMINUIR QUANTIDADE
========================= */

function diminuirQuantidade(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }

    atualizarCarrinho();
}


/* =========================
   REMOVER PRODUTO
========================= */

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();
}

/* =========================
   FINALIZAR PEDIDO
========================= */

const botaoFinalizar = document.querySelector(".finalizar-carrinho");

botaoFinalizar.addEventListener("click", () => {

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let mensagem =
        "Olá! 👋\n\n" +
        "Gostaria de fazer este pedido:\n\n";

    let total = 0;

    carrinho.forEach((item) => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        mensagem +=
            `🔧 ${item.nome}\n` +
            `Quantidade: ${item.quantidade}\n` +
            `Preço: R$ ${item.preco.toFixed(2).replace(".", ",")}\n\n`;
    });

    mensagem +=
        `💰 Total do pedido: R$ ${total.toFixed(2).replace(".", ",")}\n\n` +
        "Gostaria de confirmar a disponibilidade.";

    const url =
        `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    carrinho = [];
atualizarCarrinho();

});

atualizarCarrinho();

/* =========================
   MENU MOBILE
========================= */

const menuMobile = document.querySelector(".menu-mobile");
const nav = document.querySelector("nav");

nav.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {
        nav.classList.remove("ativo");
    });

});