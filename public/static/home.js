document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('contasContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    let currentPage = 1;
    let total_Pages = 1;

    // Função para criar e exibir o modal
    const showBuyModal = (accountId) => {
        const modal = document.createElement('div');
        modal.className = 'buy-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3 class="modal-title">Como Comprar Sua Conta</h3>
                <div class="tutorial-steps">
                    <div class="step">
                        <i class="fab fa-discord"></i>
                        <h4>1. Entre no Discord</h4>
                        <div class="textbuy">
                            <p>Acesse nosso servidor Discord oficial</p>
                        </div>
                    </div>
                    <div class="step">
                        <i class="fas fa-search"></i>
                        <h4>2. Utilize o Código de Identificação para Encontrar a Conta.</h4>
                        <div class="textbuy">
                            <p>Localizando a conta, basta efetuar a compra.</p>
                        </div>
                    </div>
                </div>
                <div class="action-button">
                    <button class="id-link" onclick="navigator.clipboard.writeText('${accountId}')"><i class="fas fa-copy"></i> Copiar ID</button>
                </div>
                <div class="action-button">
                    <a href="https://discord.gg/T435Ajj9Ba" class="discord-link"><i class="fab fa-discord discord-icon"></i> Acesse Nosso Discord</a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };

    const fetchAccounts = (page = 1) => {
        loadingSpinner.style.display = 'flex';
        container.style.display = 'none';
        container.innerHTML = '';
        axios.get(`/api/accounts?page=${page}&limit=8`)
            .then(res => {
                console.log('Resposta recebida:', res.data);
                const { accounts, totalPages } = res.data;
                if (!Array.isArray(accounts)) throw new Error("Formato inválido");

                total_Pages = totalPages || 1;
                pageInfo.textContent = `Página ${page} de ${total_Pages}`;

                prevPageBtn.disabled = page === 1;
                nextPageBtn.disabled = page === total_Pages;

                accounts.forEach(acc => {
                    axios.get(`/api/lucro/${acc.id}`)
                        .then(lucroRes => {
                            const lucroData = lucroRes.data.lucro;
                            const card = document.createElement('div');
                            card.className = 'account-card';
                            const lastLoginDate = new Date(acc.account_last_activity * 1000).toLocaleDateString('pt-BR');

                            card.innerHTML = `
                                <div class="card-header">
                                    <div class="rank-info">
                                        <img src="static/assets/riot.png" alt="${acc.valorantRankTitle || 'Sem ranque'}" class="tier-icon" />
                                        <div>${acc.valorantRankTitle || 'Sem ranque'}</div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <p><i class="fas fa-level-up-alt"></i> <strong>Nível:</strong> ${acc.riot_valorant_level}</p>
                                    <p><i class="fas fa-coins"></i> <strong>VP:</strong> ${acc.riot_valorant_wallet_vp}</p>
                                    <p><i class="fas fa-star"></i> <strong>RP:</strong> ${acc.riot_valorant_wallet_rp}</p>
                                    <p><i class="fas fa-paint-brush"></i> <strong>Skins:</strong> ${acc.riot_valorant_skin_count}</p>
                                    <p><i class="fas fa-calendar"></i> <strong>Último login:</strong> ${lastLoginDate}</p>
                                </div>
                                <div class="card-footer">
                                    <span class="price">R$ ${(acc.price + (acc.price * lucroData / 100)).toFixed(2)}</span>
                                    <div>
                                        <button class="buy-button" data-id="${acc.id}"><i class="fas fa-shopping-cart buy-icon"></i> Comprar</button>
                                        <a href="/?id=${acc.id}" class="details-button"><i class="fas fa-info-circle details-icon"></i> Detalhes</a>
                                    </div>
                                </div>
                            `;
                            container.appendChild(card);

                            card.querySelector('.buy-button').addEventListener('click', () => {
                                showBuyModal(acc.id);
                            });
                        })
                        .catch(err => {
                            console.error(`Erro ao buscar dados de lucro para conta ${acc.id}:`, err);
                            container.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar dados de lucro.</p>';
                        });
                });

                loadingSpinner.style.display = 'none';
                container.style.display = 'grid';
            })
            .catch(err => {
                console.error('Erro ao buscar contas:', err);
                loadingSpinner.style.display = 'none';
                container.style.display = 'block';
                container.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar contas recentes.</p>';
            });
    };

    fetchAccounts(currentPage);

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAccounts(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < total_Pages) {
            currentPage++;
            fetchAccounts(currentPage);
        }
    });
});