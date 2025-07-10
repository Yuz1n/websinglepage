document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const idDisplay = document.getElementById('idDisplay');
    idDisplay.textContent = id || 'Valorant';
    const loading = document.getElementById('loading');
    const accountDetails = document.getElementById('accountDetails');

    // Fetch tier colors
    let tierColors = {};
    let iconTiers = {};
    let traducoes = {};
    axios.get('/api/tier-colors')
        .then(response => {
            tierColors = response.data.tierColors;
            iconTiers = response.data.iconTiers;
        })
        .catch(error => {
            console.error('Erro ao carregar tier colors:', error);
        })
        .finally(() => {
            axios.get('/api/traducoes')
                .then(response => {
                    traducoes = response.data.traducoes;
                })
                .catch(error => {
                    console.error('Erro ao carregar traducoes:', error);
                })
                .finally(() => {
                    // Fetch account data
                    axios.get(`/api/${id}`)
                        .then(response => {
                            const item = response.data.item;
                            console.log(item)
                            loading.classList.add('d-none');
                            accountDetails.classList.remove('d-none');

                            // Title
                            //document.getElementById('accountTitle').textContent = item.title_en || item.title;

                            // Valorant Skins
                            document.getElementById('valorantSkinCount').textContent = item.riot_valorant_skin_count;
                            const valorantSkins = document.getElementById('valorantSkins');
                            Object.values(item.valorantInventory.WeaponSkins).forEach(uuid => {
                                const div = document.createElement('div');
                                div.className = 'col';
                                div.innerHTML = `
                                    <div class="card-skins" sytle="height: 165px;">
                                        <img class="tier-icon" src="" alt="Tier Icon" style="width: 30px; height: 30px; margin-bottom: 5px;">
                                        <img src="https://media.valorant-api.com/weaponskins/${uuid}/displayicon.png" class="card-img-top" alt="Skin" loading="lazy">
                                        <div class="card-body-info text-center">
                                            <p class="card-text"></p>
                                        </div>
                                    </div>`;
                                axios.get(`https://valorant-api.com/v1/weapons/skins/${uuid}`)
                                    .then(res => {
                                        div.querySelector('.card-text').textContent = res.data.data.displayName || 'Unknown Skin';
                                        const contentTierUuid = res.data.data.contentTierUuid;
                                        if (contentTierUuid && tierColors[contentTierUuid]) {
                                            const rgbColor = `rgb(${tierColors[contentTierUuid].join(',')})`;
                                            const brightColor = `rgb(${
                                                Math.min(255, tierColors[contentTierUuid][0] + 50)
                                            },${
                                                Math.min(255, tierColors[contentTierUuid][1] + 50)
                                            },${
                                                Math.min(255, tierColors[contentTierUuid][2] + 50)
                                            })`;
                                            div.querySelector('.card-skins').style.backgroundColor = rgbColor;
                                            div.querySelector('.card-img-top').style.backgroundColor = rgbColor;
                                            div.querySelector('.card-skins').style.border = `3px solid ${brightColor}`;
                                            div.querySelector('.card-skins').style.boxShadow = `0 0 5px ${brightColor}, 0 0 5px ${brightColor}`;
                                        }
                                        if (contentTierUuid && iconTiers[contentTierUuid]) {
                                            div.querySelector('.tier-icon').src = iconTiers[contentTierUuid];
                                        } else {
                                            div.querySelector('.tier-icon').style.display = 'none';
                                        }
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        div.querySelector('.card-text').textContent = 'Unknown Skin';
                                        div.querySelector('.tier-icon').style.display = 'none';
                                    });
                                valorantSkins.appendChild(div);
                            });

                            // Valorant Gunbuddies
                            document.getElementById('valorantBuddyCount').textContent = Object.keys(item.valorantInventory.Buddy).length;
                            const valorantBuddies = document.getElementById('valorantBuddies');
                            Object.values(item.valorantInventory.Buddy).forEach(uuid => {
                                const div = document.createElement('div');
                                div.className = 'col';
                                div.innerHTML = `
                                    <div class="card-skins" style="height: 165px;">
                                        <img src="https://media.valorant-api.com/buddies/${uuid}/displayicon.png" class="card-img-top" alt="Buddy" loading="lazy" style="border-radius: 8px;">
                                        <div class="card-body-info text-center">
                                            <p class="card-text"></p>
                                        </div>
                                    </div>`;
                                axios.get(`https://valorant-api.com/v1/buddies/${uuid}`)
                                    .then(res => {
                                        div.querySelector('.card-text').textContent = res.data.data.displayName || 'Unknown Buddy';
                                        const rgbColor = [34, 65, 66];
                                        const brightColor = `rgb(${
                                            Math.min(255, rgbColor[0] + 50)
                                        },${
                                            Math.min(255, rgbColor[1] + 50)
                                        },${
                                            Math.min(255, rgbColor[2] + 50)
                                        })`;
                                        div.querySelector('.card-skins').style.backgroundColor = `rgb(${rgbColor.join(',')})`;
                                        div.querySelector('.card-img-top').style.backgroundColor = `rgb(${rgbColor.join(',')})`;
                                        div.querySelector('.card-skins').style.border = `3px solid ${brightColor}`;
                                        div.querySelector('.card-skins').style.boxShadow = `0 0 5px ${brightColor}, 0 0 5px ${brightColor}`;
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        div.querySelector('.card-text').textContent = 'Unknown Buddy';
                                    });
                                valorantBuddies.appendChild(div);
                            });

                            // Valorant Agents
                            document.getElementById('valorantAgentCount').textContent = item.riot_valorant_agent_count;
                            const valorantAgents = document.getElementById('valorantAgents');
                            item.valorantInventory.Agent.forEach(uuid => {
                                const div = document.createElement('div');
                                div.className = 'col-1';
                                div.innerHTML = `
                                    <div class="card-agent">
                                        <img src="https://media.valorant-api.com/agents/${uuid}/displayicon.png" class="card-img-agent" alt="Agent" loading="lazy">
                                        <div>
                                            <p class="texto"></p>
                                        </div>
                                    </div>`;
                                axios.get(`https://valorant-api.com/v1/agents/${uuid}`)
                                    .then(res => {
                                        div.querySelector('.texto').textContent = res.data.data.displayName || 'Unknown Agent';
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        div.querySelector('.card-text').textContent = 'Unknown Agent';
                                    });
                                valorantAgents.appendChild(div);
                            });

                            // Valorant Stats
                            const valorantStats = document.getElementById('valorantStats');
                            const valorantStatItems = [
                                { label: item.riot_valorant_inventory_value + ' VP', text: 'Valor do Inventário', icon: 'gem' },
                                { label: item.riot_valorant_wallet_vp, text: 'Valorant Point', icon: 'coins' },
                                { label: item.riot_valorant_wallet_rp, text: 'Radiant Point', icon: 'star' },
                                { label: traducoes[item.valorantRankTitle] || item.valorantRankTitle, text: 'Rank Atual', icon: 'trophy' },
                                { label: traducoes[item.valorantPreviousRankTitle] || item.valorantPreviousRankTitle, text: 'Rank Season Anterior', icon: 'history' },
                                { label: traducoes[item.valorantLastRankTitle] || item.valorantLastRankTitle, text: 'Último Rank', icon: 'medal' },
                                { label: item.riot_valorant_level, text: 'Level', icon: 'level-up-alt' },
                                { label: item.valorantRegionPhrase, text: 'Servidor', icon: 'globe' }
                            ];
                            valorantStatItems.forEach(stat => {
                                const div = document.createElement('div');
                                div.className = 'col';
                                div.innerHTML = `
                                    <div class="card-body">
                                        <h6 class="text-muted"><i class="fas fa-${stat.icon} me-1"></i>${stat.text}</h6>
                                        <p class="card-title">${stat.label}</p>
                                    </div>`;
                                valorantStats.appendChild(div);
                            });

                            // Account Details
                            const accountInfo = document.getElementById('accountInfo');
                            const accountInfoItems = [
                                { label: new Date(item.account_last_activity * 1000).toLocaleDateString(), text: 'Última Atividade', icon: 'calendar' },
                                { label: item.riot_email_verified ? 'Sim' : 'Não', text: 'Email Vínculado', icon: 'envelope' },
                                { label: item.riot_country, text: 'País', icon: 'globe' },
                                { label: item.riot_phone_verified ? 'Sim' : 'Não', text: 'Telefone Vínculado', icon: 'phone' },
                                { label: item.item_domain, text: 'Domínio Email', icon: 'at' },
                                { label: (item.price * 2).toFixed(2) + ' ' + item.price_currency.toUpperCase(), text: 'Preço', icon: 'tag' },
                                { label: item.view_count, text: 'Visualizações', icon: 'eye' },
                                { label: item.itemOriginPhrase, text: 'Origem', icon: 'map-pin' }
                            ];
                            accountInfoItems.forEach(info => {
                                const div = document.createElement('div');
                                div.className = 'col';
                                div.innerHTML = `
                                    <div class="card-body" title="${info.text} explanation">
                                        <h6 class="text-muted"><i class="fas fa-${info.icon} me-1"></i>${info.text}</h6>
                                        <p class="card-title">${info.label}</p>
                                    </div>`;
                                accountInfo.appendChild(div);
                            });

                            // Account Links
                            const linksList = document.getElementById('accountLinks');
                            item.accountLinks
                                .filter(link => link.iconClass === 'valorant')
                                .forEach(link => {
                                    const div = document.createElement('div');
                                    div.innerHTML = `
                                        <a href="${link.link}" target="_blank" class="link-btn">
                                            <i class="fas fa-link"></i>${link.text}
                                        </a>`;
                                    linksList.appendChild(div);
                                });
                        })
                        .catch(error => {
                            console.error('Erro:', error);
                            idDisplay.textContent = `Erro ao carregar ID ${id}: ${error.message}`;
                        });
                });
        });
});