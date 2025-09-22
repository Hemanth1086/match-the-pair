document.addEventListener('DOMContentLoaded', function () {
    const plots = document.querySelectorAll('.plot');
    const tools = document.querySelectorAll('.tool');
    const scoreElement = document.getElementById('score');
    const waterAllBtn = document.getElementById('waterAll');
    const harvestAllBtn = document.getElementById('harvestAll');
    const restartBtn = document.getElementById('restartGame');
    const gardenArea = document.getElementById('gardenArea');

    let score = 0;
    let draggingElement = null;

    const plantStages = {
        carrot: ['🌱', '🌿', '🥕'],
        tomato: ['🌱', '🌿', '🍅'],
        corn: ['🌱', '🌿', '🌽']
    };

    const plantValues = {
        carrot: 10,
        tomato: 15,
        corn: 20
    };

    tools.forEach(tool => {
        tool.addEventListener('dragstart', function (e) {
            draggingElement = this;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.dataset.type);
        });

        tool.addEventListener('dragend', function () {
            this.classList.remove('dragging');
            draggingElement = null;
        });
    });

    plots.forEach(plot => {
        plot.addEventListener('dragover', e => e.preventDefault());

        plot.addEventListener('drop', function (e) {
            e.preventDefault();
            const toolType = e.dataTransfer.getData('text/plain');

            if (toolType === 'watering') {
                waterPlant(this);
            } else if (!this.dataset.plant) {
                plantSeed(this, toolType);
            }
        });

        plot.addEventListener('click', function () {
            if (this.dataset.plant && this.dataset.stage === '2') {
                harvestPlant(this);
            }
        });
    });

    function plantSeed(plot, plantType) {
        plot.dataset.plant = plantType;
        plot.dataset.stage = '0';

        const plantIcon = document.createElement('div');
        plantIcon.className = 'plot-content';
        plantIcon.textContent = plantStages[plantType][0];
        plot.appendChild(plantIcon);

        const effect = document.createElement('div');
        effect.className = 'growth-effect';
        plot.appendChild(effect);

        setTimeout(() => plot.removeChild(effect), 1000);
    }

    function waterPlant(plot) {
        if (plot.dataset.plant && plot.dataset.stage !== '2') {
            const effect = document.createElement('div');
            effect.className = 'water-effect';
            plot.appendChild(effect);
            setTimeout(() => plot.removeChild(effect), 1000);

            let currentStage = parseInt(plot.dataset.stage);
            if (currentStage < 2) {
                currentStage++;
                plot.dataset.stage = currentStage;
                const plantType = plot.dataset.plant;
                plot.querySelector('.plot-content').textContent = plantStages[plantType][currentStage];

                if (currentStage === 2) {
                    plot.style.boxShadow = '0 0 15px #2ecc71';
                }
            }
        }
    }

    function harvestPlant(plot) {
        const plantType = plot.dataset.plant;
        const points = plantValues[plantType];

        const effect = document.createElement('div');
        effect.className = 'harvest-effect';
        plot.appendChild(effect);
        setTimeout(() => plot.removeChild(effect), 1000);

        showPointsPopup(plot, points);

        score += points;
        scoreElement.textContent = score;

        plot.removeChild(plot.querySelector('.plot-content'));
        delete plot.dataset.plant;
        delete plot.dataset.stage;
        plot.style.boxShadow = 'none';
    }

    function showPointsPopup(plot, points) {
        const popup = document.createElement('div');
        popup.className = 'points-popup';
        popup.textContent = `+${points}`;

        const rect = plot.getBoundingClientRect();
        const gardenRect = gardenArea.getBoundingClientRect();

        popup.style.left = `${rect.left - gardenRect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top - gardenRect.top + rect.height / 2}px`;

        gardenArea.appendChild(popup);
        setTimeout(() => gardenArea.removeChild(popup), 1500);
    }

    waterAllBtn.addEventListener('click', () => {
        plots.forEach(plot => {
            if (plot.dataset.plant) waterPlant(plot);
        });
    });

    harvestAllBtn.addEventListener('click', () => {
        plots.forEach(plot => {
            if (plot.dataset.plant && plot.dataset.stage === '2') {
                harvestPlant(plot);
            }
        });
    });

    restartBtn.addEventListener('click', () => {
        score = 0;
        scoreElement.textContent = score;

        plots.forEach(plot => {
            if (plot.querySelector('.plot-content')) {
                plot.removeChild(plot.querySelector('.plot-content'));
            }
            delete plot.dataset.plant;
            delete plot.dataset.stage;
            plot.style.boxShadow = 'none';
        });
    });
});
